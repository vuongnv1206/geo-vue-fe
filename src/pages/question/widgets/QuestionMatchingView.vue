<script setup lang="ts">
import { Question } from '../types'
import QuestionHeadView from './child/QuestionHeadView.vue'
import QuestionFooterView from './child/QuestionFooterView.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  question: Question | null
  index: number | null
  showActionButton: boolean
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
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

const getCorrectAnswer = (question: Question) => {
  return question.answers
    .map((answer) => {
      const pairs = answer.content.split('|')
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
    })
    .at(0)
}
</script>

<template>
  <VaCardContent class="leading-3 text-sm">
    <QuestionHeadView :question="props.question" :index="props.index" />
    <div class="mt-2">
      <!-- eslint-disable vue/no-v-html -->
      <div v-html="formatContent(props.question?.content || '')"></div>
      <!--eslint-enable-->
    </div>
    <div class="mt-5">
      <b style="color: var(--va-success)">{{ t('questions.correct_answer') }}:</b>
    </div>
    <div class="mb-2 mt-2 flex flex-wrap gap-4">
      <div
        v-for="(pair, index2) in getCorrectAnswer(props.question as Question)"
        :key="index2"
        class="border border-dashed border-backgroundBorder p-2"
      >
        <b style="color: var(--va-success)">{{ pair.A }} - {{ pair.B }}</b>
      </div>
    </div>
    <QuestionFooterView
      :question="props.question"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCardContent>
</template>
