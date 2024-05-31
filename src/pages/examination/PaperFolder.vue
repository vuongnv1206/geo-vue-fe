<script lang="ts" setup>
import { usePaperFolderStore } from '@/stores/modules/paperFolder.module'
import { usePaperStore } from '@/stores/modules/paper.module'
import { onMounted, ref } from 'vue'
import {
  PaperFolderDto,
  SearchPaperFolderRequest,
  SearchPaperRequest,
  UpdatePaperFolderRequest,
  CreatePaperFolderRequest,
  PaperInListDto,
  CombinedData,
} from './types'
import { useMenu, useModal, useToast } from 'vuestic-ui/web-components'
import EditPaperFolderForm from './widgets/EditPaperFolderForm.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const paperFolderStore = usePaperFolderStore()
const paperStore = usePaperStore()
const loading = ref(true)

const searchPaperFolderRequest = ref<SearchPaperFolderRequest>({})
const searchPaperRequest = ref<SearchPaperRequest>({})

const paperFolderDtos = ref<PaperFolderDto[]>([])
const papers = ref<PaperInListDto[]>([])

const searchTerm = ref<string>('') // Add search term

const folderToEdit = ref<PaperFolderDto | null>(null)
const doShowEditFolderModal = ref(false)

const breadcrumbs = ref<{ id: string | null; name: string }[]>([{ id: null, name: 'Root' }])

const { init: notify } = useToast()
const editFormRef = ref()
const currentFolderId = ref<string | null>(null)

const selectedItems = ref<CombinedData[]>([])
const showPathColumn = ref(false)

const { confirm } = useModal()

const onFolderSaved = async (request: UpdatePaperFolderRequest) => {
  if (folderToEdit.value) {
    paperFolderStore
      .updatePaperFolder(request, request.id)
      .then(() => {
        notify({
          message: `${request.name} has been updated`,
          color: 'success',
        })
        getPaperFolders(currentFolderId.value) // Refresh the list of folders under the current parent folder
        doShowEditFolderModal.value = false
      })
      .catch((err: any) => {
        notify({
          message: `Failed to update paper folder\n${err.message}`,
          color: 'error',
        })
      })
  } else {
    const createRequest: CreatePaperFolderRequest = {
      name: request.name!,
      parentId: currentFolderId.value,
      subjectId: request.subjectId ?? null,
    }
    paperFolderStore
      .createPaperFolder(createRequest)
      .then(() => {
        notify({
          message: `${request.name} has been created`,
          color: 'success',
        })
        getPaperFolders(currentFolderId.value) // Refresh the list of folders under the current parent folder
        doShowEditFolderModal.value = false
      })
      .catch((err: any) => {
        notify({
          message: `Failed to create paper folder\n${err.message}`,
          color: 'error',
        })
      })
  }
}

const onFolderDelete = async (folder: PaperFolderDto) => {
  try {
    await paperFolderStore.deletePaperFolder(folder.id)
    notify({
      message: `${folder.name} has been deleted`,
      color: 'success',
    })
    getPaperFolders(currentFolderId.value) // Refresh the list of folders under the current parent folder
    getPapers(currentFolderId.value) // Refresh the list of papers under the current parent folder
  } catch (err: any) {
    notify({
      message: `Failed to delete folder\n${err.message}`,
      color: 'error',
    })
  }
}

const onPaperDelete = async (paper: PaperInListDto) => {
  try {
    await paperStore.deletePaper(paper.id)
    notify({
      message: `${paper.examName} has been deleted`,
      color: 'success',
    })
    getPapers(currentFolderId.value)
  } catch (err: any) {
    notify({
      message: `Failed to delete paper\n${err.message}`,
      color: 'error',
    })
  }
}

const onDeleteSelectedItems = async () => {
  confirm('Are you sure you want to delete selected items?').then(async (agreed) => {
    if (agreed) {
      const deletePromises = selectedItems.value.map(async (item) => {
        if (item.type === 'folder') {
          const folder = paperFolderDtos.value.find((folder) => folder.id === item.id)
          if (folder) {
            return onFolderDelete(folder)
          }
        } else if (item.type === 'paper') {
          const paper = papers.value.find((paper) => paper.id === item.id)
          if (paper) {
            return onPaperDelete(paper)
          }
        }
      })

      try {
        await Promise.all(deletePromises)
        selectedItems.value = []
        getPaperFolders(currentFolderId.value)
        getPapers(currentFolderId.value)
      } catch (err: any) {
        notify({
          message: `Failed to delete selected items\n${err.message}`,
          color: 'error',
        })
      }
    }
  })
}

onMounted(() => {
  getPaperFolders()
  getPapers()
})

