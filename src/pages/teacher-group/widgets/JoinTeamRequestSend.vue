<script setup lang="ts">
import {
  HandleJoinTeamRequest,
  JoinTeacherGroupStatus,
  JoinTeacherTeamRequestResponse,
  RequestStatus,
  SearchJoinTeacherTeamRequest,
} from '../types'
import { onMounted, ref } from 'vue'
import { DataTableColumnSource, useModal, useToast } from 'vuestic-ui'
import { getErrorMessage, JoinGroupStatusColor, JoinGroupStatusLabel } from '@/services/utils'
import { format } from '../../../services/utils'
import { useJoinTeacherTeamStore } from '@/stores/modules/joinTeacherTeam.module'

const useJoinTeacherTeamRequest = useJoinTeacherTeamStore()
const { init: notify } = useToast()
const { confirm } = useModal()
const isLoading = ref(true)
const joinTeamRequest = ref<SearchJoinTeacherTeamRequest>({
  status: RequestStatus.Sent,
  pageNumber: 1,
  pageSize: 5,
})

const joinTeamResponse = ref<JoinTeacherTeamRequestResponse>()

const getJoinTeamRequest = async () => {
  try {
    isLoading.value = true
    const res = await useJoinTeacherTeamRequest.requestJoinTeamList(joinTeamRequest.value)
    joinTeamResponse.value = res
  } catch (error) {
    notify({
      message: getErrorMessage(error),
      color: 'danger',
    })
  } finally {
    isLoading.value = false
  }
}

const columnTable: DataTableColumnSource<string>[] = [
  {
    label: 'Receiver',
    key: 'AdminTeamEmail',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
  },
  {
    label: 'Content',
    key: 'content',
    thAlign: 'center',
    tdAlign: 'center',
    width: '400px',
  },
  {
    label: 'created time',
    key: 'createOn',
    thAlign: 'center',
    tdAlign: 'center',
    width: '200px',
  },
  {
    label: 'approval time',
    key: 'lastModifiedOn',
    thAlign: 'center',
    tdAlign: 'center',
    width: '200px',
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
      const request: HandleJoinTeamRequest = {
        requestId: requestId,
      }

      if (status == JoinTeacherGroupStatus.Cancel) {
        isLoading.value = true
        await useJoinTeacherTeamRequest
          .cancelJoinTeamRequest(request)
          .then(async () => {
            notify({
              message: 'Cancel successfully',
              color: 'success',
            })
          })
          .catch((error) => {
            const message = getErrorMessage(error)
            notify({
              message: message,
              color: 'danger',
            })
          })
          .finally(() => {
            isLoading.value = false
          })
        await getJoinTeamRequest()
      }
    }
  })
}
const handlePageChange = async (newPage: number) => {
  joinTeamRequest.value.pageNumber = newPage
  await getJoinTeamRequest()
}

onMounted(async () => {
  await getJoinTeamRequest()
})
</script>

<template>
  <VaCard>
    <VaCardTitle>Request join team</VaCardTitle>
    <VaCardContent>
      <VaDataTable
        :items="joinTeamResponse?.data"
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
        <template #cell(lastModifiedOn)="{ row }">
          <span v-if="row.source.status !== JoinTeacherGroupStatus.Pending">{{
            format.formatDate(row.source.lastModifiedOn)
          }}</span>
        </template>
        <template #cell(createOn)="{ row }">
          <span>{{ format.formatDate(row.source.createOn) }}</span>
        </template>
        <template v-if="joinTeamResponse && joinTeamResponse.data.length > 0" #bodyAppend>
          <tr>
            <td colspan="6">
              <div class="flex justify-center mt-4">
                <VaPagination
                  v-model="joinTeamResponse.currentPage"
                  :pages="joinTeamResponse.totalPages"
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
</template>

<style lang="css">
.va-data-table-statistic th,
.va-data-table-statistic td {
  text-wrap: pretty;
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>
