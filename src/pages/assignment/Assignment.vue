<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Assignment, EmptyAssignment } from './types'
import AssignmentTable from '@pages/assignment/widgets/AssignmentTable.vue'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useModal, useToast } from 'vuestic-ui'
import EditAssignmentForm from '@pages/assignment/widgets/EditAssignmentForm.vue'
import { notifications } from '@/services/utils'
import { useClassStore } from '@/stores/modules/class.module'
import { Classrooms } from '../classrooms/type'

const editFormRef = ref()
const loading = ref(true)
const { confirm } = useModal()
const { init: notify } = useToast()
const stores = useAssignmentStore()
const doShowAssignmentFormModal = ref(false)
const assignment = ref<Assignment | null>(null)
const classStores = useClassStore()
const assignmentsByClass = ref<Classrooms[]>([])

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})

const getAssignmentByClass = () => {
  loading.value = true
  // dataFilter.value.advancedSearch.fields = ['name']
  classStores
    .getClasses(dataFilter)
    .then((response) => {
      assignmentsByClass.value = response.data
      console.log('Response:', response)
      console.log('ClassAssignment:', assignmentsByClass.value)
      loading.value = false
    })
    .catch((error) => {
      loading.value = false
      notify({
        message: notifications.getFailed('class assignments') + error.message,
        color: 'error',
      })
    })
}

const createNewAssignment = () => {
  assignment.value = null
  doShowAssignmentFormModal.value = true
}

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

const onAssignmentSaved = async (assignment: Assignment) => {
  doShowAssignmentFormModal.value = false
  stores
    .createAssignment(assignment as EmptyAssignment)
    .then(() => {
      notify({
        message: notifications.createSuccessfully(assignment.name),
        color: 'success',
      })
      getAssignmentByClass()
    })
    .catch((error) => {
      notify({
        message: notifications.createFailed(assignment.name) + error.message,
        color: 'error',
      })
    })
}
onMounted(() => {
  getAssignmentByClass()
})
</script>

<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton icon="add" @click="createNewAssignment()">Assignment</VaButton>
      </div>
      <AssignmentTable :loading="loading" :assignments-by-class="assignmentsByClass" />
    </VaCardContent>
  </VaCard>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowAssignmentFormModal"
    stateful
    size="small"
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowAssignmentFormModal = false"
  >
    <h3 class="text-lg font-bold">Create Assignment</h3>
    <EditAssignmentForm
      ref="editFormRef"
      :assignment="assignment"
      :save-button-label="'Save'"
      @close="cancel"
      @save="
        (assignment: Assignment) => {
          onAssignmentSaved(assignment)
          ok()
        }
      "
    />
  </VaModal>
</template>
