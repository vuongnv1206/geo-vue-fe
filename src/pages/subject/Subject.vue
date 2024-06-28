<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Subject, EmptySubject } from './types'
import SubjectTable from '@/pages/subject/widgets/SubjectTable.vue'
import { useSubjectStore } from '@/stores/modules/subject.module'
import { useModal, useToast } from 'vuestic-ui'
import EditSubjectForm from '@/pages/subject/widgets/EditSubjectForm.vue'
import { notifications } from '@/services/utils'

const loading = ref(true)
const stores = useSubjectStore()
const subjects = ref<Subject[]>([])
const selectedItemsEmitted = ref<Subject[]>([])
const SubjectToEdit = ref<Subject | null>(null)
const doShowSubjectFormModal = ref(false)
const { init: notify } = useToast()
const editFormRef = ref()
const { confirm } = useModal()

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 10,
  orderBy: ['id'],
})

const getSubjects = () => {
  loading.value = true
  dataFilter.value.advancedSearch.fields = ['name']
  stores
    .getSubjects(dataFilter.value)
    .then((response) => {
      subjects.value = response.data
      // console.log('Subjects:', subjects.value)
      loading.value = false
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('subject') + error.message,
        color: 'error',
      })
      loading.value = false
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

const onSubjectSaved = async (subject: Subject) => {
  doShowSubjectFormModal.value = false
  if (subject.id != '') {
    stores
      .updateSubject(subject.id, subject as EmptySubject)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully('subject'),
          color: 'success',
        })
        getSubjects()
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed('subject') + error.message,
          color: 'error',
        })
      })
  } else {
    stores
      .createSubject(subject as EmptySubject)
      .then(() => {
        notify({
          message: notifications.createSuccessfully('subject'),
          color: 'success',
        })
        getSubjects()
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed('subject') + error.message,
          color: 'error',
        })
      })
  }
}

const deleteSubject = (subject: Subject) => {
  stores
    .deleteSubject(subject.id)
    .then(() => {
      notify({
        message: notifications.deleteSuccessfully('subject'),
        color: 'success',
      })
      getSubjects()
    })
    .catch((error) => {
      notify({
        message: notifications.deleteFailed('subject') + error.message,
        color: 'error',
      })
    })
}

const deleteSelectedSubject = () => {
  confirm({
    title: 'Delete Subject',
    message: notifications.confirmDelete(`${selectedItemsEmitted.value.length} subjects`),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    selectedItemsEmitted.value.forEach((subject) => {
      deleteSubject(subject)
    })
  })
}

const deleteSubjectWithConfirm = (subject: Subject) => {
  confirm({
    title: 'Delete Subject',
    message: notifications.confirmDelete('subject'),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    deleteSubject(subject)
  })
}

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: notifications.unsavedChanges,
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

onMounted(() => {
  getSubjects()
})
</script>

<template>
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
        @delete="deleteSubjectWithConfirm"
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
