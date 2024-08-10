<template>
  <VaCard>
    <VaCardContent>
      <VaDataTable
        class="my-table va-table--hoverable"
        :items="items"
        :columns="columns"
        :style="{
          '--va-data-table-thead-background': 'var(--va-background-element)',
          '--va-data-table-grid-tr-border': '1px solid var(--va-background-border)',
        }"
        sticky-header
        :loading="subscriptionStore?.isLoadingOrders"
      >
        <template #cell(subscription)="{ row }">
          <span>{{ row?.rowData?.subscription?.name }}</span>
        </template>
        <template #cell(activeTime)="{ row }">
          <span v-if="row?.rowData?.startDate && row?.rowData?.endDate">
            >{{ format.formatDateNoTime(row?.rowData?.startDate) }} -
            {{ format.formatDateNoTime(row?.rowData?.endDate) }}
          </span>
          <span v-if="!row?.rowData?.startDate || !row?.rowData?.endDate">N/A</span>
        </template>
        <template #cell(status)="{ value }">
          <VaBadge :text="getStatusSubscription(value)" :color="getColorSubscription(value)" />
        </template>
        <template #cell(expired)="{ row }">
          <VaBadge
            :text="
              row?.rowData?.status === ORDER_STATUS.COMPLETED.CODE
                ? row?.rowData?.isExpired
                  ? 'Expired'
                  : 'Not yet'
                : 'N/A'
            "
            :color="
              row?.rowData?.status === ORDER_STATUS.COMPLETED.CODE
                ? row?.rowData?.isExpired
                  ? 'danger'
                  : 'success'
                : 'secondary'
            "
          />
        </template>
        <template #cell(createdOn)="{ value }">
          <span>{{ format.formatDateNoTime(new Date(value)) }}</span>
        </template>
        <template #cell(action)="{ row }">
          <VaButton
            v-if="row?.rowData?.status === ORDER_STATUS.PENDING.CODE"
            class="mr-2"
            color="primary"
            @click="() => handleShowQR(row)"
            >{{ t('subscription.orders.show_qr') }}</VaButton
          >
          <VaButton
            v-if="row?.rowData?.status === ORDER_STATUS.PENDING.CODE"
            class="ml-2"
            color="danger"
            @click="() => handleCancelOrder(row)"
            >{{ t('subscription.orders.cancel_order') }}</VaButton
          >
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
  <VaCardContent>
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center p-2">
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
          :visible-pages="3"
          :total="pagination.totalCount"
          :page-size="pagination.pageSize"
          @update:modelValue="handlePageChange"
        />
      </div>
    </div>
  </VaCardContent>
  <VaModal v-model="showQR" hide-default-actions>
    <div class="flex flex-col justify-center items-center gap-8">
      <VaImage class="w-2/3" :src="srcQR" />
      <p class="font-semibold">{{ t('subscription.text_describe_qr') }}</p>
      <VaButton color="primary" @click="handleConfirmPaid">{{ t('subscription.confirm_paid') }}</VaButton>
    </div>
  </VaModal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PaginationType } from '../audit-logs/types'
import { useToast } from 'vuestic-ui/web-components'
import { format, getErrorMessage } from '@/services/utils'
import subscriptionsService from '@/services/subscriptions.service'
import { MyOrderQueryType, MyOrderTypes } from './types'
import { useSubscriptionStore } from '@/stores/modules/subscription.module'
import { ACCOUNT_NAME, ORDER_STATUS, QR_URL } from '../subscription/subscription.enum'
import { pageSizeOptions } from './orders.enum'

const props = defineProps<{
  filterQueries: any
}>()
const { t } = useI18n()
const { init: notify } = useToast()
const subscriptionStore = useSubscriptionStore()
const items = ref<MyOrderTypes[]>([])
const pageValue = ref(1)
const pagination = ref<PaginationType>({
  currentPage: 1,
  totalPages: 1,
  totalCount: 1,
  pageSize: 10,
  hasPreviousPage: false,
  hasNextPage: false,
})
const showQR = ref(false)
const srcQR = ref('')
const columns = computed(() => [
  { key: 'orderNo', label: t('subscription.orders.orderNo') },
  { key: 'subscription', label: t('subscription.orders.subscription') },
  { key: 'activeTime', label: t('subscription.orders.activeTime') },
  { key: 'status', label: t('subscription.orders.status') },
  { key: 'expired', label: t('subscription.orders.expired') },
  { key: 'createdOn', label: t('subscription.orders.createdOn') },
  { key: 'action', label: t('subscription.orders.action') },
])
const getMyOrders = async (query: MyOrderQueryType) => {
  await subscriptionsService
    .getMyOrders(query)
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
    .catch((error: any) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
}

const handlePageChange = (newPage: number) => {
  const newCurrentPage = Math.ceil(newPage / pagination.value.pageSize)
  const queries = {
    pageNumber: newCurrentPage,
    pageSize: pagination.value.pageSize,
    orderBy: ['CreatedOn desc'],
    ...props.filterQueries,
  }
  getMyOrders(queries)
}

const handlePageSizeChange = (newPagesize: number) => {
  const newCurrentPage = Math.ceil(pageValue.value / pagination.value.pageSize)
  const queries = {
    pageNumber: newCurrentPage,
    pageSize: newPagesize,
    orderBy: ['CreatedOn desc'],
    ...props.filterQueries,
  }
  getMyOrders(queries)
}

watch(
  () => props.filterQueries,
  (newFilterQueries) => {
    const queries = {
      pageNumber: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
      orderBy: ['CreatedOn desc'],
      ...newFilterQueries,
    }
    getMyOrders(queries)
  },
  { immediate: true },
)

const getStatusSubscription = (status: string) => {
  if (Number(status) === ORDER_STATUS.PENDING.CODE) {
    return ORDER_STATUS.PENDING.NAME
  } else if (Number(status) === ORDER_STATUS.COMPLETED.CODE) {
    return ORDER_STATUS.COMPLETED.NAME
  } else {
    return ORDER_STATUS.CANCELED.NAME
  }
}
const getColorSubscription = (status: string) => {
  if (Number(status) === ORDER_STATUS.PENDING.CODE) {
    return ORDER_STATUS.PENDING.COLOR
  } else if (Number(status) === ORDER_STATUS.COMPLETED.CODE) {
    return ORDER_STATUS.COMPLETED.COLOR
  } else {
    return ORDER_STATUS.CANCELED.COLOR
  }
}

const handleShowQR = (row: any) => {
  srcQR.value = `${QR_URL}?accountName=${ACCOUNT_NAME}&amount=${row?.rowData?.subscription?.price}&addInfo=${row?.rowData?.orderNo}`
  showQR.value = true
}
const handleCancelOrder = async (row: any) => {
  await subscriptionStore
    .cancelOrder(row?.rowData?.id)
    .then(() => {
      const queries = {
        pageNumber: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
        orderBy: ['CreatedOn desc'],
        ...props.filterQueries,
      }
      getMyOrders(queries)
      notify({
        title: t('subscription.orders.success'),
        message: t('subscription.orders.cancel_success'),
        color: 'success',
      })
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
const handleConfirmPaid = () => {
  showQR.value = false
}
</script>
