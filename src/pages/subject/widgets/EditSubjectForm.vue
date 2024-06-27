<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptySubject, Subject } from '../types'
import { validators } from '@/services/utils'
import { VaCard } from 'vuestic-ui/web-components'

const props = defineProps<{
  subject: Subject | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', subject: Subject): void
  (event: 'close'): void
}>()

const defaultNewSubject: EmptySubject = {
  id: '',
  name: '',
  description: '',
}

const newSubject = ref({ ...defaultNewSubject })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newSubject.value).some((key) => {
    return (
      newSubject.value[key as keyof EmptySubject] !== (props.subject ?? defaultNewSubject)?.[key as keyof EmptySubject]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.subject,
  () => {
    if (!props.subject) {
      return
    }

    newSubject.value = { ...props.subject }
  },
  { immediate: true },
)
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput
      v-model="newSubject.name"
      label="Subject name"
      placeholder="Enter subject name"
      :rules="[validators.required2('Subject name'), validators.maxLength(50)]"
    />
    <VaInput
      v-model="newSubject.description"
      label="Description"
      placeholder="Enter description"
      :rules="[validators.maxLength(2000)]"
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newSubject as Subject)">{{ saveButtonLabel }}</VaButton>
    </VaCard>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
