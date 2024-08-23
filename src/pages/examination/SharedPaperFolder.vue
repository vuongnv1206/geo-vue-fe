<script lang="ts" setup>
import {
  PaperFolderDto,
  PaperFolderPermission,
  PaperInListDto,
  SearchSharedPaperFolderRequest,
  SearchSharedPaperRequest,
  UpdatePaperFolderRequest,
} from './types'
import { ref } from 'vue'
import { usePaperFolderStore } from '@/stores/modules/paperFolder.module'
import { usePaperStore } from '@/stores/modules/paper.module'
import { onMounted } from 'vue'
import { useMenu, useModal, useToast } from 'vuestic-ui'
import { CombinedData } from './types'
import { useRouter } from 'vue-router'
import { CreatePaperFolderRequest } from './types'
import { computed } from 'vue'
import { watchEffect } from 'vue'
import EditPaperFolderForm from '@pages/examination/widgets/EditPaperFolderForm.vue'
import { useAuthStore } from '@/stores/modules/auth.module'
import { getErrorMessage } from '@/services/utils'

const router = useRouter()
const { init: notify } = useToast()
const loading = ref(true)
const isSharedDocument = ref(true)

const paperFolderStore = usePaperFolderStore()
const paperStore = usePaperStore()

const paperFolderDtos = ref<PaperFolderDto[]>([])
const papers = ref<PaperInListDto[]>([])

const searchSharedPaperFolderRequest = ref<SearchSharedPaperFolderRequest>({})
const searchSharedPaperRequest = ref<SearchSharedPaperRequest>({})

const { confirm } = useModal()
const searchTerm = ref<string>('') // Add search term

const folderToEdit = ref<PaperFolderDto | null>(null)
const doShowEditFolderModal = ref(false)

const breadcrumbs = ref<{ id: string | null; name: string }[]>([{ id: null, name: 'Root' }])

const editFormRef = ref()
const currentFolderId = ref<string | null>(null)

const selectedItems = ref<CombinedData[]>([])
const showPathColumn = ref(false)

const pagination = ref({
  pageNumber: 1,
  pageSize: 3,
  totalPages: 0,
  totalItems: 0,
})

const authStore = useAuthStore()
const currentUserId = authStore.user?.id

const getSharedPaperFolders = async (parentId?: string | null, name?: string | null) => {
  loading.value = true
  searchSharedPaperFolderRequest.value = { parentId, name }
  paperFolderStore
    .searchSharedPaperFolders(searchSharedPaperFolderRequest.value)
    .then((res) => {
      loading.value = false
      paperFolderDtos.value = res.paperFolderChildrens
    })
    .catch(() => {
      loading.value = false
      notify({ message: 'Failed to get folders', color: 'error' })
    })
}

const getSharedPapers = async (paperFolderId?: string | null, name?: string | null) => {
  papers.value = []
  loading.value = true
  searchSharedPaperRequest.value = { paperFolderId, name }
  paperStore
    .searchSharedPapers(searchSharedPaperRequest.value)
    .then((res) => {
      loading.value = false
      papers.value = res
    })
    .catch(() => {
      loading.value = false
      notify({ message: 'Failed to get papers', color: 'error' })
    })
}

onMounted(() => {
  getSharedPaperFolders()
  getSharedPapers()
})

const currentFolder = ref<PaperFolderDto>()
const handleFolderDoubleClick = async (event: any) => {
  const item = event.item
  if (item.type === 'folder') {
    const folderId = item.id
    currentFolder.value = item
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
      pagination.value.pageNumber = 1
      showPathColumn.value = false
      getSharedPaperFolders(folderId, searchTerm.value)
      getSharedPapers(folderId, searchTerm.value)
    }
  } else if (item.type === 'paper') {
    showPaperDetail(item)
  }
}

const showPaperDetail = (paper: PaperInListDto) => {
  router.push({ name: 'admin-exam-detail', params: { id: paper.id } })
}
const navigateToBreadcrumb = (index: number) => {
  const breadcrumb = breadcrumbs.value[index]
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
  currentFolderId.value = breadcrumb.id
  searchTerm.value = ''
  pagination.value.pageNumber = 1
  getSharedPaperFolders(breadcrumb.id, searchTerm.value)
  getSharedPapers(breadcrumb.id, searchTerm.value)
}