const getPaperFolders = async (parentId?: string | null, name?: string | null) => {
  loading.value = true
  searchPaperFolderRequest.value = { parentId, name }
  paperFolderStore
    .searchPaperFolders(searchPaperFolderRequest.value)
    .then((res) => {
      loading.value = false
      paperFolderDtos.value = res
    })
    .catch(() => {
      loading.value = false
      notify({ message: 'Failed to get question folders', color: 'error' })
    })
}

const getPapers = async (folderId?: string | null, name?: string | null) => {
  papers.value = []
  loading.value = true
  searchPaperRequest.value = { paperFolderId: folderId, name }
  paperStore
    .searchPapers(searchPaperRequest.value)
    .then((res) => {
      loading.value = false
      papers.value = res
    })
    .catch(() => {
      loading.value = false
      notify({ message: 'Failed to get papers', color: 'error' })
    })
}
const handleFolderDoubleClick = async (event: any) => {
  const item = event.item
  if (item.type === 'folder') {
    const folderId = item.id
    if (currentFolderId.value !== folderId) {
      currentFolderId.value = folderId
      const folder = paperFolderDtos.value.find((folder) => folder.id === folderId)
      if (folder && folder.parents) {
        // Cập nhật breadcrumbs theo đường dẫn của folder
        breadcrumbs.value = [
          { id: null, name: 'Root' },
          ...folder.parents.map((parent) => ({ id: parent.id, name: parent.name })),
          { id: folder.id, name: folder.name },
        ]

        breadcrumbs.value.pop()
      }
      searchTerm.value = ''
      showPathColumn.value = false
      getPaperFolders(folderId, searchTerm.value)

      getPapers(folderId, searchTerm.value)
    }
  } else if (item.type === 'paper') {
    showPaperDetail(item)
  }
}

const router = useRouter()
const showPaperDetail = (paper: PaperInListDto) => {
  console.log('Show paper detail:', paper)
  router.push({ name: 'admin-exam-detail', params: { id: paper.id } })
  // For example, you could navigate to a detail page
}
const navigateToBreadcrumb = (index: number) => {
  const breadcrumb = breadcrumbs.value[index]
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
  currentFolderId.value = breadcrumb.id
  searchTerm.value = ''
  //papers.value = []
  getPaperFolders(breadcrumb.id, searchTerm.value)
  getPapers(breadcrumb.id, searchTerm.value)
}
const handleSearch = () => {
  if (searchTerm.value) {
    showPathColumn.value = true
  } else {
    showPathColumn.value = false
  }
  papers.value = []
  getPaperFolders(currentFolderId.value, searchTerm.value)
  getPapers(currentFolderId.value, searchTerm.value)
}

const navigateToPath = async (id: string | null) => {
  if (id) {
    if (currentFolderId.value !== id) {
      const folder = paperFolderDtos.value.find((folder) => folder.id === id)
      if (folder && folder.parents) {
        breadcrumbs.value = [
          { id: null, name: 'Root' },
          ...folder.parents.map((parent) => ({ id: parent.id, name: parent.name })),
        ]
      }
      currentFolderId.value = id
      //papers.value = []
      searchTerm.value = ''
      getPaperFolders(id, searchTerm.value)
      getPapers(id, searchTerm.value)
      showPathColumn.value = false
    }
  } else {
    breadcrumbs.value = [{ id: null, name: 'Root' }]
    currentFolderId.value = null
    //papers.value = []
    getPaperFolders()
    getPapers()
    showPathColumn.value = false
    searchTerm.value = ''
  }
}

const showAddPaperFolderModal = () => {
  folderToEdit.value = null
  doShowEditFolderModal.value = true
}

const showEditPaperFolderModal = (folder: PaperFolderDto) => {
  folderToEdit.value = folder
  doShowEditFolderModal.value = true
}

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

const { show } = useMenu()
const contextmenu = (event: any) => {
  const item = event.item
  if (item.type === 'folder') {
    event.event.preventDefault()
    show({
      event: event.event,
      options: [
        { text: 'Rename', icon: 'edit' },
        { text: 'Share', icon: 'share' },
        { text: 'Delete', icon: 'delete' },
      ],
      onSelected(option) {
        if (option.text === 'Rename') {
          showEditPaperFolderModal(item)
        } else if (option.text === 'Delete') {
          onFolderDelete(item)
        }
      },
    })
  }
}

const tableColumns = computed(() => {
  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
    { label: 'Created On', key: 'createdOn', sortable: true },
    { label: 'Last Modified On', key: 'lastModifiedOn', sortable: true },
    { label: ' ', key: 'actions' },
  ]
  if (showPathColumn.value) {
    columns.splice(columns.length - 1, 0, { label: 'Path', key: 'path', sortable: true })
  }
  return columns
})

const onSelectedItemsChange = (items: CombinedData[]) => {
  selectedItems.value = items
}

