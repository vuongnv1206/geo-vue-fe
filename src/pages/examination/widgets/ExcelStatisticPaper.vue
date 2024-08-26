<script setup lang="ts">
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { GeneratePaperStatisticExcelRequest } from '../types'
import { useToast } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'

const props = defineProps<{
  paperId: string
  classId?: string
}>()

const { t } = useI18n()
const optionsExcelCheckbox = reactive([
  { label: 'Get Classroom Frequency Mark', value: 1, isSelect: true },
  { label: 'Get List Transcript', value: 2, isSelect: true },
  { label: 'Get Paper Information', value: 3, isSelect: true },
])
const paperStatisticsStore = useStatisticPaperStore()
const { init: notify } = useToast()
const exportExcelStatistics = () => {
  const selectedStatisticTypes = optionsExcelCheckbox
    .filter((option) => option.isSelect) // Lọc các option có isSelect bằng true
    .map((option) => option.value) // Lấy giá trị value của các option đó

  const request: GeneratePaperStatisticExcelRequest = {
    paperId: props.paperId,
    classId: props.classId,
    requestStatisticTypes: selectedStatisticTypes,
  }
  paperStatisticsStore
    .exportExcelStatistics(request)
    .then((response) => {
      console.log('aaaa', response)
      // notify({
      //   message: notifications.downloadSuccess(),
      //   color: 'success',
      // })
    })
    .catch((error) => {
      notify({
        message: notifications.downloadFailed() + getErrorMessage(error),
        color: 'error',
      })
    })
}
</script>

<template>
  <VaCard>
    <VaCardTitle>Export statistical data to Excel</VaCardTitle>
    <VaCardContent class="mt-2">
      <template v-for="checkbox in optionsExcelCheckbox" :key="checkbox.value">
        <VaCheckbox v-model="checkbox.isSelect" class="mb-2" :label="checkbox.label" />
        <VaDivider />
      </template>

      <VaButton
        preset="secondary"
        border-color="primary"
        class="mb-2 float-right"
        icon="description"
        @click="exportExcelStatistics"
      >
        {{ t('papers.excel_export_button') }}
      </VaButton>
    </VaCardContent>
  </VaCard>
</template>
