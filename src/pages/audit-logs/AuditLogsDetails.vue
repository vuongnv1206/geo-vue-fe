<template>
  <section
    v-if="props?.detailsInformation?.action === ActionEnum.Update.Action"
    class="my-3 flex justify-center items-center"
  >
    <div>
      <p class="font-semibold text-lg text-warning mb-5 text-center">{{ t('auditLogs.details.update') }}</p>
      <div class="font-semibold my-2 p-2 rounded">
        <VaCardContent class="pb-0">
          <VaDataTable class="my-table va-table--hoverable" :items="itemsUpdate" :columns="columnsUpdate" sticky-header>
            <template #cell(fields)="{ row }">
              <span>{{ getFormattedValue(row?.rowData?.field) }}</span>
            </template>
            <template #cell(oldData)="{ row }">
              <span>{{ row?.rowData?.oldData || 'null' }}</span>
            </template>
            <template #cell(newData)="{ row }">
              <span>{{ row?.rowData?.newData || 'null' }}</span>
            </template>
          </VaDataTable>
        </VaCardContent>
      </div>
    </div>
  </section>
  <section
    v-if="props?.detailsInformation?.action !== ActionEnum.Update.Action"
    class="my-3 flex justify-center items-center"
  >
    <div>
      <p class="font-semibold text-lg mb-5 text-center" :class="getTextColor()">
        {{ t('auditLogs.details.create') }}
      </p>
      <div class="font-semibold my-2 p-2 rounded">
        <VaCardContent v-if="props?.detailsInformation?.action === ActionEnum.Create.Action" class="pb-0">
          <VaDataTable class="my-table va-table--hoverable" :items="itemsCreate" :columns="columnsCreate" sticky-header>
            <template #cell(fields)="{ row }">
              <span>{{ getFormattedValue(row?.rowData?.field) }}</span>
            </template>
            <template #cell(data)="{ row }">
              <span>{{ row?.rowData?.data || 'null' }}</span>
            </template>
          </VaDataTable>
        </VaCardContent>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ActionEnum } from './audit-logs.enum'
import { computed, ref, watch } from 'vue'

const { t } = useI18n()
const props = defineProps<{
  detailsInformation: any
}>()
const itemsUpdate = ref<any[]>([])
const itemsCreate = ref<any[]>([])
const columnsCreate = computed(() => [
  { key: 'fields', label: t('auditLogs.details.fields') },
  { key: 'data', label: t('auditLogs.details.data') },
])
const columnsUpdate = computed(() => [
  { key: 'fields', label: t('auditLogs.details.fields') },
  { key: 'oldData', label: t('auditLogs.details.oldData') },
  { key: 'newData', label: t('auditLogs.details.newData') },
])

watch(
  () => props?.detailsInformation,
  (details) => {
    if (details?.action === ActionEnum.Update.Action) {
      const jsonDataOldValues = JSON.parse(details?.oldValues)
      const jsonDataNewValues = JSON.parse(details?.newValues)
      const result = Object.keys(jsonDataOldValues).map((key: any) => {
        if (Object.prototype.hasOwnProperty.call(jsonDataNewValues, key)) {
          return { field: key, oldData: jsonDataOldValues[key], newData: jsonDataNewValues[key] }
        }
      })
      itemsUpdate.value = result
    }
    if (details?.action === ActionEnum.Create.Action) {
      const jsonDataNewValues = JSON.parse(details?.newValues)
      const resultNewValues = Object.keys(jsonDataNewValues).map((key: any) => ({
        field: key,
        data: jsonDataNewValues[key],
      }))
      itemsCreate.value = resultNewValues
    }
  },
  { immediate: true },
)

const getFormattedValue = (value: string) => {
  const capitalizeValue = value.charAt(0).toUpperCase() + value.slice(1)
  return capitalizeValue.replace(/([A-Z])/g, ' $1').trim()
}

const getTextColor = () =>
  props?.detailsInformation?.action === ActionEnum.Create.Action ? 'text-success' : 'text-danger'
</script>
