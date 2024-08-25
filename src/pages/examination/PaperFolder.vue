<script lang="ts" setup>
import { usePaperFolderStore } from '@/stores/modules/paperFolder.module'
import { usePaperStore } from '@/stores/modules/paper.module'
import { onMounted, ref, watch } from 'vue'
import {
  PaperFolderDto,
  UpdatePaperFolderRequest,
  CreatePaperFolderRequest,
  PaperInListDto,
  CombinedData,
  SearchPaperFolderRequest,
  SearchPaperRequest,
} from './types'
import { useMenu, useModal, useToast } from 'vuestic-ui'
import EditPaperFolderForm from './widgets/EditPaperFolderForm.vue'
import { computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { GroupTeacher, TeacherTeam, TeacherTeamTeacherGroupCombine } from '../teacher-group/types'
import { avatarColor } from '@/services/utils'
import { UserDetail } from '@/pages/user/types'
import { PaperFolderPermission, SharePaperFolderRequest } from './types'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { getErrorMessage } from '../../services/utils'
import { format } from '@services/utils'

const router = useRouter()
const paperFolderStore = usePaperFolderStore()
const paperStore = usePaperStore()
const loading = ref(true)
const isMyDocument = ref(true)

const searchPaperFolderRequest = ref<SearchPaperFolderRequest>({})
const searchPaperRequest = ref<SearchPaperRequest>({})
const pagination = ref({
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
  totalItems: 0,
})

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
        getPaperFolders(currentFolderId.value)
        doShowEditFolderModal.value = false
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        notify({
          message: message,
          color: 'danger',
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
        getPaperFolders(currentFolderId.value)
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
      getPaperFolders(currentFolderId.value)
      getPapers(currentFolderId.value)
    } catch (err: any) {
      notify({
        message: `Failed to delete folder\n${err.message}`,
        color: 'error',
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
      getPapers(currentFolderId.value)
    } catch (err: any) {
      notify({
        message: `Failed to delete paper\n${err.message}`,
        color: 'error',
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
        getPaperFolders(currentFolderId.value)
        getPapers(currentFolderId.value)
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
      paperFolderDtos.value = res.paperFolderChildrens
    })
    .catch(() => {
      loading.value = false
      notify({ message: 'Failed to get folders', color: 'error' })
    })
}

const getPapers = async (paperFolderId?: string | null, name?: string | null) => {
  papers.value = []
  loading.value = true
  searchPaperRequest.value = { paperFolderId, name }
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
      pagination.value.pageNumber = 1
      showPathColumn.value = false
      getPaperFolders(folderId, searchTerm.value)

      getPapers(folderId, searchTerm.value)
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
  pagination.value.pageNumber = 1
  getPaperFolders(currentFolderId.value, searchTerm.value)
  getPapers(currentFolderId.value, searchTerm.value)
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
      getPaperFolders(id, searchTerm.value)
      getPapers(id, searchTerm.value)
      showPathColumn.value = false
    }
  } else {
    breadcrumbs.value = [{ id: null, name: 'Root' }]
    currentFolderId.value = null
    getPaperFolders()
    getPapers()
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

const onFolderShare = (folder: PaperFolderDto) => {
  folderToEdit.value = folder
  getTeacherGroups()
  doShowSharePaperFolderModal.value = true
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
        { text: 'Share', icon: 'share' },
        { text: 'Delete', icon: 'delete' },
      ],
      onSelected(option) {
        if (option.text === 'Rename') {
          showEditPaperFolderModal(item)
        } else if (option.text === 'Delete') {
          onFolderDelete(item)
        } else if (option.text === 'Share') {
          onFolderShare(item)
        }
      },
    })
  }
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

const switchToSharedDocuments = () => {
  isMyDocument.value = false
  router.push({ name: 'shared-paper-folder' })
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
  await getPaperFolders(currentFolderId.value, searchTerm.value)
  await getPapers(currentFolderId.value, searchTerm.value)
}

// logic share
const doShowSharePaperFolderModal = ref(false)
const singleSelect = ref<TeacherTeamTeacherGroupCombine | null>(null)
const autoCompleteSearchValue = ref('')
const isLoadingSelect = ref(false)
const options = ref<TeacherTeamTeacherGroupCombine[]>([])

const groupTeacherStore = useGroupTeacherStore()
const dataFilter = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 1000,
  orderBy: ['id'],
})
const groupTeachers = ref<GroupTeacher[]>([])
const teacherTeams = ref<TeacherTeam[]>([])
const getTeacherGroups = () => {
  isLoadingSelect.value = true
  groupTeacherStore.getGroupTeachers(dataFilter).then((res) => {
    groupTeachers.value = res.data
    groupTeacherStore
      .getTeacherTeams(dataFilter)
      .then((res) => {
        teacherTeams.value = res.data
        options.value = []
        groupTeachers.value.forEach((groupTeacher) => {
          options.value.push({
            groupTeacher: groupTeacher,
            teacherTeam: null,
          })
        })
        teacherTeams.value.forEach((teacherTeam) => {
          options.value.push({
            groupTeacher: null,
            teacherTeam: teacherTeam,
          })
        })
      })
      .finally(() => {
        isLoadingSelect.value = false
      })
  })
}

