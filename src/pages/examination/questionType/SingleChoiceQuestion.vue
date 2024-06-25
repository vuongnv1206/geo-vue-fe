<script lang="ts" setup>
import { defineProps } from 'vue'
import { SubmitPaperDetailDto } from '../types'
import { Question } from '@/pages/question/types'
import QuestionHeadView from '@pages/question/widgets/child/QuestionHeadView.vue'
import QuestionFooterView from '@/pages/question/widgets/child/QuestionFooterView.vue'

const props = defineProps<{
  question: Question
  studentAnswers: SubmitPaperDetailDto[]
  showActionButton: boolean
  index: number | null
}>()

const getCorrectAnswer = (question?: Question) => {
  return question?.answers.find((answer) => answer.isCorrect)?.content || ''
}

const getUserAnswer = (questionId: string | undefined) => {
  const answerRaw = props.studentAnswers.find((detail) => detail.questionId === questionId)?.answerRaw || ''

  return answerRaw.split('|')
}

const getPointAchieve = (questionId: string | undefined) => {
  const a = props.studentAnswers.find((detail) => detail.questionId === questionId)?.mark || 0
  return a
}

const getContentFormat = (question?: Question) => {
  return question?.content.replace(/\n/g, '<br>')
}
</script>

<template>
  <VaCard outlined class="mb-2 p-2">
    <QuestionHeadView :question="question" :index="index" />
    <VaCardTitle>Point: {{ getPointAchieve(question.id) }}/{{ question.mark }}</VaCardTitle>
    <VaCardContent>
      <div class="mt-2">
        <!-- eslint-disable vue/no-v-html -->
        <p style="line-height: initial" v-html="getContentFormat(question as Question)" />
        <!--eslint-enable-->
      </div>
      <div class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(answer, idx) in question.answers" :key="answer.id || ''">
          <span> {{ String.fromCharCode(65 + idx) }}. {{ answer.content }} </span>
          <span v-for="(ans, index2) in getUserAnswer(question.id)" :key="index2">
            <VaIcon
              v-if="ans === answer.id"
              :name="answer.isCorrect ? 'check_circle' : 'cancel'"
              :color="answer.isCorrect ? 'success' : 'danger'"
              size="small"
              class="m-2"
            />
          </span>
        </div>
      </div>
      <div class="va-text-bold mt-3 va-text-success">Đáp án đúng: {{ getCorrectAnswer(question) }}</div>
    </VaCardContent>
    <QuestionFooterView :question="question" :show-action-button="props.showActionButton" />
  </VaCard>
</template>
