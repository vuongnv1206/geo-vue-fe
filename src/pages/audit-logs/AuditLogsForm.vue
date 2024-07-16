<template>
  <VaForm class="grid md:grid-cols-4 gap-4 my-5">
    <VaSelect
      v-model="formData.resource"
      :options="resourceType"
      text-by="label"
      value-by="value"
      :label="t('auditLogs.form.resourceType')"
      @update:modelValue="handleChangeResource"
    />
    <VaSelect
      v-model="formData.action"
      :options="optionsAction"
      text-by="label"
      value-by="value"
      :label="t('auditLogs.form.actionType')"
      @update:modelValue="handleChangeAction"
    />
  </VaForm>
</template>

<script setup lang="ts">
import { useAuditLogsStore } from '@/stores/modules/auditLogs.module'
import { onMounted, reactive, ref } from 'vue'
import { optionsAction } from './audit-logs.enum'
import { optionsActionType } from './types'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  handleTriggerFilter: (filterQuery: any) => void
}>()
const auditLogsStore = useAuditLogsStore()
const formData = reactive({ action: '', resource: '' })
const resourceType = ref<optionsActionType[]>([])
const { t } = useI18n()
const getResourceType = async () => {
  await auditLogsStore.getResourceType().then((response) => {
    const optionsResource = response?.data?.map((item: any) => ({
      label: item,
      value: item,
    }))
    optionsResource.unshift({ label: 'All', value: '' })
    resourceType.value = [...(optionsResource || [])]
  })
}
onMounted(() => {
  getResourceType()
})

const handleChangeResource = () => {
  props.handleTriggerFilter(formData)
}

const handleChangeAction = () => {
  props.handleTriggerFilter(formData)
}
</script>
