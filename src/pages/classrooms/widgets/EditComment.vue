<template>
  <QuillEditor v-model:content="newComment.content" class="border rounded" theme="bubble" content-type="html" />
  <div class="w-full flex justify-end mt-4">
    <VaCard class="inline-flex flex-col-reverse sm:flex-row gap-2 p-2">
      <VaButton preset="secondary" color="secondary" @click="emit('close')">Cancel</VaButton>
      <VaButton @click="emit('save', newComment)">Save</VaButton>
    </VaCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import { EmptyComment } from '../types'

const props = defineProps<{
  comment: EmptyComment | null
}>()

const emit = defineEmits<{
  (e: 'save', comment: EmptyComment): void
  (event: 'close'): void
}>()

const defaultNewComment: EmptyComment = {
  id: '',
  postId: '',
  parentId: '',
  content: '',
}
const newComment = ref({ ...defaultNewComment })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newComment.value).some((key) => {
    return (
      newComment.value[key as keyof EmptyComment] !== (props.comment ?? defaultNewComment)?.[key as keyof EmptyComment]
    )
  })
})

watch(
  () => props.comment,
  () => {
    if (!props.comment) {
      return
    }

    newComment.value = { ...props.comment }
  },
  { immediate: true },
)

defineExpose({
  isFormHasUnsavedChanges,
})
</script>
