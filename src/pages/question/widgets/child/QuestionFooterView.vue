<script setup lang="ts">
import { Question } from '../../types'

const props = defineProps<{
  question: Question | null
  showActionButton: boolean
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
}>()
</script>

<template>
  <div class="flex justify-between">
    <div class="flex gap-2">
      <h1 class="mt-3">
        <VaBadge
          :text="props.question?.questionLable?.name"
          :color="props.question?.questionLable?.color || 'primary'"
        />
      </h1>
    </div>
    <div v-if="showActionButton" class="flex gap-2">
      <VaIcon name="mso-edit" color="primary" @click="emit('edit', props.question as Question)" />
      <VaIcon name="mso-delete" color="danger" @click="emit('delete', props.question as Question)" />
    </div>
  </div>
</template>
