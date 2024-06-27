<template>
  <VaCard class="p-2">
    <div class="relative">
      <!-- <VaInput class="flex-grow mr-2" v-model="replyContent" placeholder="Say something..." /> -->
      <QuillEditor v-model="replyContent" class="h-13" theme="bubble" />

      <div class="absolute right-0 top-0 h-full flex items-end">
        <VaButton preset="plain" size="small" class="mr-1" icon="send" @click="handleSubmit" />
        <VaButton preset="plain" size="small" class="mr-2" @click="$emit('cancel')"> Cancel </VaButton>
      </div>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import { useQuillReply } from './quillUtils'

const props = defineProps<{
  postId: string
  parentId: string
}>()

const emit = defineEmits<{
  (e: 'submit', postId: string, parentId: string, content: string): void
  (e: 'cancel'): void
}>()
const { replyContent, submitReply } = useQuillReply(emit)

const handleSubmit = () => submitReply(props.postId, props.parentId)
</script>
