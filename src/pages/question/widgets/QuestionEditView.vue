<script setup lang="ts">
import { Question, QuestionType } from '../types'
import QuestionEditMultipleChoiceView from './questionEditView/QuestionEditMultipleChoiceView.vue'
import QuestionEditSingleChoiceView from './questionEditView/QuestionEditSingleChoiceView.vue'
import QuestionEditFillBlankView from './questionEditView/QuestionEditFillBlankView.vue'
import QuestionEditMatchingView from './questionEditView/QuestionEditMatchingView.vue'
import QuestionEditReadingView from './questionEditView/QuestionEditReadingView.vue'
import QuestionEditWritingView from './questionEditView/QuestionEditWritingView.vue'

const props = defineProps<{
  question: Question | null
  index: number | null
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
}>()
</script>

<template>
  <VaCard class="col-span-3 md:col-span-1 min-h-[100px] border border-dashed border-backgroundBorder m-3">
    <QuestionEditMultipleChoiceView
      v-if="props.question?.questionType === QuestionType.MultipleChoice"
      :question="props.question"
      :index="props.index"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionEditSingleChoiceView
      v-else-if="props.question?.questionType === QuestionType.SingleChoice"
      :question="props.question"
      :index="props.index"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionEditFillBlankView
      v-else-if="props.question?.questionType === QuestionType.FillBlank"
      :question="props.question"
      :index="props.index"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionEditMatchingView
      v-else-if="props.question?.questionType === QuestionType.Matching"
      :question="props.question"
      :index="props.index"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionEditReadingView
      v-else-if="props.question?.questionType === QuestionType.Reading"
      :question="props.question"
      :index="props.index"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionEditWritingView
      v-else-if="props.question?.questionType === QuestionType.Writing"
      :question="props.question"
      :index="props.index"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCard>
</template>

<style lang="scss" scoped></style>
