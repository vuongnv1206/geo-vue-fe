<script setup lang="ts">
import { useJoinGroupRequestStore } from '@/stores/modules/joinGroupRequest.module'
import {
  HandleJoinGroupRequest,
  JoinGroupTeacherRequestResponse,
  JoinTeacherGroupStatus,
  RequestStatus,
  SearchJoinGroupTeacherRequest,
} from '../types'
import { onMounted, ref } from 'vue'
import { DataTableColumnSource, useModal, useToast } from 'vuestic-ui'
import { getErrorMessage, JoinGroupStatusColor, JoinGroupStatusLabel } from '@/services/utils'

const joinGroupRequestStore = useJoinGroupRequestStore()
const { init: notify } = useToast()
const { confirm } = useModal()
const isLoading = ref(true)
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
  isLoading.value = false
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

const handlerRequest = async (requestId: string, status: JoinTeacherGroupStatus) => {
  const messageConfirm = 'Are you sure cancel this request join group'

  confirm(messageConfirm).then(async (agreed) => {
    if (agreed) {
      const request: HandleJoinGroupRequest = {
        requestId: requestId,
      }

      if (status == JoinTeacherGroupStatus.Cancel) {
        await joinGroupRequestStore
          .cancelRequest(request)
          .then(async () => {
            notify({
              message: 'Cancel successfully',
              color: 'success',
            })
            joinGroupRequestStore.setRefresh(true)
          })
          .catch((error) => {
            const message = getErrorMessage(error)
            notify({
              message: message,
              color: 'danger',
            })
          })
        await getJoinGroupRequest()
      }
    }
  })
}
const handlePageChange = async (newPage: number) => {
  joinGroupRequest.value.pageNumber = newPage
  await getJoinGroupRequest()
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
      :loading="isLoading"
      sticky-header
      :disable-client-side-sorting="false"
      class="va-data-table-statistic"
      ><template #cell(content)="{ row }">
        <span>{{ getContentDisplay(row.source.content) }}</span>
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
      <template #cell(action)="{ row }">
        <VaButton
          v-if="row.source.status === JoinTeacherGroupStatus.Pending"
          preset="secondary"
          border-color="secondary"
          icon="close"
          color="secondary"
          @click="handlerRequest(row.source.id, JoinTeacherGroupStatus.Cancel)"
        >
          Cancel
        </VaButton>
        <span v-else-if="row.source.status === JoinTeacherGroupStatus.Accepted" class="va-text-success">
          Request has been accepted
        </span>
        <span v-else-if="row.source.status === JoinTeacherGroupStatus.Rejected" class="va-text-danger">
          Request has been rejected
        </span>
        <span v-else-if="row.source.status === JoinTeacherGroupStatus.Cancel" class="va-text-secondary">
          Request has been cancelled
        </span>
      </template>
      <template v-if="joinGroupResponse && joinGroupResponse.data.length > 0" #bodyAppend>
        <tr>
          <td colspan="6">
            <div class="flex justify-center mt-4">
              <VaPagination
                v-model="joinGroupResponse.currentPage"
                :pages="joinGroupResponse.totalPages"
                :visible-pages="5"
                buttons-preset="default"
                @update:modelValue="handlePageChange"
              />
            </div>
          </td>
        </tr>
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
