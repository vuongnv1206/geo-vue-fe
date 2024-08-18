<template>
  <VaCard>
    <VaCardContent>
      <VaSelect
        v-model="formData.status"
        :options="statusOptions"
        text-by="label"
        value-by="value"
        :label="t('subscription.orders.status')"
        class="w-40"
        @update:modelValue="handleChangeStatus"
      />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  handleTriggerFilter: (filterQuery: any) => void
}>()

const { t } = useI18n()
const formData = reactive({ status: null })
const statusOptions = computed(() => [
  { value: null, label: t('subscription.orders.all') },
  { value: 0, label: t('subscription.orders.pending') },
  { value: 1, label: t('subscription.orders.completed') },
  { value: 3, label: t('subscription.orders.canceled') },
])

const handleChangeStatus = () => {
  props.handleTriggerFilter(formData)
}
</script>
