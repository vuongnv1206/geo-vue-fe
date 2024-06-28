<script setup lang="ts">
import { PropType, ref } from 'vue'
import { defineVaDataTableColumns, useModal, useToast } from 'vuestic-ui'
import { EmptyStudent, Student } from '../types'
import { notifications } from '@/services/utils'
import { useStudentStore } from '@/stores/modules/student.module'
import EditStudent from './EditStudent.vue'

const props = defineProps({
  students: {
    type: Array as PropType<Student[]>,
    required: true,
  },
})

const studentStore = useStudentStore()
// const loading = ref(true)
const { init: notify } = useToast()
const { confirm } = useModal()
const selectedItemsEmitted = ref<Student[]>([])
const studentToEdit = ref<Student | null>(null)
const doShowStudentFormModal = ref(false)
const editFormRef = ref()

const columns = defineVaDataTableColumns([
  { label: 'Student Code', key: 'studentCode', sortable: true },
  { label: 'First Name', key: 'firstName', sortable: true },
  { label: 'Last Name', key: 'lastName', sortable: true },
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Date of Birth', key: 'dob', sortable: true },
  { label: 'Gender', key: 'gender', sortable: true },
  { label: 'Phone Number', key: 'phoneNumber', sortable: true },
  { label: ' ', key: 'actions' },
])

const handleSelectionChange = (selectedItems: Student[]) => {
  selectedItemsEmitted.value = selectedItems
}

const deleteStudent = (student: Student) => {
  studentStore
    .deleteStudent(student.id)
    .then(() => {
      notify({
        message: notifications.deleteSuccessfully('student'),
        color: 'success',
      })
    })
    .catch((error) => {
      notify({
        message: notifications.deleteFailed('student') + error.message,
        color: 'error',
      })
    })
}

const deleteSelectedStudent = () => {
  confirm({
    title: 'Delete Student',
    message: notifications.confirmDelete(`${selectedItemsEmitted.value.length} students`),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    selectedItemsEmitted.value.forEach((student) => {
      deleteStudent(student)
    })
  })
}

const createNewStudent = () => {
  studentToEdit.value = null
  doShowStudentFormModal.value = true
}

const editStudent = (student: Student) => {
  studentToEdit.value = student
  doShowStudentFormModal.value = true
}
const deleteStudentWithConfirm = (student: Student) => {
  confirm({
    title: 'Delete Student',
    message: `Do you want to delete this student ?`,
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    deleteStudent(student)
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

const onStudentSaved = async (student: Student) => {
  doShowStudentFormModal.value = false
  console.log('student data: ', student)
  if (student.id) {
    studentStore
      .updateStudent(student.id, student as EmptyStudent)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully('student'),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.updatedSuccessfully('student') + error.message,
          color: 'error',
        })
      })
  } else {
    studentStore
      .createStudent(student as EmptyStudent)
      .then(() => {
        notify({
          message: notifications.createSuccessfully('student'),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed('student') + error.message,
          color: 'error',
        })
      })
  }
}
</script>

<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton v-if="selectedItemsEmitted.length != 0" icon="delete" color="danger" @click="deleteSelectedStudent()">
          Delete</VaButton
        >
        <VaButton icon="add" @click="createNewStudent()">Student</VaButton>
      </div>
      <VaDataTable
        hoverable
        clickable
        selectable
        :columns="columns"
        select-mode="multiple"
        :items="props.students"
        :disable-client-side-sorting="false"
        @selectionChange="handleSelectionChange($event.currentSelectedItems)"
        @delete="deleteStudentWithConfirm"
      >
        <template #cell(actions)="{ rowData }">
          <div class="flex gap-2 justify-end">
            <VaButton
              preset="primary"
              size="small"
              color="primary"
              icon="mso-edit"
              aria-label="Edit"
              @click="editStudent(rowData)"
            />
            <VaButton
              preset="primary"
              size="small"
              icon="mso-delete"
              color="danger"
              aria-label="Delete"
              @click="deleteStudent(rowData)"
            />
          </div>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowStudentFormModal"
    size="small"
    stateful
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowStudentFormModal = false"
  >
    <VaModalHeader>
      <h3 class="text-lg font-bold">{{ studentToEdit ? 'Edit' : 'Create' }} Student</h3>
    </VaModalHeader>
    <EditStudent
      ref="editFormRef"
      :student="studentToEdit"
      :save-button-label="studentToEdit === null ? 'Add' : 'Save'"
      @close="cancel"
      @save="
        (student: Student) => {
          onStudentSaved(student)
          ok()
        }
      "
    />
  </VaModal>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
