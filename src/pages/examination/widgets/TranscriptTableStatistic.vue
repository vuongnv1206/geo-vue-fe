<script setup lang="ts">
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { DataTableColumnSource, useToast } from 'vuestic-ui'
import { TranscriptStatisticRequest, TranscriptStatisticResponse } from '../types'
import { computed, onMounted, ref } from 'vue'
import { format, getErrorMessage, notifications } from '@/services/utils'
const props = defineProps<{
  paperId: string
}>()

const { init: notify } = useToast()

const statisticPaperStore = useStatisticPaperStore()

const responseData = ref<TranscriptStatisticResponse>()

const getDataTranscriptStatistic = async (paperId: string) => {
  const request = ref<TranscriptStatisticRequest>({
    paperId: paperId,
  })

  try {
    const res = await statisticPaperStore.transcriptStatistic(request.value)
    responseData.value = res
    console.log(res)
  } catch (error) {
    notify({
      message: notifications.getFailed('question statistic ') + getErrorMessage(error),
      color: 'danger',
    })
  }
}

const columnTable: DataTableColumnSource<string>[] = [
  {
    label: 'Student code',
    key: 'attendee.studentCode',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Full name',
    key: 'fullName',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Contact',
    key: 'contact',
    thAlign: 'center',
    tdAlign: 'center',
    width: '150px',
  },
  {
    label: 'Date of birth',
    key: 'dateOfBirth',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Started test',
    key: 'startedTest',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Score',
    key: 'mark',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
]

const formattedData = computed(() => {
  return responseData.value?.data.map((item) => ({
    ...item,
    fullName: `${item.attendee.firstName} ${item.attendee.lastName}`,
    contact: `${item.attendee.email} - ${item.attendee.phoneNumber}`,
    dateOfBirth: format.formatDateNoTime(item.attendee.dateOfBirth),
    startedTest: format.formatDate(item.startedTest),
  }))
})

onMounted(async () => {
  await getDataTranscriptStatistic(props.paperId)
})
</script>

<template>
  <VaCard>
    <VaCardTitle>Transcript table</VaCardTitle>
    <VaCardContent>
      <VaDataTable
        :items="formattedData"
        :columns="columnTable"
        sticky-header
        :disable-client-side-sorting="false"
        class="va-data-table-statistic"
      >
        <template #footer>
          <tr class="va-data-table__table-tr text-center">
            <td colspan="5" class="va-data-table__table-td">Medium Score</td>
            <td class="va-data-table__table-td">
              {{ responseData?.averageMark }}
            </td>
          </tr>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
</template>
