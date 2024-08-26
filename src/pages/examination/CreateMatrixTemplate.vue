<script setup lang="ts">
import { useQuestionLabelStore } from '@/stores/modules/questionLabel.modul'
import QuestionFolderListTab from '../question/widgets/QuestionFolderListTab.vue'
import { QuestionLabelRequest, QuestionLabelResponse, QuestionTree, QuestionType } from '../question/types'
import { computed, onMounted, ref, watch } from 'vue'
import { useToast, VaIcon, VaInput } from 'vuestic-ui'
import { getErrorMessage, notifications, validators } from '@/services/utils'
import { ContentMatrixRequest, CreateMatrixRequest, PaperMatrixTemplate, UpdateMatrixRequest } from './types'
import { useI18n } from 'vue-i18n'
import { QuestionTypeColor } from '@services/utils'
import { usePaperMatrixStore } from '@/stores/modules/paperMatrices.module'
import { useRoute, useRouter } from 'vue-router'

const questionLabelStore = useQuestionLabelStore()
const paperMatrixStore = usePaperMatrixStore()
const { init: notify } = useToast()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)

const questionLabelData = ref<QuestionLabelResponse>()
const questionLabelLength = ref(0)
const contentMatrixRequestList = ref<ContentMatrixRequest[]>([])

const getQuestionLabel = async () => {
  const questionLabelRequest = ref<QuestionLabelRequest>({})

  try {
    const res = await questionLabelStore.questionLabelSearch(questionLabelRequest.value)
    questionLabelData.value = res
    questionLabelLength.value = res.data.length
  } catch (error) {
    notify({
      message: notifications.getFailed('question label' + getErrorMessage(error)),
      color: 'danger',
    })
  }
}

const totalPointPaper = computed(() => {
  return contentMatrixRequestList.value.reduce((accumulator, item) => {
    return accumulator + (Number(item.totalPoint) || 0)
  }, 0)
})

const cancelCreatePaper = () => {}

const QuestionTypeOptions = [
  { id: 1, name: t('questions.single_choice'), questionType: 1 },
  { id: 2, name: t('questions.multiple_choice'), questionType: 2 },
  { id: 4, name: t('questions.fill_blank'), questionType: 4 },
  { id: 5, name: t('questions.matching'), questionType: 5 },
  { id: 6, name: t('questions.reading'), questionType: 6 },
  { id: 8, name: t('questions.writing'), questionType: 8 },
  { id: 100, name: t('questions.other'), questionType: 100 },
]

const selectedFolderList = ref<QuestionTree[]>([])

const handleFolderSelected = (node: QuestionTree) => {
  selectedFolderList.value.push(node)
  contentMatrixRequestList.value.push({
    questionFolderId: node.id,
    criteriaQuestions: (questionLabelData.value?.data ?? []).map((item) => ({
      questionLabelId: item.id,
      numberOfQuestion: undefined,
      rawIndex: undefined,
      questionType: 1,
    })),
    totalPoint: 1,
  })

  updateCreateMatrixRequest()
}

const removeFolder = (folderId: string, index: number) => {
  if (index >= 0 && index < selectedFolderList.value.length) {
    selectedFolderList.value.splice(index, 1)
    contentMatrixRequestList.value.splice(index, 1)
    updateCreateMatrixRequest()
  }
}

const updateCreateMatrixRequest = () => {
  createMatrixRequest.value.totalPoint = totalPointPaper.value
  createMatrixRequest.value.content = JSON.stringify(contentMatrixRequestList.value)
}

const createMatrixRequest = ref<CreateMatrixRequest>({
  name: '',
  totalPoint: totalPointPaper.value,
  content: JSON.stringify(contentMatrixRequestList.value),
})

watch(contentMatrixRequestList, updateCreateMatrixRequest, { deep: true })

