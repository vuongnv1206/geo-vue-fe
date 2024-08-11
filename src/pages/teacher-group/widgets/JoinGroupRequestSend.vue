<script setup lang="ts">
import { useJoinGroupRequestStore } from '@/stores/modules/joinGroupRequest.module'
import {
  JoinGroupTeacherRequestResponse,
  JoinTeacherGroupStatus,
  RequestStatus,
  SearchJoinGroupTeacherRequest,
} from '../types'
import { onMounted, ref } from 'vue'
import { DataTableColumnSource, useToast } from 'vuestic-ui'
import { getErrorMessage, JoinGroupStatusColor, JoinGroupStatusLabel } from '@/services/utils'

const joinGroupRequestStore = useJoinGroupRequestStore()
const { init: notify } = useToast()
const joinGroupRequest = ref<SearchJoinGroupTeacherRequest>({
  status: RequestStatus.Sent,
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
  },
  {
    label: 'Receiver',
    key: 'receiverEmail',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
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
    width: '150px',
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
      ><template #cell(content)="{ row }">
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
        <VaButton preset="secondary" border-color="secondary" icon="close" color="secondary"> Cancel </VaButton>
      </template>
    </VaDataTable>
  </VaCardContent>
</template>

<style lang="css">
.va-data-table-statistic th,
.va-data-table-statistic td {
  text-wrap: pretty;
}
</style>
