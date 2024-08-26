<script lang="ts" setup>
import { useSubmitPaperStore } from '@/stores/modules/submitPaper.module'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast, VaButton, VaCard } from 'vuestic-ui'
import { Question, QuestionType } from '../question/types'
import { GetLastResultExamRequest, LastResultExamDto } from './types'
import SingleChoiceQuestion from './questionType/SingleChoiceQuestion.vue'
import MatchingQuestion from './questionType/MatchingQuestion.vue'
import FillBlankQuestion from './questionType/FillBlankQuestion.vue'
import WritingQuestion from './questionType/WritingQuestion.vue'
import ReadingQuestion from './questionType/ReadingQuestion.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const showSidebar = ref(true)
const submitPaperStore = useSubmitPaperStore()
const { init: notify } = useToast()

const loading = ref(true)

const request: GetLastResultExamRequest = {
  paperId: route.params.paperId as string,
  userId: route.params.userId as string,
  submitPaperId: route.params.submitPaperId as string,
}

const result = ref<LastResultExamDto | null>(null)

const groupedQuestions = ref<{ [key: string]: Question[] }>({
  singleChoice: [],
  multipleChoice: [],
  fillBlank: [],
  matching: [],
  reading: [],
  writing: [],
  other: [],
})

const maxPointInPaper = ref<number | undefined>(0)

