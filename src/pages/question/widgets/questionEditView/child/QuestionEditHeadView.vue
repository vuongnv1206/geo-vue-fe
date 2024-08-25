<script setup lang="ts">
import { ref } from 'vue'
import { Question, QuestionType, QuestionLable } from '../../../types'
import { QuestionTypeColor, QuestionTypeLabel } from '@services/utils'

const props = defineProps<{
  question: Question | null
  index: number | null
}>()

const options = ['Easy', 'Medium', 'Hard', 'Very hard']
const colorOptions = ['success', '#FFFF00', '#34ffc5', 'danger']
const selectedOption = props.question?.questionLable?.name ? ref(props.question?.questionLable?.name) : ref('')

const emit = defineEmits<{
  (event: 'selectLable', question: Question): void
}>()

const selectOption = (option: string) => {
  selectedOption.value = option
  const questionLable: QuestionLable = {
    name: option,
  }
  props.question!.questionLable = questionLable
  emit('selectLable', props.question as Question)
}
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
      <VaDropdown class="px-4">
        <template #anchor>
          <div class="flex items-center">
            <button class="border-r rounded border-slate-200">
              <div class="flex items-center">
                <VaIcon name="label" class="mr-1 text-primary" />
                <h6 class="text-primary text-primary text-sm font-bold">Label</h6>
              </div>
            </button>
            <VaBadge
              :text="props.question?.questionLable?.name"
              :color="colorOptions[options.indexOf(selectedOption)]"
              class="ml-3"
            />
          </div>
        </template>
        <VaDropdownContent>
          <VaRadio
            v-model="selectedOption"
            :option="options[0]"
            color="success"
            label="Easy"
            name="color-radio-group"
            @Click="selectOption(options[0])" />
          <VaRadio
            v-model="selectedOption"
            :option="options[1]"
            color="#FFFF00"
            label="Medium"
            name="color-radio-group"
            @Click="selectOption(options[1])" />
          <VaRadio
            v-model="selectedOption"
            :option="options[2]"
            color="#34ffc5"
            label="Hard"
            name="color-radio-group"
            @Click="selectOption(options[2])" />
          <VaRadio
            v-model="selectedOption"
            :option="options[3]"
            color="danger"
            label="Very Hard"
            name="color-radio-group"
            @Click="selectOption(options[3])"
        /></VaDropdownContent>
      </VaDropdown>
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
