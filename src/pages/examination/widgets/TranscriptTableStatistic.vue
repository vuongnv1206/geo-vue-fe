<script setup lang="ts">
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { DataTableColumnSource, useToast } from 'vuestic-ui'
import { TranscriptStatisticRequest, TranscriptStatisticResponse } from '../types'
import { computed, ref, watch } from 'vue'
import { format, getErrorMessage, notifications } from '@/services/utils'
import { useRouter } from 'vue-router'
const props = defineProps<{
  paperId: string
  classId?: string
}>()

const { init: notify } = useToast()

const statisticPaperStore = useStatisticPaperStore()
const router = useRouter()
const responseData = ref<TranscriptStatisticResponse>()

const getDataTranscriptStatistic = async (paperId: string, classId?: string) => {
  const request = ref<TranscriptStatisticRequest>({
    paperId: paperId,
    classId: classId === '' ? undefined : classId,
  })

  try {
    const res = await statisticPaperStore.transcriptStatistic(request.value)
    responseData.value = res
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
  },
  {
    label: 'Contact',
    key: 'contact',
    thAlign: 'center',
    tdAlign: 'center',
  },
  {
    label: 'Date of birth',
    key: 'dateOfBirth',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
  },
  {
    label: 'Started test',
    key: 'startedTest',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
  },
  {
    label: 'Classroom',
    key: 'classrooms',
    thAlign: 'center',
    tdAlign: 'center',
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
    classrooms: item.classrooms,
  }))
})

const redirectToClassDetail = (classId: string) => {
  router.push({ name: 'class-details', params: { id: classId } })
}

watch(
  () => props.classId,
  (newClassId) => {
    getDataTranscriptStatistic(props.paperId, newClassId)
  },
  { immediate: true },
)

// onMounted(async () => {
//   await getDataTranscriptStatistic(props.paperId)
// })
</script>

<template>
  <VaCard>
    <VaCardTitle>Transcript</VaCardTitle>
    <VaCardContent>
      <VaDataTable
        :items="formattedData"
        :columns="columnTable"
        sticky-header
        :disable-client-side-sorting="false"
        class="va-data-table-statistic"
      >
        <template #cell(classrooms)="{ row }">
          <VaChip
            v-for="classroom in row.source.classrooms"
            :key="classroom.id"
            outline
            class="cursor-pointer m-1"
            @click="redirectToClassDetail(classroom.id)"
          >
            {{ classroom.name }}
          </VaChip>
        </template>
        <template #footer>
          <tr class="va-data-table__table-tr text-center">
            <td colspan="6" class="va-data-table__table-td">Medium Score</td>
            <td class="va-data-table__table-td">
              {{ responseData?.averageMark }}
            </td>
          </tr>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
</template>
