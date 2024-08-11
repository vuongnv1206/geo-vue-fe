<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  JoinGroupTeacherRequestResponse,
  JoinTeacherGroupStatus,
  RequestStatus,
  SearchJoinGroupTeacherRequest,
} from '../types'
import { DataTableColumnSource, useToast } from 'vuestic-ui'
import { useJoinGroupRequestStore } from '@/stores/modules/joinGroupRequest.module'
import { getErrorMessage, JoinGroupStatusColor, JoinGroupStatusLabel } from '@/services/utils'

const joinGroupRequestStore = useJoinGroupRequestStore()
const { init: notify } = useToast()
const joinGroupRequest = ref<SearchJoinGroupTeacherRequest>({
  status: RequestStatus.Received,
  pageNumber: 1,
  pageSize: 10,
})

const joinGroupResponse = ref<JoinGroupTeacherRequestResponse>()

const getJoinGroupRequest = async () => {
  try {
    const res = await joinGroupRequestStore.joinGroupRequest_search(joinGroupRequest.value)
    joinGroupResponse.value = res
  } catch (error) {
    notify({
      message: getErrorMessage(error),
      color: 'danger',
    })
  }
}

const columnTable: DataTableColumnSource<string>[] = [
  {
    label: 'Group name',
    key: 'groupName',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
  },
  {
    label: 'Sender',
    key: 'email',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '250px',
  },
  {
    label: 'Receiver',
    key: 'receiverEmail',
    thAlign: 'center',
    tdAlign: 'center',
    width: '250px',
  },
  {
    label: 'Content',
    key: 'content',
    thAlign: 'center',
    tdAlign: 'center',
  },
  {
    label: 'Status',
    key: 'status',
    thAlign: 'center',
    tdAlign: 'center',
  },
  {
    label: ' ',
    key: 'action',
    thAlign: 'center',
    tdAlign: 'center',
    width: '250px',
  },
]

const getContentDisplay = (content: string) => {
  return content ? content : 'No Content'
}

onMounted(async () => {
  await getJoinGroupRequest()
})
</script>

<template>
  <VaCardTitle> </VaCardTitle>
  <VaCardContent>
    <VaDataTable
      :items="joinGroupResponse?.data"
      :columns="columnTable"
      sticky-header
      :disable-client-side-sorting="false"
      class="va-data-table-statistic"
    >
      <template #cell(content)="{ row }">
        <span>{{ getContentDisplay(row.content) }}</span>
      </template>
      <template #cell(status)="{ row }">
        <span>
          <VaBadge
            :text="JoinGroupStatusLabel(row.source.status as JoinTeacherGroupStatus)"
            :color="JoinGroupStatusColor(row.source.status as JoinTeacherGroupStatus)"
            class="mr-2"
          />
        </span>
      </template>
      <template #cell(action)="{}">
        <div class="flex gap-2 justify-center">
          <VaButton preset="secondary" border-color="danger" icon="close" color="danger"> Reject </VaButton>
          <VaButton preset="secondary" border-color="success" icon="check" color="success"> Accept </VaButton>
        </div>
      </template>
    </VaDataTable>
  </VaCardContent>
</template>

<style lang="css">
.va-data-table-statistic th,
.va-data-table-statistic td {
  text-wrap: pretty;
}

.va-data-table-statistic tr,
.va-data-table-statistic td,
.va-data-table-statistic th {
  border: 1px solid rgb(229, 231, 235);
}
</style>
