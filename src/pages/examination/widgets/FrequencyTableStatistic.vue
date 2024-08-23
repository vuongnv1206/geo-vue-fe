<script setup lang="ts">
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { useToast } from 'vuestic-ui'
import { ClassroomFrequencyMarkRequest, ClassroomFrequencyMarkResponse, FrequencyMark } from '../types'
import { onMounted, ref } from 'vue'
import { getErrorMessage, notifications } from '@/services/utils'

const props = defineProps<{
  paperId: string
  classId?: string
}>()

const { init: notify } = useToast()

const statisticPaperStore = useStatisticPaperStore()

const data = ref<ClassroomFrequencyMarkResponse[]>([])

const frequencyMarkRange = ref<FrequencyMark[]>([])

const getFrequencyMark = async (paperId: string, classId?: string) => {
  const request = ref<ClassroomFrequencyMarkRequest>({
    paperId: paperId,
    classroomId: classId,
  })
  try {
    const res = await statisticPaperStore.frequencyMarkClassroomStatistic(request.value)
    data.value = res
    if (res.length > 0) {
      frequencyMarkRange.value = res[0].frequencyMarks
    }
  } catch (error) {
    notify({
      message: notifications.getFailed('frequency score class') + getErrorMessage(error),
      color: 'danger',
    })
  }
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
                v-for="(scoreRange, index) in frequencyMarkRange"
                :key="index"
                colspan="2"
                class="va-text-center border"
              >
                {{ index === frequencyMarkRange.length - 1 ? '<=' : '<' }}{{ scoreRange.toMark }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border"></td>
              <td class="border">Register</td>
              <td class="border">Contest</td>
              <template v-for="(scoreRange, index) in frequencyMarkRange" :key="index">
                <td class="border">Amount</td>
                <td class="border">%</td>
              </template>
            </tr>
            <template v-if="data.length > 0">
              <tr v-for="(item, index) in data" :key="index">
                <td class="border">{{ item.className }}</td>
                <td class="border">{{ item.totalRegister }}</td>
                <td class="border">{{ item.totalAttendee }}</td>
                <template v-for="(scoreRange, index2) in item.frequencyMarks" :key="index2">
                  <td class="border">{{ scoreRange.total }}</td>
                  <td class="border">{{ scoreRange.rate }}</td>
                </template>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td></td>
                <td class="border">0</td>
                <td class="border">0</td>
              </tr>
            </template>
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
