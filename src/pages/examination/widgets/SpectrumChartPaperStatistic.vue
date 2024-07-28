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
import { ref, onMounted, nextTick, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { useToast } from 'vuestic-ui'
import { ClassroomFrequencyMarkRequest, ClassroomFrequencyMarkResponse } from '../types'
import { getErrorMessage, notifications } from '@/services/utils'

const props = defineProps<{
  paperId: string
}>()

const { init: notify } = useToast()

const statisticPaperStore = useStatisticPaperStore()

const data = ref<ClassroomFrequencyMarkResponse>()
const getFrequencyMark = async (paperId: string) => {
  const request = ref<ClassroomFrequencyMarkRequest>({
    paperId: paperId,
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

// Register Chart.js components
Chart.register(...registerables)

// Reactive references
const canvas = ref<HTMLCanvasElement | null>(null)

// Computed label scores
const labelScores = computed(() => {
  return (data.value?.frequencyMarks ?? []).map(({ fromMark, toMark }) => `${fromMark}-${toMark}`)
})

onMounted(async () => {
  await getFrequencyMark(props.paperId)

  await nextTick() // Ensure DOM is updated

  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      new Chart(ctx, {
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
})
</script>

<style lang="scss" scoped>
canvas {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
