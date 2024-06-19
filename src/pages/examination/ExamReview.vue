<script lang="ts" setup>
import { useSubmitPaperStore } from '@/stores/modules/submitPaper.module'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast, VaButton, VaCard } from 'vuestic-ui'
import { Question, QuestionType } from '../question/types'
import { GetLastResultExamRequest, LastResultExamDto } from './types'

import SingleChoiceQuestion from './questionType/SingleChoiceQuestion.vue'

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

const getLastExamResult = () => {
  submitPaperStore
    .getLastResultExam(request)
    .then((res) => {
      result.value = res
      if (res && res.paper && res.paper.questions) {
        groupedQuestions.value = groupQuestionsByType(res.paper.questions)
      }
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

// Computed property to group the questions by type
const groupQuestionsByType = (questions: Question[]) => {
  const groups: { [key: string]: Question[] } = {
    singleChoice: [],
    multipleChoice: [],
    fillBlank: [],
    matching: [],
    reading: [],
    writing: [],
    other: [],
  }

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

  return groups
}

const initialTab = computed(() => {
  if (groupedQuestions.value.singleChoice.length) return 'singleChoice'
  if (groupedQuestions.value.multipleChoice.length) return 'multipleChoice'
  if (groupedQuestions.value.fillBlank.length) return 'fillBlank'
  if (groupedQuestions.value.matching.length) return 'matching'
  if (groupedQuestions.value.reading.length) return 'reading'
  if (groupedQuestions.value.writing.length) return 'writing'
  if (groupedQuestions.value.other.length) return 'other'
  return undefined
})
</script>

<template>
  <VaLayout style="height: 85vh">
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
                <p><b>Điểm:</b> {{ result?.totalMark }}/10</p>
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
      <VaCard class="mt-2 ml-2" style="height: 80vh">
        <VaTabs v-model="initialTab" stateful grow>
          <VaTab v-if="groupedQuestions.singleChoice.length" name="singleChoice" label="Single Choice">
            <SingleChoiceQuestion
              :questions="groupedQuestions.singleChoice"
              :student-answers="result?.submitPaperDetails ?? []"
            />
          </VaTab>
          <!-- <VaTab v-if="groupedQuestions.multipleChoice.length" name="multipleChoice" label="Multiple Choice">
            <MultipleChoiceQuestion :questions="groupedQuestions.multipleChoice" />
          </VaTab>
          <VaTab v-if="groupedQuestions.fillBlank.length" name="fillBlank" label="Fill in the Blank">
            <FillBlankQuestion :questions="groupedQuestions.fillBlank" />
          </VaTab>
          <VaTab v-if="groupedQuestions.matching.length" name="matching" label="Matching">
            <MatchingQuestion :questions="groupedQuestions.matching" />
          </VaTab>
          <VaTab v-if="groupedQuestions.reading.length" name="reading" label="Reading">
            <ReadingQuestion :questions="groupedQuestions.reading" />
          </VaTab>
          <VaTab v-if="groupedQuestions.writing.length" name="writing" label="Writing">
            <EssayQuestion :questions="groupedQuestions.writing" />
          </VaTab>
          <VaTab v-if="groupedQuestions.other.length" name="other" label="Other">
            <SingleChoiceQuestion :questions="groupedQuestions.other" />
          </VaTab> -->
        </VaTabs>
      </VaCard>
    </template>
  </VaLayout>
</template>
