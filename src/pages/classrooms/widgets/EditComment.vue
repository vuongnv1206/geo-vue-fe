<template>
  <VaForm class="flex flex-col gap-2">
    <div>
      <label
        id="input-label-510"
        aria-hidden="true"
        class="va-input-label va-input-wrapper__label va-input-wrapper__label--outer"
        style="color: var(--va-primary)"
        >{{ $t('comments.content') }}</label
      >
      <QuillEditor
        v-model:content="newComment.content"
        class="border rounded"
        :placeholder="$t('comments.enter_comment')"
        theme="bubble"
        content-type="html"
      />
    </div>
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="emit('close')">{{ t('settings.cancel') }}</VaButton>
      <VaButton @click="emit('save', newComment)">{{ t('settings.save') }}</VaButton>
    </VaCard>
  </VaForm>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import { EmptyComment } from '../types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
