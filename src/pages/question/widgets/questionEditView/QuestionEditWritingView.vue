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

onBeforeMount(() => {
  if ((props.question?.content.length ?? 0) < 500) {
    readMoreActivated.value = true
  }
})
</script>

<template>
  <VaCardContent class="leading-3 p-2 text-sm py-5">
    <QuestionEditHeadView :question="props.question" :index="props.index" class="ml-[20px]" />
    <div class="mt-4 ml-[20px]">
      <span v-if="!readMoreActivated">
        <!-- eslint-disable vue/no-v-html -->
        <p style="line-height: initial" v-html="props.question?.content.slice(0, 500).replace(/\n/g, '<br>')" />
        <!--eslint-enable-->
        ...
        <button href="#" class="text-primary" @click="readMoreActivated = !readMoreActivated">Read more</button>
      </span>
      <span v-else>
        <!-- eslint-disable vue/no-v-html -->
        <p style="line-height: initial" v-html="props.question?.content.replace(/\n/g, '<br>')" />
        <!--eslint-enable-->
      </span>
    </div>
    <!-- footer -->
    <QuestionFooterView
      :question="props.question"
      @edit="emit('edit', props.question as Question)"
      @delete="emit('delete', props.question as Question)"
    />
  </VaCardContent>
</template>
