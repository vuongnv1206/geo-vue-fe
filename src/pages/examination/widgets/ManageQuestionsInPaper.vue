<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import QuestionBankModal from '@pages/examination/widgets/QuestionBankModal.vue'
import { Question } from '@pages/question/types'
import QuestionView from '@pages/question/widgets/QuestionView.vue'
import { PaperDto, QuestionIntoPaperRequest, UpdateQuestionsInPaperRequest } from '../types'
import { useRoute, useRouter } from 'vue-router'
import { validators } from '@services/utils'
import { useModal, useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { usePaperStore } from '@/stores/modules/paper.module'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { init: notify } = useToast()
const { confirm } = useModal()
const showQuestionBankModal = ref(false)
const questionsInPaper = ref<Question[]>([])
const questionRequest = ref<QuestionIntoPaperRequest[]>([])
const totalPointPaper = ref(0)
const paperStore = usePaperStore()
const paperId = route.params.paperId as string

const paperDetail = ref<PaperDto | null>(null)
const getPaperDetail = async () => {
  try {
    const res = await paperStore.paperDetail(paperId)
    paperDetail.value = res
    if (paperDetail.value.questions) {
      questionsInPaper.value = paperDetail.value.questions
      questionRequest.value = paperDetail.value.questions.map((question) => ({
        questionId: question.originalQuestionId,
        mark: question.mark || 0,
        rawIndex: question.rawIndex || 0,
      }))

      updateTotalPoint()
    }
  } catch (error) {
    notify({
      message: `Not Found ${error}`,
      color: 'danger',
    })
  }
}

onMounted(() => {
  getPaperDetail()
})

const AddQuestionsToPaper = (questions: Question[]) => {
  let indexQuestion = 0
  questions.forEach((question) => {
    if (!questionRequest.value.some((req) => req.questionId === question.id)) {
      questionsInPaper.value.push(question)
      questionRequest.value.push({
        questionId: question.id,
        mark: 1,
        rawIndex: indexQuestion++,
      })
    }
    console.log('questionRequest', questionRequest.value)
    console.log('questionsInPaper', questionsInPaper.value)
  })
  updateTotalPoint()
}

const updateTotalPoint = () => {
  totalPointPaper.value = questionRequest.value.reduce((sum, question) => sum + question.mark, 0)
}

const saveManageQuestions = async () => {
  if (questionRequest.value.length < 2) {
    notify({
      message: "Couldn't save! Please, add more than 1 question",
      color: 'danger',
    })
  } else {
    try {
      // Prepare the request object
      const request: UpdateQuestionsInPaperRequest = {
        paperId: paperId as string,
        questions: questionRequest.value as QuestionIntoPaperRequest[],
      }
      await paperStore.updateQuestionsInPaper(paperId, request)
      notify({
        message: 'Questions updated successfully',
        color: 'success',
      })
      // Redirect to the exam detail page
      router.push({ name: 'admin-exam-detail', params: { id: paperId } })
    } catch (error) {
      notify({
        message: `Failed to update questions\n${error}`,
        color: 'danger',
      })
    }
  }
}

const deleteQuestion = async (questionId: string | null | undefined) => {
  const result = await confirm({
    message: 'Are you sure delete?',
    okText: 'Delete',
    title: 'delete confirm?',
  })

  if (result) {
    questionsInPaper.value = questionsInPaper.value.filter((ques) => ques.id !== questionId)
    questionRequest.value = questionRequest.value.filter((req) => req.questionId !== questionId)
    console.log('questionRequest', questionRequest.value)
    console.log('questionsInPaper', questionsInPaper.value)

    updateTotalPoint()
  }
}
</script>

<template>
  <div>
    <VaCard square outlined>
      <div class="flex justify-between p-1">
        <div></div>
        <VaCardTitle>{{ paperDetail?.examName }}</VaCardTitle>
        <div class="flex justify-end">
          <VaButton class="ml-1 pr-3 pl-3" size="small" @click="saveManageQuestions">Save</VaButton>
        </div>
      </div>
    </VaCard>
    <VaCardContent>
      <div class="flex justify-between">
        <p>
          <b>{{ questionsInPaper.length }} question(s)</b> ({{ totalPointPaper }} {{ t('papers.point') }})
        </p>
        <VaButton
          border-color="primary"
          preset="primary"
          size="small"
          icon="add"
          class="pr-2 pl-2"
          @click="showQuestionBankModal = !showQuestionBankModal"
        >
          Add question
        </VaButton>
      </div>
      <VaModal
        v-slot="{ ok }"
        v-model="showQuestionBankModal"
        hide-default-actions
        size="large"
        close-button
        class="geo-add-question-modal"
      >
        <QuestionBankModal
          @save="
            (questions: Question[]) => {
              AddQuestionsToPaper(questions)
              ok()
            }
          "
        />
      </VaModal>
    </VaCardContent>
    <div v-for="(testQuestion, index) in questionsInPaper" :key="testQuestion.id || ''">
      <VaCard class="mb-2">
        <VaCardTitle class="flex justify-between align-content-end p-0">
          <div>
            <VaInput
              v-model.number="questionRequest[index].mark"
              :placeholder="t('papers.enter_point')"
              :label="t('papers.point')"
              :rules="[validators.required, validators.isNumber]"
              @change="updateTotalPoint"
            />
          </div>
          <div class="flex align-bottom">
            <VaButton preset="primary" color="danger" icon="delete" @click="deleteQuestion(testQuestion.id)" />
          </div>
        </VaCardTitle>
        <VaCardContent class="p-0 pb-1">
          <QuestionView :question="testQuestion" :index="null" :show-action-button="false" :is-stripe="false" />
        </VaCardContent>
      </VaCard>
    </div>
    <div v-if="questionsInPaper.length > 0" class="flex justify-center">
      <p>
        <b>{{ questionsInPaper.length }} question(s)</b> ({{ totalPointPaper }} point)
      </p>
      <VaButton
        border-color="primary"
        preset="primary"
        size="small"
        icon="add"
        class="ml-2 pr-2 pl-2"
        @click="showQuestionBankModal = !showQuestionBankModal"
      >
        Add question
      </VaButton>
    </div>
  </div>
</template>

<style>
.geo-add-question-modal .va-modal__dialog {
  max-width: 80vw !important;
}
</style>
