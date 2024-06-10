<script setup lang="ts">
import { Question } from '../types'
import QuestionHeadView from './child/QuestionHeadView.vue'
import QuestionFooterView from './child/QuestionFooterView.vue'

const props = defineProps<{
  question: Question | null
  index: number | null
  showActionButton: boolean
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
}>()

const indexToLetter = (index: number) => {
  return String.fromCharCode(65 + index)
}

const getContentFormat = (question: Question) => {
  return question.content.replace(/\n/g, '<br>')
}

const getCorrectAnswer = (question: Question) => {
  return question.answers
    .filter((answer) => answer.isCorrect)
    .map((answer) => indexToLetter(question.answers.indexOf(answer)))
    .join(', ')
}
</script>

<template>
  <VaCardContent class="leading-3 text-sm">
    <QuestionHeadView :question="props.question" :index="props.index" />
    <div class="mt-2">
      <!-- eslint-disable vue/no-v-html -->
      <p style="line-height: initial" v-html="getContentFormat(props.question as Question)" />
      <!--eslint-enable-->
    </div>
    <VaCardBlock class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 mt-2">
      <VaCardBlock v-for="(answer, index2) in props.question?.answers" :key="index2" class="col-span-1">
        <VaCardContent>
          <b>{{ indexToLetter(index2) }}.</b> {{ answer.content }}
        </VaCardContent>
      </VaCardBlock>
    </VaCardBlock>
    <div class="mt-5">
      <b style="color: var(--va-success)"
        >Correct answer: {{ props.question ? getCorrectAnswer(props.question) : '' }}</b
      >
    </div>
    <!-- footer -->
    <QuestionFooterView
      :question="props.question"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCardContent>
</template>
