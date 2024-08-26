<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import { useToast, VaIcon } from 'vuestic-ui'
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { BasicStatisticPaperRequest, BasicStatisticPaperResponse } from '../types'
import { getErrorMessage, notifications } from '@/services/utils'

const props = defineProps<{
  paperId: string
  classId?: string
}>()
const { init: notify } = useToast()

const statisticPaperStore = useStatisticPaperStore()
const loading = ref(true)
const data = ref<BasicStatisticPaperResponse>()

const getBasicStatisticPaper = async (paperId: string, classId?: string) => {
  loading.value = true
  const request = ref<BasicStatisticPaperRequest>({
    paperId: paperId,
    classId: classId === '' ? undefined : classId,
  })
  try {
    const res = await statisticPaperStore.basicPaperStatistic(request.value)
    data.value = res
  } catch (error) {
    notify({
      message: notifications.getFailed('basic statistic ') + getErrorMessage(error),
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}

watch(
  () => props.classId,
  (newClassId) => {
    getBasicStatisticPaper(props.paperId, newClassId)
  },
  { immediate: true },
)
</script>

<template>
  <VaInnerLoading :loading="loading">
    <VaCard>
      <VaCardTitle>Basic Statistic</VaCardTitle>
    </VaCard>
    <p class="va-text-bold text-center">{{ data?.examName }} - {{ data?.subjectName }}</p>
    <VaCardContent class="grid xm:grid-cols-1 md:grid-cols-2">
      <div class="col-span-1">
        <div class="flex gap-2 m-2 va-text-secondary">
          <p class="text-xs">
            <VaIcon name="how_to_reg" size="large" />
            <span>NUMBER OF STUDENTS REGISTERED FOR THE EXAM</span>
          </p>
          <p class="va-text-bold">{{ data?.totalRegister }}</p>
        </div>
        <div class="flex gap-2 m-2 va-text-secondary">
          <p class="text-xs">
            <VaIcon name="mood" size="large" />
            <span>NUMBER OF STUDENTS WHO TOOK THE TEST </span>
          </p>
          <p class="va-text-bold">{{ data?.totalAttendee }}</p>
        </div>
        <div class="flex gap-2 m-2 va-text-secondary">
          <p class="text-xs">
            <VaIcon name="sentiment_neutral" size="large" />
            <span>NUMBER OF STUDENTS WHO ARE TAKING THE TEST</span>
          </p>
          <p class="va-text-bold">{{ data?.totalDoing }}</p>
        </div>
        <div class="flex gap-2 m-2 va-text-secondary">
          <p class="text-xs">
            <VaIcon name="sentiment_dissatisfied" size="large" />
            <span>NUMBER OF STUDENTS WHO HAVE NOT TAKEN THE TEST</span>
          </p>
          <p class="va-text-bold">{{ data?.totalNotComplete }}</p>
        </div>
      </div>
      <div class="col-span-1">
        <div class="flex gap-2 m-2 va-text-secondary">
          <p class="text-xs">
            <span>AVERAGE SCORE</span>
          </p>
          <p class="va-text-bold">{{ data?.averageMark }}</p>
        </div>
        <div class="flex gap-2 m-2 va-text-secondary">
          <p class="text-xs">
            <span
              >POPUlAR SCORE: <span class="va-text-bold">{{ data?.markPopular }}</span> - NUMBER:
              <span class="va-text-bold">{{ data?.totalPopular }}</span></span
            >
          </p>
        </div>
        <div class="flex gap-2 m-2 va-text-secondary">
          <p class="text-xs">
            <span
              >Highest SCORE: <span class="va-text-bold">{{ data?.highestMark }}</span> - NUMBER:
              <span class="va-text-bold">{{ data?.totalHighestMark }}</span></span
            >
          </p>
        </div>
        <div class="flex gap-2 m-2 va-text-secondary">
          <p class="text-xs">
            <span
              >Lowest SCORE: <span class="va-text-bold">{{ data?.lowestMark }}</span> - NUMBER:
              <span class="va-text-bold">{{ data?.totalLowestMark }}</span></span
            >
          </p>
        </div>
      </div>
    </VaCardContent>
  </VaInnerLoading>
</template>
