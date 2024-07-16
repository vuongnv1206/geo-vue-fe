<script lang="ts" setup>
import { usePaperStore } from '@/stores/modules/paper.module'
import { onMounted, ref, watch } from 'vue'
import { CombinedData, PaperDeleted } from '../examination/types'
import { DataFilterPaper, dataPaperIds } from './types'
import { useModal, useToast } from 'vuestic-ui'
import { computed, watchEffect } from 'vue'
import { format, getErrorMessage } from '@services/utils'
import { useI18n } from 'vue-i18n'
import { watchDebounced } from '@vueuse/core'

const paperStore = usePaperStore()
const loading = ref(true)

const dataFilterPaper = ref<DataFilterPaper>({
  examName: '',
  pageNumber: 1,
  pageSize: 20,
})

const pagination = ref({
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
  totalItems: 0,
})

const papers = ref<PaperDeleted[]>([])

// const searchTerm = ref<string>('') // Add search term
const searchTerm = ref({
  examName: '',
})
const { init: notify } = useToast()

const selectedItems = ref<CombinedData[]>([])
const showPathColumn = ref(false)
const { t } = useI18n()
const { confirm } = useModal()

const handleRestore = async (paper: any) => {
  const data = {
    paperIds: [paper.id],
  }
  await paperStore
    .restoreDeletedPapers(data)
    .then(() => {
      notify({
        title: t('auth.success'),
        message: t('bin.restore_exam_success'),
        color: 'success',
      })
      paperStore.setRefresh(true)
    })
    .catch((err) => {
      const message = getErrorMessage(err)
      notify({
        title: t('auth.error'),
        message: message,
        color: 'danger',
      })
    })
}
const handleDelete = async (paper: PaperDeleted) => {
  confirm('Are you sure you want to delete this items?').then(async (agreed) => {
    if (agreed) {
      const data: dataPaperIds = {
        paperIds: [paper.id],
      }
      await paperStore
        .deletedMultiPapers(data)
        .then(() => {
          notify({
            title: t('auth.success'),
            message: t('bin.delete_exam_success'),
            color: 'success',
          })
          paperStore.setRefresh(true)
        })
        .catch((err) => {
          const message = getErrorMessage(err)
          notify({
            title: t('auth.error'),
            message: message,
            color: 'danger',
          })
        })
    }
  })
}

const handleDeleteSelectedItems = async () => {
  confirm('Are you sure you want to delete selected items?').then(async (agreed) => {
    if (agreed) {
      const paperIds = selectedItems.value.map((item) => item.id)
      const data = { paperIds }
      await paperStore
        .deletedMultiPapers(data)
        .then(() => {
          notify({
            title: t('auth.success'),
            message: t('bin.delete_exam_success'),
            color: 'success',
          })
          paperStore.setRefresh(true)
        })
        .catch((err) => {
          const message = getErrorMessage(err)
          notify({
            title: t('auth.error'),
            message: message,
            color: 'danger',
          })
        })
    }
  })
}

watch(
  () => paperStore.isRefresh,
  (refresh) => {
    if (refresh) {
      getPapers()
      paperStore.setRefresh(false)
    }
  },
)

onMounted(() => {
  getPapers()
})

const getPapers = async (name?: string | null) => {
  papers.value = []
  loading.value = true
  dataFilterPaper.value.examName = name ?? ''
  await paperStore
    .searchDeletedPapers(dataFilterPaper.value)
    .then((res) => {
      loading.value = false
      papers.value = res.data
    })
    .catch(() => {
      loading.value = false
      notify({ message: 'Failed to get papers', color: 'error' })
    })
}

const handleSearch = () => {
  if (searchTerm.value) {
    showPathColumn.value = true
  } else {
    showPathColumn.value = false
  }
  papers.value = []
  pagination.value.pageNumber = 1
  getPapers(searchTerm.value?.examName)
}

// using debounce to prevent multiple search request
watchDebounced(
  searchTerm.value,
  () => {
    handleSearch()
  },
  { debounce: 500, maxWait: 1000 },
)

const tableColumns = computed(() => [
  { label: 'Exam Name', key: 'examName', sortable: true },
  { label: 'Subject', key: 'subject', sortable: true },
  { label: 'Duration', key: 'duration', sortable: true },
  { label: 'Created On', key: 'createdOn', sortable: true },
  { label: 'Deleted On', key: 'deletedOn', sortable: true },
  { label: ' ', key: 'actions' },
])

const onSelectedItemsChange = (items: CombinedData[]) => {
  selectedItems.value = items
}

const combinedData = computed(() => {
  return papers.value
})

// Tính lại totalPages khi combinedData thay đổi
const calculateTotalPages = () => {
  pagination.value.totalPages = Math.ceil(combinedData.value.length / pagination.value.pageSize)
}

watchEffect(() => {
  calculateTotalPages()
})

// Computed property để lấy ra dữ liệu cho trang hiện tại
const currentItems = computed(() => {
  const startIndex = (pagination.value.pageNumber - 1) * pagination.value.pageSize
  const endIndex = startIndex + pagination.value.pageSize
  return combinedData.value.slice(startIndex, endIndex)
})

// Hàm xử lý khi thay đổi trang
const handlePageChange = async (page: number) => {
  pagination.value.pageNumber = page
  await getPapers(searchTerm.value?.examName)
}
</script>

<template>
  <VaCard class="flex md:flex-row flex-col justify-between gap-2 p-2 mb-2">
    <VaInput v-model="searchTerm.examName" placeholder="Search" class="w-64">
      <template #appendInner>
        <VaIcon color="secondary" class="material-icons">search</VaIcon>
      </template>
    </VaInput>
    <VaCard>
      <VaButton
        v-if="selectedItems.length !== 0 && currentItems?.length > 0"
        icon="delete"
        color="danger"
        @click="handleDeleteSelectedItems"
        >Delete
      </VaButton>
    </VaCard>
  </VaCard>

  <VaCard>
    <VaCardContent>
      <VaDataTable
        class="min-h-[73vh]"
        :items="currentItems"
        :columns="tableColumns"
        :loading="loading"
        selectable
        select-mode="multiple"
        :disable-client-side-sorting="false"
        @selectionChange="onSelectedItemsChange($event.currentSelectedItems)"
      >
        <template #cell(subject)="{ rowData }">
          <div class="flex items-center gap-2 ellipsis max-w-[230px]">
            {{ rowData?.subject?.name }}
          </div>
        </template>
        <template #cell(createdOn)="{ rowData }">
          <div class="flex items-center gap-2 ellipsis max-w-[230px]">
            <VaPopover icon="info" :message="format.formatDate(rowData?.createdOn)">
              <div>{{ format.getTimeString(rowData?.createdOn) }}</div>
            </VaPopover>
          </div>
        </template>
        <template #cell(deletedOn)="{ rowData }">
          <div class="flex items-center gap-2 ellipsis max-w-[230px]">
            <VaPopover icon="info" :message="format.formatDate(rowData?.deletedOn)">
              <div>{{ format.getTimeString(rowData?.deletedOn) }}</div>
            </VaPopover>
          </div>
        </template>

        <template #cell(actions)="{ rowData }">
          <VaButton
            class="mr-2"
            preset="primary"
            size="small"
            color="primary"
            icon="settings_backup_restore"
            aria-label="Edit Folder"
            @click="handleRestore(rowData as any)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete Folder"
            @click="handleDelete(rowData as any)"
          />
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
</template>
