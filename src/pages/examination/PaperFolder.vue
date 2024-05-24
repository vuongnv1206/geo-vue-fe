<script lang="ts" setup>
import { usePaperFolderStore } from '@/stores/modules/paperFolder.module'
import { onMounted, ref } from 'vue'
import { PaperFolderDto, SearchPaperFolderRequest, UpdatePaperFolderRequest } from './types'
import { defineVaDataTableColumns, useModal, useToast } from 'vuestic-ui/web-components'
import { CreatePaperFolderRequest } from './types'
import EditPaperFolderForm from './widgets/EditPaperFolderForm.vue'
const stores = usePaperFolderStore()
const loading = ref(true)
const searchPaperFolderRequest = ref<SearchPaperFolderRequest>({})
const paperFolderDtos = ref<PaperFolderDto[]>([])

const folderToEdit = ref<PaperFolderDto | null>(null)
const doShowEditFolderModal = ref(false)
const breadcrumbs = ref<{ id: string | null; name: string }[]>([{ id: null, name: 'Root' }])

const { init: notify } = useToast()

const editFormRef = ref()
const currentFolderId = ref<string | null>(null)

const { confirm } = useModal()

const onFolderSaved = async (request: UpdatePaperFolderRequest) => {
  if (folderToEdit.value) {
    stores
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
    stores
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
    await stores.deletePaperFolder(folder.id)
    notify({
      message: `${folder.name} has been deleted`,
      color: 'success',
    })
    getPaperFolders()
  } catch (err: any) {
    notify({
      message: `Failed to delete folder\n${err.message}`,
      color: 'error',
    })
  }
}
onMounted(() => {
  getPaperFolders()
})

const getPaperFolders = async (parentId?: string | null) => {
  loading.value = true
  // Thiết lập parentId cho request
  searchPaperFolderRequest.value.parentId = parentId
  stores
    .searchPaperFolders(searchPaperFolderRequest.value)
    .then((res) => {
      loading.value = false
      paperFolderDtos.value = res
      console.log(paperFolderDtos)
    })
    .catch(() => {
      loading.value = false
      notify({
        message: 'Failed to get question folders',
        color: 'error',
      })
    })
}

const handleFolderDoubleClick = (event: any) => {
  const folderId = event.item.id
  currentFolderId.value = folderId
  // Gọi hàm để lấy các thư mục con của thư mục này
  getPaperFolders(event.item.id) // Truyền parentId của thư mục được chọn

  breadcrumbs.value.push({ id: folderId, name: event.item.name })
  getPaperFolders(folderId) // Truyền parentId của thư mục được chọn
}

const navigateToBreadcrumb = (index: number) => {
  const breadcrumb = breadcrumbs.value[index]
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
  currentFolderId.value = breadcrumb.id
  getPaperFolders(breadcrumb.id)
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

const columns = defineVaDataTableColumns([
  { label: 'Folder Name', key: 'name', sortable: true },
  { label: 'Created By', key: 'creatorName', sortable: true },
  { label: 'Created On', key: 'createdOn', sortable: true },
  { label: 'Last Modified On', key: 'lastModifiedOn', sortable: true },
  { label: ' ', key: 'actions' },
])
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
        :items="paperFolderDtos"
        :columns="columns"
        hoverable
        clickable
        selectable
        select-mode="multiple"
        @row:dblclick="handleFolderDoubleClick($event)"
      >
        <template #cell(name)="{ rowData }">
          <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
            <div>
              <VaIcon class="mr-2" name="folder" size="large" />
              <span>{{ rowData.name }}</span>
            </div>
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
          <div class="flex gap-2 justify-end">
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
