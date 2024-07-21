<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput
      v-model="newGroupClass.name"
      :label="$t('groupClasses.name')"
      :rules="[validators.required2($t('groupClasses.name')), validators.maxLength(50)]"
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ t('settings.cancel') }}</VaButton>
      <VaButton @click="validate() && $emit('save', newGroupClass as GroupClass)">{{ saveButtonLabel }}</VaButton>
    </VaCard>
  </VaForm>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptyGroupClass, GroupClass } from '../types'
import { validators } from '@/services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  groupClass: GroupClass | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', groupclass: GroupClass): void
  (event: 'close'): void
}>()

const defaultNewGroupClass: EmptyGroupClass = {
  name: '',
}
const newGroupClass = ref({ ...defaultNewGroupClass })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newGroupClass.value).some((key) => {
    if (key === 'team') {
      return false
    }
    return (
      newGroupClass.value[key as keyof EmptyGroupClass] !==
      (props.groupClass ?? defaultNewGroupClass)?.[key as keyof EmptyGroupClass]
    )
  })
})

watch(
  () => props.groupClass,
  () => {
    if (!props.groupClass) {
      return
    }

    newGroupClass.value = {
      ...props.groupClass,
    }
  },
  { immediate: true },
)

defineExpose({
  isFormHasUnsavedChanges,
})
</script>
