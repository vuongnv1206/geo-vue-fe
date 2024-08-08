<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { validators } from '@/services/utils'
import { CreatePaperLabelRequest, PaperLabelDto } from '../../types'

const props = defineProps<{
  label: PaperLabelDto | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', label: PaperLabelDto): void
  (event: 'close'): void
}>()

const defaultNewLabel: CreatePaperLabelRequest = {
  name: '',
}

const newLabel = ref({ ...defaultNewLabel })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newLabel.value).some((key) => {
    return (
      newLabel.value[key as keyof CreatePaperLabelRequest] !==
      (props.label ?? defaultNewLabel)?.[key as keyof CreatePaperLabelRequest]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.label,
  () => {
    if (!props.label) {
      return
    }

    newLabel.value = { ...props.label }
  },
  { immediate: true },
)
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput
      v-model="newLabel.name"
      :label="$t('subjects.subject_name')"
      :placeholder="$t('subjects.enter_name')"
      :rules="[validators.required2('name'), validators.maxLength(50)]"
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ $t('settings.cancel') }}</VaButton>
      <VaButton @click="validate() && $emit('save', newLabel as PaperLabelDto)">{{ saveButtonLabel }}</VaButton>
    </VaCard>
  </VaForm>
</template>
