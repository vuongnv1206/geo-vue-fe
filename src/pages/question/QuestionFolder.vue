<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { QuestionTree } from './types'
import QuestionFolder from './widgets/QuestionFolder.vue'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'

const loading = ref(true)
const currentShowFolderId = ref<string>('')

const stores = useQuestionFolderStore()

const questionTreeMain = ref<QuestionTree>()
const questionTrees = ref<QuestionTree[]>([])

const getQuestionFolders = () => {
  loading.value = true
  stores.getQuestionFolders(currentShowFolderId.value).then((res) => {
    questionTreeMain.value = res
    getCurrentShowFolder(res)
    loading.value = false
  })
}

const getCurrentShowFolder = (questionTree: QuestionTree) => {
  if (questionTree.currentShow) {
    questionTrees.value = questionTree.children
    return questionTree
  } else {
    questionTree.children.forEach((child) => {
      return getCurrentShowFolder(child)
    })
  }
  return questionTree
}

const selectedFolder = (questionTree: QuestionTree) => {
  currentShowFolderId.value = questionTree.id
  getQuestionFolders()
}

const QuestionFolderBreadcrumb = computed(() => {
  let questionTree = questionTreeMain.value
  const result: { label: string; to: string }[] = []
  while (questionTree?.currentShow == false) {
    result.push({
      label: questionTree.name,
      to: questionTree.id,
    })
    questionTree = questionTree.children[0]
  }
  if (questionTree?.currentShow) {
    result.push({
      label: questionTree.name,
      to: questionTree.id,
    })
  }
  return result
})

const handleBreadcrumbClick = (item: { label: string; to: string }) => {
  if (item.label == 'Root') {
    currentShowFolderId.value = ''
  } else {
    currentShowFolderId.value = item.to
  }
  getQuestionFolders()
}

const QuestionTreeToEdit = ref<QuestionTree | null>(null)
const doShowQuestionTreeFormModal = ref(false)

const editQuestionTree = (questionTree: QuestionTree) => {
  QuestionTreeToEdit.value = questionTree
  doShowQuestionTreeFormModal.value = true
}

const deleteQuestionTree = (questionTree: QuestionTree) => {
  console.log('deleteQuestionTree', questionTree)
}

const createNewQuestionFolder = () => {
  console.log('createNewQuestionFolder')
}

const selectedItemsEmitted = ref<QuestionTree[]>([])

const deleteSelectedFolder = () => {
  console.log('deleteSelectedFolder', selectedItemsEmitted.value)
}

onMounted(() => {
  getQuestionFolders()
})
</script>

<template>
  <h1 class="page-title font-bold">Question Folder</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaBreadcrumbs>
            <VaBreadcrumbsItem
              v-for="item in QuestionFolderBreadcrumb"
              :key="item.label"
              :label="item.label"
              @click="handleBreadcrumbClick(item)"
            >
              <a href="#" class="text-blue-500">{{ item.label }}</a>
            </VaBreadcrumbsItem>
          </VaBreadcrumbs>
        </div>
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <VaButton
            v-if="selectedItemsEmitted.length != 0"
            icon="delete"
            color="danger"
            @click="deleteSelectedFolder()"
          >
            Delete</VaButton
          >
          <VaButton icon="add" @click="createNewQuestionFolder()">Question Folder</VaButton>
        </div>
      </div>
      <QuestionFolder
        v-model:selectedItemsEmitted="selectedItemsEmitted"
        :question-trees="questionTrees"
        :loading="loading"
        @edit="editQuestionTree"
        @delete="deleteQuestionTree"
        @selectedFolder="selectedFolder"
      />
    </VaCardContent>
  </VaCard>
</template>
