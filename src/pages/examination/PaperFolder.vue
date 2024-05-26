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
} from './types'
import { defineVaDataTableColumns, useMenu, useModal, useToast } from 'vuestic-ui/web-components'
import EditPaperFolderForm from './widgets/EditPaperFolderForm.vue'
import { computed } from 'vue'

const paperFolderStore = usePaperFolderStore()
const paperStore = usePaperStore()
const loading = ref(true)
const searchPaperFolderRequest = ref<SearchPaperFolderRequest>({})
const paperFolderDtos = ref<PaperFolderDto[]>([])
const papers = ref<PaperInListDto[]>([])

const folderToEdit = ref<PaperFolderDto | null>(null)
const doShowEditFolderModal = ref(false)
const breadcrumbs = ref<{ id: string | null; name: string }[]>([{ id: null, name: 'Root' }])

const { init: notify } = useToast()
const editFormRef = ref()
const currentFolderId = ref<string | null>(null)

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
onMounted(() => {
  getPaperFolders()
  getPapers()
})

const getPaperFolders = async (parentId?: string | null) => {
  loading.value = true
  // Thiết lập parentId cho request
  searchPaperFolderRequest.value.parentId = parentId
  paperFolderStore
    .searchPaperFolders(searchPaperFolderRequest.value)
    .then((res) => {
      loading.value = false
      paperFolderDtos.value = res
      console.log(paperFolderDtos)
    })
    .catch(() => {
      loading.value = false
      notify({ message: 'Failed to get question folders', color: 'error' })
    })
}

const getPapers = async (folderId?: string | null) => {
  if (!folderId) return
  loading.value = true
  const searchRequest: SearchPaperRequest = { paperFolderId: folderId }
  paperStore
    .searchPapers(searchRequest)
    .then((res) => {
      loading.value = false
      papers.value = res
    })
    .catch(() => {
      loading.value = false
      notify({ message: 'Failed to get papers', color: 'error' })
    })
}
const handleFolderDoubleClick = (event: any) => {
  const item = event.item
  if (item.type === 'folder') {
    const folderId = item.id
    currentFolderId.value = folderId
    breadcrumbs.value.push({ id: folderId, name: item.name })
    getPaperFolders(folderId) // Lấy các thư mục con
    getPapers(folderId) // Lấy các papers trong thư mục
  } else if (item.type === 'paper') {
    showPaperDetail(item)
  }
}
const showPaperDetail = (paper: PaperInListDto) => {
  console.log('Show paper detail:', paper)
  // For example, you could navigate to a detail page
}
const navigateToBreadcrumb = (index: number) => {
  const breadcrumb = breadcrumbs.value[index]
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
  currentFolderId.value = breadcrumb.id

  papers.value = []
  getPaperFolders(breadcrumb.id)
  getPapers(breadcrumb.id)
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

const tableColumns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Created By', key: 'creatorName', sortable: true },
  { label: 'Created On', key: 'createdOn', sortable: true },
  { label: 'Last Modified On', key: 'lastModifiedOn', sortable: true },
  { label: ' ', key: 'actions' },
])

const combinedData = computed(() => {
  const folders = paperFolderDtos.value.map((folder) => ({
    ...folder,
    name: folder.name,
    status: '',
    creatorName: folder.creatorName,
    createdOn: folder.createdOn,
    lastModifiedOn: folder.lastModifiedOn,
    type: 'folder',
  }))

  const papersList = papers.value.map((paper) => ({
    ...paper,
    name: paper.examName,
    status: paper.status,
    creatorName: paper.creatorName,
    createdOn: paper.createdOn,
    lastModifiedOn: paper.lastModifiedOn,
    type: 'paper',
  }))

  return [...folders, ...papersList]
})
</script>

<template>
  <h1 class="page-title font-bold">Paper Folder</h1>
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
          <VaButton icon="add" @click="showAddPaperFolderModal()">Paper Folder</VaButton>
        </div>
      </div>

      <VaDataTable
        :items="combinedData"
        :columns="tableColumns"
        hoverable
        clickable
        selectable
        select-mode="multiple"
        :disable-client-side-sorting="false"
        @row:contextmenu="contextmenu($event)"
        @row:dblclick="handleFolderDoubleClick($event)"
      >
        <template #cell(name)="{ rowData }">
          <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
            <div v-if="rowData.type === 'folder'">
              <VaIcon class="mr-2" name="folder" size="large" />
              <span>{{ rowData.name }}</span>
            </div>
            <div v-else>
              <span>{{ rowData.name }}</span>
            </div>
          </div>
        </template>
        <template #cell(status)="{ rowData }">
          <div v-if="rowData.type === 'paper'" class="flex items-center gap-2 ellipsis max-w-[230px]">
            {{ rowData.status }}
          </div>
        </template>
        <template #cell(createdBy)="{ rowData }">
          <div class="flex items-center gap-2 ellipsis max-w-[230px]">
            {{ rowData.creatorName }}
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
