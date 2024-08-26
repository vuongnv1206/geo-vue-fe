<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  AcceptJoinTeamRequest,
  HandleJoinTeamRequest,
  JoinTeacherGroupStatus,
  JoinTeacherTeamRequestDto,
  JoinTeacherTeamRequestResponse,
  RequestStatus,
  SearchJoinTeacherTeamRequest,
} from '../types'
import { DataTableColumnSource, useModal, useToast } from 'vuestic-ui'
import { format, getErrorMessage, JoinGroupStatusColor, JoinGroupStatusLabel } from '@/services/utils'
import { useJoinTeacherTeamStore } from '@/stores/modules/joinTeacherTeam.module'
import AcceptRequestModal from './AcceptRequestModal.vue'

const useJoinTeacherTeamRequest = useJoinTeacherTeamStore()
const { init: notify } = useToast()
const { confirm } = useModal()

const joinTeamRequest = ref<SearchJoinTeacherTeamRequest>({
  status: RequestStatus.Received,
  pageNumber: 1,
  pageSize: 5,
})

const isLoading = ref(true)

const joinTeamResponse = ref<JoinTeacherTeamRequestResponse>()

const getJoinTeacherTeamRequest = async () => {
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
    label: 'Full name',
    key: 'senderFullName',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '200px',
  },
  {
    label: 'Sender',
    key: 'senderEmail',
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
  const messageConfirm = 'Are you sure reject this request join team'

  confirm(messageConfirm).then(async (agreed) => {
    if (agreed) {
      if (status == JoinTeacherGroupStatus.Rejected) {
        isLoading.value = true
        const request: HandleJoinTeamRequest = {
          requestId: requestId,
        }
        await useJoinTeacherTeamRequest
          .rejectJoinTeamRequest(request)
          .then(async () => {
            notify({
              message: 'Reject successfully',
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
      }
      await getJoinTeacherTeamRequest()
    }
  })
}

const handlePageChange = async (newPage: number) => {
  joinTeamRequest.value.pageNumber = newPage
  await getJoinTeacherTeamRequest()
}

const showAcceptModal = ref(false)
const selectedRequest = ref<JoinTeacherTeamRequestDto>()
const showAcceptModalHandle = (request: JoinTeacherTeamRequestDto) => {
  showAcceptModal.value = !showAcceptModal.value
  selectedRequest.value = request
}

const handleAcceptRequest = async (data: AcceptJoinTeamRequest) => {
  isLoading.value = true
  await useJoinTeacherTeamRequest
    .acceptJoinTeamRequest(data)
    .then(async () => {
      notify({
        message: 'Accept successfully',
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
  await getJoinTeacherTeamRequest()
}

onMounted(async () => {
  await getJoinTeacherTeamRequest()
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
              @click="showAcceptModalHandle(row.source as JoinTeacherTeamRequestDto)"
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
        <template #cell(lastModifiedOn)="{ row }">
          <span v-if="row.source.status !== JoinTeacherGroupStatus.Pending">{{
            format.formatDate(row.source.lastModifiedOn)
          }}</span>
          <span v-else> N/a </span>
        </template>
        <template #cell(createOn)="{ row }">
          {{ format.formatDate(row.source.createOn) }}
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

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="showAcceptModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
  >
    <AcceptRequestModal
      v-if="selectedRequest"
      :request-join="selectedRequest"
      :save-button-label="'Approve'"
      @close="cancel"
      @save="
        (data: AcceptJoinTeamRequest) => {
          handleAcceptRequest(data)
          ok()
        }
      "
    />
  </VaModal>
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
