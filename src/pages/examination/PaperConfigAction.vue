<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PaperDto } from '@/pages/examination/types'
import { usePaperStore } from '@/stores/modules/paper.module'
import { useToast, VaCard, VaCardTitle } from 'vuestic-ui'

const paperDetail = ref<PaperDto | null>(null)
const route = useRoute()
const router = useRouter()
const paperStore = usePaperStore()
const { init: notify } = useToast()
const paperId = route.params.id
const getPaperDetail = () => {
  paperStore
    .paperDetail(paperId.toString())
    .then((res) => {
      paperDetail.value = res
    })
    .catch((error) => {
      notify({
        message: `Not Found ${error}`,
        color: 'danger',
      })
    })
}

const configOnline = () => {
  router.push({ name: 'paper-config-online', params: { id: paperId } })
}

const backToPage = () => {
  router.push({ name: 'admin-exam-detail', params: { id: paperId } })
}

onMounted(() => {
  getPaperDetail()
})
</script>
<template>
  <div class="flex justify-center">
    <div class="min-w-[50%]">
      <VaCard class="flex mb-3">
        <VaCardTitle class="flex gap-2">
          <VaButton size="small" @click="backToPage">
            <VaIcon name="keyboard_arrow_left" />
          </VaButton>
          <p class="va-title">Config Exam:</p>
          <p class="">{{ paperDetail?.examName }}</p>
        </VaCardTitle>
      </VaCard>
      <VaCard>
        <VaCardTitle>Online</VaCardTitle>
        <VaCardContent>
          <VaButton preset="secondary" border-color="primary" icon="settings" @click="configOnline"
            >Config Online Testing</VaButton
          >
        </VaCardContent>
      </VaCard>

      <VaCard class="mt-3">
        <VaCardTitle>Offline</VaCardTitle>
        <VaCardContent>
          <VaButton preset="secondary" border-color="primary" icon="text_snippet">Export exam to Word</VaButton>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>
