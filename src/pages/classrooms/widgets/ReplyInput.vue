<template>
  <VaCard class="p-2">
    <div class="relative">
      <!-- <VaInput class="flex-grow mr-2" v-model="replyContent" placeholder="Say something..." /> -->
      <QuillEditor
        theme="bubble"
        @update:content="
          (v) =>
            (replyContent = v.ops
              .map((op: any) => op.insert)
              .join('')
              .trim())
        "
      />
      <div class="absolute right-0 top-0 h-full flex items-end">
        <VaButton preset="plain" size="small" class="mr-1" icon="send" @click="submitReply" />
        <VaButton preset="plain" size="small" class="mr-2" @click="$emit('cancel')"> Cancel </VaButton>
      </div>
    </div>
  </VaCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
const props = defineProps<{
  postId: string
  parentId: string
}>()

const emit = defineEmits<{
  (e: 'submit', postId: string, parentId: string, content: string): void
  (e: 'cancel'): void
}>()

const replyContent = ref('')

function submitReply() {
  if (replyContent.value.trim()) {
    emit('submit', props.postId, props.parentId, replyContent.value)
    replyContent.value = ''
  }
}
</script>