const handleSearch = () => {
  if (searchTerm.value) {
    showPathColumn.value = true
  } else {
    showPathColumn.value = false
  }
  papers.value = []
  pagination.value.pageNumber = 1
  getSharedPaperFolders(currentFolderId.value, searchTerm.value)
  getSharedPapers(currentFolderId.value, searchTerm.value)
}

const navigateToPath = async (id: string | null) => {
  if (id) {
    if (currentFolderId.value !== id) {
      const parentFolders = await getListParents(id)
      breadcrumbs.value = [
        { id: null, name: 'Root' },
        ...parentFolders.map((parent) => ({ id: parent.id, name: parent.name })),
      ]

      currentFolderId.value = id
      searchTerm.value = ''
      pagination.value.pageNumber = 1
      getSharedPaperFolders(id, searchTerm.value)
      getSharedPapers(id, searchTerm.value)
      showPathColumn.value = false
    }
  } else {
    breadcrumbs.value = [{ id: null, name: 'Root' }]
    currentFolderId.value = null
    getSharedPaperFolders()
    getSharedPapers()
    showPathColumn.value = false
    searchTerm.value = ''
  }
}

const getListParents = async (id: string): Promise<PaperFolderDto[]> => {
  try {
    const response = await paperFolderStore.getListParents(id)
    return response
  } catch (error) {
    console.error('Failed to get parent folders:', error)
    throw error
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

const showCreatePaper = () => {
  router.push({ name: 'create-paper', params: { folderId: currentFolderId.value } })
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
        // { text: 'Share', icon: 'share' },
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

const onFolderSaved = async (request: UpdatePaperFolderRequest) => {
  if (folderToEdit.value) {
    paperFolderStore
      .updatePaperFolder(request, request.id)
      .then(() => {
        notify({
          message: `${request.name} has been updated`,
          color: 'success',
        })
        getSharedPaperFolders(currentFolderId.value)
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
    }
    paperFolderStore
      .createPaperFolder(createRequest)
      .then(() => {
        notify({
          message: `${request.name} has been created`,
          color: 'success',
        })
        getSharedPaperFolders(currentFolderId.value)
        doShowEditFolderModal.value = false
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        notify({
          message: message,
          color: 'danger',
        })
      })
  }
}

const onFolderDelete = async (folder: PaperFolderDto) => {
  const result = await confirm({
    message: `Are you sure you want to delete "${folder.name}"?`,
    title: 'Delete Folder',
    okText: 'Confirm',
    cancelText: 'Cancel',
    size: 'small',
  })
  if (result) {
    try {
      await paperFolderStore.deletePaperFolder(folder.id)
      notify({
        message: `${folder.name} has been deleted`,
        color: 'success',
      })
      getSharedPaperFolders(currentFolderId.value)
      getSharedPapers(currentFolderId.value)
    } catch (error) {
      const message = getErrorMessage(error)
      notify({
        message: message,
        color: 'danger',
      })
    }
  }
}

const onPaperDelete = async (paper: PaperInListDto) => {
  const result = await confirm({
    message: `Are you sure you want to delete "${paper.examName}"?`,
    title: 'Delete Paper',
    okText: 'Confirm',
    cancelText: 'Cancel',
    size: 'small',
  })
  if (result) {
    try {
      await paperStore.deletePaper(paper.id)
      notify({
        message: `${paper.examName} has been deleted`,
        color: 'success',
      })
      getSharedPapers(currentFolderId.value)
    } catch (error) {
      const message = getErrorMessage(error)
      notify({
        message: message,
        color: 'danger',
      })
    }
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
        getSharedPaperFolders(currentFolderId.value)
        getSharedPapers(currentFolderId.value)
      } catch (error) {
        const message = getErrorMessage(error)
        notify({
          message: message,
          color: 'danger',
        })
      }
    }
  })
}

const tableColumns = computed(() => {
  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Creator', key: 'creatorName', sortable: true },
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
    creatorName: folder.creatorName || '',
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
    creatorName: paper.creatorName || '',
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

// Tính lại totalPages khi combinedData thay đổi
const calculateTotalPages = () => {
  pagination.value.totalPages = Math.ceil(combinedData.value.length / pagination.value.pageSize)
}

watchEffect(() => {
  calculateTotalPages()
})

const switchToMyDocuments = () => {
  router.push({ name: 'paper-folder' })
}

const canEdit = (permissions: PaperFolderPermission[]) => {
  return permissions.some((item) => item.userId === currentUserId && item.canUpdate)
}

const canDelete = (permissions: PaperFolderPermission[]) => {
  return permissions.some((item) => item.userId === currentUserId && item.canDelete)
}

const canAdd = () => {
  return currentFolder.value?.paperFolderPermissions?.some((item) => item.userId === currentUserId && item.canAdd)
}

// Computed property để lấy ra dữ liệu cho trang hiện tại
const currentItems = computed(() => {
  const startIndex = (pagination.value.pageNumber - 1) * pagination.value.pageSize
  const endIndex = startIndex + pagination.value.pageSize
  return combinedData.value.slice(startIndex, endIndex)
})

// Hàm xử lý khi thay đổi trang
const handlePageChange = async (page: number) => {
  pagination.value.pageNumber = page
  await getSharedPaperFolders(currentFolderId.value, searchTerm.value)
  await getSharedPapers(currentFolderId.value, searchTerm.value)
}
</script>
<template>
  <template v-if="isSharedDocument">
    <VaCard class="flex flex-col md:flex-row gap-2 p-2 mb-2">
      <VaCard class="flex justify-start items-center flex-grow">
        <VaCard class="flex">
          <VaInput v-model="searchTerm" placeholder="Search" class="flex-grow">
            <template #appendInner>
              <VaIcon color="secondary" class="material-icons" @click="handleSearch">search</VaIcon>
            </template>
          </VaInput>
        </VaCard>
      </VaCard>

      <VaCard class="flex justify-end items-center">
        <VaCard class="flex gap-2">
          <VaButton v-if="selectedItems.length !== 0" icon="delete" color="danger" @click="onDeleteSelectedItems"
            >Delete
          </VaButton>
          <template v-if="canAdd()">
            <VaButton icon="add" @click="showCreatePaper()">Paper</VaButton>
            <VaButton icon="add" @click="showAddPaperFolderModal()">Folder</VaButton>
          </template>
          <VaDropdown placement="bottom-end">
            <template #anchor>
              <VaButton icon="filter_alt" />
            </template>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="isSharedDocument ? '' : 'check'"
                @click="switchToMyDocuments"
                >My Documents</VaButton
              >
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="isSharedDocument ? 'check' : ''"
                @click="isSharedDocument = true"
                >Shared Documents</VaButton
              >
            </VaDropdownContent>
          </VaDropdown>
        </VaCard>
      </VaCard>
    </VaCard>

    <VaCard>
      <VaCardTitle>
        <VaBreadcrumbs>
          <VaBreadcrumbsItem v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.id ?? index">
            <a href="#" class="text-blue-500" @click.prevent="navigateToBreadcrumb(index)">
              {{ breadcrumb.name }}
            </a>
          </VaBreadcrumbsItem>
        </VaBreadcrumbs>
      </VaCardTitle>
      <VaCardContent>
        <VaDataTable
          class="min-h-[73vh]"
          :items="currentItems"
          :columns="tableColumns"
          :loading="loading"
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
                v-if="canEdit(rowData.paperFolderPermissions)"
                preset="primary"
                size="small"
                color="primary"
                icon="mso-edit"
                aria-label="Edit Folder"
                @click="showEditPaperFolderModal(rowData as PaperFolderDto)"
              />
              <VaButton
                v-if="canDelete(rowData.paperFolderPermissions)"
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
        <VaPagination
          v-if="pagination.totalPages > 1"
          v-model="pagination.pageNumber"
          :pages="pagination.totalPages"
          :visible-pages="3"
          buttons-preset="secondary"
          class="justify-center sm:justify-end"
          @update:modelValue="handlePageChange"
        />
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
  <template v-else>
    <PaperFolder />
  </template>
</template>
