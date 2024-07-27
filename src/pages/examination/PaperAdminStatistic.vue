<script lang="ts" setup>
import { useRoute } from 'vue-router'
import BasicPaperStatistic from './widgets/BasicPaperStatistic.vue'
import ExcelStatisticPaper from './widgets/ExcelStatisticPaper.vue'
import SpectrumChartPaperStatistic from './widgets/SpectrumChartPaperStatistic.vue'

const route = useRoute()
const paperId = route.params.id as string
</script>

<template>
  <VaCard class="mb-3 p-2">
    <VaButton size="small" icon="chevron_left" icon-color="#ffffff"> Back </VaButton>
  </VaCard>
  <div class="grid xm:grid-cols-1 md:grid-cols-3 gap-3 mb-3">
    <VaCard class="md:col-span-2 xm:col-span-1">
      <BasicPaperStatistic :paper-id="paperId" />
    </VaCard>
    <VaCard class="col-span-1">
      <ExcelStatisticPaper />
    </VaCard>
  </div>
  <div>
    <VaCard>
      <SpectrumChartPaperStatistic />
    </VaCard>
  </div>
</template>
