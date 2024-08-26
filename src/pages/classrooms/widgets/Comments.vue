<template>
  <div class="relative">
    <QuillEditor
      ref="quillEditor"
      v-model:content="newComment.content"
      class="border rounded"
      :placeholder="$t('comments.enter_comment')"
      theme="bubble"
      content-type="html"
    />
    <VaButton
      class="absolute bottom-0 right-0 transform mb-2 mr-2"
      preset="plain"
      size="small"
      icon="send"
      @click="handleSaveComment"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Quill, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import { EmptyComment } from '../types'

const quillEditor = ref<InstanceType<typeof QuillEditor> | null>(null)
const quillInstance = ref<Quill | null>(null)
const props = defineProps<{
  postId: string
  parentId: string
}>()

const defaultNewComment: EmptyComment = {
  id: '',
  postId: props.postId,
  parentId: props.parentId,
  content: '',
}
const newComment = ref({ ...defaultNewComment })

const emit = defineEmits<{
  (e: 'save', comment: EmptyComment): void
}>()

const clearEditor = () => {
  if (quillInstance.value) {
    quillInstance.value.setText('')
  }
  newComment.value.content = ''
}
const handleSaveComment = () => {
  emit('save', newComment.value)
  clearEditor()
}

onMounted(() => {
  if (quillEditor.value) {
    quillInstance.value = quillEditor.value.getQuill()
  }
})
</script>
