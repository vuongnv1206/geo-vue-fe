<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Question, QuestionTree, SearchQuestion } from './types'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import { useQuestionStore } from '@/stores/modules/question.module'
import QuestionView from './widgets/QuestionView.vue'

const nodes = ref<QuestionTree[]>([])
const stores = useQuestionFolderStore()
const storesQuestion = useQuestionStore()

const loading = ref(false)
const loadingNode = ref(false)

const currentSelectedFolder = ref<QuestionTree | null>(null)

const searchValue = ref<SearchQuestion>({
  pageNumber: 1,
  pageSize: 30,
})

const testQuestions = ref<Question[]>([])

const searchQuestion = (search: SearchQuestion) => {
  console.log(search)
  storesQuestion
    .SearchQuestion(search)
    .then((res) => {
      testQuestions.value = res.data
      console.log(testQuestions.value)
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleSelectFolder = (node: QuestionTree) => {
  currentSelectedFolder.value = node
  searchValue.value.folderId = node.id
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
  <h1 class="h1">Question Bank</h1>
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
            <div class="flex gap-2"></div>
          </VaCardTitle>
          <VaCard v-if="currentSelectedFolder == null" class="mb-5 pr-4 flex justify-center">
            <div class="flex flex-col gap-4 w-full">
              <VaCardContent class="flex flex-col items-center justify-center">
                <h2 class="va-h5">No question folder selected</h2>
                <p class="text-base leading-5">Please select a question folder to view its questions</p>
              </VaCardContent>
            </div>
          </VaCard>
          <VaScrollContainer v-else class="max-h-[800px]" vertical>
            <div v-for="testQuestion in testQuestions" :key="testQuestion.id">
              <QuestionView :question="testQuestion" :index="null" />
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
        </VaCard>
      </div>
    </div>
  </section>
</template>
