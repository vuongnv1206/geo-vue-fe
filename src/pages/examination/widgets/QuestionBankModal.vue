<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import { useQuestionStore } from '@/stores/modules/question.module'
import { useToast } from 'vuestic-ui'
import { getErrorMessage } from '@/services/utils'
import { QuestionTypeColor } from '@services/utils'
import QuestionView from '@/pages/question/widgets/QuestionView.vue'
import { Question, QuestionSearchRes, QuestionTree, SearchQuestion } from '@pages/question/types'
import { Pagination } from '../../question/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const nodes = ref<QuestionTree[]>([])
const stores = useQuestionFolderStore()
const storesQuestion = useQuestionStore()

const loading = ref(false)
const loadingNode = ref(false)
const loadingQuestion = ref(false)

const { init } = useToast()

const currentSelectedFolder = ref<QuestionTree | null>(null)

const QuestionTypeOptions = [
  { id: 0, name: t('papers.all'), questionType: 0 },
  { id: 1, name: t('papers.single_choice'), questionType: 1 },
  { id: 2, name: t('papers.multiple_choice'), questionType: 2 },
  { id: 4, name: t('papers.fill_blank'), questionType: 4 },
  { id: 5, name: t('papers.matching'), questionType: 5 },
  { id: 6, name: t('papers.reading'), questionType: 6 },
  { id: 8, name: t('papers.writing'), questionType: 8 },
  { id: 100, name: t('papers.other'), questionType: 100 },
]

const QuestionTypeValue = ref(QuestionTypeOptions[0])

const QuestionSortOptions = [
  { id: 0, name: t('papers.newest'), questionType: 1 },
  { id: 1, name: t('papers.oldest'), questionType: 2 },
  { id: 2, name: t('papers.last_modified'), questionType: 4 },
]

const QuestionSortValue = ref(QuestionSortOptions[0])

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
  search: '',
})

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.perPage))

