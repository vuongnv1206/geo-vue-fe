<script setup lang="ts">
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

const indexToLetter = (index: number) => {
  return String.fromCharCode(65 + index)
}

const getContentFormat = (question: Question) => {
  return question.content.replace(/\n/g, '<br>')
}

const SelectAnswer = (idx: number) => {
  props.question?.answers.forEach((answer, index) => {
    if (index === idx) {
      answer.isCorrect = !answer.isCorrect
    } else {
      answer.isCorrect = false
    }
  })

  emit('edit', props.question as Question)
}
</script>

<template>
  <VaCardContent class="leading-3 text-sm p-2 py-5">
    <QuestionEditHeadView :question="props.question" :index="props.index" class="ml-[20px]" />
    <div class="mt-2 border rounded border-slate-300 py-3 px-1 ml-[20px]">
      <!-- eslint-disable vue/no-v-html -->
      <p style="line-height: initial" v-html="getContentFormat(props.question as Question)" />
      <!--eslint-enable-->
    </div>
    <div class="grid grid-cols-1 gap-1 mt-4">
      <div v-for="(answer, index2) in props.question?.answers" :key="index2" class="col-span-1">
        <div>
          <VaHover stateful>
            <template #default="{ hover }">
              <VaIcon v-if="answer.isCorrect" name="check" class="text-primary min-w-[20px]" />
              <button
                :class="
                  'border rounded p-2 min-w-[35px]' +
                  (answer.isCorrect ? ' border-primary' : hover ? ' border-primary' : ' border-slate-300') +
                  (!answer.isCorrect ? ' ml-[20px]' : '')
                "
                @click="SelectAnswer(index2)"
              >
                <b>{{ indexToLetter(index2) }}.</b>
              </button>
              <button
                :class="
                  'border rounded p-2 ml-2 ' +
                  (answer.isCorrect ? ' border-primary' : hover ? ' border-primary' : ' border-slate-300')
                "
              >
                {{ answer.content }}
              </button>
            </template>
          </VaHover>
        </div>
      </div>
    </div>
    <QuestionFooterView
      :question="props.question"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCardContent>
</template>