const permissionEdit = ref({
  canView: false,
  canAdd: false,
  canUpdate: false,
  canDelete: false,
  canShare: false,
})
const getOptionName = (option: TeacherTeamTeacherGroupCombine) => {
  if (option.groupTeacher) {
    const optionData = { data: option.groupTeacher.name, isUser: false }
    return optionData
  } else {
    const optionData = { data: option.teacherTeam?.teacherName, isUser: true }
    return optionData
  }
}
const doShowPaperFolderPermissionFormAddModal = ref(false)
const doShowPaperFolderPermissionFormModal = ref(false)
const editPermissionValue = ref<PaperFolderPermission>({} as PaperFolderPermission)
const optionsSelect = ref<TeacherTeamTeacherGroupCombine | null>(null)
const AddPermission = (option: TeacherTeamTeacherGroupCombine) => {
  optionsSelect.value = option

  const user = ref<UserDetail | null>(null)
  if (option.teacherTeam) {
    user.value = {
      id: option.teacherTeam.teacherId,
      email: option.teacherTeam.email,
      firstName: option.teacherTeam.teacherName,
      emailConfirmed: false,
      phoneNumberConfirmed: false,
      lastName: '',
      phoneNumber: '',
      imageUrl: '',
      isActive: false,
      userName: '',
      birthDate: '',
      gender: true,
    }
  }

  editPermissionValue.value = {
    user: user.value,
    groupTeacherId: option.groupTeacher?.id || '',
    groupTeacher: option.groupTeacher,
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
    createdBy: '',
    createdOn: '',
    lastModifiedBy: '',
    lastModifiedOn: '',
    id: '',
    folderId: folderToEdit.value?.id || '',
    userId: '',
  }

  permissionEdit.value = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
  }
  doShowPaperFolderPermissionFormAddModal.value = true
}
const getNameUserGroup = (option: PaperFolderPermission | null) => {
  if (option?.user) {
    return option.user.firstName + ' ' + option.user.lastName
  } else {
    return option?.groupTeacher?.name
  }
}

const allPermissionFalse = (permission: PaperFolderPermission) => {
  return !permission.canView && !permission.canAdd && !permission.canUpdate && !permission.canDelete
}

const editPermission = (permission: PaperFolderPermission) => {
  editPermissionValue.value = { ...permission }

  permissionEdit.value = {
    canView: permission.canView,
    canAdd: permission.canAdd,
    canUpdate: permission.canUpdate,
    canDelete: permission.canDelete,
    canShare: permission.canShare,
  }
  doShowPaperFolderPermissionFormModal.value = true
}

