<template>
  <h1 class="font-bold text-xl">{{ t('auditLogs.title') }}</h1>
  <VaCard class="my-4 rounded p-5">
    <AuditLogsForm :handle-trigger-filter="handleTriggerFilter" />
    <AuditLogsTable :filter-queries="filterQueries" />
  </VaCard>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import AuditLogsForm from './AuditLogsForm.vue'
import AuditLogsTable from './AuditLogsTable.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const filterQueries = ref({ action: '', resource: '' })

const handleTriggerFilter = (filterQuery: any) => {
  filterQueries.value = { ...filterQuery }
}
</script>
