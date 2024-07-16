<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { Question, QuestionTree, SearchQuestion, QuestionSearchRes, Pagination } from '../question/types'
import { useQuestionEditStore } from '@/stores/modules/questionEdit.module'
import { useQuestionStore } from '@/stores/modules/question.module'
import { useModal, useToast, useBreakpoint } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import { getErrorMessage } from '@/services/utils'
import { QuestionTypeColor } from '@services/utils'
import QuestionView from '../question/widgets/QuestionView.vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useBinStore } from '@/stores/modules/bin.module'

const { t } = useI18n()

const storesBin = useBinStore()
const storesQuestion = useQuestionStore()
const storesQEdit = useQuestionEditStore()
const router = useRouter()
const { confirm } = useModal()

const loadingQuestion = ref(false)

const { init } = useToast()

const currentSelectedFolder = ref<QuestionTree | null>(null)

const QuestionTypeOptions = [
  { id: 0, name: t('questions.all'), questionType: 0 },
  { id: 1, name: t('questions.single_choice'), questionType: 1 },
  { id: 2, name: t('questions.multiple_choice'), questionType: 2 },
  { id: 4, name: t('questions.fill_blank'), questionType: 4 },
  { id: 5, name: t('questions.matching'), questionType: 5 },
  { id: 6, name: t('questions.reading'), questionType: 6 },
  { id: 8, name: t('questions.writing'), questionType: 8 },
  { id: 100, name: t('questions.other'), questionType: 100 },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  (event: 'edit', questionTree: QuestionTree): void
  (event: 'delete', questionTree: QuestionTree): void
  (event: 'share', questionTree: QuestionTree): void
}>()

const QuestionTypeValue = ref(QuestionTypeOptions[0])

const testQuestions = ref<Question[]>([])
const questionSearchRes = ref<QuestionSearchRes | null>(null)

const pagination = ref<Pagination>({
  page: 1,
  perPage: 10,
  total: 0,
})

const searchValue = ref<SearchQuestion>({
  pageNumber: 1,
  pageSize: pagination.value.perPage,
})

const filters = ref({
  keyword: '',
})

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.perPage))

const searchQuestion = (search: SearchQuestion) => {
  loadingQuestion.value = true
  storesQuestion
    .SearchDeletedQuestion(search)
    .then((res) => {
      testQuestions.value = res.data
      questionSearchRes.value = res
    })
    .catch((err) => {
      const message = getErrorMessage(err)
      init({
        title: t('questions.error'),
        message: message,
        color: 'danger',
      })
    })
    .finally(() => {
      loadingQuestion.value = false
    })
}

// using debounce to prevent multiple search request
watchDebounced(
  filters.value,
  () => {
    pagination.value.page = 1
    searchValue.value.content = filters.value.keyword
    searchQuestion(searchValue.value)
  },
  { debounce: 500, maxWait: 1000 },
)

watch(
  () => pagination.value.page,
  () => {
    searchValue.value.pageNumber = pagination.value.page
    searchValue.value.pageSize = pagination.value.perPage
    searchQuestion(searchValue.value)
  },
)

watch(
  () => pagination.value.perPage,
  () => {
    searchValue.value.pageNumber = 1
    searchValue.value.pageSize = pagination.value.perPage
    searchQuestion(searchValue.value)
  },
)

watch(
  () => questionSearchRes.value,
  () => {
    if (questionSearchRes.value) {
      pagination.value.total = questionSearchRes.value.totalCount
    }
  },
  { immediate: true },
)

const setSearchQuestionWithType = () => {
  if (QuestionTypeValue.value.id !== 0) {
    searchValue.value.questionType = QuestionTypeValue.value.questionType
  } else {
    searchValue.value.questionType = undefined
  }
}

const { editMode, questionToEdit } = storeToRefs(storesQuestion)

const editQuestion = (question: Question) => {
  editMode.value = true
  questionToEdit.value = question
  if (currentSelectedFolder.value?.id) {
    storesQEdit.clearQuestions()
    storesQEdit.addQuestion(question)
    storesQEdit.setFolder(currentSelectedFolder.value)
    router.push({ name: 'question-edit' })
  }
}

const deleteQuestion = (question: Question) => {
  confirm({
    title: t('questions.delete_question'),
    message: t('questions.delete_confirmation'),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    storesQuestion
      .DeleteQuestion(question.id || '')
      .then(() => {
        init({
          title: t('questions.success'),
          message: t('questions.delete_success'),
          color: 'success',
        })
        searchQuestion(searchValue.value)
      })
      .catch((err) => {
        const message = getErrorMessage(err)
        init({
          title: t('questions.error'),
          message: message,
          color: 'danger',
        })
      })
  })
}

watch(
  () => QuestionTypeValue.value.id,
  () => {
    pagination.value.page = 1
    setSearchQuestionWithType()
    searchQuestion(searchValue.value)
  },
)

watch(
  () => storesBin.refresh,
  (refresh) => {
    if (refresh) {
      searchQuestion(searchValue.value)
      storesBin.setRefresh(false)
    }
  },
)

onMounted(() => {
  searchValue.value.pageNumber = 1
  searchValue.value.pageSize = pagination.value.perPage
  setSearchQuestionWithType()
  searchQuestion(searchValue.value)
  storesBin.setBinQuestion(true)
})

onUnmounted(() => {
  storesBin.setBinQuestion(false)
})