const canEdit = ref(false)
watch(
  () => permissionEdit.value,
  (value) => {
    if (!value.canView) {
      canEdit.value = false
    }
  },
  { deep: true },
)

watch(
  () => canEdit.value,
  (value) => {
    if (!value) {
      permissionEdit.value = {
        canView: false,
        canAdd: false,
        canUpdate: false,
        canDelete: false,
        canShare: false,
      }
    } else {
      permissionEdit.value.canView = true
      permissionEdit.value.canAdd = true
      permissionEdit.value.canUpdate = true
      permissionEdit.value.canDelete = true
    }
  },
)

watch(
  () => permissionEdit.value.canShare,
  (value) => {
    if (value) {
      canEdit.value = true
    }
  },
  { deep: true },
)

const handleDeletePermission = () => {
  permissionEdit.value = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
  }
  onSharePaperFolderPermission()
}

const onSharePaperFolderPermission = () => {
  const sharePermission = ref<SharePaperFolderRequest>({
    canView: permissionEdit.value.canView,
    canAdd: permissionEdit.value.canAdd,
    canUpdate: permissionEdit.value.canUpdate,
    canDelete: permissionEdit.value.canDelete,
    canShare: permissionEdit.value.canShare,
    folderId: editPermissionValue.value.folderId,
    userId: null,
    groupId: null,
  })
  if (editPermissionValue.value?.user) {
    sharePermission.value.userId = editPermissionValue.value.user.id
  }
  if (editPermissionValue.value?.groupTeacherId) {
    sharePermission.value.groupId = editPermissionValue.value.groupTeacherId
  }

  paperFolderStore
    .sharePaperFolder(editPermissionValue.value.folderId, sharePermission.value)
    .then(() => {
      notify({
        message: 'Paper folder permission update',
        color: 'success',
      })
      doShowSharePaperFolderModal.value = false
      getPaperFolders(currentFolderId.value)
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        message:
          'Failed to update paper folder permission ' +
          editPermissionValue.value?.user?.firstName +
          ' ' +
          editPermissionValue.value?.user?.lastName +
          '\n' +
          message,
        color: 'danger',
      })
    })
}
</script>

