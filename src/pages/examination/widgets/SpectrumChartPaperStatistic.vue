<template>
  <VaCard>
    <VaCardTitle>Spectrum charts</VaCardTitle>
    <VaCardContent>
      <div class="flex justify-center w-full h-full overflow-hidden relative">
        <canvas ref="canvas" style="width: 100%; height: 400px"></canvas>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { useToast } from 'vuestic-ui'
import { ClassroomFrequencyMarkRequest, ClassroomFrequencyMarkResponse } from '../types'
import { getErrorMessage, notifications } from '@/services/utils'

const props = defineProps<{
  paperId: string
  classId?: string
}>()

const { init: notify } = useToast()

const statisticPaperStore = useStatisticPaperStore()

const data = ref<ClassroomFrequencyMarkResponse>()
const getFrequencyMark = async (paperId: string, classId?: string) => {
  const request = ref<ClassroomFrequencyMarkRequest>({
    paperId: paperId,
    classroomId: classId === '' ? undefined : classId,
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

const canvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null // Track the Chart instance

const labelScores = computed(() => {
  return (data.value?.frequencyMarks ?? []).map(({ fromMark, toMark }) => `${fromMark}-${toMark}`)
})

const renderChart = () => {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      // Destroy the previous chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy()
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labelScores.value,
          datasets: [
            {
              label: `Account`,
              data: (data.value?.frequencyMarks ?? []).map((mark) => mark.total),
              backgroundColor: 'blue',
              borderColor: 'blue',
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false,
              },
              border: {
                width: 0,
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    } else {
      console.error('Canvas context is null')
    }
  } else {
    console.error('Canvas element is null')
  }
}

watch(
  () => props.classId,
  async (newClassId) => {
    await getFrequencyMark(props.paperId, newClassId)
    await nextTick() // Ensure DOM is updated
    renderChart() // Re-render the chart
  },
  { immediate: true },
)

// Register Chart.js components
Chart.register(...registerables)
</script>

<style lang="scss" scoped>
canvas {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
