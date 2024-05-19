<script setup lang="ts">
import { ref, watch } from 'vue'
import { QuestionTree, QuestionTreeEmpty } from '../types'

const props = defineProps<{
  questionTree: QuestionTree | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', questionTree: QuestionTree): void
  (event: 'close'): void
}>()

const defaultNewQuestionTree: QuestionTreeEmpty = {
  id: props.questionTree?.id || '',
  name: '',
  parentId: props.questionTree?.id || '',
}

const newQuestionTree = ref({ ...defaultNewQuestionTree })

watch(
  () => props.questionTree,
  () => {
    if (!props.questionTree) {
      return
    }

    newQuestionTree.value = {
      ...props.questionTree,
    }
  },
  { immediate: true },
)
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput
      v-model="newQuestionTree.name"
      label="Folder name"
      :rules="[(v) => v.length > 0 || `Folder name is required`]"
    />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newQuestionTree as QuestionTree)">{{ saveButtonLabel }}</VaButton>
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
