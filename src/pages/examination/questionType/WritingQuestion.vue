<script setup lang="ts">
import { MarkAnswerRequest, SubmitPaperDetailDto } from '../types'
import { Question } from '@/pages/question/types'
import QuestionHeadView from '@pages/question/widgets/child/QuestionHeadView.vue'
import QuestionFooterView from '@/pages/question/widgets/child/QuestionFooterView.vue'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { validators } from '@/services/utils'
import { useI18n } from 'vue-i18n'
import { useSubmitPaperStore } from '@/stores/modules/submitPaper.module'
import { useToast } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useAuthStore } from '@/stores/modules/auth.module'
const { init: notify } = useToast()
const submitPaperStore = useSubmitPaperStore()

const { t } = useI18n()
const props = defineProps<{
  question: Question
  studentAnswers: SubmitPaperDetailDto[]
  showActionButton: boolean
  index: number | null
  submitPaperId: string
}>()
const authStore = useAuthStore()
const readMoreActivated = ref(false)
const readMoreAnswerActivated = ref(false)
const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))
const getUserAnswer = (questionId: string | undefined) => {
  const ans = props.studentAnswers.find((detail) => detail.questionId === questionId)?.answerRaw || ''
  return ans
}

onBeforeMount(() => {
  if ((props.question?.content.length ?? 0) < 500) {
    readMoreActivated.value = true
  }
  getUserAnswer(props.question.id)
})

const getPointAchieve = (questionId: string | undefined) => {
  const a = props.studentAnswers.find((detail) => detail.questionId === questionId)?.mark || 0
  return a
}

const markQuestion = ref(0)
const emit = defineEmits(['markSuccess'])
const manualMarkForQuestion = async () => {
  const markRequest = ref<MarkAnswerRequest>({
    submitPaperId: props.submitPaperId,
    questionId: props.question.id,
    mark: markQuestion.value,
  })

  await submitPaperStore
    .markAnswerWriting(markRequest.value)
    .then(() => {
      notify({
        message: `Send mark success`,
        color: 'success',
      })
      getPointAchieve(props.question.id)

      emit('markSuccess', props.question.id)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(getErrorMessage(error)),
        color: 'danger',
      })
    })
}

onMounted(() => {
  markQuestion.value = getPointAchieve(props.question.id)
})
</script>

<template>
  <VaCard outlined class="mb-2 p-2">
    <QuestionHeadView :question="props.question" :index="props.index" />
    <VaCardTitle>{{ t('papers.point') }}: {{ markQuestion }}/{{ question.mark }}</VaCardTitle>
    <div class="mt-4">
      <span class="va-text-bold">{{ t('papers.require_title') }}: </span>
      <div class="pl-2 pr-2">
        <span v-if="!readMoreActivated">
          <!-- eslint-disable vue/no-v-html -->
          <p style="line-height: initial" v-html="props.question?.content.slice(0, 500).replace(/\n/g, '<br>')" />
          <!--eslint-enable-->
          ...
          <button href="#" class="text-primary" @click="readMoreActivated = !readMoreActivated">
            {{ t('cards.button.readMore') }}
          </button>
        </span>
        <span v-else>
          <p style="line-height: initial" v-html="props.question?.content.replace(/\n/g, '<br>')" />
        </span>
      </div>
    </div>
    <div class="mt-4">
      <span class="va-text-bold"
        >{{ t('papers.student_answer') }}:
        <button
          v-show="!readMoreAnswerActivated"
          href="#"
          class="text-primary"
          @click="readMoreAnswerActivated = !readMoreAnswerActivated"
        >
          {{ t('cards.button.readMore') }}
        </button>
      </span>
      <div class="pl-2 pr-2">
        <span v-if="readMoreAnswerActivated">
          <p style="line-height: initial" v-html="getUserAnswer(props.question.id).replace(/\n/g, '<br>')" />
        </span>
        <button
          v-show="readMoreAnswerActivated"
          href="#"
          class="text-primary text-sm"
          @click="readMoreAnswerActivated = !readMoreAnswerActivated"
        >
          <i>( {{ t('settings.hide') }})</i>
        </button>
      </div>
    </div>
    <div v-if="isTeacher" class="flex gap-2">
      <VaInput
        v-model="markQuestion"
        :rules="[validators.maxValue(props.question.mark ?? 0), validators.minValue(0), validators.isNumber]"
        class="p-0 max-w-[300px]"
        placeholder="point"
        input-class="va-text-right"
      >
        <template #appendInner>
          <span>/{{ props.question.mark }}</span>
        </template>
      </VaInput>
      <VaButton size="small" @click="manualMarkForQuestion">{{ t('settings.send') }}</VaButton>
    </div>
    <!-- footer -->
    <QuestionFooterView :question="props.question" :show-action-button="props.showActionButton" />
  </VaCard>
</template>
