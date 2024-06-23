<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { Question, QuestionTree, SearchQuestion, QuestionSearchRes, Pagination } from './types'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import { useQuestionEditStore } from '@/stores/modules/questionEdit.module'
import { useQuestionStore } from '@/stores/modules/question.module'
import { useModal, useToast } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import { getErrorMessage } from '@/services/utils'
import { QuestionTypeColor } from '@services/utils'
import QuestionView from './widgets/QuestionView.vue'

const nodes = ref<QuestionTree[]>([])
const stores = useQuestionFolderStore()
const storesQuestion = useQuestionStore()
const storesQEdit = useQuestionEditStore()
const router = useRouter()
const { confirm } = useModal()

const loading = ref(false)
const loadingNode = ref(false)
const loadingQuestion = ref(false)

const { init } = useToast()

const currentSelectedFolder = ref<QuestionTree | null>(null)

const QuestionTypeOptions = [
  { id: 0, name: 'All', questionType: 0 },
  { id: 1, name: 'Single Choice', questionType: 1 },
  { id: 2, name: 'Multiple Choice', questionType: 2 },
  { id: 4, name: 'Fill Blank', questionType: 4 },
  { id: 5, name: 'Matching', questionType: 5 },
  { id: 6, name: 'Reading', questionType: 6 },
  { id: 8, name: 'Writing', questionType: 8 },
  { id: 100, name: 'Other', questionType: 100 },
]

const QuestionSortOptions = [
  { id: 0, name: 'Newest', questionType: 1 },
  { id: 1, name: 'Oldest', questionType: 2 },
  { id: 2, name: 'Last Modified', questionType: 4 },
]

const QuestionTypeValue = ref(QuestionTypeOptions[0])

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
  keyword: '',
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
      testQuestions.value = res.data
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
    pagination.value.page = 1
    searchValue.value.keyword = filters.value.keyword
    searchQuestion(searchValue.value)
  },
  { debounce: 500, maxWait: 1000 },
)

watch(
  () => pagination.value.page,
  () => {
    searchValue.value.pageNumber = pagination.value.page
    searchValue.value.pageSize = pagination.value.perPage
    console.log('pagination', pagination.value)
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

const editQuestion = (question: Question) => {
  console.log('Edit question', question)
}

const deleteQuestion = (question: Question) => {
  confirm({
    title: 'Delete question',
    message: `Are you sure you want to delete?`,
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    storesQuestion
      .DeleteQuestion(question.id || '')
      .then(() => {
        init({
          title: 'Success',
          message: 'Delete question successfully',
          color: 'success',
        })
        searchQuestion(searchValue.value)
      })
      .catch((err) => {
        const message = getErrorMessage(err)
        init({
          title: 'Error',
          message: message,
          color: 'danger',
        })
      })
  })
}

const AddNewQuestion = () => {
  // push to add new question page
  console.log('Add new question')
  if (currentSelectedFolder.value?.id) {
    storesQEdit.clearQuestions()
    storesQEdit.setFolder(currentSelectedFolder.value)
    router.push({ name: 'question-edit' })
  } else {
    init({
      title: 'Error',
      message: 'Please select a folder to add question',
      color: 'danger',
    })
  }
}

watch(
  () => QuestionTypeValue.value.id,
  () => {
    pagination.value.page = 1
    console.log('Search question with type')
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
          <VaCard class="flex flex-col">
            <VaCardTitle class="flex items-start justify-between">
              <h1 class="card-title text-secondary font-bold uppercase">Folders</h1>
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
      <div class="flex flex-col gap-4 w-full sm:w-[75%]">
        <VaCard class="flex flex-col min-h-[800px]">
          <VaCardTitle class="flex items-start justify-between">
            <h1 class="card-title text-secondary font-bold uppercase">
              List question of <b>{{ currentSelectedFolder?.name || '?' }}</b>
            </h1>
            <div class="flex gap-2">
              <VaButton icon="add" @click="AddNewQuestion">Add Question</VaButton>
            </div>
          </VaCardTitle>
          <div class="flex flex-wrap gap-2 mb-2 p-3 justify-start">
            <div>
              <VaSelect
                v-model="QuestionTypeValue"
                track-by="id"
                :text-by="(option) => (option as any).name"
                placeholder="All"
                label="Question Type"
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
              <VaInput v-model="filters.keyword" label="Search content" placeholder="Search">
                <template #prependInner>
                  <VaIcon name="search" color="secondary" size="small" />
                </template>
              </VaInput>
            </div>
            <div>
              <VaSelect
                v-model="QuestionSortValue"
                track-by="id"
                :text-by="(option) => (option as any).name"
                placeholder="Newest"
                label="Sort by"
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
          </div>
          <VaCard v-if="currentSelectedFolder == null" class="mb-5 pr-4 flex justify-center">
            <div class="flex flex-col gap-4 w-full">
              <VaCardContent class="flex flex-col items-center justify-center">
                <h2 class="va-h5">No question folder selected</h2>
                <p class="text-base leading-5">Please select a question folder to view its questions</p>
              </VaCardContent>
            </div>
          </VaCard>
          <VaInnerLoading v-else :loading="loadingQuestion" :size="60">
            <VaScrollContainer class="min-h-[600px] max-h-[70vh]" vertical>
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
                    <h2 class="va-h5">No question in this folder</h2>
                    <p class="text-base leading-5">Please select another folder</p>
                  </VaCardContent>
                </div>
              </VaCard>
            </VaScrollContainer>
          </VaInnerLoading>
          <VaCardContent>
            <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center p-2">
              <div>
                <b>{{ pagination.total }} results.</b>
                Results per page
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
  </section>
</template>