const continueCreatePaper = async () => {
  const totalNumberOfQuestions = contentMatrixRequestList.value.reduce((total, item) => {
    return total + item.criteriaQuestions.reduce((sum, question) => sum + (Number(question.numberOfQuestion) || 0), 0)
  }, 0)

  if (!createMatrixRequest.value.name?.trim()) {
    notify({
      message: "Please enter matrix's name",
      color: 'danger',
    })
  } else if (contentMatrixRequestList.value.length <= 0) {
    notify({
      message: 'Please select any folder',
      color: 'danger',
    })
  } else if (totalNumberOfQuestions < 2) {
    notify({
      message: 'Total number of questions must be greater than 2',
      color: 'danger',
    })
  } else if (totalPointPaper.value !== 10) {
    notify({
      message: 'Total points must equal 10',
      color: 'danger',
    })
  } else {
    if (paperMatrixSelected.value) {
      const updateMatrixRequest = ref<UpdateMatrixRequest>({
        id: paperMatrixSelected.value.id,
        name: createMatrixRequest.value.name,
        content: createMatrixRequest.value.content,
        totalPoint: createMatrixRequest.value.totalPoint,
      })

      await updatePaperMatrix(updateMatrixRequest.value)
    } else {
      await createNewPaperMatrix()
    }
  }
}
const folderId = ref(route.params.folderId ?? null)
const createNewPaperMatrix = async () => {
  await paperMatrixStore
    .createMatrixTemplate(createMatrixRequest.value)
    .then(async (response) => {
      notify({ message: 'Create a matrix successfully', color: 'success' })
      await getListPaperMatrix()
      router.push({ name: 'generate-paper-matrix', params: { folderId: folderId.value, matrixId: response } })
    })
    .catch((error) => notify({ message: getErrorMessage(error), color: 'danger' }))
}

const updatePaperMatrix = async (request: UpdateMatrixRequest) => {
  await paperMatrixStore
    .updateMatrixTemplate(request)
    .then(async (response) => {
      notify({ message: 'Update matrix successfully', color: 'success' })
      await getListPaperMatrix()
      router.push({ name: 'generate-paper-matrix', params: { folderId: folderId.value, matrixId: response } })
    })
    .catch((error) =>
      notify({ message: notifications.createFailed('matrix' + getErrorMessage(error)), color: 'danger' }),
    )
}

const questionLabelTotals = computed(() => {
  const totals: number[] = new Array(questionLabelLength.value).fill(0)

  contentMatrixRequestList.value.forEach((item) => {
    item.criteriaQuestions.forEach((question, index) => {
      if (question.numberOfQuestion != null) {
        totals[index] += Number(question.numberOfQuestion)
      }
    })
  })
  return totals
})

const totalQuestionTypeInFolder = (indexFolder: number, ...questionTypes: QuestionType[]): number => {
  return contentMatrixRequestList.value[indexFolder].criteriaQuestions
    .filter((question) => questionTypes.includes(question.questionType as QuestionType))
    .reduce((total, question) => {
      const numberOfQuestion = Number(question.numberOfQuestion)
      return total + (isNaN(numberOfQuestion) ? 0 : numberOfQuestion)
    }, 0)
}

const totalQuestionType = (...questionTypes: QuestionType[]): number => {
  let total = 0
  contentMatrixRequestList.value.forEach((folder) => {
    const criteriaQuestions = folder.criteriaQuestions ?? []
    total += criteriaQuestions
      .filter((question) => questionTypes.includes(question.questionType as QuestionType))
      .reduce((subTotal, question) => {
        const numberOfQuestion = Number(question.numberOfQuestion)
        return subTotal + (isNaN(numberOfQuestion) ? 0 : numberOfQuestion)
      }, 0)
  })

  return total
}

const numberPatternRule = (value: string): boolean | string => {
  if (value === null || value.trim().length === 0) {
    return true
  }

  const regex = /^\d+(?:\s*,\s*\d+)*$/
  return regex.test(value) || 'Invalid format'
}

const requiredNumberRule = (value: string): boolean | string => {
  if (value === null || value.trim().length === 0) {
    return 'require field'
  }

  const regex = /^\d+$/
  if (!regex.test(value)) {
    return 'invalid format'
  }

  const numberValue = parseInt(value, 10)
  if (numberValue > 10) {
    return 'max 10 point'
  }

  return true
}

const paperMatrixOptions = ref<PaperMatrixTemplate[]>([])
const paperMatrixSelected = ref<PaperMatrixTemplate>()

const getListPaperMatrix = async () => {
  try {
    const res = await paperMatrixStore.getListPaperMatrixTemplate()
    paperMatrixOptions.value = res
  } catch (error) {
    notify({ message: notifications.getFailed('matrix' + getErrorMessage(error)), color: 'danger' })
  }
}

