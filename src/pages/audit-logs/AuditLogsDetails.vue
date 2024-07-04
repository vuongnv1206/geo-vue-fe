<template>
  <section
    v-if="props?.detailsInformation?.action === ActionEnum.Update.Action"
    class="my-3 grid grid-cols-1 md:grid-cols-2 gap-2"
  >
    <div>
      <p class="font-semibold text-lg text-danger mb-5">{{ t('auditLogs.details.oldData') }}</p>
      <div class="font-semibold my-2 p-2 bg-slate-900 rounded">
        <pre class="font-medium whitespace-pre-wrap break-words text-white">{{
          getPrettyJson(props?.detailsInformation?.oldValues)
        }}</pre>
      </div>
    </div>
    <div>
      <p class="font-semibold text-lg text-success mb-5">{{ t('auditLogs.details.newData') }}</p>
      <div class="font-semibold my-2 p-2 bg-slate-900 rounded">
        <pre class="font-medium whitespace-pre-wrap break-words text-white">{{
          getPrettyJson(props?.detailsInformation?.newValues)
        }}</pre>
      </div>
    </div>
  </section>
  <section
    v-if="props?.detailsInformation?.action !== ActionEnum.Update.Action"
    class="my-3 flex justify-center items-center"
  >
    <div>
      <p class="font-semibold text-lg mb-5 text-center" :class="getTextColor()">
        {{
          props?.detailsInformation?.action === ActionEnum.Create.Action
            ? t('auditLogs.details.newData')
            : t('auditLogs.details.oldData')
        }}
      </p>
      <div class="font-semibold my-2 p-2 bg-slate-900 rounded">
        <pre class="font-medium whitespace-pre-wrap break-words text-white">{{
          props?.detailsInformation?.action === ActionEnum.Create.Action
            ? getPrettyJson(props?.detailsInformation?.newValues)
            : getPrettyJson(props?.detailsInformation?.resource)
        }}</pre>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ActionEnum } from './audit-logs.enum'

const { t } = useI18n()
const props = defineProps<{
  detailsInformation: any
}>()

const getTextColor = () =>
  props?.detailsInformation?.action === ActionEnum.Create.Action ? 'text-success' : 'text-danger'

const getPrettyJson = (defaultJsonString: string) => {
  const jsonObj = JSON.parse(defaultJsonString)
  const prettyJsonString = JSON.stringify(jsonObj, null, 2)
  return prettyJsonString
}
</script>
