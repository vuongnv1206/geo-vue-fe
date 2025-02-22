<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { Question, QuestionTree, SearchQuestion, QuestionSearchRes, Pagination } from './types'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import { useQuestionEditStore } from '@/stores/modules/questionEdit.module'
import { useQuestionStore } from '@/stores/modules/question.module'
import { useModal, useToast, useMenu, useBreakpoint } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import { getErrorMessage } from '@/services/utils'
import { QuestionTypeColor } from '@services/utils'
import QuestionView from './widgets/QuestionView.vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const nodes = ref<QuestionTree[]>([])
const stores = useQuestionFolderStore()
const storesQuestion = useQuestionStore()
const storesQEdit = useQuestionEditStore()
const router = useRouter()
const { confirm } = useModal()
const { show } = useMenu()

const loading = ref(false)
const loadingNode = ref(false)
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

const QuestionSortOptions = [
  { id: 0, name: t('questions.newest'), questionType: 1 },
  { id: 1, name: t('questions.oldest'), questionType: 2 },
  { id: 2, name: t('questions.last_modified'), questionType: 4 },
]

const emit = defineEmits<{
  (event: 'edit', questionTree: QuestionTree): void
  (event: 'delete', questionTree: QuestionTree): void
  (event: 'share', questionTree: QuestionTree): void
}>()

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

const AddNewQuestion = () => {
  // push to add new question page
  editMode.value = false
  if (currentSelectedFolder.value?.id) {
    storesQEdit.clearQuestions()
    storesQEdit.setFolder(currentSelectedFolder.value)
    router.push({ name: 'question-edit' })
  } else {
    init({
      title: t('questions.error'),
      message: t('questions.select_folder_to_add'),
      color: 'danger',
    })
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

const contextmenu = (event: any, node: QuestionTree) => {
  event.preventDefault()
  show({
    event: event,
    options: [
      { text: t('questions.rename'), icon: 'edit' },
      { text: t('questions.share'), icon: 'share' },
      { text: t('questions.delete'), icon: 'delete' },
    ],
    onSelected(option) {
      if (option.text === t('questions.rename')) {
        emit('edit', node)
      }
      if (option.text === t('questions.share')) {
        emit('share', node)
      }
      if (option.text === t('questions.delete')) {
        emit('delete', node)
      }
    },
  })
}

const { needReloadQuestionFolder, sellectedQuestionFolderId } = storeToRefs(storesQuestion)

watch(
  () => needReloadQuestionFolder.value,
  () => {
    if (needReloadQuestionFolder.value) {
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
          needReloadQuestionFolder.value = false
        })
    }
  },
  { immediate: true },
)

const breakpoints = useBreakpoint()

const isSidebarVisibleChild = ref(breakpoints.smUp)

watchEffect(() => {
  isSidebarVisibleChild.value = breakpoints.smUp
})

onMounted(() => {
  loading.value = true
  stores
    .getQuestionFolders('')
    .then((res) => {
      nodes.value = res.children

      if (sellectedQuestionFolderId.value !== '') {
        const node = findNode(nodes.value, sellectedQuestionFolderId.value)
        if (node) {
          handleSelectFolder(node)
        }
        sellectedQuestionFolderId.value = ''
      }
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
  <VaLayout
    :top="{ order: 1 }"
    class="gap-2"
    :left="{ absolute: breakpoints.smDown, order: 2, overlay: breakpoints.smDown && isSidebarVisibleChild }"
    @leftOverlayClick="isSidebarVisibleChild = false"
  >
    <template #top>
      <VaNavbar class="py-2 rounded">
        <template #left>
          <VaButton
            size="small"
            :icon="isSidebarVisibleChild ? 'menu_open' : 'menu'"
            @click="isSidebarVisibleChild = !isSidebarVisibleChild"
          />
          <div style="font-size: smaller" class="text-secondary font-bold uppercase ml-2 flex items-center">
            <span class="inline-block align-middle">
              <VaIcon name="folder" class="ml-2" /> <b>{{ currentSelectedFolder?.name || '?' }}</b>
            </span>
          </div>
        </template>
        <template #right>
          <div class="flex gap-2">
            <VaButton icon="add" @click="AddNewQuestion">{{ t('questions.add_question') }}</VaButton>
          </div>
        </template>
      </VaNavbar>
    </template>
    <template #left>
      <div v-if="isSidebarVisibleChild" class="max-h-[calc(100vh-64px)] min-w-[calc(300px)] overflow-y-auto">
        <div class="w-full">
          <VaInnerLoading :loading="loading" :size="60">
            <VaCard class="flex flex-col">
              <VaCardTitle class="flex items-start justify-between">
                <h1 class="card-title text-secondary font-bold uppercase">{{ t('questions.folders') }}</h1>
                <div class="flex gap-2"></div>
              </VaCardTitle>
              <VaSkeletonGroup v-if="loading" animation="wave" :delay="0">
                <VaCard>
                  <VaCardContent class="flex items-center">
                    <VaSkeleton variant="text" class="ml-2 va-text" :lines="10" />
                  </VaCardContent>
                </VaCard>
              </VaSkeletonGroup>
              <VaScrollContainer v-else class="max-h-[75vh]" horizontal vertical>
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
                    <button
                      v-else
                      :style="node.id === currentSelectedFolder?.id ? 'color: #154ec1' : ''"
                      class="w-full"
                      type="button"
                      @contextmenu="contextmenu($event, node)"
                      @click="handleSelectFolder(node)"
                    >
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
      </div>
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
              <div>
                <VaSelect
                  v-model="QuestionSortValue"
                  track-by="id"
                  :text-by="(option: any) => (option as any).name"
                  :placeholder="t('questions.newest')"
                  :label="t('questions.sort_by')"
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
                  <h2 class="va-h5">{{ t('questions.no_folder_selected') }}</h2>
                  <p class="text-base leading-5">{{ t('questions.select_folder') }}</p>
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
                      <h2 class="va-h5">{{ t('questions.no_question') }}</h2>
                      <p class="text-base leading-5">{{ t('questions.select_another_folder') }}</p>
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
                  <VaPagination
                    v-model="pagination.page"
                    buttons-preset="secondary"
                    :pages="totalPages"
                    :visible-pages="5"
                    :boundary-links="true"
                    :direction-links="true"
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
