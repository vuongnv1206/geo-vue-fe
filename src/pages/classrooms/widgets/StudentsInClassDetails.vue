<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { DataTableItem, defineVaDataTableColumns, useModal, useToast } from 'vuestic-ui'
import { Classrooms, EmptyStudent, Student } from '../types'
import { notifications, getErrorMessage, format } from '@/services/utils'
import { useStudentStore } from '@/stores/modules/student.module'
import EditStudent from './EditStudent.vue'

const props = defineProps({
  classroom: {
    type: Object as PropType<Classrooms>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'load'): void
}>()

const editFormRef = ref()
const { confirm } = useModal()
const { init: notify } = useToast()
const studentStore = useStudentStore()
const doShowStudentFormModal = ref(false)
const selectedItemsEmitted = ref<Student[]>([])
const studentToEdit = ref<Student | null>(null)

const columns = defineVaDataTableColumns([
  { label: 'Student Code', key: 'studentCode', sortable: true },
  { label: 'First Name', key: 'firstName', sortable: true },
  { label: 'Last Name', key: 'lastName', sortable: true },
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Date of Birth', key: 'dateOfBirth', sortable: true },
  { label: 'Gender', key: 'gender', sortable: true },
  { label: 'Phone Number', key: 'phoneNumber', sortable: true },
  { label: ' ', key: 'actions' },
])

const createNewStudent = () => {
  studentToEdit.value = null
  doShowStudentFormModal.value = true
}

const editStudent = (rowData: DataTableItem) => {
  studentToEdit.value = rowData as Student
  doShowStudentFormModal.value = true
}

const handleSelectionChange = (selectedItems: Student[]) => {
  selectedItemsEmitted.value = selectedItems
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

const deleteStudent = (rowData: DataTableItem) => {
  studentStore
    .deleteStudent(rowData.id)
    .then(() => {
      notify({
        message: notifications.deleteSuccessfully(rowData.firstName + ' ' + rowData.lastName),
        color: 'success',
      })
      emit('load')
    })
    .catch((error) => {
      notify({
        message: notifications.deleteFailed(rowData.firstName + ' ' + rowData.lastName) + getErrorMessage(error),
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

const deleteStudentWithConfirm = (student: Student) => {
  confirm({
    title: 'Delete Student',
    message: notifications.confirmDelete(student.firstName + ' ' + student.lastName),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    deleteStudent(student)
  })
}

const onStudentSaved = async (student: Student) => {
  doShowStudentFormModal.value = false
  if (student.id) {
    studentStore
      .updateStudent(student.id, student as EmptyStudent)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(student.firstName + ' ' + student.lastName),
          color: 'success',
        })
        emit('load')
      })
      .catch((error) => {
        notify({
          message:
            notifications.updatedSuccessfully(student.firstName + ' ' + student.lastName) + getErrorMessage(error),
          color: 'error',
        })
      })
  } else {
    studentStore
      .createStudent(student as EmptyStudent)
      .then(() => {
        notify({
          message: notifications.createSuccessfully(student.firstName + ' ' + student.lastName),
          color: 'success',
        })
        emit('load')
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed(student.firstName + ' ' + student.lastName) + getErrorMessage(error),
          color: 'error',
        })
      })
  }
}

const canStudentManage = computed(() => {
  if (props.classroom.permissions === null || props.classroom.permissions === undefined) {
    return true
  }
  return props.classroom.permissions?.some((permission) => permission.permissionType === 3)
})
</script>

<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton v-if="selectedItemsEmitted.length != 0" icon="delete" color="danger" @click="deleteSelectedStudent()">
          Delete</VaButton
        >
        <VaButton :disabled="!canStudentManage" icon="add" @click="createNewStudent()">Student</VaButton>
      </div>
      <VaDataTable
        hoverable
        clickable
        selectable
        :columns="columns"
        select-mode="multiple"
        :items="props.classroom.students || []"
        :disable-client-side-sorting="false"
        @selectionChange="handleSelectionChange($event.currentSelectedItems)"
        @delete="deleteStudentWithConfirm"
      >
        <template #cell(dateOfBirth)="{ rowData }">
          <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
            <div>{{ format.formatDate(rowData.dateOfBirth) }}</div>
          </div>
        </template>
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
    <h3 class="text-lg font-bold">{{ studentToEdit ? 'Edit' : 'Create' }} Student</h3>
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