const combinedData = computed(() => {
  const resolvedFolders = paperFolderDtos.value.map((folder) => ({
    ...folder,
    name: folder.name,
    status: '',
    createdOn: folder.createdOn || '',
    lastModifiedOn: folder.lastModifiedOn || '',
    type: 'folder',
    paths: folder.parents
      ? [{ id: null, name: 'Root' }, ...folder.parents.map((parent) => ({ id: parent.id, name: parent.name }))]
      : [],
    createdBy: folder.createdBy || '',
    lastModifiedBy: folder.lastModifiedBy || null,
  }))

  const resolvedPapers = papers.value.map((paper) => ({
    ...paper,
    name: paper.examName,
    status: paper.status,
    createdOn: paper.createdOn || '',
    lastModifiedOn: paper.lastModifiedOn || '',
    type: 'paper',
    paths: paper.parents
      ? [{ id: null, name: 'Root' }, ...paper.parents.map((parent) => ({ id: parent.id, name: parent.name }))]
      : [],
    createdBy: paper.createdBy || '',
    lastModifiedBy: paper.lastModifiedBy || null,
  }))

  return [...resolvedFolders, ...resolvedPapers]
})
</script>

<template>
  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px">
    <VaInput v-model="searchTerm" placeholder="Search..." />
    <VaButton @click="handleSearch">Search</VaButton>
  </div>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaBreadcrumbs>
            <VaBreadcrumbsItem v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.id ?? index">
              <a href="#" class="text-blue-500" @click.prevent="navigateToBreadcrumb(index)">
                {{ breadcrumb.name }}
              </a>
            </VaBreadcrumbsItem>
          </VaBreadcrumbs>
        </div>
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <VaButton v-if="selectedItems.length !== 0" icon="delete" color="danger" @click="onDeleteSelectedItems">
            Delete
          </VaButton>

          <VaButton icon="add" @click="showAddPaperFolderModal()">Folder</VaButton>
        </div>
      </div>

      <VaDataTable
        :items="combinedData"
        :columns="tableColumns"
        hoverable
        selectable
        clickable
        select-mode="multiple"
        :disable-client-side-sorting="false"
        @row:contextmenu="contextmenu($event)"
        @row:dblclick="handleFolderDoubleClick($event)"
        @selectionChange="onSelectedItemsChange($event.currentSelectedItems)"
      >
        <template #cell(name)="{ rowData }">
          <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
            <div v-if="rowData.type === 'folder'">
              <VaIcon class="mr-2" name="folder" size="large" />
              <span>{{ rowData.name }}</span>
            </div>
            <div v-else>
              <VaIcon class="mr-2" name="description" size="large" />
              <span>{{ rowData.name }}</span>
            </div>
          </div>
        </template>
        <template #cell(status)="{ rowData }">
          <div v-if="rowData.type === 'paper'" class="flex items-center gap-2 ellipsis max-w-[230px]">
            {{ rowData.status }}
          </div>
        </template>
        <template #cell(createdOn)="{ rowData }">
          <div class="flex items-center gap-2 ellipsis max-w-[230px]">
            <div>{{ rowData.createdOn.split('T')[0] }}</div>
            <div>{{ rowData.createdOn.split('T')[1].split('.')[0] }}</div>
          </div>
        </template>
        <template #cell(lastModifiedOn)="{ rowData }">
          <div class="flex items-center gap-2 ellipsis max-w-[230px]">
            <div>{{ rowData.lastModifiedOn?.split('T')[0] }}</div>
            <div>{{ rowData.lastModifiedOn?.split('T')[1].split('.')[0] }}</div>
          </div>
        </template>

        <template #cell(path)="{ rowData }">
          <div v-if="rowData.paths" class="flex items-center gap-2 ellipsis max-w-[230px]">
            <VaBreadcrumbs separator="/">
              <VaBreadcrumbsItem v-for="(segment, index) in rowData.paths" :key="index">
                <a href="#" @click.prevent="navigateToPath(segment.id)">
                  {{ segment.name }}
                </a>
              </VaBreadcrumbsItem>
            </VaBreadcrumbs>
          </div>
        </template>

        <template #cell(actions)="{ rowData }">
          <div v-if="rowData.type === 'folder'" class="flex gap-2 justify-end">
            <VaButton
              preset="primary"
              size="small"
              color="primary"
              icon="mso-edit"
              aria-label="Edit Folder"
              @click="showEditPaperFolderModal(rowData as PaperFolderDto)"
            />
            <VaButton
              preset="primary"
              size="small"
              icon="mso-delete"
              color="danger"
              aria-label="Delete Folder"
              @click="onFolderDelete(rowData as PaperFolderDto)"
            />
          </div>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditFolderModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ folderToEdit ? 'Edit folder' : 'Add folder' }}</h1>

    <EditPaperFolderForm
      ref="editFormRef"
      :folder="folderToEdit"
      :save-button-label="folderToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (folder: UpdatePaperFolderRequest) => {
          onFolderSaved(folder)
          ok()
        }
      "
    />
  </VaModal>
</template>
