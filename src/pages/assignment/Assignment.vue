<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Assignment, EmptyAssignment } from './types'
import AssignmentTable from './widgets/AssignmentTable.vue'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useModal, useToast } from 'vuestic-ui'
import EditAssignmentForm from './widgets/EditAssignmentForm.vue'

const stores = useAssignmentStore()
const assignments = ref<Assignment[]>([])
// const currentAssignmentId = ref<string>('')
const selectedItemsEmitted = ref<Assignment[]>([])
const AssignmentToEdit = ref<Assignment | null>(null)
const doShowAssignmentFormModal = ref(false)
const { init: notify } = useToast()
const editFormRef = ref()
const { confirm } = useModal()

const getAssignments = () => {
  stores
    .getAssignments()
    .then((response) => {
      assignments.value = response.data
    })
    .catch((error) => {
      console.log('Error:', error)
    })
}

const deleteAssignment = (assignment: Assignment) => {
  console.log('deleteSelectedAssignment', assignment)
  stores
    .deleteAssignment(assignment.id)
    .then(() => {
      notify({
        message: 'Assignment deleted successfully',
        color: 'success',
      })
      getAssignments()
    })
    .catch((error) => {
      notify({
        message: 'Failed to delete assignment\n' + error.message,
        color: 'error',
      })
    })
}

const deleteSelectedAssignment = () => {
  selectedItemsEmitted.value.forEach((assignment) => {
    deleteAssignment(assignment)
  })
}

const createNewAssignment = () => {
  AssignmentToEdit.value = null
  doShowAssignmentFormModal.value = true
}

const editAssignment = (assignment: Assignment) => {
  AssignmentToEdit.value = assignment
  doShowAssignmentFormModal.value = true
}

// const selectedAssignment = (assignment: Assignment) => {
//   currentAssignmentId.value = assignment.id
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

const onAssignmentSaved = async (assignment: Assignment) => {
  doShowAssignmentFormModal.value = false
  if (assignment.id != '') {
    stores
      .updateAssignment(assignment.id, assignment as EmptyAssignment)
      .then(() => {
        notify({
          message: 'Assignment updated successfully',
          color: 'success',
        })
        getAssignments()
      })
      .catch((error) => {
        notify({
          message: 'Failed to update assignment\n' + error.message,
          color: 'error',
        })
      })
  } else {
    stores
      .createAssignment(assignment as EmptyAssignment)
      .then(() => {
        notify({
          message: 'Assignment created successfully',
          color: 'success',
        })
        getAssignments()
      })
      .catch((error) => {
        notify({
          message: 'Failed to create assignment\n' + error.message,
          color: 'error',
        })
      })
  }
}
onMounted(() => {
  getAssignments()
})
</script>

<template>
  <h1 class="page-title font-bold">Assignment</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton
          v-if="selectedItemsEmitted.length != 0"
          icon="delete"
          color="danger"
          @click="deleteSelectedAssignment()"
        >
          Delete</VaButton
        >
        <VaButton icon="add" @click="createNewAssignment()">Assignment</VaButton>
      </div>
      <AssignmentTable
        v-model:selectedItemsEmitted="selectedItemsEmitted"
        :assignments="assignments"
        @edit="editAssignment"
        @delete="deleteAssignment"
      />
    </VaCardContent>
  </VaCard>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowAssignmentFormModal"
    size="small"
    stateful
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowAssignmentFormModal = false"
  >
    <h3 class="text-lg font-bold">{{ AssignmentToEdit ? 'Edit' : 'Create' }} Assignment</h3>
    <EditAssignmentForm
      ref="editFormRef"
      :assignment="AssignmentToEdit"
      :save-button-label="AssignmentToEdit === null ? 'Add' : 'Save'"
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
