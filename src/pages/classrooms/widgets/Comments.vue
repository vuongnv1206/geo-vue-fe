<template>
  <div class="relative">
    <QuillEditor v-model:content="newComment.content" class="border rounded" theme="bubble" content-type="html" />
    <VaButton
      class="absolute bottom-0 right-0 transform mb-2 mr-2"
      preset="plain"
      size="small"
      icon="send"
      @click="emit('save', newComment)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import { EmptyComment } from '../types'

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
</script>
