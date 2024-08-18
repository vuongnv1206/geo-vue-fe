<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const optionsExcelCheckbox = reactive([
  { label: 'Spectrum statistics', value: 1, isSelect: true },
  { label: 'Statistics on the ratio of true / false according to the question', value: 2, isSelect: true },
  { label: 'Score Board', value: 3, isSelect: true },
])
</script>

<template>
  <VaCard>
    <VaCardTitle>Export statistical data to Excel</VaCardTitle>
    <VaCardContent class="mt-2">
      <template v-for="checkbox in optionsExcelCheckbox" :key="checkbox.value">
        <VaCheckbox v-model="checkbox.isSelect" class="mb-2" :label="checkbox.label" />
        <VaDivider />
      </template>

      <VaButton preset="secondary" border-color="primary" class="mb-2 float-right" icon="description">
        {{ t('papers.excel_export_button') }}
      </VaButton>
    </VaCardContent>
  </VaCard>
</template>
