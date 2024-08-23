<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  HandleJoinGroupRequest,
  JoinGroupTeacherRequestResponse,
  JoinTeacherGroupStatus,
  RequestStatus,
  SearchJoinGroupTeacherRequest,
} from '../types'
import { DataTableColumnSource, useModal, useToast } from 'vuestic-ui'
import { useJoinGroupRequestStore } from '@/stores/modules/joinGroupRequest.module'
import { format, getErrorMessage, JoinGroupStatusColor, JoinGroupStatusLabel } from '@/services/utils'
import JoinTeamRequestReceive from './JoinTeamRequestReceive.vue'

const joinGroupRequestStore = useJoinGroupRequestStore()
const { init: notify } = useToast()
const { confirm } = useModal()

const joinGroupRequest = ref<SearchJoinGroupTeacherRequest>({
  status: RequestStatus.Received,
  pageNumber: 1,
  pageSize: 5,
})

const isLoading = ref(true)

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
    width: '200px',
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
    label: 'Content',
    key: 'content',
    thAlign: 'center',
    tdAlign: 'center',
    width: '400px',
  },
  {
    label: 'Send time',
    key: 'createOn',
    thAlign: 'center',
    tdAlign: 'center',
    width: '200px',
  },
  {
    label: 'Status',
    key: 'status',
    thAlign: 'center',
    tdAlign: 'center',
    width: '100px',
  },
  {
    label: 'Approval time',
    key: 'lastModifiedOn',
    thAlign: 'center',
    tdAlign: 'center',
    width: '200px',
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

const handlerRequest = async (requestId: string, status: JoinTeacherGroupStatus) => {
  const messageConfirm =
    status == JoinTeacherGroupStatus.Accepted
      ? 'Are you sure accept this request join group'
      : 'Are you sure reject this request join group'

  confirm(messageConfirm).then(async (agreed) => {
    if (agreed) {
      const request: HandleJoinGroupRequest = {
        requestId: requestId,
      }

      if (status == JoinTeacherGroupStatus.Accepted) {
        await joinGroupRequestStore
          .acceptRequest(request)
          .then(async () => {
            notify({
              message: 'Accept successfully',
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
      } else if (status == JoinTeacherGroupStatus.Rejected) {
        await joinGroupRequestStore
          .rejectRequest(request)
          .then(async () => {
            notify({
              message: 'Reject successfully',
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
      }
      await getJoinGroupRequest()
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
  <VaCard>
    <VaCardTitle>Request join group</VaCardTitle>
    <VaCardContent>
      <VaDataTable
        :items="joinGroupResponse?.data"
        :columns="columnTable"
        :loading="isLoading"
        sticky-header
        :disable-client-side-sorting="false"
        class="va-data-table-statistic"
      >
        <template #cell(content)="{ row }">
          <p class="text-wrap">{{ getContentDisplay(row.source.content) }}</p>
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
        <template #cell(lastModifiedOn)="{ row }">
          <span v-if="row.source.status !== JoinTeacherGroupStatus.Pending">{{
            format.formatDate(row.source.lastModifiedOn)
          }}</span>
          <span v-else> N/a </span>
        </template>
        <template #cell(action)="{ row }">
          <div v-if="row.source.status === JoinTeacherGroupStatus.Pending" class="flex gap-2 justify-center">
            <VaButton
              preset="secondary"
              border-color="danger"
              icon="close"
              color="danger"
              @click="handlerRequest(row.source.id, JoinTeacherGroupStatus.Rejected)"
            >
              Reject
            </VaButton>
            <VaButton
              preset="secondary"
              border-color="success"
              icon="check"
              color="success"
              @click="handlerRequest(row.source.id, JoinTeacherGroupStatus.Accepted)"
            >
              Accept
            </VaButton>
          </div>
          <div v-else-if="row.source.status === JoinTeacherGroupStatus.Cancel">
            <span>The request has been cancelled</span>
          </div>
          <div v-else>
            <span>N/a</span>
          </div>
        </template>
        <template #cell(createOn)="{ row }">
          {{ format.formatDate(row.source.createOn) }}
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
  </VaCard>
  <JoinTeamRequestReceive />
</template>

<style lang="scss">
.va-data-table-statistic th,
.va-data-table-statistic td {
  text-wrap: pretty;
  word-break: break-word;
  overflow-wrap: break-word;
}

.va-data-table-statistic tr,
.va-data-table-statistic td,
.va-data-table-statistic th {
  border: 1px solid rgb(229, 231, 235);
}
</style>