const getLastExamResult = () => {
  loading.value = true
  submitPaperStore
    .getLastResultExam(request)
    .then((res) => {
      result.value = res
      if (res && res.paper && res.paper.questions) {
        groupedQuestions.value = groupQuestionsByType(res.paper.questions)
      }
      maxPointInPaper.value = res.paper.maxPoint
    })
    .catch((error) => {
      notify({
        message: `Not Found ${error}`,
        color: 'danger',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getLastExamResult()
})

const valueTab = ref('all')
const questionTypesLabel = ref(['all'])

// Computed property to group the questions by type
const groups: { [key: string]: Question[] } = {
  singleChoice: [],
  multipleChoice: [],
  fillBlank: [],
  matching: [],
  reading: [],
  writing: [],
  other: [],
}
const groupQuestionsByType = (questions: Question[]) => {
  loading.value = true
  questions.forEach((question) => {
    if (question.questionType === QuestionType.SingleChoice) {
      return groups.singleChoice.push(question)
    }
    if (question.questionType === QuestionType.MultipleChoice) {
      return groups.multipleChoice.push(question)
    }
    if (question.questionType === QuestionType.FillBlank) {
      return groups.fillBlank.push(question)
    }
    if (question.questionType === QuestionType.Matching) {
      return groups.matching.push(question)
    }
    if (
      question.questionType === QuestionType.Reading ||
      question.questionType === QuestionType.ReadingQuestionPassage
    ) {
      return groups.reading.push(question)
    }
    if (question.questionType === QuestionType.Writing) {
      return groups.writing.push(question)
    }

    return groups.other.push(question)
  })

  for (const label in groups) {
    if (groups[label].length > 0) {
      questionTypesLabel.value.push(label)
    }
  }
  loading.value = false
  return groups
}

const getQuestionLabel = (typeQuestion: string) => {
  switch (typeQuestion) {
    case 'all':
      return 'Total'
    case 'singleChoice':
      return 'Single Choice'
    case 'multipleChoice':
      return 'Multiple Choice'
    case 'fillBlank':
      return 'Fill in the Blank'
    case 'matching':
      return 'Matching'
    case 'reading':
      return 'Reading'
    case 'readingQuestionPassage':
      return 'Reading Question Passage'
    case 'writing':
      return 'Writing'
    default:
      return 'Other'
  }
}
const getCorrectQuestionPerQuestion = (typeQuestion: string) => {
  let correctQuestion = 0
  let totalQuestion = 0
  let label = ''
  loading.value = true

  switch (typeQuestion) {
    case 'all':
      correctQuestion =
        result.value?.submitPaperDetails?.filter(
          (detail) => detail.isCorrect || detail.question.questionType === QuestionType.Writing,
        ).length || 0
      totalQuestion = result.value?.paper.questions?.length || 0
      label = 'Total'
      break

    case 'singleChoice':
      ;({ correctQuestion, totalQuestion } = getCorrectQuestionCount(QuestionType.SingleChoice))
      label = 'Single Choice'
      break

    case 'multipleChoice':
      ;({ correctQuestion, totalQuestion } = getCorrectQuestionCount(QuestionType.MultipleChoice))
      label = 'Multiple Choice'
      break

    case 'fillBlank':
      ;({ correctQuestion, totalQuestion } = getCorrectQuestionCount(QuestionType.FillBlank))
      label = 'Fill in the Blank'
      break

    case 'matching':
      ;({ correctQuestion, totalQuestion } = getCorrectQuestionCount(QuestionType.Matching))
      label = 'Matching'
      break

    case 'reading':
      ;({ correctQuestion, totalQuestion } = getCorrectQuestionCount(QuestionType.Reading))
      label = 'Reading'
      break

    case 'readingQuestionPassage':
      ;({ correctQuestion, totalQuestion } = getCorrectQuestionCount(QuestionType.ReadingQuestionPassage))
      label = 'Reading Question Passage'
      break

    case 'writing':
      ;({ correctQuestion, totalQuestion } = getCorrectQuestionCount(QuestionType.Writing))
      label = 'Graded Writing'
      break

    default:
      label = 'Other'
      correctQuestion = 0
      totalQuestion = 0
      break
  }
  loading.value = false
  return {
    label,
    correctQuestion,
    totalQuestion,
  }
}

const getCorrectQuestionCount = (typeQuestion: QuestionType) => {
  loading.value = true
  let correctQuestion = 0
  if (typeQuestion == QuestionType.Writing) {
    correctQuestion =
      result.value?.submitPaperDetails?.filter(
        (detail) => detail.lastModifiedBy !== detail.createdBy && detail.question.questionType === typeQuestion,
      ).length || 0
  } else {
    correctQuestion =
      result.value?.submitPaperDetails?.filter(
        (detail) => detail.isCorrect && detail.question.questionType === typeQuestion,
      ).length || 0
  }

  const totalQuestion =
    result.value?.paper.questions?.filter((question) => question.questionType === typeQuestion).length || 0
  loading.value = false
  return {
    correctQuestion,
    totalQuestion,
  }
}

const handleMarkSuccess = async () => {
  questionTypesLabel.value = ['all']
  await getLastExamResult()
}

const roundToTwoDecimal = (num: number | undefined) => {
  return Math.round((num ?? 0) * 100) / 100
}
</script>

<template>
  <VaInnerLoading :loading="loading"> </VaInnerLoading>
  <VaLayout>
    <template #left>
      <VaCard v-if="showSidebar" style="min-width: 20rem; max-width: 30rem" bordered>
        <VaCardTitle>
          <div class="flex items-center">
            <VaAvatar size="small" class="mr-2"> {{ result?.student?.userName.charAt(0).toUpperCase() }} </VaAvatar>
            <p>
              <b>{{ result?.student?.userName }}</b>
            </p>
          </div>
        </VaCardTitle>
        <VaDivider />

        <VaCardContent>
          <VaCard class="va-text-secondary text-xs">
            <VaCardTitle class="flex justify-between bg-slate-200">{{ t('papers.details') }}</VaCardTitle>

            <VaCardActions align="stretch" vertical>
              <VaListItem>
                <p>
                  <b>{{ t('papers.point') }}:</b> {{ roundToTwoDecimal(result?.totalMark) }}/{{
                    roundToTwoDecimal(maxPointInPaper)
                  }}
                </p>
              </VaListItem>
              <template v-for="(typeQuestion, index) in questionTypesLabel" :key="index">
                <VaListItem>
                  <p class="flex gap-1">
                    <b>{{ getCorrectQuestionPerQuestion(typeQuestion).label }}:</b>
                    {{ getCorrectQuestionPerQuestion(typeQuestion).correctQuestion }} /
                    {{ getCorrectQuestionPerQuestion(typeQuestion).totalQuestion }}
                  </p>
                </VaListItem>
              </template>
            </VaCardActions>
          </VaCard>
        </VaCardContent>
      </VaCard>
    </template>

    <template #content>
      <VaNavbar class="py-2 ml-1 flex justify-between items-center" shadowed bordered>
        <template #left>
          <VaNavbarItem class="navbar-item-slot">
            <div class="flex items-center">
              <VaButton :icon="showSidebar ? 'menu_open' : 'menu'" size="small" @click="showSidebar = !showSidebar" />
            </div>
          </VaNavbarItem>
        </template>
        <template #right>
          <!-- <VaNavbarItem class="navbar-item-slot">
            <VaMenu>
              <template #anchor>
                <VaButton icon="filter_list" size="small">Filter</VaButton>
              </template>
              <div class="p-4"> -->
          <!-- Thêm các tùy chọn filter nếu cần -->
          <!-- </div>
            </VaMenu>
          </VaNavbarItem> -->
        </template>
        <template #center>
          <VaNavbarItem>
            {{ result?.paper.examName }}
          </VaNavbarItem>
        </template>
      </VaNavbar>
      <VaCard class="mt-2 ml-2">
        <VaTabs v-model="valueTab">
          <template #tabs>
            <VaTab v-for="title in questionTypesLabel" :key="title" :name="title">
              {{ getQuestionLabel(title) }}
            </VaTab>
          </template>
        </VaTabs>
        <VaCardContent>
          <VaScrollContainer class="min-h-[60vh] max-h-[80vh]" vertical>
            <div v-for="(question, index) in result?.paper.questions" :key="question.id">
              <SingleChoiceQuestion
                v-if="
                  question.questionType == QuestionType.SingleChoice &&
                  (valueTab == 'singleChoice' || valueTab == 'all')
                "
                :question="question"
                :student-answers="result?.submitPaperDetails ?? []"
                :show-action-button="false"
                :index="index + 1"
              />
              <SingleChoiceQuestion
                v-if="
                  question.questionType == QuestionType.MultipleChoice &&
                  (valueTab == 'multipleChoice' || valueTab == 'all')
                "
                :question="question"
                :student-answers="result?.submitPaperDetails ?? []"
                :show-action-button="false"
                :index="index + 1"
              />
              <MatchingQuestion
                v-if="question.questionType == QuestionType.Matching && (valueTab == 'matching' || valueTab == 'all')"
                :question="question"
                :student-answers="result?.submitPaperDetails ?? []"
                :show-action-button="false"
                :index="index + 1"
              />
              <FillBlankQuestion
                v-if="question.questionType == QuestionType.FillBlank && (valueTab == 'fillBlank' || valueTab == 'all')"
                :question="question"
                :student-answers="result?.submitPaperDetails ?? []"
                :show-action-button="false"
                :index="index + 1"
              />
              <WritingQuestion
                v-if="question.questionType == QuestionType.Writing && (valueTab == 'writing' || valueTab == 'all')"
                :question="question"
                :student-answers="result?.submitPaperDetails ?? []"
                :show-action-button="false"
                :index="index + 1"
                :submit-paper-id="request.submitPaperId"
                @markSuccess="handleMarkSuccess"
              />
              <ReadingQuestion
                v-if="question.questionType == QuestionType.Reading && (valueTab == 'reading' || valueTab == 'all')"
                :question="question"
                :student-answers="result?.submitPaperDetails ?? []"
                :show-action-button="false"
                :index="index + 1"
              />
            </div>
          </VaScrollContainer>
        </VaCardContent>
      </VaCard>
    </template>
  </VaLayout>
</template>
