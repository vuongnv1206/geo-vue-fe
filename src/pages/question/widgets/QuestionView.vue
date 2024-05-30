<script setup lang="ts">
import { Question, QuestionType } from '../types'

const props = defineProps<{
  question: Question | null
  index: number | null
}>()

const indexToLetter = (index: number) => {
  return String.fromCharCode(65 + index)
}

const getCorrectAnswer = (question: Question) => {
  // Single choice
  if (question.questionType === QuestionType.SingleChoice) {
    return indexToLetter(question.answers.findIndex((answer) => answer.isCorrect))
  }
  // Multiple choice
  if (question.questionType === QuestionType.MultipleChoice) {
    return question.answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => indexToLetter(question.answers.indexOf(answer)))
      .join(', ')
  }
  // Fill blank
  if (question.questionType === QuestionType.FillBlank) {
    return question.answers.map((answer) => answer.content).join(', ')
  }
}
</script>

<template>
  <VaCard class="col-span-3 md:col-span-1 min-h-[100px] border border-dashed border-backgroundBorder m-5">
    <VaCardContent
      v-if="
        props.question?.questionType === QuestionType.SingleChoice ||
        props.question?.questionType === QuestionType.MultipleChoice
      "
      class="leading-3 text-sm"
    >
      <h6 class="text-primary text-primary text-sm leading-7 font-bold">Question {{ props.index }}:</h6>
      <div class="mt-2">
        {{ props.question?.content }}
      </div>
      <VaCardBlock class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 mt-2">
        <VaCardBlock v-for="(answer, index2) in props.question?.answers" :key="index2" class="col-span-1">
          <VaCardContent>
            <b>{{ indexToLetter(index2) }}.</b> {{ answer.content }}
          </VaCardContent>
        </VaCardBlock>
      </VaCardBlock>
      <!-- footer -->
      <VaCardFooter>
        <div class="flex justify-between">
          <div class="flex gap-2">
            <b style="color: var(--va-success)">Correct answer: {{ getCorrectAnswer(props.question) }}</b>
          </div>
          <div class="flex gap-2">
            <VaIcon name="mso-edit" color="primary" />
            <VaIcon name="mso-delete" color="danger" />
          </div>
        </div>
      </VaCardFooter>
    </VaCardContent>
    <VaCardContent v-if="props.question?.questionType === QuestionType.FillBlank" class="leading-3 text-sm">
      <h6 class="text-primary text-primary text-sm leading-7 font-bold">Question {{ props.index }}:</h6>
      <div class="mt-2">
        {{ props.question?.content }}
      </div>
      <VaCardBlock class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 mt-2">
        <VaCardBlock v-for="(answer, index2) in props.question?.answers" :key="index2" class="col-span-1">
          <VaCardContent>
            <b>{{ indexToLetter(index2) }}.</b> {{ answer.content }}
          </VaCardContent>
        </VaCardBlock>
      </VaCardBlock>
      <!-- footer -->
      <VaCardFooter>
        <div class="flex justify-between">
          <div class="flex gap-2">
            <b style="color: var(--va-success)">Correct answer: {{ getCorrectAnswer(props.question) }}</b>
          </div>
          <div class="flex gap-2">
            <VaIcon name="mso-edit" color="primary" />
            <VaIcon name="mso-delete" color="danger" />
          </div>
        </div>
      </VaCardFooter>
    </VaCardContent>
  </VaCard>
</template>

<style lang="scss" scoped></style>
