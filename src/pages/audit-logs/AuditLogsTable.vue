<template>
  <div>
    <VaCardContent class="pb-0">
      <VaDataTable
        class="my-table va-table--hoverable"
        :items="items"
        :columns="columns"
        :style="{
          '--va-data-table-thead-background': 'var(--va-background-element)',
          '--va-data-table-grid-tr-border': '1px solid var(--va-background-border)',
        }"
        sticky-header
      >
        <template #cell(user)="{ row }">
          <span class="flex gap-2">
            <VaAvatar
              :src="getSrcAvatar(row)"
              class="w-14 h-14 bg-warning font-bold"
              :fallback-text="row.rowData?.author?.name?.charAt(0)?.toUpperCase()"
            />
            <div>
              <p class="text-sm">{{ row.rowData?.author?.name }}</p>
              <p class="text-secondary">{{ row.rowData?.author?.email }}</p>
            </div>
          </span>
        </template>
        <template #cell(action)="{ value }">
          <span :class="getActionColor(value)">{{ value }}</span>
        </template>
        <template #cell(createdAt)="{ value }">
          <div class="flex items-center gap-2 ellipsis max-w-[230px]">
            <VaPopover icon="info" :message="format.formatDateStr(value)">
              <div>{{ format.getTimeString(value) }}</div>
            </VaPopover>
          </div>
        </template>
        <template #cell(viewDetails)="{ row }">
          <VaButton preset="secondary" class="w-fit text-xs md:text-sm" size="small" @click="handleShowDetails(row)">
            {{ t('auditLogs.table.buttonDetails') }}
          </VaButton>
        </template>
      </VaDataTable>
    </VaCardContent>
    <VaCardContent>
      <div class="flex flex-col-reverse md:flex-row gap-2 justify-between md:justify-center items-center p-2">
        <div>
          <b>
            {{
              pagination?.totalCount <= 1
                ? pagination.totalCount + ' ' + t('auditLogs.table.item')
                : pagination.totalCount + ' ' + t('auditLogs.table.items')
            }}
          </b>
          {{ t('questions.results_per_page') }}
          <VaSelect
            v-if="pagination.totalCount > 0"
            v-model="pagination.pageSize"
            class="w-32"
            :options="pageSizeOptions"
            @update:modelValue="handlePageSizeChange"
          />
        </div>
        <div v-if="pagination.totalCount > 0" class="flex">
          <VaPagination
            v-if="pagination.totalCount > 0"
            v-model="pageValue"
            gapped
            active-page-color="textPrimary"
            :visible-pages="4"
            :total="pagination.totalCount"
            :page-size="pagination.pageSize"
            @update:modelValue="handlePageChange"
          />
        </div>
      </div>
    </VaCardContent>
    <VaModal v-model="showModal" hide-default-actions size="large">
      <template #header>
        <p class="text-xl font-bold">{{ t('auditLogs.table.titleDetails') }}</p>
      </template>
      <AuditLogsDetails :details-information="details" />
      <template #footer>
        <VaButton @click="showModal = false">{{ t('auditLogs.table.buttonCloseDetails') }}</VaButton>
      </template>
    </VaModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AuditLogsTypes, PaginationType } from './types'
import AuditLogsDetails from './AuditLogsDetails.vue'
import { pageSizeOptions } from './audit-logs.enum'
import { VaAvatar, useToast } from 'vuestic-ui/web-components'
import { watch } from 'vue'
import { useAuditLogsStore } from '@/stores/modules/auditLogs.module'
import { getActionColor, getSrcAvatar } from './helper'
import { getErrorMessage, format } from '@/services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { init: notify } = useToast()
const props = defineProps<{
  filterQueries: any
}>()
const auditLogsStore = useAuditLogsStore()
const showModal = ref(false)
const pageValue = ref(1)
const details = ref<any>()
const pagination = ref<PaginationType>({
  currentPage: 1,
  totalPages: 1,
  totalCount: 1,
  pageSize: 10,
  hasPreviousPage: false,
  hasNextPage: false,
})
const items = ref<AuditLogsTypes[]>([])
const columns = computed(() => [
  { key: 'user', label: t('auditLogs.table.userCol') },
  { key: 'resource', label: t('auditLogs.table.resourceCol') },
  { key: 'action', label: t('auditLogs.table.actionCol') },
  { key: 'createdAt', label: t('auditLogs.table.createdAtCol') },
  { key: 'viewDetails', label: t('auditLogs.table.viewDetailsCol') },
])

const getAuditLogs = async (query: any) => {
  await auditLogsStore
    .getAuditLogs(query)
    .then((response) => {
      items.value = response?.data?.data
      pagination.value = {
        currentPage: response?.data?.currentPage,
        totalPages: response?.data?.totalPages,
        totalCount: response?.data?.totalCount,
        pageSize: response?.data?.pageSize,
        hasPreviousPage: response?.data?.hasPreviousPage,
        hasNextPage: response?.data?.hasNextPage,
      }
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
}

watch(
  () => props.filterQueries,
  (newFilterQueries) => {
    const queries = {
      pageNumber: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
      ...newFilterQueries,
    }
    getAuditLogs(queries)
  },
)

onMounted(() => {
  const queries = {
    pageNumber: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    ...props.filterQueries,
  }
  getAuditLogs(queries)
})

const handlePageChange = (newPage: number) => {
  const newCurrentPage = Math.ceil(newPage / pagination.value.pageSize)
  const queries = {
    pageNumber: newCurrentPage,
    pageSize: pagination.value.pageSize,
    ...props.filterQueries,
  }
  getAuditLogs(queries)
}

const handlePageSizeChange = (newPagesize: number) => {
  const newCurrentPage = Math.ceil(pageValue.value / pagination.value.pageSize)
  const queries = {
    pageNumber: newCurrentPage,
    pageSize: newPagesize,
    ...props.filterQueries,
  }
  getAuditLogs(queries)
}

const handleShowDetails = async (row: any) => {
  showModal.value = true
  details.value = {
    createdAt: row?.rowData?.oldValues,
    oldValues: row?.rowData?.oldValues,
    newValues: row?.rowData?.newValues,
    resource: `{"resourceId": "${row?.rowData?.resourceId}"}`,
    action: row?.rowData?.action?.toLowerCase(),
  }
}
</script>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
