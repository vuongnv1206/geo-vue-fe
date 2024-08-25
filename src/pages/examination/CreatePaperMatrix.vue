<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { CreatePaperRequest, QuestionGenerateToMatrix, QuestionIntoPaperRequest } from './types'
import { onMounted, ref } from 'vue'
import { useModal, useToast } from 'vuestic-ui'
import { usePaperStore } from '@/stores/modules/paper.module'
import { getErrorMessage, notifications } from '@/services/utils'
import { useI18n } from 'vue-i18n'
import QuestionView from '../question/widgets/QuestionView.vue'
import UpdatePaperPurpose from '@/pages/examination/widgets/UpdatePaperPurpose.vue'
import { GetQuestionRandomRequest, QuestionType } from '../question/types'
import { useQuestionStore } from '@/stores/modules/question.module'

const router = useRouter()
const route = useRoute()

const { t } = useI18n()
const { init: notify } = useToast()
const { confirm } = useModal()

const folderId = route.params.folderId ?? null
const matrixId = route.params.matrixId ?? null

const paperStore = usePaperStore()
const questionStore = useQuestionStore()

const questionRequest = ref<QuestionIntoPaperRequest[]>([])
const questionGenerateMatrix = ref<QuestionGenerateToMatrix[]>([])
const totalPointPaper = ref(10)
const getQuestionInMatrix = async (matrixId: string) => {
  try {
    const res = await paperStore.getQuestionFromMatrix(matrixId)
    questionRequest.value = res.map((item) => ({
      ...item,
      questionId: item.question.id,
    }))
    questionGenerateMatrix.value = res
  } catch (error) {
    notify({
      message: notifications.getFailed('question label' + getErrorMessage(error)),
      color: 'danger',
    })
  }
}

const paperRequest = ref<CreatePaperRequest>({
  examName: '',
  status: 1,
  password: '',
  type: 0,
  paperFolderId: (folderId as string) || undefined,
  description: '',
  questions: [],
  subjectId: '',
})

const cancelCreatePaper = async () => {
  const result = await confirm({
    message: 'Are you sure wanna leave without creating?',
    okText: 'Leave',
    title: "I'm sure?",
  })
  if (result) {
    router.push({ name: 'paper-folder' })
  }
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

const updateTotalPoint = () => {
  totalPointPaper.value = Math.round(questionRequest.value.reduce((sum, question) => sum + question.mark, 0))
}
// const errorMessages = ref<string[]>([])
// const isTotalPointValid = ref(true)

// const updateQuestionMark = (index: number, mark: number) => {
//   questionRequest.value[index].mark = mark
//   updateTotalPoint()

//   errorMessages.value = Array(questionRequest.value.length).fill('')
//   // Kiểm tra nếu tổng điểm không phải là 10, chỉ hiển thị lỗi cho input đang được chỉnh sửa
//   if (totalPointPaper.value !== 10) {
//     errorMessages.value[index] = `Total points must be exactly 10. Current total is ${totalPointPaper.value}.`
//     isTotalPointValid.value = false
//   } else {
//     isTotalPointValid.value = true
//   }
// }

const saveCreatePaper = (data: CreatePaperRequest) => {
  paperStore
    .createPaper(data)
    .then((res) => {
      notify({
        message: 'Create paper successfully',
        color: 'success',
      })
      router.push({ name: 'admin-exam-detail', params: { id: res } })
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        message: message,
        color: 'danger',
      })
    })
}
const cancelUpdatePaper = () => {
  showUpdatePaperPurpose.value = !showUpdatePaperPurpose.value
}

const changeOtherQuestion = async (
  folderId: string,
  questionType: QuestionType,
  questionLabelId: string,
  indexQuestion: number,
) => {
  try {
    const request: GetQuestionRandomRequest = {
      folderId: folderId,
      questionType: questionType,
      questionLabelId: questionLabelId,
      numberQuestion: 1,
    }

    const res = await questionStore.getQuestionRandomMatrix(request)
    if (res.length > 0) {
      const newQuestion: QuestionGenerateToMatrix = {
        question: res[0],
        mark: questionGenerateMatrix.value[indexQuestion].mark,
        rawIndex: questionGenerateMatrix.value[indexQuestion].rawIndex,
        folderId: folderId,
      }
      questionGenerateMatrix.value.splice(indexQuestion, 1, newQuestion)
      questionRequest.value = questionGenerateMatrix.value.map((item) => ({
        ...item,
        questionId: item.question.id,
      }))
    }
  } catch (error) {
    const message = getErrorMessage(error)
    notify({
      message: message,
      color: 'danger',
    })
  }
}

onMounted(async () => {
  await getQuestionInMatrix(matrixId as string)
  updateTotalPoint()
})
</script>

<template>
  <template v-if="!showUpdatePaperPurpose">
    <VaCard class="mb-2">
      <VaCardTitle>
        <VaInput v-model="paperRequest.examName" placeholder="Enter name..." />
        <VaButton preset="primary" class="mr-1 ml-2 p-1" size="small" @click="cancelCreatePaper">Cancel</VaButton>
        <VaButton class="ml-1 p-1" size="small" @click="continueCreatePaper">Continue</VaButton>
      </VaCardTitle>
    </VaCard>
    <div class="flex justify-between">
      <p>
        <b>{{ questionRequest.length }} question(s)</b> ({{ totalPointPaper }} {{ t('papers.point') }})
      </p>
    </div>
    <div v-for="(questionMatrix, index) in questionGenerateMatrix" :key="index">
      <VaCard class="mb-2">
        <VaCardTitle class="flex justify-between align-content-end p-0">
          <div>
            <VaInput
              v-model.number="questionRequest[index].mark"
              :placeholder="t('papers.enter_point')"
              :label="t('papers.point')"
              readonly
            />
            <!-- <span v-if="errorMessages[index]" class="text-red-500 text-sm">{{ errorMessages[index] }}</span> -->
          </div>
          <div class="flex align-bottom">
            <VaButton
              preset="primary"
              color="secondary"
              icon="change_circle"
              @click="
                changeOtherQuestion(
                  questionMatrix.folderId,
                  questionMatrix.question.questionType,
                  questionMatrix.question.questionLable?.id || '',
                  index,
                )
              "
            />
          </div>
        </VaCardTitle>
        <VaCardContent class="p-0 pb-1">
          <QuestionView
            :question="questionMatrix.question"
            :index="questionMatrix.rawIndex"
            :show-action-button="false"
            :is-stripe="false"
          />
        </VaCardContent>
      </VaCard>
    </div>
  </template>

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
