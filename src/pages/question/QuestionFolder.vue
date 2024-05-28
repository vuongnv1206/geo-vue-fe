<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { QuestionTree, QuestionTreeEmpty } from './types'
import QuestionFolder from './widgets/QuestionFolder.vue'
import EditQuestionTreeForm from './widgets/EditQuestionTreeForm.vue'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import { useModal, useToast } from 'vuestic-ui'
import { getErrorMessage } from '@/services/utils'

const loading = ref(true)
const currentShowFolderId = ref<string>('')

const stores = useQuestionFolderStore()

const questionTreeMain = ref<QuestionTree>()
const questionTrees = ref<QuestionTree[]>([])

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

const shareQuestionTree = (questionTree: QuestionTree) => {
  console.log('shareQuestionTree', questionTree)
}

const createNewQuestionFolder = () => {
  QuestionTreeToEdit.value = null
  doShowQuestionTreeFormModal.value = true
}

const selectedItemsEmitted = ref<QuestionTree[]>([])
const selectedItemsEmittedDelete = ref<QuestionTree[]>([])

const deleteQuestionTree = (questionTree: QuestionTree) => {
  loading.value = true
  if (!selectedItemsEmittedDelete.value.includes(questionTree)) {
    stores
      .deleteQuestionFolder(questionTree.id)
      .then(() => {
        notify({
          message: 'Question Folder ' + questionTree.name + ' deleted',
          color: 'success',
        })
        getQuestionFolders()
      })
      .catch((err) => {
        const message = getErrorMessage(err)
        notify({
          message: 'Failed to delete question folder ' + questionTree.name + '\n' + message,
          color: 'danger',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const deleteSelectedFolder = () => {
  confirm('Are you sure you want to delete selected folders?').then((agreed) => {
    if (agreed) {
      selectedItemsEmitted.value.forEach((questionTree) => {
        deleteQuestionTree(questionTree)
        selectedItemsEmittedDelete.value.push(questionTree)
      })
    }
  })
}

const getQuestionFolders = () => {
  loading.value = true
  stores
    .getQuestionFolders(currentShowFolderId.value)
    .then((res) => {
      questionTreeMain.value = res
      getCurrentShowFolder(res)
      loading.value = false
    })
    .catch(() => {
      loading.value = false
      notify({
        message: 'Failed to get question folders',
        color: 'danger',
      })
    })
    .finally(() => {
      selectedItemsEmitted.value = []
    })
}

const selectedFolder = (questionTree: QuestionTree) => {
  currentShowFolderId.value = questionTree.id
  getQuestionFolders()
}

const editFormRef = ref()
const { confirm } = useModal()
const { init: notify } = useToast()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

const onQuestionnFolderSaved = async (qFolder: QuestionTree) => {
  doShowQuestionTreeFormModal.value = false
  if (qFolder.id != '') {
    loading.value = true
    stores
      .updateQuestionFolder(qFolder.id, qFolder as QuestionTreeEmpty)
      .then(() => {
        notify({
          message: 'Question Folder updated',
          color: 'success',
        })
        getQuestionFolders()
      })
      .catch((err) => {
        const message = getErrorMessage(err)
        notify({
          message: 'Failed to update question folder ' + qFolder.name + '\n' + message,
          color: 'danger',
        })
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    if (currentShowFolderId.value != '') {
      qFolder.parentId = currentShowFolderId.value
    } else {
      qFolder.parentId = ''
    }
    loading.value = true
    stores
      .createQuestionFolder(qFolder as QuestionTreeEmpty)
      .then(() => {
        notify({
          message: 'Question Folder ' + qFolder.name + ' created',
          color: 'success',
        })
        getQuestionFolders()
      })
      .catch((err) => {
        const message = getErrorMessage(err)
        notify({
          message: 'Failed to create question folder ' + qFolder.name + '\n' + message,
          color: 'danger',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
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
        @share="shareQuestionTree"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowQuestionTreeFormModal"
    size="small"
    mobile-fullscreen
    close-button
    stateful
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 v-if="QuestionTreeToEdit === null" class="va-h5 mb-4">Add folder</h1>
    <h1 v-else class="va-h5 mb-4">Edit folder</h1>
    <EditQuestionTreeForm
      ref="editFormRef"
      :question-tree="QuestionTreeToEdit"
      :save-button-label="QuestionTreeToEdit === null ? 'Add' : 'Save'"
      @close="cancel"
      @save="
        (questionTree: QuestionTree) => {
          onQuestionnFolderSaved(questionTree)
          ok()
        }
      "
    />
  </VaModal>
</template>
