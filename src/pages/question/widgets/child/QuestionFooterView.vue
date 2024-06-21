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

const getTimeString = (date: string) => {
  return date.split('T')[0] + ' ' + date.split('T')[1].split('.')[0]
}

const options = [
  { text: props.question?.owner?.userName, value: 'createdBy', icon: 'person' },
  { text: getTimeString(props.question?.createdOn || ''), value: 'createdOn', icon: 'mso-event_upcoming' },
  { text: getTimeString(props.question?.lastModifiedOn || ''), value: 'updatedOn', icon: 'edit_calendar' },
]
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
      <div class="flex gap-2">
        <VaMenu :options="options">
          <template #anchor>
            <div>
              <VaIcon name="mso-info" color="primary" />
            </div>
          </template>
        </VaMenu>
        <VaIcon name="mso-edit" color="primary" @click="emit('edit', props.question as Question)" />
        <VaIcon name="mso-delete" color="danger" @click="emit('delete', props.question as Question)" />
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2">
        <VaMenu :options="options">
          <template #anchor>
            <div>
              <VaIcon name="mso-info" color="primary" />
            </div>
          </template>
        </VaMenu>
      </div>
    </div>
  </div>
</template>
