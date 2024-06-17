<script lang="ts" setup>
import { ref } from 'vue'
import QuestionBankModal from '@pages/examination/widgets/QuestionBankModal.vue'
import { Question } from '../question/types'
import QuestionView from '../question/widgets/QuestionView.vue'
import { CreatePaperRequest, QuestionIntoPaperRequest } from './types'
import { useRoute, useRouter } from 'vue-router'
import { validators } from '@services/utils'
import { useModal, useToast } from 'vuestic-ui'
import UpdatePaperPurpose from '@/pages/examination/widgets/UpdatePaperPurpose.vue'
import { usePaperStore } from '../../stores/modules/paper.module'

const route = useRoute()
const router = useRouter()
const { init: notify } = useToast()
const folderId = route.params.folderId ? route.params.folderId.toString() : undefined
const { confirm } = useModal()
const showQuestionBankModal = ref(false)
const questionsInPaper = ref<Question[]>([])
const questionRequest = ref<QuestionIntoPaperRequest[]>([])
const totalPointPaper = ref(0)
const storePaper = usePaperStore()

const paperRequest = ref<CreatePaperRequest>({
  examName: '',
  status: 1,
  password: '',
  type: 0,
  paperFolderId: folderId,
  description: '',
  questions: [],
  subjectId: '',
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
  })
  updateTotalPoint()
}

const updateTotalPoint = () => {
  totalPointPaper.value = questionRequest.value.reduce((sum, question) => sum + question.mark, 0)
}

const showUpdatePaperPurpose = ref(false)
const continueCreatePaper = () => {
  if (questionRequest.value.length < 2) {
    notify({
      message: "Couldn't save! Please, add more than 1 question",
      color: 'danger',
    })
  } else {
    paperRequest.value.questions = questionRequest.value
    showUpdatePaperPurpose.value = !showUpdatePaperPurpose.value
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
    updateTotalPoint()
  }
}

const cancelCreatePaper = async () => {
  const result = await confirm({
    message: 'Are you sure wanna leave without creating?',
    okText: 'confirm create',
    title: "I'm sure?",
  })
  if (result) {
    router.push({ name: 'paper-folder' })
  }
}

const saveCreatePaper = (data: CreatePaperRequest) => {
  console.log(data)
  storePaper
    .createPaper(data)
    .then((res) => {
      notify({
        message: 'Create paper successfully',
        color: 'success',
      })
      router.push({ name: 'admin-exam-detail', params: { id: res } })
    })
    .catch((error) => {
      notify({
        message: `Fail create paper \n ${error}`,
        color: 'danger',
      })
    })
}
const cancelUpdatePaper = () => {
  showUpdatePaperPurpose.value = !showUpdatePaperPurpose.value
}
</script>

<template>
  <div v-if="!showUpdatePaperPurpose">
    <VaCard>
      <VaCardTitle>
        <VaInput v-model="paperRequest.examName" placeholder="Enter name..." />
        <VaButton preset="primary" class="mr-1 ml-2 p-1" size="small" @click="cancelCreatePaper">Cancel</VaButton>
        <VaButton class="ml-1 p-1" size="small" @click="continueCreatePaper">Continue</VaButton>
      </VaCardTitle>
    </VaCard>
    <VaCardContent>
      <div class="flex justify-between">
        <p>
          <b>{{ questionsInPaper.length }} question(s)</b> ({{ totalPointPaper }} point)
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
      <VaModal v-slot="{ ok }" v-model="showQuestionBankModal" hide-default-actions size="large" close-button>
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
              placeholder="enter point"
              label="Point"
              :rules="[validators.required, validators.isNumber]"
              @change="updateTotalPoint"
            />
          </div>
          <div class="flex align-bottom">
            <VaButton preset="primary" color="danger" icon="delete" @click="deleteQuestion(testQuestion.id)"></VaButton>
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
  <UpdatePaperPurpose
    v-if="showUpdatePaperPurpose"
    :paper-request="paperRequest"
    @save="
      (data: CreatePaperRequest) => {
        saveCreatePaper(data)
      }
    "
    @cancel="
      () => {
        cancelUpdatePaper()
      }
    "
  />
</template>
