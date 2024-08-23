<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import { useI18n } from 'vue-i18n'
import { Pagination, QuestionTree, SearchQuestion } from '../types'

const nodes = ref<QuestionTree[]>([])
const storesQuestion = useQuestionFolderStore()
const loadingNode = ref(false)
const { t } = useI18n()

const loading = ref(false)

const currentSelectedFolder = ref<QuestionTree | null>(null)

const pagination = ref<Pagination>({
  page: 1,
  perPage: 10,
  total: 0,
})
const searchValue = ref<SearchQuestion>({
  pageNumber: 1,
  pageSize: pagination.value.perPage,
})

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

const checkHasChildren = (nodeId: string) => {
  const node = findNode(nodes.value, nodeId)
  return node && node.children && node.children.length > 0
}

const currentLoadingNodeId = ref<string | null>(null)

const fetchedChildren = new Set<string>()
const NodeExpanded = ref<string[]>([])

const handleExpanded = (expanded: string[]) => {
  NodeExpanded.value = expanded
  console.log(NodeExpanded)
  for (const nodeId of expanded) {
    if (!fetchedChildren.has(nodeId) && checkHasChildren(nodeId)) {
      fetchedChildren.add(nodeId)
      loadingNode.value = true
      currentLoadingNodeId.value = nodeId
      storesQuestion
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

const isNodeExpanded = (nodeId: string) => {
  return NodeExpanded.value.includes(nodeId)
}

const handleSelectFolder = (node: QuestionTree) => {
  currentSelectedFolder.value = node
  searchValue.value.folderId = node.id
  pagination.value.page = 1
  emitEvent('selectedFolder', node)
}

const emitEvent = defineEmits<{
  (e: 'selectedFolder', node: QuestionTree): void
}>()

onMounted(() => {
  loading.value = true
  storesQuestion
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
</template>
