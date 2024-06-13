<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Question } from '../../types'
import QuestionEditHeadView from './child/QuestionEditHeadView.vue'

const props = defineProps<{
  question: Question | null
  index: number | null
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
}>()

const readMoreActivated = ref(false)

const showQuestionPassage = ref(false)

const indexToLetter = (index: number) => {
  return String.fromCharCode(65 + index)
}

const getQuestionPassage = (question: Question) => {
  return question.questionPassages
    ?.map((passage) => {
      if (!passage || !passage.answers || !passage.content) {
        return ''
      }
      const passageAnswers = passage.answers
        .map((answer, index) => {
          const color = answer.isCorrect ? 'text-success' : ''
          const fontWeight = answer.isCorrect ? 'font-bold' : ''
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
  <VaCardContent class="leading-3 p-2 text-sm py-5">
    <QuestionEditHeadView :question="props.question" :index="props.index" class="ml-[20px]" />
    <div class="mt-2 ml-[20px]">
      <span v-if="!readMoreActivated">
        <!-- eslint-disable vue/no-v-html -->
        <div style="line-height: initial" v-html="props.question?.content.slice(0, 500).replace(/\n/g, '<br>')"></div>
        <!--eslint-enable-->
        ...
        <button class="text-primary" @click="readMoreActivated = !readMoreActivated">Read more</button>
      </span>
      <span v-else>
        <!-- eslint-disable vue/no-v-html -->
        <div style="line-height: initial" v-html="props.question?.content.replace(/\n/g, '<br>')"></div>
        <!--eslint-enable-->
      </span>
    </div>
    <!-- Question passages -->
    <VaBadge overlap :text="`${props.question?.questionPassages?.length}`" class="mt-3 ml-[20px]">
      <VaButton
        preset="secondary"
        border-color="primary"
        color="primary"
        size="small"
        @click="showQuestionPassage = !showQuestionPassage"
      >
        {{ showQuestionPassage ? 'Hide' : 'Show' }} question passages
      </VaButton>
    </VaBadge>
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="showQuestionPassage"
      class="mt-3 ml-[20px]"
      v-html="getQuestionPassage(props.question as Question)"
    ></div>
    <!--eslint-enable-->
    <VaCardBlock class="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 mt-2 ml-[20px]">
      <VaCardBlock v-for="(answer, index2) in props.question?.answers" :key="index2" class="col-span-1">
        <VaCardContent>
          <b>{{ indexToLetter(index2) }}.</b> {{ answer.content }}
        </VaCardContent>
      </VaCardBlock>
    </VaCardBlock>
    <!-- footer -->
    <QuestionFooterView
      :question="props.question"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCardContent>
</template>
