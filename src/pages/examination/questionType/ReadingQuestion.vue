<script lang="ts" setup>
import { Question } from '@/pages/question/types'
import { SubmitPaperDetailDto } from '../types'
import QuestionHeadView from '@pages/question/widgets/child/QuestionHeadView.vue'
import QuestionFooterView from '@/pages/question/widgets/child/QuestionFooterView.vue'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  question: Question
  studentAnswers: SubmitPaperDetailDto[]
  showActionButton: boolean
  index: number | null
}>()

const readMoreActivated = ref(false)

const showQuestionPassage = ref(false)

const indexToLetter = (index: number) => {
  return String.fromCharCode(65 + index)
}

const getPointAchieve = () => {
  let mark = 0
  props.question.questionPassages?.forEach((childQuestion) => {
    const a = props.studentAnswers.find((detail) => detail.questionId === childQuestion.id)?.mark || 0
    mark += a
  })
  return mark
}

// const getUserAnswer = (questionId: string | undefined) => {
//   return props.studentAnswers.find((detail) => detail.questionId === questionId)?.answerRaw || ''
// }

const getQuestionPassage = (question: Question) => {
  return question.questionPassages
    ?.map((passage) => {
      if (!passage || !passage.answers || !passage.content) {
        return ''
      }

      const correctAnswer = passage.answers.find((answer) => answer.isCorrect)
      const studentAnswer = props.studentAnswers.find((detail) => detail.questionId === passage.id)
      const isCorrectAnswer = correctAnswer && studentAnswer ? studentAnswer.answerRaw === correctAnswer.id : false

      const passageAnswers = passage.answers
        .map((answer, index) => {
          let color = answer.isCorrect ? 'text-success' : ''
          const fontWeight = answer.isCorrect ? 'font-bold' : ''
          if (answer.id === studentAnswer?.answerRaw) {
            color = isCorrectAnswer ? 'text-success' : 'text-danger'
          }
          return `<li class="mt-2 ${color} ${fontWeight}">${indexToLetter(index)}. ${answer.content}</li>`
        })
        .join('')

      const html = `
      <div class="mt-5">
        <b>${passage.content.replace(/\n/g, '<br>')}</b>
        <ul class="mt-2">
          ${passageAnswers}
        </ul>
      </div>
    `
      return html
    })
    .join('')
}

onBeforeMount(() => {
  if ((props.question?.content.length ?? 0) < 500) {
    readMoreActivated.value = true
  }
})
</script>

<template>
  <VaCard outlined class="mb-2 p-2">
    <QuestionHeadView :question="question" :index="index" />
    <VaCardTitle>{{ t('papers.point') }}: {{ getPointAchieve() }}/{{ question.mark }}</VaCardTitle>
    <div class="mt-2">
      <span v-if="!readMoreActivated">
        <!-- eslint-disable vue/no-v-html -->
        <div style="line-height: initial" v-html="props.question?.content.slice(0, 500).replace(/\n/g, '<br>')"></div>
        <!--eslint-enable-->
        ...
        <button href="#" class="text-primary" @click="readMoreActivated = !readMoreActivated">
          {{ t('settings.read_more') }}
        </button>
      </span>
      <span v-else>
        <div style="line-height: initial" v-html="props.question?.content.replace(/\n/g, '<br>')"></div>
      </span>
    </div>
    <!-- Question passages -->
    <VaBadge overlap :text="`${props.question?.questionPassages?.length}`" class="mt-3">
      <VaButton
        preset="secondary"
        border-color="primary"
        color="primary"
        size="small"
        @click="showQuestionPassage = !showQuestionPassage"
      >
        {{ showQuestionPassage ? t('settings.hide') : t('settings.show') }} {{ t('papers.question_passages') }}
      </VaButton>
    </VaBadge>
    <!-- eslint-disable vue/no-v-html -->
    <div v-if="showQuestionPassage" class="mt-3" v-html="getQuestionPassage(props.question as Question)"></div>
    <!--eslint-enable-->
    <VaCardBlock class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 mt-2">
      <VaCardBlock v-for="(answer, index2) in props.question?.answers" :key="index2" class="col-span-1">
        <VaCardContent>
          <b>{{ indexToLetter(index2) }}.</b> {{ answer.content }}
        </VaCardContent>
      </VaCardBlock>
    </VaCardBlock>
    <!-- footer -->
    <QuestionFooterView :question="props.question" :show-action-button="props.showActionButton" />
  </VaCard>
</template>