const searchQuestion = (search: SearchQuestion) => {
  if (currentSelectedFolder.value == null) {
    return
  }
  loadingQuestion.value = true
  storesQuestion
    .SearchQuestion(search)
    .then((res) => {
      testQuestions.value = res.data.map((question: any) => ({
        ...question,
        isSelected: selectedQuestions.value.find((q) => q.id === question.id),
      }))
      questionSearchRes.value = res
    })
    .catch((err) => {
      const message = getErrorMessage(err)
      init({
        title: 'Error',
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
    searchValue.value.content = filters.value.search
    pagination.value.page = 1
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
  { immediate: true },
)

watch(
  () => pagination.value.perPage,
  () => {
    searchValue.value.pageNumber = 1
    searchValue.value.pageSize = pagination.value.perPage
    searchQuestion(searchValue.value)
  },
  { immediate: true },
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

const searchQuestionWithType = () => {
  if (QuestionTypeValue.value.id !== 0) {
    searchValue.value.questionType = QuestionTypeValue.value.questionType
  } else {
    searchValue.value.questionType = undefined
  }
  searchQuestion(searchValue.value)
}

const handleSelectFolder = (node: QuestionTree) => {
  currentSelectedFolder.value = node
  searchValue.value.folderId = node.id
  pagination.value.page = 1
  searchQuestion(searchValue.value)
}

const findNode = (nodes: QuestionTree[], nodeId: string): QuestionTree | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node // Found the desired node
    }
    if (node.children && node.children.length > 0) {
      const foundInChildren = findNode(node.children, nodeId)
      if (foundInChildren) {
        return foundInChildren // Found in the child nodes
      }
    }
  }
  return null // Node not found
}

const findNodeCurrentShow = (nodes: QuestionTree[]): QuestionTree | null => {
  for (const node of nodes) {
    if (node.currentShow) {
      return node // Found the desired node
    }
    if (node.children && node.children.length > 0) {
      const foundInChildren = findNodeCurrentShow(node.children)
      if (foundInChildren) {
        return foundInChildren // Found in the child nodes
      }
    }
  }
  return null // Node not found
}

const fetchedChildren = new Set<string>()

const checkHasChildren = (nodeId: string) => {
  const node = findNode(nodes.value, nodeId)
  return node && node.children && node.children.length > 0
}

const currentLoadingNodeId = ref<string | null>(null)
const NodeExpanded = ref<string[]>([])

const isNodeExpanded = (nodeId: string) => {
  return NodeExpanded.value.includes(nodeId)
}

const handleExpanded = (expanded: string[]) => {
  NodeExpanded.value = expanded
  console.log(NodeExpanded)
  for (const nodeId of expanded) {
    if (!fetchedChildren.has(nodeId) && checkHasChildren(nodeId)) {
      fetchedChildren.add(nodeId)
      loadingNode.value = true
      currentLoadingNodeId.value = nodeId
      stores
        .getQuestionFolders(nodeId)
        .then((res) => {
          const node = findNode(nodes.value, nodeId)
          const nodeRes = findNodeCurrentShow(res.children)
          if (node) {
            node.children = nodeRes?.children || []
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          loadingNode.value = false
          currentLoadingNodeId.value = null
        })
    }
  }
}

watch(
  () => QuestionTypeValue.value.id,
  () => {
    pagination.value.page = 1
    searchQuestionWithType()
  },
  { immediate: true },
)

watch(
  () => QuestionSortValue.value.id,
  () => {
    pagination.value.page = 1

    if (QuestionSortValue.value.id === 0) {
      searchValue.value.orderBy = []
      searchValue.value.orderBy.push('CreatedOn desc')
      console.log(searchValue.value)
    }
    if (QuestionSortValue.value.id === 1) {
      searchValue.value.orderBy = []
      searchValue.value.orderBy.push('CreatedOn asc')
    }
    if (QuestionSortValue.value.id === 2) {
      searchValue.value.orderBy = []
      searchValue.value.orderBy.push('LastModifiedOn desc')
    }
    searchQuestion(searchValue.value)
  },
  { immediate: true },
)

const selectedQuestions = ref<Question[]>([])

const chooseQuestionBank = (questionId: string | null | undefined) => {
  const question = testQuestions.value.find((q) => q.id === questionId)
  if (question) {
    question.isSelected = !question.isSelected
    if (question.isSelected) {
      const exists = selectedQuestions.value.find((q) => q.id === questionId)
      if (!exists) {
        selectedQuestions.value.push(question)
      }
    } else {
      selectedQuestions.value = selectedQuestions.value.filter((q) => q.id !== questionId)
    }
  }
}

const emit = defineEmits(['save'])

const saveQuestion = () => {
  emit('save', selectedQuestions.value)
}

onMounted(() => {
  loading.value = true
  stores
    .getQuestionFolders('')
    .then((res) => {
      nodes.value = res.children
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-[25%]">
        <VaInnerLoading :loading="loading" :size="60">
          <VaCard class="flex flex-col" outlined>
            <VaCardTitle class="flex items-start justify-between">
              <h1 class="card-title text-secondary font-bold uppercase">{{ t('papers.folder') }}</h1>
              <div class="flex gap-2"></div>
            </VaCardTitle>
            <VaSkeletonGroup v-if="loading" animation="wave" :delay="0">
              <VaCard>
                <VaCardContent class="flex items-center">
                  <VaSkeleton variant="text" class="ml-2 va-text" :lines="10" />
                </VaCardContent>
              </VaCard>
            </VaSkeletonGroup>
            <VaScrollContainer v-else class="max-h-[1000px]" horizontal vertical>
              <VaTreeView :nodes="nodes" children-by="children" track-by="id" @update:expanded="handleExpanded">
                <template #content="node">
                  <VaInnerLoading v-if="node.id === currentLoadingNodeId" :loading="loadingNode" :size="32">
                    <button type="button" style="width: 100%" @click="handleSelectFolder(node)">
                      <div class="flex items-center">
                        <VaIcon v-if="isNodeExpanded(node.id)" name="folder_open" class="mr-2" />
                        <VaIcon v-else name="folder" class="mr-2" />
                        <span>{{ node.name }}</span>
                      </div>
                    </button>
                  </VaInnerLoading>
                  <button v-else type="button" style="width: 100%" @click="handleSelectFolder(node)">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center">
                        <VaIcon v-if="isNodeExpanded(node.id)" name="folder_open" class="mr-2" />
                        <VaIcon v-else name="folder" class="mr-2" />
                        <span>{{ node.name }}</span>
                      </div>
                      <div class="flex gap-2">
                        {{ node.totalQuestions }}
                      </div>
                    </div>
                  </button>
                </template>
              </VaTreeView>
            </VaScrollContainer>
          </VaCard>
        </VaInnerLoading>
      </div>
      <div class="flex flex-col gap-4 w-full sm:w-[75%] border-left">
        <VaCard class="flex flex-col min-h-[500px]" outlined>
          <VaCardTitle class="flex items-start justify-between">
            <h1 class="card-title text-secondary font-bold uppercase">
              {{ t('papers.list_question_of') }} <b>{{ currentSelectedFolder?.name || '?' }}</b>
            </h1>
            <div class="flex gap-2"></div>
          </VaCardTitle>
          <div class="flex flex-col md:flex-row gap-2 mb-2 p-3 justify-between">
            <div class="grid grid-cols-2 gap-2">
              <VaSelect
                v-model="QuestionTypeValue"
                track-by="id"
                :text-by="(option: any) => (option as any).name"
                :placeholder="t('papers.all')"
                :label="t('papers.question_type')"
                :options="QuestionTypeOptions"
                class="col-span-1"
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
              <div>
                <VaSelect
                  v-model="QuestionSortValue"
                  track-by="id"
                  :text-by="(option: any) => (option as any).name"
                  :placeholder="t('papers.newest')"
                  :label="t('papers.sort_by')"
                  :options="QuestionSortOptions"
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
              <VaInput
                v-model="filters.search"
                :label="t('papers.search_content')"
                :placeholder="t('papers.search_content')"
                class="col-span-2"
              >
                <template #prependInner>
                  <VaIcon name="search" color="secondary" size="small" />
                </template>
              </VaInput>
            </div>
          </div>
          <VaCard v-if="currentSelectedFolder == null" class="mb-5 pr-4 flex justify-center">
            <div class="flex flex-col gap-4 w-full">
              <VaCardContent class="flex flex-col items-center justify-center">
                <h2 class="va-h5">{{ t('papers.no_question_folder_selected') }}</h2>
                <p class="text-base leading-5">{{ t('papers.please_select_folder') }}</p>
              </VaCardContent>
            </div>
          </VaCard>
          <VaInnerLoading v-else :loading="loadingQuestion" :size="60">
            <VaScrollContainer class="max-h-[500px]" vertical>
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
                  :show-action-button="false"
                  :is-stripe="testQuestion.isSelected"
                  class="cursor-pointer"
                  @click="chooseQuestionBank(testQuestion.id)"
                />
              </div>
              <VaCard v-if="testQuestions.length === 0" class="mb-5 pr-4 flex justify-center">
                <div class="flex flex-col gap-4 w-full">
                  <VaCardContent class="flex flex-col items-center justify-center">
                    <h2 class="va-h5">{{ t('papers.no_question_in_folder') }}</h2>
                    <p class="text-base leading-5">{{ t('papers.please_select_another_folder') }}</p>
                  </VaCardContent>
                </div>
              </VaCard>
            </VaScrollContainer>
          </VaInnerLoading>
          <VaCardContent>
            <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center p-2">
              <div>
                <b>{{ pagination.total }} {{ t('papers.result') }}.</b>
                {{ t('papers.results_per_page') }}
                <VaSelect v-model="pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
              </div>

              <div v-if="totalPages > 1" class="flex">
                <VaButton
                  preset="secondary"
                  icon="va-arrow-left"
                  :aria-label="t('papers.previous_page')"
                  :disabled="pagination.page === 1"
                  @click="pagination.page--"
                />
                <VaButton
                  class="mr-2"
                  preset="secondary"
                  icon="va-arrow-right"
                  :aria-label="t('papers.next_page')"
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
        <div>
          <p>{{ t('papers.number_of_questions_selected') }}: {{ selectedQuestions.length }}</p>
          <VaButton @click="saveQuestion">{{ t('papers.choose_question') }}</VaButton>
        </div>
      </div>
    </div>
  </section>
</template>
