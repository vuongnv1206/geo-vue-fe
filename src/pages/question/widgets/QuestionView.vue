<script setup lang="ts">
import { Question, QuestionType } from '../types'
import QuestionSingleChoiceView from './QuestionSingleChoiceView.vue'
import QuestionMultipleChoice from './QuestionMultipleChoiceView.vue'
import QuestionFillBlankView from './QuestionFillBlankView.vue'
import QuestionMatchingView from './QuestionMatchingView.vue'
import QuestionReadingView from './QuestionReadingView.vue'
import QuestionWritingView from './QuestionWritingView.vue'

const props = defineProps<{
  question: Question | null
  index: number | null
  showActionButton: boolean
  isStripe: boolean
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
}>()
</script>

<template>
  <VaCard
    class="col-span-3 md:col-span-1 min-h-[100px] border border-dashed border-backgroundBorder m-3"
    :stripe="props.isStripe"
    stripe-color="success"
  >
    <QuestionSingleChoiceView
      v-if="props.question?.questionType === QuestionType.SingleChoice"
      :question="props.question"
      :index="props.index"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionMultipleChoice
      v-if="props.question?.questionType === QuestionType.MultipleChoice"
      :question="props.question"
      :index="props.index"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionFillBlankView
      v-if="props.question?.questionType === QuestionType.FillBlank"
      :question="props.question"
      :index="props.index"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionMatchingView
      v-if="props.question?.questionType === QuestionType.Matching"
      :question="props.question"
      :index="props.index"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionReadingView
      v-if="props.question?.questionType === QuestionType.Reading"
      :question="props.question"
      :index="props.index"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
    <QuestionWritingView
      v-if="props.question?.questionType === QuestionType.Writing"
      :question="props.question"
      :index="props.index"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCard>
</template>

<style lang="scss" scoped></style>