<template>
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

    <VaCard class="flex justify-between items-center flex-grow">
      <VaBadge text="My Documents" color="primary" />
    </VaCard>

    <VaCard class="flex justify-end items-center">
      <VaCard class="flex gap-2">
        <VaButton v-if="selectedItems.length > 0" icon="delete" color="danger" @click="onDeleteSelectedItems">
          Delete
        </VaButton>

        <VaButton icon="add" @click="showCreatePaper()">Paper</VaButton>
        <VaButton icon="add" @click="showAddPaperFolderModal()">Folder</VaButton>
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
              :icon="isMyDocument ? 'check' : ''"
              @click="isMyDocument = true"
              >My Documents
            </VaButton>
          </VaDropdownContent>
          <VaDropdownContent class="p-0">
            <VaButton
              preset="secondary"
              size="small"
              style="width: 100%"
              class="p-2"
              :icon="isMyDocument ? '' : 'check'"
              @click="switchToSharedDocuments"
              >Shared Documents
            </VaButton>
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
        clickable
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
            <VaPopover icon="info" :message="format.formatDate(rowData.createdOn)">
              <div>{{ format.getTimeString(rowData.createdOn) }}</div>
            </VaPopover>
          </div>
        </template>
        <template #cell(lastModifiedOn)="{ rowData }">
          <div class="flex items-center gap-2 ellipsis max-w-[230px]">
            <VaPopover icon="info" :message="format.formatDate(rowData.lastModifiedOn)">
              <div>{{ format.getTimeString(rowData.lastModifiedOn) }}</div>
            </VaPopover>
          </div>
        </template>

        <template #cell(path)="{ rowData }">
          <div v-if="rowData.paths" class="flex items-center gap-2 ellipsis max-w-[500px]">
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
  <VaModal
    v-model="doShowSharePaperFolderModal"
    mobile-fullscreen
    size="small"
    close-button
    stateful
    hide-default-actions
  >
    <h1 class="va-h5 mb-4">Share folder "{{ folderToEdit?.name }}"</h1>
    <VaSelect
      v-model="singleSelect"
      v-model:search="autoCompleteSearchValue"
      class="col-span-1"
      :loading="isLoadingSelect"
      label="Select User or Group"
      :options="options"
      searchable
      :text-by="
        (option: TeacherTeamTeacherGroupCombine) => getOptionName(option as TeacherTeamTeacherGroupCombine).data
      "
      placeholder="Search user or Group"
      track-by="id"
    >
      <template #appendInner>
        <VaIcon name="fas-search" />
      </template>
      <template #option="{ option }">
        <div class="flex justify-between items-center p-2">
          <div class="flex items-center gap-2">
            <VaAvatar
              v-if="getOptionName(option as TeacherTeamTeacherGroupCombine).isUser"
              :size="48"
              :color="avatarColor(getOptionName(option as TeacherTeamTeacherGroupCombine).data)"
              >{{
                getOptionName(option as TeacherTeamTeacherGroupCombine)
                  .data?.charAt(0)
                  .toUpperCase()
              }}
            </VaAvatar>
            <VaAvatar v-else :size="48" color="warning" icon="group"> </VaAvatar>
            <div>
              <div>{{ getOptionName(option as TeacherTeamTeacherGroupCombine).data }}</div>
              <div class="text-sm text-gray-500">
                {{ getOptionName(option as TeacherTeamTeacherGroupCombine).data }}
              </div>
            </div>
          </div>
          <div>
            <VaPopover
              v-if="
                (option as TeacherTeamTeacherGroupCombine).teacherTeam?.teacherId ===
                '00000000-0000-0000-0000-000000000000'
              "
              class="mr-2 mb-2"
              message="Not registered yet"
            >
              <VaIcon class="mr-2" name="no_accounts" />
            </VaPopover>
            <VaButton
              :disabled="
                (option as TeacherTeamTeacherGroupCombine).teacherTeam?.teacherId ===
                '00000000-0000-0000-0000-000000000000'
              "
              size="small"
              preset="secondary"
              border-color="primary"
              @click="AddPermission(option as TeacherTeamTeacherGroupCombine)"
            >
              Select
            </VaButton>
          </div>
        </div>
      </template>
    </VaSelect>
    <div class="mt-5">
      <VaScrollContainer class="h-80" vertical>
        <VaList>
          <VaListLabel> Permissions </VaListLabel>

          <VaListItem
            v-for="(permission, index) in folderToEdit?.paperFolderPermissions"
            :key="index"
            class="list__item ml-5"
          >
            <VaListItemSection avatar>
              <VaAvatar
                v-if="permission.userId !== null ? true : false"
                :size="42"
                :color="avatarColor(getNameUserGroup(permission))"
              >
                {{ getNameUserGroup(permission)?.charAt(0) }}
              </VaAvatar>
              <VaAvatar v-else :size="42" color="warning" icon="group"> </VaAvatar>
            </VaListItemSection>

            <VaListItemSection>
              <VaListItemLabel>
                {{ getNameUserGroup(permission) }}
              </VaListItemLabel>

              <VaListItemLabel caption>
                {{ permission.user?.email }}
              </VaListItemLabel>
            </VaListItemSection>

            <!-- <VaListItemSection icon>
              <VaButton
                 v-if="folderToEdit?.createdBy && folderToEdit?.createdBy == permission.user?.id"
                size="small"
                disabled
                preset="secondary"
                border-color="primary"
                class="mr-6 mb-2"
                @click="editPermission(permission)"
              >
                Edit Permissions
              </VaButton>
            </VaListItemSection> -->

            <VaListItemSection v-if="!allPermissionFalse(permission as PaperFolderPermission)" icon>
              <VaButton
                v-if="folderToEdit?.createdBy && folderToEdit.createdBy == permission.user?.id"
                size="small"
                disabled
                preset="secondary"
                border-color="primary"
                class="mr-6 mb-2"
              >
                Owner
              </VaButton>
              <VaButton
                v-else
                size="small"
                preset="secondary"
                border-color="primary"
                class="mr-6 mb-2"
                @click="editPermission(permission)"
              >
                Edit Permissions
              </VaButton>
            </VaListItemSection>
          </VaListItem>
        </VaList>
      </VaScrollContainer>
    </div>
  </VaModal>

  <VaModal
    v-model="doShowPaperFolderPermissionFormAddModal"
    ok-text="Save"
    size="small"
    @ok="
      () => {
        onSharePaperFolderPermission()
      }
    "
  >
    <span class="va-h5 mb-5"
      >Grand Permissions for <b>"{{ getNameUserGroup(editPermissionValue) }}"</b></span
    >
    <VaForm>
      <div class="gap-4 ml-10 mt-10">
        <VaListItem>
          <VaListItemSection avatar>
            <VaAvatar :size="48" :color="avatarColor(getNameUserGroup(editPermissionValue))">{{
              getNameUserGroup(editPermissionValue)?.charAt(0)
            }}</VaAvatar>
          </VaListItemSection>
          <VaListItemSection>
            <VaListItemLabel>
              {{ getNameUserGroup(editPermissionValue) }}
            </VaListItemLabel>

            <VaListItemLabel caption>
              {{ editPermissionValue?.user?.email }}
            </VaListItemLabel>
          </VaListItemSection>
          <VaListItemSection icon>
            <VaPopover message="Delete permission" position="top">
              <VaButton
                round
                icon="mso-delete"
                color="danger"
                @click="
                  () => {
                    console.log('delete')
                  }
                "
              >
                Delete
              </VaButton>
            </VaPopover>
          </VaListItemSection>
        </VaListItem>
      </div>
      <div class="flex flex-col gap-4 p-10">
        <VaCheckbox v-model="permissionEdit.canView" label="View" />
        <VaCheckbox v-model="canEdit" label="Edit" />
        <VaCheckbox v-model="permissionEdit.canShare" label="Share" />
      </div>
    </VaForm>
  </VaModal>
  <VaModal
    v-model="doShowPaperFolderPermissionFormModal"
    ok-text="Save"
    size="small"
    @ok="
      () => {
        onSharePaperFolderPermission()
      }
    "
  >
    <span class="va-h5 mb-5"
      >Edit Permissions for <b>"{{ getNameUserGroup(editPermissionValue) }}"</b></span
    >
    <VaForm>
      <div class="gap-4 ml-10 mt-10">
        <VaListItem>
          <VaListItemSection avatar>
            <VaAvatar :size="48" :color="avatarColor(getNameUserGroup(editPermissionValue))">{{
              getNameUserGroup(editPermissionValue)?.charAt(0)
            }}</VaAvatar>
          </VaListItemSection>
          <VaListItemSection>
            <VaListItemLabel>
              {{ getNameUserGroup(editPermissionValue) }}
            </VaListItemLabel>

            <VaListItemLabel caption>
              {{ editPermissionValue?.user?.email }}
            </VaListItemLabel>
          </VaListItemSection>
          <VaListItemSection icon>
            <VaPopover message="Delete permission" position="top">
              <VaButton
                round
                icon="mso-delete"
                color="danger"
                @click="
                  () => {
                    handleDeletePermission()
                  }
                "
              >
                Delete
              </VaButton>
            </VaPopover>
          </VaListItemSection>
        </VaListItem>
      </div>
      <div class="flex flex-col gap-4 p-10">
        <VaCheckbox v-model="permissionEdit.canView" label="View" />
        <VaCheckbox v-model="canEdit" label="Edit" />
        <VaCheckbox v-model="permissionEdit.canShare" label="Share" />
      </div>
    </VaForm>
  </VaModal>
</template>
