<script lang="ts" setup>
import { defineProps } from 'vue'
import { SubmitPaperDetailDto } from '../types'
import { Question } from '@/pages/question/types'
import QuestionHeadView from '@pages/question/widgets/child/QuestionHeadView.vue'
import QuestionFooterView from '@/pages/question/widgets/child/QuestionFooterView.vue'

const props = defineProps<{
  questions: Question[]
  studentAnswers: SubmitPaperDetailDto[]
  showActionButton: boolean
}>()

const getCorrectAnswer = (question: Question) => {
  return question.answers?.find((answer) => answer.isCorrect)?.content || ''
}

const getUserAnswer = (questionId: string | undefined) => {
  return props.studentAnswers.find((detail) => detail.questionId === questionId)?.answerRaw || ''
}

const getContentFormat = (question: Question) => {
  return question.content.replace(/\n/g, '<br>')
}
</script>

<template>
  <div v-for="(question, index) in questions" :key="question.id">
    <VaCard outlined class="mb-2 p-2">
      <QuestionHeadView :question="question" :index="index + 1" />
      <VaCardContent>
        <div class="mt-2">
          <!-- eslint-disable vue/no-v-html -->
          <p style="line-height: initial" v-html="getContentFormat(question as Question)" />
          <!--eslint-enable-->
        </div>
        <div class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(answer, idx) in question.answers" :key="answer.id">
            <span> {{ String.fromCharCode(65 + idx) }}. {{ answer.content }} </span>
            <VaIcon
              v-if="getUserAnswer(question.id) === answer.id"
              :name="answer.isCorrect ? 'check_circle' : 'cancel'"
              :color="answer.isCorrect ? 'success' : 'danger'"
              size="small"
              class="m-2"
            />
          </div>
        </div>
        <div class="va-text-bold mt-3 va-text-success">Đáp án đúng: {{ getCorrectAnswer(question) }}</div>
      </VaCardContent>
      <QuestionFooterView :question="question" :show-action-button="props.showActionButton" />
    </VaCard>
  </div>
</template>
