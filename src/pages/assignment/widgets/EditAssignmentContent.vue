<template>
  <VaCard class="p-2">
    <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
      <QuillEditor
        v-model:content="newAssignmentContent.content"
        class="border rounded"
        :placeholder="$t('assignments.enter_content')"
        content-type="html"
        style="height: 200px"
      />
      <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
        <VaButton preset="secondary" color="secondary" @click="emit('close')">{{ $t('settings.cancel') }}</VaButton>
        <VaButton @click="validate() && emit('save', newAssignmentContent as AssignmentContent)">{{
          $t('settings.save')
        }}</VaButton>
      </div>
    </VaForm>
  </VaCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { AssignmentContent, EmptyAssignmentContent } from '../types'

const props = defineProps<{
  assignmentContent: AssignmentContent | null
}>()

const emit = defineEmits<{
  (event: 'save', content: AssignmentContent): void
  (event: 'close'): void
}>()

const defaultNewAssignmentContent: EmptyAssignmentContent = {
  content: '',
}

const newAssignmentContent = ref({ ...defaultNewAssignmentContent })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newAssignmentContent.value).some((key) => {
    return (
      newAssignmentContent.value[key as keyof EmptyAssignmentContent] !==
      (props.assignmentContent ?? defaultNewAssignmentContent)?.[key as keyof EmptyAssignmentContent]
    )
  })
})

watch(
  () => props.assignmentContent,
  () => {
    if (!props.assignmentContent) {
      return
    }

    newAssignmentContent.value = { ...props.assignmentContent }
  },
  { immediate: true },
)

defineExpose({
  isFormHasUnsavedChanges,
})
</script>
