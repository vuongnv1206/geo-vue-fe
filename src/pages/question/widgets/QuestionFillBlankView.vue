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
</script>

<template>
  <VaCardContent class="leading-3 text-sm">
    <QuestionHeadView :question="props.question" :index="props.index" />
    <div class="mt-2">
      <!-- eslint-disable vue/no-v-html -->
      <p style="line-height: initial" v-html="formatContent(props.question?.content || '')"></p>
      <!--eslint-enable-->
    </div>
    <div class="mt-5">
      <b style="color: var(--va-success)">{{ t('questions.correct_answer') }}:</b>
    </div>
    <div class="mb-2 mt-2 flex flex-wrap gap-4">
      <div
        v-for="(answer, index2) in getCorrectAnswer(props.question as Question)"
        :key="index2"
        class="border border-dashed border-backgroundBorder p-2"
      >
        <b style="color: var(--va-success)">{{ index2 }}. {{ answer }}</b>
      </div>
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

<style lang="scss" scoped>
.fillblank {
  width: 50px;
  text-align: center;
}
</style>
