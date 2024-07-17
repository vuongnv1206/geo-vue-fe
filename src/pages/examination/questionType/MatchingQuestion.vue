<script lang="ts" setup>
import { Question } from '@/pages/question/types'
import { SubmitPaperDetailDto } from '../types'
import QuestionHeadView from '@pages/question/widgets/child/QuestionHeadView.vue'
import QuestionFooterView from '@/pages/question/widgets/child/QuestionFooterView.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  question: Question
  studentAnswers: SubmitPaperDetailDto[]
  showActionButton: boolean
  index: number | null
}>()

const formatContent = (content: string) => {
  const data = JSON.parse(content)

  const Qcontent = (data.Question as string).replace(/\n/g, '<br>')

  const columnA = Object.keys(data.ColumnA)
    .map((key) => `<li class="mt-2">${key}. ${data.ColumnA[key]}</li>`)
    .join('')

  const columnB = Object.keys(data.ColumnB)
    .map((key) => `<li class="mt-2">${key}. ${data.ColumnB[key]}</li>`)
    .join('')

  const html = `
    <div  style="line-height: initial;" >${Qcontent}</div>
    <div class="flex flex-wrap gap-4 mt-2">
      <div class="border border-dashed border-backgroundBorder p-5">
        <h6><b>Column A</b></h6>
        <ul class="mt-2">
          ${columnA}
        </ul>
      </div>
      <div class="border border-dashed border-backgroundBorder p-5">
        <h6><b>Column B</b></h6>
        <ul class="mt-2">
          ${columnB}
        </ul>
      </div>
    </div>
  `
  return html
}

const getCorrectAnswer = (contentAnswer: string, question: Question) => {
  const pairs = contentAnswer.split('|')
  const data = pairs.reduce(
    (acc, pair) => {
      const [key, value] = pair.split('_')
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )
  return Object.keys(data).map((key) => {
    const contentData = JSON.parse(question.content)
    return {
      A: key + '. ' + contentData.ColumnA[key],
      B: data[key] + '. ' + contentData.ColumnB[data[key]],
    }
  })
}

const getUserAnswer = (questionId: string | undefined) => {
  return props.studentAnswers.find((detail) => detail.questionId === questionId)?.answerRaw || ''
}

const isCorrect = (studentAnswer: any, correctAnswers: any[]) => {
  return correctAnswers.find((pair) => pair.A === studentAnswer.A && pair.B === studentAnswer.B)
}

const getPointAchieve = (questionId: string | undefined) => {
  const a = props.studentAnswers.find((detail) => detail.questionId === questionId)?.mark || 0
  return a
}
</script>

<template>
  <VaCard outlined class="mb-2 p-2">
    <QuestionHeadView :question="question" :index="index" />
    <VaCardTitle>{{ t('papers.point') }}: {{ getPointAchieve(question.id) }}/{{ question.mark }}</VaCardTitle>
    <VaCardContent>
      <div class="mt-2">
        <!-- eslint-disable vue/no-v-html -->
        <div v-html="formatContent(question.content || '')"></div>
        <!--eslint-enable-->
      </div>
      <div class="mt-5">
        <b>{{ t('papers.student_answer') }}:</b>
      </div>
      <div class="mb-2 mt-2 flex flex-wrap gap-4">
        <div
          v-for="(pair, index2) in getCorrectAnswer(getUserAnswer(question.id), question as Question)"
          :key="index2"
          class="border border-dashed border-backgroundBorder p-2"
        >
          <b
            :class="
              isCorrect(pair, getCorrectAnswer(question.answers[0].content, question as Question))
                ? 'va-text-success'
                : 'va-text-danger'
            "
            >{{ pair.A }} - {{ pair.B }}
          </b>
        </div>
      </div>
      <div class="mt-5">
        <b style="color: var(--va-success)"> {{ t('papers.correct_answer') }}: </b>
      </div>
      <div class="mb-2 mt-2 flex flex-wrap gap-4">
        <div
          v-for="(pair, index2) in getCorrectAnswer(question.answers[0].content, question as Question)"
          :key="index2"
          class="border border-dashed border-backgroundBorder p-2"
        >
          <b style="color: var(--va-success)">{{ pair.A }} - {{ pair.B }}</b>
        </div>
      </div>
    </VaCardContent>
    <QuestionFooterView :question="question" :show-action-button="props.showActionButton" />
  </VaCard>
</template>
