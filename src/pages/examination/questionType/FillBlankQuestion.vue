<script setup lang="ts">
import { Question } from '@/pages/question/types'
import { SubmitPaperDetailDto } from '../types'

import QuestionHeadView from '@pages/question/widgets/child/QuestionHeadView.vue'
import QuestionFooterView from '@/pages/question/widgets/child/QuestionFooterView.vue'

const props = defineProps<{
  question: Question
  studentAnswers: SubmitPaperDetailDto[]
  showActionButton: boolean
  index: number | null
}>()

const getCorrectAnswer = (question: Question) => {
  return question.answers.reduce(
    (acc, answer) => {
      const match = answer.content.match(/_\[(\d+)\](.+)/)
      if (match) {
        acc[match[1]] = match[2]
      }
      return acc
    },
    {} as Record<string, string>,
  )
}

const formatContent = (content: string) => {
  return content
    .replace(
      /\$_fillblank\[(\d+)\]/g,
      '<span class="fillblank border border-dashed border-backgroundBorder m-2 px-3">$1</span>',
    )
    .replace(/\n/g, '<br>')
}

const getUserAnswer = (questionId: string | undefined) => {
  const ans = props.studentAnswers.find((detail) => detail.questionId === questionId)?.answerRaw || ''
  return JSON.parse(ans)
}

const isCorrect = (correctAnswer: Record<string, string>, userAnswer: Record<string, string>) => {
  for (const key in userAnswer) {
    if (correctAnswer[key] !== userAnswer[key]) return false
    return true
  }
}

const getPointAchieve = (questionId: string | undefined) => {
  const a = props.studentAnswers.find((detail) => detail.questionId === questionId)?.mark || 0
  return a
}
</script>

<template>
  <VaCard outlined class="mb-2 p-2">
    <QuestionHeadView :question="props.question" :index="props.index" />
    <VaCardTitle>Point: {{ getPointAchieve(question.id) }}/{{ question.mark }}</VaCardTitle>
    <div class="mt-2">
      <!-- eslint-disable vue/no-v-html -->
      <p style="line-height: initial" v-html="formatContent(props.question?.content || '')"></p>
      <!--eslint-enable-->
    </div>
    <div class="mb-2 mt-5 flex flex-wrap gap-4">
      <b>Student's answer:</b>
      <template v-for="(record, index2) in getUserAnswer(props.question.id)" :key="index2">
        <div v-for="(value, key) in record" :key="key" class="border border-dashed border-backgroundBorder p-2">
          <b :class="isCorrect(getCorrectAnswer(props.question), record) ? 'va-text-success' : 'va-text-danger'"
            >{{ key }}. {{ value }}
          </b>
        </div>
      </template>
    </div>
    <div class="mb-2 mt-2 flex flex-wrap gap-4">
      <b class="va-text-success">Correct answer:</b>
      <div
        v-for="(answer, index3) in getCorrectAnswer(props.question as Question)"
        :key="index3"
        class="border border-dashed border-backgroundBorder p-2"
      >
        <b class="va-text-success">{{ index3 }}. {{ answer }}</b>
      </div>
    </div>
    <!-- footer -->
    <QuestionFooterView :question="props.question" :show-action-button="props.showActionButton" />
  </VaCard>
</template>
