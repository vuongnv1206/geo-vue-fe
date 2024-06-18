<script lang="ts" setup>
import { defineProps } from 'vue'
import { SubmitPaperDetailDto } from '../types'
import { Question } from '@/pages/question/types'

const props = defineProps<{
  questions: Question[]
  studentAnswers: SubmitPaperDetailDto[]
}>()

const getCorrectAnswer = (question: Question) => {
  return question.answers?.find((answer) => answer.isCorrect)?.content || ''
}

const getUserAnswer = (questionId: string | undefined) => {
  return props.studentAnswers.find((detail) => detail.questionId === questionId)?.answerRaw || ''
}

const isUserAnswerCorrect = (questionId: string | undefined) => {
  return props.studentAnswers.find((detail) => detail.questionId === questionId)?.isCorrect || false
}
</script>

<template>
  <div v-for="(question, index) in questions" :key="question.id">
    <VaCard>
      <VaCardTitle>Câu {{ index + 1 }}</VaCardTitle>
      <VaCardContent>
        <div>{{ question.content }}</div>
        <div style="display: flex; margin-top: 10px">
          <div
            v-for="(answer, idx) in question.answers"
            :key="answer.id"
            style="margin-bottom: 5px; display: flex; align-items: center"
          >
            <span> {{ String.fromCharCode(65 + idx) }}. {{ answer.content }} </span>
            <VaIcon
              v-if="getUserAnswer(question.id) === answer.id"
              v-show="answer.isCorrect"
              name="check_circle"
              color="green"
              size="small"
            />
            <VaIcon
              v-if="getUserAnswer(question.id) === answer.id"
              v-show="!answer.isCorrect"
              name="cancel"
              color="red"
              size="small"
            />
          </div>
        </div>
        <div
          :style="{
            color: isUserAnswerCorrect(question.id) ? 'green' : 'red',
            fontWeight: 'bold',
            marginTop: '10px',
          }"
        >
          Đáp án đúng: {{ getCorrectAnswer(question) }}
        </div>
      </VaCardContent>
      <VaDivider />
    </VaCard>
  </div>
</template>
