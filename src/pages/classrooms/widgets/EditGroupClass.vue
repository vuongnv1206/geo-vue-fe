<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptyGroupClass, GroupClass } from '../type'

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

defineExpose({
  isFormHasUnsavedChanges,
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

const required = (v: string) => !!v || 'This field is required'
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newGroupClass.name" label="GroupClass name" :rules="[required]" />

    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newGroupClass as GroupClass)">{{ saveButtonLabel }}</VaButton>
    </div>
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
