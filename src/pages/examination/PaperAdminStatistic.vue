<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import BasicPaperStatistic from './widgets/BasicPaperStatistic.vue'
import ExcelStatisticPaper from './widgets/ExcelStatisticPaper.vue'
import SpectrumChartPaperStatistic from './widgets/SpectrumChartPaperStatistic.vue'
import FrequencyTableStatistic from './widgets/FrequencyTableStatistic.vue'
import { useToast } from 'vuestic-ui'
import { usePaperStore } from '@/stores/modules/paper.module'
import { PaperAccess, PaperDto } from './types'
import { onMounted, ref } from 'vue'
import RatioRightWrongQuestionStatistic from './widgets/RatioRightWrongQuestionStatistic.vue'
import TranscriptTableStatistic from './widgets/TranscriptTableStatistic.vue'

const route = useRoute()
const router = useRouter()
const paperStore = usePaperStore()
const paperId = route.params.id as string
const { init: notify } = useToast()

const classAccessOption = ref<PaperAccess[]>([])
const classIdSelected = ref<string | undefined>(undefined)

const paperDetail = ref<PaperDto | null>(null)
const getPaperDetail = async () => {
  try {
    const res = await paperStore.paperDetail(paperId)
    paperDetail.value = res
    if (res.paperAccesses?.some((pa) => pa.classId != null)) {
      classAccessOption.value = res.paperAccesses?.filter((pa) => pa.classId !== null)
    }
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
  <VaCard class="flex justify-between mb-3 p-2 gap-2">
    <VaButton size="small" icon="chevron_left" icon-color="#ffffff" @click="backToPaperDetail"> Back </VaButton>
    <VaSelect
      v-model="classIdSelected"
      :options="classAccessOption"
      :text-by="(option: PaperAccess) => option.className"
      :value-by="(option: PaperAccess) => option.classId"
      placeholder="Select a classroom"
      clearable
      class="md:max-w-[25%] xs:max-w-[100%]"
    />
  </VaCard>
  <div class="grid xm:grid-cols-1 md:grid-cols-3 gap-3 mb-3">
    <VaCard class="md:col-span-2 xm:col-span-1">
      <BasicPaperStatistic :paper-id="paperId" :class-id="classIdSelected" />
    </VaCard>
    <VaCard class="col-span-1">
      <ExcelStatisticPaper />
    </VaCard>
  </div>
  <div class="mb-3">
    <VaCard>
      <SpectrumChartPaperStatistic :paper-id="paperId" :class-id="classIdSelected" />
    </VaCard>
  </div>
  <div class="mb-3">
    <VaCard>
      <FrequencyTableStatistic :paper-id="paperId" :class-id="classIdSelected" />
    </VaCard>
  </div>
  <div class="mb-3">
    <VaCard>
      <RatioRightWrongQuestionStatistic :paper-id="paperId" :class-id="classIdSelected" />
    </VaCard>
  </div>
  <div class="mb-3">
    <VaCard>
      <TranscriptTableStatistic :paper-id="paperId" :class-id="classIdSelected" />
    </VaCard>
  </div>
</template>
