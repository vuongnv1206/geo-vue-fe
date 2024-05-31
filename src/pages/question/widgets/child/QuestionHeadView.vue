<script setup lang="ts">
import { Question, QuestionType } from '../../types'
import { QuestionTypeColor, QuestionTypeLabel } from '@services/utils'

const props = defineProps<{
  question: Question | null
  index: number | null
}>()
</script>

<template>
  <div class="flex justify-between">
    <h6 class="text-primary text-primary text-sm font-bold">Question {{ props.index }}:</h6>
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
