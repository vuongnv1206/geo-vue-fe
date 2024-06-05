<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Subject, EmptySubject } from './types'
import SubjectTable from './widgets/SubjectTable.vue'
import { useSubjectStore } from '@/stores/modules/subject.module'
import { useModal, useToast } from 'vuestic-ui'
import EditSubjectForm from './widgets/EditSubjectForm.vue'

const loading = ref(true)
const stores = useSubjectStore()
const subjects = ref<Subject[]>([])
// const currentSubjectId = ref<string>('')
const selectedItemsEmitted = ref<Subject[]>([])
const SubjectToEdit = ref<Subject | null>(null)
const doShowSubjectFormModal = ref(false)
const { init: notify } = useToast()
const editFormRef = ref()
const { confirm } = useModal()

const getSubjects = () => {
  loading.value = true
  stores
    .getSubjects()
    .then((response) => {
      subjects.value = response.data
      console.log('Subjects:', subjects.value)
      loading.value = false
    })
    .catch((error) => {
      console.log('Error:', error)
      notify({
        message: 'Failed to get subjects\n' + error.message,
        color: 'error',
      })
      loading.value = false
    })
}

const deleteSubject = (subject: Subject) => {
  console.log('deleteSelectedSubject', subject)
  stores
    .deleteSubject(subject.id)
    .then(() => {
      notify({
        message: 'Subject deleted successfully',
        color: 'success',
      })
      getSubjects()
    })
    .catch((error) => {
      notify({
        message: 'Failed to delete subject\n' + error.message,
        color: 'error',
      })
    })
}

const deleteSelectedSubject = () => {
  selectedItemsEmitted.value.forEach((subject) => {
    deleteSubject(subject)
  })
}

const createNewSubject = () => {
  SubjectToEdit.value = null
  doShowSubjectFormModal.value = true
}

const editSubject = (subject: Subject) => {
  SubjectToEdit.value = subject
  doShowSubjectFormModal.value = true
}

// const selectedSubject = (subject: Subject) => {
//   currentSubjectId.value = subject.id
// }

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

const onSubjectSaved = async (subject: Subject) => {
  doShowSubjectFormModal.value = false
  if (subject.id != '') {
    stores
      .updateSubject(subject.id, subject as EmptySubject)
      .then(() => {
        notify({
          message: 'Subject updated successfully',
          color: 'success',
        })
        getSubjects()
      })
      .catch((error) => {
        notify({
          message: 'Failed to update subject\n' + error.message,
          color: 'error',
        })
      })
  } else {
    stores
      .createSubject(subject as EmptySubject)
      .then(() => {
        notify({
          message: 'Subject created successfully',
          color: 'success',
        })
        getSubjects()
      })
      .catch((error) => {
        notify({
          message: 'Failed to create subject\n' + error.message,
          color: 'error',
        })
      })
  }
}
onMounted(() => {
  getSubjects()
})
</script>

<template>
  <h1 class="page-title font-bold">Subject</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton v-if="selectedItemsEmitted.length != 0" icon="delete" color="danger" @click="deleteSelectedSubject()">
          Delete</VaButton
        >
        <VaButton icon="add" @click="createNewSubject()">Subject</VaButton>
      </div>
      <SubjectTable
        v-model:selectedItemsEmitted="selectedItemsEmitted"
        :loading="loading"
        :subjects="subjects"
        @edit="editSubject"
        @delete="deleteSubject"
      />
    </VaCardContent>
  </VaCard>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowSubjectFormModal"
    size="small"
    stateful
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowSubjectFormModal = false"
  >
    <VaModalHeader>
      <h3 class="text-lg font-bold">{{ SubjectToEdit ? 'Edit' : 'Create' }} Subject</h3>
    </VaModalHeader>
    <EditSubjectForm
      ref="editFormRef"
      :subject="SubjectToEdit"
      :save-button-label="SubjectToEdit === null ? 'Add' : 'Save'"
      @close="cancel"
      @save="
        (subject: Subject) => {
          onSubjectSaved(subject)
          ok()
        }
      "
    />
  </VaModal>
</template>
