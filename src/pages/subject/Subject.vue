<template>
  <VaCard>
    <VaCardContent class="min-h-[85vh]">
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton v-if="selectedItemsEmitted.length != 0" icon="delete" color="danger" @click="deleteSelectedSubject()">
          Delete
        </VaButton>
        <VaButton icon="add" @click="createNewSubject()">Subject</VaButton>
      </div>
      <VaScrollContainer class="max-h-[72vh]" vertical>
        <SubjectTable
          v-model:selectedItemsEmitted="selectedItemsEmitted"
          :loading="loading"
          :subjects="subjects"
          @edit="editSubject"
          @delete="deleteSubjectWithConfirm"
        />
      </VaScrollContainer>
      <div v-if="dataFilter.totalCount > 0" class="flex flex-row justify-between items-center mt-4">
        <p>Items from {{ startItemIndex }} to {{ endItemIndex }} of total {{ dataFilter.totalCount }}</p>
        <VaPagination
          v-model="dataFilter.pageNumber"
          gapped
          :visible-pages="3"
          buttons-preset="secondary"
          :pages="dataFilter.totalPages"
          @update:modelValue="handlePageChange"
        />
        <VaSelect
          v-model="dataFilter.pageSize"
          class="w-32"
          :options="[10, 25, 50, 100, 250]"
          @update:modelValue="handlePageSizeChange"
        />
      </div>
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
      <h3 class="text-lg font-bold">{{ subjectToEdit ? 'Edit' : 'Create' }} Subject</h3>
    </VaModalHeader>
    <EditSubjectForm
      ref="editFormRef"
      :subject="subjectToEdit"
      :save-button-label="subjectToEdit === null ? 'Add' : 'Save'"
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

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Subject, EmptySubject } from './types'
import SubjectTable from '@/pages/subject/widgets/SubjectTable.vue'
import { useSubjectStore } from '@/stores/modules/subject.module'
import { useModal, useToast, VaPagination, VaSelect } from 'vuestic-ui'
import EditSubjectForm from '@/pages/subject/widgets/EditSubjectForm.vue'
import { getErrorMessage, notifications } from '@/services/utils'

const loading = ref(true)
const stores = useSubjectStore()
const subjects = ref<Subject[]>([])
const selectedItemsEmitted = ref<Subject[]>([])
const subjectToEdit = ref<Subject | null>(null)
const doShowSubjectFormModal = ref(false)
const { init: notify } = useToast()
const editFormRef = ref()
const { confirm } = useModal()

const dataFilter = ref({
  advancedSearch: {
    fields: ['name'],
    keyword: '',
  },
  pageNumber: 1,
  totalPages: 1,
  totalCount: 1,
  pageSize: 10,
  orderBy: ['createdOn'],
})

const getSubjects = (filter: typeof dataFilter.value) => {
  loading.value = true
  stores
    .getSubjects(filter)
    .then((response) => {
      subjects.value = response.data
      dataFilter.value = {
        ...dataFilter.value,
        pageNumber: response.currentPage,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
        pageSize: response.pageSize,
      }
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('subject') + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const handlePageChange = (newPage: number) => {
  dataFilter.value.pageNumber = newPage
  getSubjects(dataFilter.value)
}

const handlePageSizeChange = (newPageSize: number) => {
  dataFilter.value.pageSize = newPageSize
  getSubjects(dataFilter.value)
}

const startItemIndex = computed(() => {
  return (dataFilter.value.pageNumber - 1) * dataFilter.value.pageSize + 1
})

const endItemIndex = computed(() => {
  return Math.min(dataFilter.value.pageNumber * dataFilter.value.pageSize, dataFilter.value.totalCount)
})

const createNewSubject = () => {
  subjectToEdit.value = null
  doShowSubjectFormModal.value = true
}

const editSubject = (subject: Subject) => {
  subjectToEdit.value = subject
  doShowSubjectFormModal.value = true
}

const onSubjectSaved = async (subject: Subject) => {
  doShowSubjectFormModal.value = false
  if (subject.id) {
    stores
      .updateSubject(subject.id, subject as EmptySubject)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(subject.name),
          color: 'success',
        })
        getSubjects(dataFilter.value)
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed(subject.name) + getErrorMessage(error),
          color: 'error',
        })
      })
  } else {
    stores
      .createSubject(subject as EmptySubject)
      .then(() => {
        notify({
          message: notifications.createSuccessfully(subject.name),
          color: 'success',
        })
        getSubjects(dataFilter.value)
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed(subject.name) + getErrorMessage(error),
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
        message: notifications.deleteSuccessfully(subject.name),
        color: 'success',
      })
      getSubjects(dataFilter.value)
    })
    .catch((error) => {
      notify({
        message: notifications.deleteFailed(subject.name) + getErrorMessage(error),
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
    message: notifications.confirmDelete(subject.name),
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
  getSubjects(dataFilter.value)
})
</script>
