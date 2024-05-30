<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Question, QuestionTree } from './types'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import QuestionView from './widgets/QuestionView.vue'

const nodes = ref<QuestionTree[]>([])
const stores = useQuestionFolderStore()

const loading = ref(false)
const loadingNode = ref(false)

const currentSelectedFolder = ref<QuestionTree | null>(null)

const handleSelectFolder = (node: QuestionTree) => {
  currentSelectedFolder.value = node
  console.log(node)
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

const testQuestions = ref<Question[]>([
  {
    content: 'Test add',
    image: '/disk/test.png',
    audio: '',
    questionFolder: {
      name: 'Ngành IA',
      parentId: '',
    },
    questionType: 1,
    questionLable: null,
    questionPassages: [],
    answers: [
      {
        id: '0f9c1eb0-57e8-4262-aa78-6f0d22fdbd7a',
        content: 'answer 1',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: true,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
    ],
    createdBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    createdOn: '2024-05-30T04:43:02.217887+07:00',
    lastModifiedBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    lastModifiedOn: '2024-05-30T04:43:02.217887+07:00',
    deletedOn: '',
    deletedBy: '',
    id: '789b8469-74ff-423c-bf96-9e025a63e1aa',
  },
  {
    content: 'Test add',
    image: '/disk/test.png',
    audio: '',
    questionFolder: {
      name: 'Ngành IA',
      parentId: '',
    },
    questionType: 1,
    questionLable: null,
    questionPassages: [],
    answers: [
      {
        id: '0f9c1eb0-57e8-4262-aa78-6f0d22fdbd7a',
        content: 'answer 1',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: true,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
    ],
    createdBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    createdOn: '2024-05-30T04:43:02.217887+07:00',
    lastModifiedBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    lastModifiedOn: '2024-05-30T04:43:02.217887+07:00',
    deletedOn: '',
    deletedBy: '',
    id: '789b8469-74ff-423c-bf96-9e025a63e1aa',
  },
  {
    content: 'Test add',
    image: '/disk/test.png',
    audio: '',
    questionFolder: {
      name: 'Ngành IA',
      parentId: '',
    },
    questionType: 1,
    questionLable: null,
    questionPassages: [],
    answers: [
      {
        id: '0f9c1eb0-57e8-4262-aa78-6f0d22fdbd7a',
        content: 'answer 1',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: true,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
    ],
    createdBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    createdOn: '2024-05-30T04:43:02.217887+07:00',
    lastModifiedBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    lastModifiedOn: '2024-05-30T04:43:02.217887+07:00',
    deletedOn: '',
    deletedBy: '',
    id: '789b8469-74ff-423c-bf96-9e025a63e1aa',
  },
  {
    content: 'Test add',
    image: '/disk/test.png',
    audio: '',
    questionFolder: {
      name: 'Ngành IA',
      parentId: '',
    },
    questionType: 1,
    questionLable: null,
    questionPassages: [],
    answers: [
      {
        id: '0f9c1eb0-57e8-4262-aa78-6f0d22fdbd7a',
        content: 'answer 1',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: true,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
    ],
    createdBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    createdOn: '2024-05-30T04:43:02.217887+07:00',
    lastModifiedBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    lastModifiedOn: '2024-05-30T04:43:02.217887+07:00',
    deletedOn: '',
    deletedBy: '',
    id: '789b8469-74ff-423c-bf96-9e025a63e1aa',
  },
  {
    content: 'Test add',
    image: '/disk/test.png',
    audio: '',
    questionFolder: {
      name: 'Ngành IA',
      parentId: '',
    },
    questionType: 1,
    questionLable: null,
    questionPassages: [],
    answers: [
      {
        id: '0f9c1eb0-57e8-4262-aa78-6f0d22fdbd7a',
        content: 'answer 1',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: true,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
      {
        id: 'fd1710ff-ea22-4b4f-aedd-462022841014',
        content: 'answer 2',
        questionId: '789b8469-74ff-423c-bf96-9e025a63e1aa',
        isCorrect: false,
      },
    ],
    createdBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    createdOn: '2024-05-30T04:43:02.217887+07:00',
    lastModifiedBy: '17d8b48f-679d-4eea-b7a4-af8a6dabcb25',
    lastModifiedOn: '2024-05-30T04:43:02.217887+07:00',
    deletedOn: '',
    deletedBy: '',
    id: '789b8469-74ff-423c-bf96-9e025a63e1aa',
  },
  {
    content:
      "The $_fillblank[1] Ocean is the largest ocean on Earth, covering about $_fillblank[2] of the Earth's surface.",
    image: '',
    audio: '',
    questionFolder: {
      name: 'Geography',
      parentId: null,
    },
    questionType: 4,
    questionLable: {
      name: 'Geography Facts',
    },
    questionPassages: [],
    answers: [
      {
        id: '0d17e87e-e05c-4929-9625-f3cc9d472db6',
        content: '$_[1]Pacific',
        questionId: '748b715a-af78-474e-aee5-85946c979940',
        isCorrect: true,
      },
      {
        id: '32971f92-2ff9-4a9a-a99b-153e2cf30e55',
        content: '$_[2]30%',
        questionId: '748b715a-af78-474e-aee5-85946c979940',
        isCorrect: true,
      },
    ],
    createdBy: '00000000-0000-0000-0000-000000000000',
    createdOn: '2024-05-30T04:41:28.764029+07:00',
    lastModifiedBy: '00000000-0000-0000-0000-000000000000',
    lastModifiedOn: '2024-05-30T04:41:28.764029+07:00',
    deletedOn: null,
    deletedBy: null,
    id: '748b715a-af78-474e-aee5-85946c979940',
  },
])

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
      <div class="w-full sm:w-[20%]">
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
      <div class="flex flex-col gap-4 w-full sm:w-[80%]">
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
          </VaScrollContainer>
        </VaCard>
      </div>
    </div>
  </section>
</template>