const breakpoints = useBreakpoint()

const isSidebarVisibleChild = ref(breakpoints.smUp)

watchEffect(() => {
  isSidebarVisibleChild.value = breakpoints.smUp
})

const DeleteAllFromBin = () => {
  const listIds = testQuestions.value?.map((item) => item.id) || []
  const dataApproveAll = {
    questionIds: listIds,
  }
  storesQuestion
    .DeleteMultiQuestion(dataApproveAll)
    .then(() => {
      init({
        title: t('questions.success'),
        message: t('questions.delete_all_success'),
        color: 'success',
      })
      storesBin.setRefresh(true)
    })
    .catch((err) => {
      const message = getErrorMessage(err)
      init({
        title: t('questions.error'),
        message: message,
        color: 'danger',
      })
    })
}
</script>

<template>
  <VaLayout
    :top="{ order: 1 }"
    class="gap-2"
    :left="{ absolute: breakpoints.smDown, order: 2, overlay: breakpoints.smDown && isSidebarVisibleChild }"
    @leftOverlayClick="isSidebarVisibleChild = false"
  >
    <template #top>
      <VaNavbar class="py-2 rounded">
        <template #left>
          <div style="font-size: smaller" class="text-secondary font-bold uppercase ml-2 flex items-center">
            <span class="inline-block align-middle">
              <VaIcon name="folder" class="ml-2" /> <b>{{ t('questionFolder.pending_title') }}</b>
            </span>
          </div>
        </template>
        <template #right>
          <div v-if="testQuestions?.length > 0" class="flex gap-2">
            <VaButton color="danger" icon="close" @click="DeleteAllFromBin">{{ t('questions.delete_all') }}</VaButton>
          </div>
        </template>
      </VaNavbar>
    </template>
    <template #content>
      <div class="max-h-[calc(100vh-64px)] overflow-y-auto">
        <div class="flex flex-col gap-4">
          <VaCard class="flex flex-col min-h-[75vh]">
            <div class="flex flex-wrap gap-2 mb-2 p-3 justify-start">
              <div>
                <VaSelect
                  v-model="QuestionTypeValue"
                  track-by="id"
                  :text-by="(option: any) => (option as any).name"
                  :placeholder="t('questions.all')"
                  :label="t('questions.question_type')"
                  :options="QuestionTypeOptions"
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
              </div>
              <div>
                <VaInput
                  v-model="filters.keyword"
                  :label="t('questions.search_content')"
                  :placeholder="t('questions.search')"
                >
                  <template #prependInner>
                    <VaIcon name="search" color="secondary" size="small" />
                  </template>
                </VaInput>
              </div>
            </div>
            <VaCard v-if="testQuestions?.length <= 0" class="mb-5 pr-4 flex justify-center">
              <div class="flex flex-col gap-4 w-full">
                <VaCardContent class="flex flex-col items-center justify-center">
                  <h2 class="va-h5">{{ t('questions.no_question_deleted') }}</h2>
                </VaCardContent>
              </div>
            </VaCard>
            <VaInnerLoading v-else :loading="loadingQuestion" :size="60">
              <VaScrollContainer class="min-h-[60vh] max-h-[60vh]" vertical>
                <VaSkeletonGroup v-if="loadingQuestion" animation="wave" :delay="0">
                  <VaCard>
                    <VaCardContent class="flex items-center">
                      <VaSkeleton variant="text" class="ml-2 va-text" :lines="10" />
                    </VaCardContent>
                  </VaCard>
                </VaSkeletonGroup>
                <div v-for="testQuestion in testQuestions" :key="testQuestion.id || ''">
                  <QuestionView
                    :question="testQuestion"
                    :index="null"
                    :is-stripe="false"
                    :show-action-button="true"
                    @edit="editQuestion"
                    @delete="deleteQuestion"
                  />
                </div>
                <VaCard v-if="testQuestions.length === 0" class="mb-5 pr-4 flex justify-center">
                  <div class="flex flex-col gap-4 w-full">
                    <VaCardContent class="flex flex-col items-center justify-center">
                      <h2 class="va-h5">{{ t('questions.no_question_deleted') }}</h2>
                    </VaCardContent>
                  </div>
                </VaCard>
              </VaScrollContainer>
            </VaInnerLoading>
            <VaCardContent>
              <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center p-2">
                <div>
                  <b>{{ pagination.total }} {{ t('questions.results') }}.</b>
                  {{ t('questions.results_per_page') }}
                  <VaSelect v-model="pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
                </div>

                <div v-if="totalPages > 1" class="flex">
                  <VaButton
                    preset="secondary"
                    icon="va-arrow-left"
                    aria-label="Previous page"
                    :disabled="pagination.page === 1"
                    @click="pagination.page--"
                  />
                  <VaButton
                    class="mr-2"
                    preset="secondary"
                    icon="va-arrow-right"
                    aria-label="Next page"
                    :disabled="pagination.page === totalPages"
                    @click="pagination.page++"
                  />
                  <VaPagination
                    v-model="pagination.page"
                    buttons-preset="secondary"
                    :pages="totalPages"
                    :visible-pages="5"
                    :boundary-links="false"
                    :direction-links="false"
                  />
                </div>
              </div>
            </VaCardContent>
          </VaCard>
        </div>
      </div>
    </template>
  </VaLayout>
</template>
