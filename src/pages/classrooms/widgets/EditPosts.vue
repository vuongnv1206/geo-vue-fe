<template>
  <VaForm class="flex flex-col gap-2">
    <div>
      <label
        id="input-label-510"
        aria-hidden="true"
        class="va-input-label va-input-wrapper__label va-input-wrapper__label--outer"
        style="color: var(--va-primary)"
        >{{ t('posts.content') }}</label
      >
      <QuillEditor
        v-model:content="newPost.content"
        class="border rounded"
        :placeholder="$t('posts.enter_content')"
        theme="bubble"
        content-type="html"
      />
    </div>
    <VaSwitch v-model="newPost.isLockComment" size="small" :label="t('posts.lock_comment')" />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="emit('close')">{{ t('settings.cancel') }}</VaButton>
      <VaButton @click="emit('save', newPost)">{{ t('settings.save') }}</VaButton>
    </VaCard>
  </VaForm>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import { EmptyPost } from '../types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  posts: EmptyPost | null
}>()

const emit = defineEmits<{
  (e: 'save', posts: EmptyPost): void
  (event: 'close'): void
}>()

const defaultNewPost: EmptyPost = {
  id: '',
  classesId: '',
  content: '',
  isLockComment: false,
}
const newPost = ref({ ...defaultNewPost })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newPost.value).some((key) => {
    return newPost.value[key as keyof EmptyPost] !== (props.posts ?? defaultNewPost)?.[key as keyof EmptyPost]
  })
})

watch(
  () => props.posts,
  () => {
    if (!props.posts) {
      return
    }
    newPost.value = { ...props.posts }
  },
  { immediate: true },
)

defineExpose({
  isFormHasUnsavedChanges,
})
</script>
