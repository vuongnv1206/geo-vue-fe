<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { defineVaDataTableColumns, useModal, useToast } from 'vuestic-ui'
import { ClassPermission, Classrooms, EmptyStudent, FailedStudentImport, Student } from '../types'
import { notifications, getErrorMessage, format } from '@/services/utils'
import { useStudentStore } from '@/stores/modules/student.module'
import EditStudent from './EditStudent.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  { label: t('students.code'), key: 'studentCode', sortable: true },
  { label: t('students.first_name'), key: 'firstName', sortable: true },
  { label: t('students.last_name'), key: 'lastName', sortable: true },
  { label: t('students.email'), key: 'email', sortable: true },
  { label: t('students.date_of_birth'), key: 'dateOfBirth', sortable: true },
  { label: t('students.gender'), key: 'gender', sortable: true },
  { label: t('students.phone_number'), key: 'phoneNumber', sortable: true },
  { label: ' ', key: 'actions' },
])

const createNewStudent = () => {
  studentToEdit.value = null
  doShowStudentFormModal.value = true
}

const editStudent = (student: Student) => {
  studentToEdit.value = student as Student
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

const deleteStudent = (student: Student) => {
  studentStore
    .deleteStudent(student.id)
    .then(() => {
      notify({
        message: notifications.deleteSuccessfully(student.firstName + ' ' + student.lastName),
        color: 'success',
      })
      emit('load')
    })
    .catch((error) => {
      notify({
        message: notifications.deleteFailed(student.firstName + ' ' + student.lastName) + getErrorMessage(error),
        color: 'error',
      })
    })
}

const deleteSelectedStudent = () => {
  confirm({
    title: t('students.delete_student'),
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
    title: t('students.delete_student'),
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

const getFormatFileImportStudent = () => {
  studentStore
    .getFormatFileImportStudent()
    .then((response) => {
      console.log('aaaa', response)
      // notify({
      //   message: notifications.downloadSuccess(),
      //   color: 'success',
      // })
      emit('load')
    })
    .catch((error) => {
      notify({
        message: notifications.downloadFailed() + getErrorMessage(error),
        color: 'error',
      })
    })
}

const getFailedFileImportStudent = (data: any) => {
  studentStore
    .getFailedFileImportStudent(data)
    .then(() => {
      emit('load')
    })
    .catch((error) => {
      notify({
        message: notifications.downloadFailed() + getErrorMessage(error),
        color: 'error',
      })
    })
}
const filesUploaded = ref<any>()

const uploadStudentFile = () => {
  studentStore
    .uploadStudentFile(filesUploaded.value[0], props.classroom.id)
    .then((response) => {
      // console.log('upload success', filesUploaded.value[0])
      console.log(response)
      if (response.length > 0) {
        notify({
          message: t('students.import_failed'),
          color: 'warning',
        })
        const requestFail: FailedStudentImport = {
          failedStudents: response.map((item: any) => ({
            studentRequest: {
              firstName: item.studentRequest.firstName,
              lastName: item.studentRequest.lastName,
              avatarUrl: item.studentRequest.avatarUrl,
              dateOfBirth: item.studentRequest.dateOfBirth,
              email: item.studentRequest.email,
              phoneNumber: item.studentRequest.phoneNumber,
              studentCode: item.studentRequest.studentCode,
              gender: item.studentRequest.gender,
              classesId: item.studentRequest.classesId,
            },
            errorMessage: item.errorMessage,
          })),
        }
        getFailedFileImportStudent(requestFail)
      } else {
        notify({
          message: notifications.uploadSuccess(),
          color: 'success',
        })
        emit('load')
      }
    })
    .catch((error) => {
      notify({
        message: notifications.uploadFailed() + getErrorMessage(error),
        color: 'error',
      })
    })
}

const canStudentManage = computed(() => {
  if (props.classroom.permissions === null || props.classroom.permissions === undefined) {
    return true
  }
  return props.classroom.permissions?.some((permission) => permission.permissionType === ClassPermission.ManageStudent)
})
</script>

<template>
  <VaCard>
    <VaCardTitle v-if="canStudentManage" class="flex flex-col md:flex-row gap-2 justify-end">
      <VaButton v-if="selectedItemsEmitted.length != 0" icon="delete" color="danger" @click="deleteSelectedStudent()">
        {{ t('settings.delete') }}
      </VaButton>
      <VaButton icon="add" @click="createNewStudent()">
        {{ t('students.student') }}
      </VaButton>
      <VaFileUpload v-model="filesUploaded" hide-file-list file-types=".xlsx,.xls" @fileAdded="uploadStudentFile" />

      <VaButton icon="download" @click="getFormatFileImportStudent()">
        {{ t('students.get_template') }}
      </VaButton>
    </VaCardTitle>
    <VaCardContent>
      <VaDataTable
        hoverable
        clickable
        :selectable="canStudentManage"
        :columns="columns"
        select-mode="multiple"
        :items="props.classroom.students || []"
        :disable-client-side-sorting="false"
        @selectionChange="handleSelectionChange($event.currentSelectedItems)"
      >
        <template #cell(gender)="{ rowData }">
          <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
            <div>{{ rowData.gender ? t('students.male') : t('students.female') }}</div>
          </div>
        </template>
        <template #cell(dateOfBirth)="{ rowData }">
          <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
            <div>{{ format.formatDate(rowData.dateOfBirth) }}</div>
          </div>
        </template>
        <template #cell(actions)="{ rowData: student }">
          <div v-if="canStudentManage" class="flex gap-2 justify-end">
            <VaButton
              preset="primary"
              size="small"
              color="primary"
              icon="mso-edit"
              :aria-label="t('settings.edit')"
              @click="editStudent(student as Student)"
            />
            <VaButton
              preset="primary"
              size="small"
              icon="mso-delete"
              color="danger"
              :aria-label="t('settings.delete')"
              @click="deleteStudentWithConfirm(student as Student)"
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
    <h3 class="text-lg font-bold">
      {{ studentToEdit ? $t('settings.edit') : $t('settings.create') }} {{ t('students.student') }}
    </h3>
    <EditStudent
      ref="editFormRef"
      :student="studentToEdit"
      :save-button-label="studentToEdit === null ? $t('settings.add') : $t('settings.save')"
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
