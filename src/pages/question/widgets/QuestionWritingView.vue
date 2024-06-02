<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Question } from '../types'
import QuestionHeadView from './child/QuestionHeadView.vue'
import QuestionFooterView from './child/QuestionFooterView.vue'

const props = defineProps<{
  question: Question | null
  index: number | null
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
}>()

const readMoreActivated = ref(false)

onBeforeMount(() => {
  if ((props.question?.content.length ?? 0) < 500) {
    readMoreActivated.value = true
  }
})
</script>

<template>
  <VaCardContent class="leading-3 text-sm">
    <QuestionHeadView :question="props.question" :index="props.index" />
    <div class="mt-2">
      <span v-if="!readMoreActivated">
        {{ props.question?.content.slice(0, 500) }} ...
        <a href="#" class="text-primary" @click="readMoreActivated = !readMoreActivated">Read more</a>
      </span>
      <span v-else>
        {{ props.question?.content }}
      </span>
    </div>
    <!-- footer -->
    <QuestionFooterView
      :question="props.question"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCardContent>
</template>
