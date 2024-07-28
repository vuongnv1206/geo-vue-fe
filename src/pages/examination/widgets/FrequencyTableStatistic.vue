<script setup lang="ts">
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { useToast } from 'vuestic-ui'
import { ClassroomFrequencyMarkRequest, ClassroomFrequencyMarkResponse } from '../types'
import { onMounted, ref } from 'vue'
import { getErrorMessage, notifications } from '@/services/utils'

const props = defineProps<{
  paperId: string
  classroomIds: string[] | null
}>()

const { init: notify } = useToast()

const statisticPaperStore = useStatisticPaperStore()

const data = ref<ClassroomFrequencyMarkResponse>()

const getFrequencyMark = async (paperId: string, classId?: string) => {
  const request = ref<ClassroomFrequencyMarkRequest>({
    paperId: paperId,
    classroomId: classId,
  })
  try {
    const res = await statisticPaperStore.frequencyMarkStatistic(request.value)
    data.value = res
  } catch (error) {
    notify({
      message: notifications.getFailed('frequency score ') + getErrorMessage(error),
      color: 'danger',
    })
  }
}

const calculatePercent = (numberAchieve: number, totalAttendee: number | undefined) => {
  if (totalAttendee === undefined || totalAttendee === null || totalAttendee === 0) {
    return 0
  }
  return (numberAchieve / totalAttendee) * 100
}

onMounted(async () => {
  await getFrequencyMark(props.paperId)
})
</script>

<template>
  <VaCard>
    <VaCardTitle>Frequency table</VaCardTitle>
    <VaCardContent>
      <div class="va-table-responsive">
        <table class="va-table va-table--hoverable border min-w-[100%]">
          <thead>
            <tr>
              <th class="border">Class</th>
              <th colspan="2" class="border">Number of students</th>
              <th
                v-for="(scoreRange, index) in data?.frequencyMarks"
                :key="index"
                colspan="2"
                class="va-text-center border"
              >
                {{ scoreRange.fromMark }} - {{ scoreRange.toMark }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border"></td>
              <td class="border">Register</td>
              <td class="border">Contest</td>
              <template v-for="(scoreRange, index) in data?.frequencyMarks" :key="index">
                <td class="border">Amount</td>
                <td class="border">%</td>
              </template>
            </tr>
            <tr>
              <td class="border">All of contestants</td>
              <td class="border">{{ data?.totalRegister }}</td>
              <td class="border">{{ data?.totalAttendee }}</td>
              <template v-for="(scoreRange, index) in data?.frequencyMarks" :key="index">
                <td class="border">{{ scoreRange.total }}</td>
                <td>{{ calculatePercent(scoreRange.total, data?.totalAttendee) }}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<style scoped>
.va-table-responsive {
  overflow: auto;
}
</style>
