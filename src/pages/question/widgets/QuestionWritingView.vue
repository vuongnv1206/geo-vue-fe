<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Question } from '../types'
import QuestionHeadView from './child/QuestionHeadView.vue'
import QuestionFooterView from './child/QuestionFooterView.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  question: Question | null
  index: number | null
  showActionButton: boolean
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
}>()

const readMoreActivated = ref(false)

onBeforeMount(() => {
  if ((props.question?.content.length ?? 0) < 500) {
    readMoreActivated.value = true
  }
})
</script>

<template>
  <VaCardContent class="leading-3 text-sm">
    <QuestionHeadView :question="props.question" :index="props.index" />
    <div class="mt-4">
      <span v-if="!readMoreActivated">
        <!-- eslint-disable vue/no-v-html -->
        <p style="line-height: initial" v-html="props.question?.content.slice(0, 500).replace(/\n/g, '<br>')" />
        <!--eslint-enable-->
        ...
        <button href="#" class="text-primary" @click="readMoreActivated = !readMoreActivated">
          {{ t('questions.read_more') }}
        </button>
      </span>
      <span v-else>
        <p style="line-height: initial" v-html="props.question?.content.replace(/\n/g, '<br>')" />
      </span>
    </div>
    <!-- footer -->
    <QuestionFooterView
      :question="props.question"
      :show-action-button="props.showActionButton"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCardContent>
</template>
