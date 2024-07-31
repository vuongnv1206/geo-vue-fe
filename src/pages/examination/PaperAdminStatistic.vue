<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import BasicPaperStatistic from './widgets/BasicPaperStatistic.vue'
import ExcelStatisticPaper from './widgets/ExcelStatisticPaper.vue'
import SpectrumChartPaperStatistic from './widgets/SpectrumChartPaperStatistic.vue'
import FrequencyTableStatistic from './widgets/FrequencyTableStatistic.vue'
import { useToast } from 'vuestic-ui'
import { usePaperStore } from '@/stores/modules/paper.module'
import { PaperDto } from './types'
import { onMounted, ref } from 'vue'
import RatioRightWrongQuestionStatistic from './widgets/RatioRightWrongQuestionStatistic.vue'
import TranscriptTableStatistic from './widgets/TranscriptTableStatistic.vue'

const route = useRoute()
const router = useRouter()
const paperStore = usePaperStore()
const paperId = route.params.id as string
const { init: notify } = useToast()

const paperDetail = ref<PaperDto | null>(null)
const getPaperDetail = async () => {
  try {
    const res = await paperStore.paperDetail(paperId)
    paperDetail.value = res
  } catch (error) {
    notify({
      message: `Not Found ${error}`,
      color: 'danger',
    })
  }
}

const backToPaperDetail = () => {
  router.push({ name: 'admin-exam-detail', params: { id: paperId } })
}

onMounted(async () => {
  await getPaperDetail()
})
</script>

<template>
  <VaCard class="mb-3 p-2">
    <VaButton size="small" icon="chevron_left" icon-color="#ffffff" @click="backToPaperDetail"> Back </VaButton>
  </VaCard>
  <div class="grid xm:grid-cols-1 md:grid-cols-3 gap-3 mb-3">
    <VaCard class="md:col-span-2 xm:col-span-1">
      <BasicPaperStatistic :paper-id="paperId" />
    </VaCard>
    <VaCard class="col-span-1">
      <ExcelStatisticPaper />
    </VaCard>
  </div>
  <div class="mb-3">
    <VaCard>
      <SpectrumChartPaperStatistic :paper-id="paperId" />
    </VaCard>
  </div>
  <div class="mb-3">
    <VaCard>
      <FrequencyTableStatistic
        :paper-id="paperId"
        :classroom-ids="
          paperDetail?.paperAccesses
            ?.filter((c) => c.classId !== null && c.classId !== undefined)
            .map((a) => a.classId as string) || []
        "
      />
    </VaCard>
  </div>
  <div class="mb-3">
    <VaCard>
      <RatioRightWrongQuestionStatistic :paper-id="paperId" />
    </VaCard>
  </div>
  <div class="mb-3">
    <VaCard>
      <TranscriptTableStatistic :paper-id="paperId" />
    </VaCard>
  </div>
</template>
