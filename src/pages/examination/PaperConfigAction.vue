<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PaperDto } from '@/pages/examination/types'
import { usePaperStore } from '@/stores/modules/paper.module'
import { useToast } from 'vuestic-ui'
const paperDetail = ref<PaperDto | null>(null)
const route = useRoute()
const paperStore = usePaperStore()
const { init: notify } = useToast()
const getPaperDetail = () => {
  const paperId = route.params.id
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

onMounted(() => {
  getPaperDetail()
})
</script>
<template>
  <div class="flex" style="align-items: center">
    <p class="mr-3 va-h3">Config Exam:</p>
    <p class="va-h5">{{ paperDetail?.examName }}</p>
  </div>
  <div class="flex justify-center">
    <div style="max-width: 70%">
      <VaCard>
        <VaCardTitle>Online</VaCardTitle>
        <VaCardContent>
          <p class="va-text-secondary text-xs mb-2">
            <VaIcon name="info" class="material-symbols-outlined" />
            Copy the link and send it to students. Students access the link to do and submit assignments online. Support
            both multiple choice and essay
          </p>

          <VaButton preset="secondary" border-color="primary" icon="settings">Config Online Testing</VaButton>
        </VaCardContent>
      </VaCard>

      <VaCard class="mt-3">
        <VaCardTitle>Offline</VaCardTitle>
        <VaCardContent>
          <p class="va-text-secondary text-xs mb-2">
            <VaIcon name="info" class="material-symbols-outlined" />
            Print questions for students to do on paper.
          </p>

          <VaButton preset="secondary" border-color="primary" icon="prints">Print Test</VaButton>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>
