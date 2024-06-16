<script lang="ts" setup>
import { useSubmitPaperStore } from '@/stores/modules/submitPaper.module'
import { ref } from 'vue'
import { useToast, VaButton, VaCard } from 'vuestic-ui'
import { GetLastResultExamRequest, LastResultExamDto } from './types'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { QuestionType } from '../question/types'
import { Question } from '../question/types'

import SingleChoiceQuestion from './questionType/SingleChoiceQuestion.vue'
import MatchingQuestion from './questionType/MatchingQuestion.vue'
import FillBlankQuestion from './questionType/FillBlankQuestion.vue'
import WritingQuestion from './questionType/WritingQuestion.vue'
import ReadingQuestion from './questionType/ReadingQuestion.vue'

const route = useRoute()
const showSidebar = ref(true)
const submitPaperStore = useSubmitPaperStore()
const { init: notify } = useToast()

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
  questions.forEach((question) => {
    switch (question.questionType) {
      case QuestionType.SingleChoice:
        groups.singleChoice.push(question)
        break
      case QuestionType.MultipleChoice:
        groups.multipleChoice.push(question)
        break
      case QuestionType.FillBlank:
        groups.fillBlank.push(question)
        break
      case QuestionType.Matching:
        groups.matching.push(question)
        break
      case QuestionType.Reading:
      case QuestionType.ReadingQuestionPassage:
        groups.reading.push(question)
        break
      case QuestionType.Writing:
        groups.writing.push(question)
        break
      default:
        groups.other.push(question)
        break
    }
  })

  for (const label in groups) {
    if (groups[label].length > 0) {
      questionTypesLabel.value.push(label)
    }
  }
  return groups
}

const filterGroupQuestionType = () => {
  console.log(valueTab.value)
}
</script>

<template>
  <VaLayout>
    <template #left>
      <VaCard v-if="showSidebar" style="min-width: 20rem; max-width: 30rem" bordered>
        <VaCardTitle>
          <div class="flex items-center">
            <VaAvatar size="small" class="mr-2"> N </VaAvatar>
            <p>
              <b>{{ result?.student?.userName }}</b>
            </p>
          </div>
        </VaCardTitle>
        <VaDivider />

        <VaCardContent>
          <VaCard class="va-text-secondary text-xs">
            <VaCardTitle class="flex justify-between bg-slate-200"> Thông tin chi tiết </VaCardTitle>

            <VaCardActions align="stretch" vertical>
              <VaListItem>
                <p><b>Điểm:</b> {{ result?.totalMark }}/{{ maxPointInPaper }}</p>
              </VaListItem>
              <VaListItem>
                <p>
                  <b>Trắc nghiệm:</b>({{
                    result?.submitPaperDetails?.filter((detail) => detail.isCorrect).length || 0
                  }}/{{ result?.totalQuestion }} câu)
                </p>
              </VaListItem>
              <VaListItem>
                <p><b>Tự luận:</b> <span style="color: red">Chưa chấm</span> (1 câu)</p>
              </VaListItem>
              <div>
                <p><b>Số file đã nộp:</b> 0</p>
              </div>
              <div>
                <p><b>Xem chi tiết quá trình làm bài:</b> <span class="icon">🔍</span></p>
              </div>
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
          <VaNavbarItem class="navbar-item-slot">
            <VaMenu>
              <template #anchor>
                <VaButton icon="filter_list" size="small">Filter</VaButton>
              </template>
              <div class="p-4">
                <!-- Thêm các tùy chọn filter nếu cần -->
              </div>
            </VaMenu>
          </VaNavbarItem>
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
            <VaTab v-for="title in questionTypesLabel" :key="title" :name="title" @click="filterGroupQuestionType">
              {{ title }}
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