const handleChangeSelectionMatrix = (selection?: PaperMatrixTemplate) => {
  isLoading.value = true
  if (selection) {
    createMatrixRequest.value.name = selection.name
    selectedFolderList.value = selection.contentItems.map((item) => ({
      id: item.questionFolderId,
      name: item.questionFolderName ?? '',
      totalQuestions: null,
      parentId: null,
      currentShow: true,
      permission: [],
      children: [],
      createdBy: '',
      createdOn: '',
      lastModifiedBy: '',
      lastModifiedOn: null,
      owner: null,
    }))

    contentMatrixRequestList.value = selection.contentItems.map((item) => ({
      questionFolderId: item.questionFolderId,
      criteriaQuestions: item.criteriaQuestions,
      totalPoint: item.totalPoint,
    }))
  } else {
    createMatrixRequest.value.name = ''
    selectedFolderList.value = []
    contentMatrixRequestList.value = []
  }
  isLoading.value = false
}

watch(paperMatrixSelected, (newSelected) => {
  handleChangeSelectionMatrix(newSelected)
})

onMounted(async () => {
  await getQuestionLabel()
  await getListPaperMatrix()
})
</script>

<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaCard class="mb-2">
      <VaCardContent class="grid grid-cols-12 gap-2">
        <VaInput
          v-model="createMatrixRequest.name"
          :rules="[validators.required]"
          placeholder="Enter matrix name..."
          class="md:col-span-8 xs:col-span-12"
        />
        <VaSelect
          v-model="paperMatrixSelected"
          placeholder="created matrix list"
          clearable
          :options="paperMatrixOptions"
          :text-by="(p: PaperMatrixTemplate) => p.name"
          class="md:col-span-2 xs:col-span-12"
          @clear="paperMatrixSelected = undefined"
        />
        <VaButton preset="primary" class="md:col-span-1 xs:col-span-6 p-1" size="small" @click="cancelCreatePaper"
          >Cancel</VaButton
        >
        <VaButton class="md:col-span-1 xs:col-span-6 p-1" size="small" @click="continueCreatePaper">Continue</VaButton>
      </VaCardContent>
    </VaCard>

    <VaCard>
      <VaCardContent class="grid grid-cols-12 gap-2">
        <div class="md:col-span-2 xs:col-span-12">
          <QuestionFolderListTab @selectedFolder="handleFolderSelected" />
        </div>
        <div class="md:col-span-10 xs:col-span-12">
          <div class="va-table-responsive">
            <table class="va-table w-[100%]">
              <thead class="table-header">
                <tr>
                  <td rowspan="3">No</td>
                  <td rowspan="3">Topic</td>
                  <td rowspan="3">Sub Topic</td>
                  <td :colspan="questionLabelLength * 3">Difficulty Level</td>
                  <td colspan="6">Total</td>
                  <td rowspan="3">Total point</td>
                </tr>
                <tr>
                  <td v-for="(questionLabel, index) in questionLabelData?.data" :key="index" colspan="3">
                    {{ questionLabel.name }}
                  </td>
                  <td colspan="6">NUMBER ONLY</td>
                </tr>
                <tr>
                  <template v-for="index in questionLabelLength" :key="index">
                    <td>Number only</td>
                    <td>Question type</td>
                    <td>Raw index</td>
                  </template>
                  <td>OC</td>
                  <td>FB</td>
                  <td>MA</td>
                  <td>RE</td>
                  <td>WR</td>
                  <td>OT</td>
                </tr>
              </thead>
              <tbody>
                <tr v-if="selectedFolderList.length == 0">
                  <td :colspan="questionLabelLength * 3 + 10">Select topics in the left tree to add to the matrix</td>
                </tr>
                <template v-for="(folder, index) in selectedFolderList" v-else :key="index">
                  <tr>
                    <td class="table-disable">{{ index + 1 }}</td>
                    <td class="table-disable">{{ folder.name }}</td>
                    <td class="table-disable"><VaIcon name="delete" @click="removeFolder(folder.id, index)" /></td>
                    <template
                      v-for="(question, questionIndex) in contentMatrixRequestList[index].criteriaQuestions"
                      :key="questionIndex"
                    >
                      <td>
                        <VaInput
                          v-model="contentMatrixRequestList[index].criteriaQuestions[questionIndex].numberOfQuestion"
                          mask="numeral"
                          input-class="va-text-center"
                          class="no-border max-w-[150px]"
                        />
                      </td>
                      <td>
                        <VaSelect
                          v-model="contentMatrixRequestList[index].criteriaQuestions[questionIndex].questionType"
                          track-by="id"
                          :text-by="(option: any) => (option as any).name"
                          :value-by="(option: any) => (option as any).questionType"
                          :placeholder="t('questions.single_choice')"
                          :options="QuestionTypeOptions"
                          class="no-border max-w-[140px]"
                        >
                          <template #content="{ value }">
                            <VaBadge
                              :text="(value as any).name"
                              :color="QuestionTypeColor((value as any).questionType)"
                              class="mr-2"
                            />
                          </template>
                          <template #option="{ option, selectOption }">
                            <button class="w-full flex items-center" @click="() => selectOption(option)">
                              <div class="flex justify-between items-center p-2">
                                <VaBadge
                                  :text="(option as any).name"
                                  :color="QuestionTypeColor((option as any).questionType)"
                                  class="mr-2"
                                />
                              </div>
                            </button>
                          </template>
                        </VaSelect>
                      </td>
                      <td>
                        <VaInput
                          v-model="contentMatrixRequestList[index].criteriaQuestions[questionIndex].rawIndex"
                          :rules="[numberPatternRule]"
                          input-class="va-text-center"
                          class="no-border max-w-[100px]"
                        />
                      </td>
                    </template>
                    <template v-for="questionType in QuestionTypeOptions" :key="questionType.id">
                      <td
                        v-if="(questionType.questionType as QuestionType) === QuestionType.SingleChoice"
                        class="table-disable"
                      >
                        {{ totalQuestionTypeInFolder(index, QuestionType.SingleChoice, QuestionType.MultipleChoice) }}
                      </td>
                      <template
                        v-else-if="(questionType.questionType as QuestionType) === QuestionType.MultipleChoice"
                      ></template>
                      <td v-else class="table-disable">
                        {{ totalQuestionTypeInFolder(index, questionType.questionType) }}
                      </td>
                    </template>
                    <td>
                      <VaInput
                        v-model="contentMatrixRequestList[index].totalPoint"
                        :rules="[requiredNumberRule]"
                        input-class="va-text-center"
                        class="no-border max-w-[100px]"
                      />
                    </td>
                  </tr>
                </template>
              </tbody>
              <tfoot>
                <tr class="table-disable">
                  <td colspan="3">Total</td>
                  <template v-for="(total, index) in questionLabelTotals" :key="index">
                    <td v-if="total > 0" colspan="3">{{ total }}</td>
                    <td v-else colspan="3"></td>
                  </template>
                  <template v-for="questionType in QuestionTypeOptions" :key="questionType.id">
                    <td v-if="(questionType.questionType as QuestionType) === QuestionType.SingleChoice">
                      {{ totalQuestionType(QuestionType.SingleChoice, QuestionType.MultipleChoice) }}
                    </td>
                    <template
                      v-else-if="(questionType.questionType as QuestionType) === QuestionType.MultipleChoice"
                    ></template>
                    <td v-else>
                      {{ totalQuestionType(questionType.questionType) }}
                    </td>
                  </template>
                  <td>
                    <span :class="{ 'va-text-danger': totalPointPaper != 10 }"
                      >{{ totalPointPaper }} <span v-if="totalPointPaper != 10">(must equal 10)</span></span
                    >
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </VaCardContent>
      <VaCardContent>
        <p class="text-secondary">
          *Raw index: Enter the positions in the title: The positions are separated by commas ',' (eg. To get 3
          sentences, enter: 1, 2, 3). If you don't want to sort, you can leave it blank
        </p>
        <div class="text-secondary">
          <p>*Question type:</p>
          <p class="pl-2">- OC: Single choice, multiple choice</p>
          <p class="pl-2">- FB: Fill blank</p>
          <p class="pl-2">- MA: Matching</p>
          <p class="pl-2">- RE: Reading</p>
          <p class="pl-2">- WR: Writing</p>
          <p class="pl-2">- OT: Other</p>
        </div>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
</template>

<style scoped>
.va-table-responsive {
  overflow: auto;
}

thead,
tr,
td {
  border: 1px solid;
  text-align: center;
  vertical-align: middle;
}

.table-header {
  background-color: #c8e6c9;
}

.table-disable {
  background-color: #cfd8dc;
}

.no-border {
  --va-input-wrapper-border-color: #fff;
}
</style>
