<script setup lang="ts">
import { Question, QuestionType } from '../../../types'
import { QuestionTypeColor, QuestionTypeLabel } from '@services/utils'

const props = defineProps<{
  question: Question | null
  index: number | null
}>()
</script>

<template>
  <div class="flex justify-between">
    <div class="flex justify-start">
      <button class="border rounded border-slate-200 p-1">
        <h6 class="text-primary text-primary text-sm font-bold">Question {{ props.index }}:</h6>
      </button>
      <button class="border-r rounded border-slate-200 px-4">
        <div class="flex items-center">
          <VaIcon name="attach_file" class="mr-1 text-primary" />
          <h6 class="text-primary text-primary text-sm font-bold">Audio</h6>
        </div>
      </button>
      <button class="border-r rounded border-slate-200 px-4">
        <div class="flex items-center">
          <VaIcon name="label" class="mr-1 text-primary" />
          <h6 class="text-primary text-primary text-sm font-bold">Label</h6>
        </div>
      </button>
    </div>
    <div></div>
    <div>
      <VaBadge
        :text="QuestionTypeLabel(question?.questionType as QuestionType)"
        :color="QuestionTypeColor(question?.questionType as QuestionType)"
        class="mr-2"
      />
    </div>
  </div>
</template>
