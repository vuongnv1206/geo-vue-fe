<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Classrooms } from './type'
import { useClassStore } from '@/stores/modules/class.module'
import { useModal, useToast } from 'vuestic-ui'
import ClassTable from './widgets/ClassTable.vue'
import EditClass from './widgets/EditClass.vue'
const loading = ref(true)

const stores = useClassStore()

const classrooms = ref<Classrooms[]>([])
const classToEdit = ref<Classrooms | null>(null)
const doShowClassFormModal = ref(false)

const editClass = (classrooms: Classrooms) => {
  classToEdit.value = classrooms
  doShowClassFormModal.value = true
}

const createNewClass = () => {
  classToEdit.value = null
  doShowClassFormModal.value = true
}

const selectedItemsEmitted = ref<Classrooms[]>([])

function getClassByUser() {
  loading.value = true
  stores
    .getClassroomByUser()
    .then((res) => {
      classrooms.value = res
    })
    .catch(() => {
      notify({
        message: 'Failed to get class fails',
        color: 'error',
      })
    })
    .finally(() => {
      selectedItemsEmitted.value = []
      loading.value = false
    })
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

const onClassDelete = async (c: Classrooms) => {
  const response = await confirm({
    title: 'Delete Class',
    message: `Are you sure you want to delete Class "${c.name}"?`,
    okText: 'Delete',
    size: 'small',
    maxWidth: '380px',
  })

  if (!response) {
    return
  }

  await stores.deleteClassroom(c.id)
  notify({
    message: 'Class deleted',
    color: 'success',
  })
  getClassByUser()
}

const onClassSaved = async (classrooms: Classrooms) => {
  doShowClassFormModal.value = false
  if ('id' in classrooms) {
    stores
      .updateClassroom(classrooms.id, classrooms as Classrooms)
      .then(() => {
        notify({
          message: 'Class updated',
          color: 'success',
        })
        getClassByUser()
      })
      .catch((err) => {
        notify({
          message: 'Failed to update class\n' + err.message,
          color: 'error',
        })
      })
  } else {
    stores
      .addClassroom(classrooms as Classrooms)
      .then(() => {
        notify({
          message: 'Class created',
          color: 'success',
        })
        getClassByUser()
      })
      .catch((err) => {
        notify({
          message: 'Failed to create class\n' + err.message,
          color: 'error',
        })
      })
  }
}

onMounted(() => {
  getClassByUser()
})
</script>

<template>
  <h1 class="page-title font-bold">Class</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add" @click="createNewClass()">Class</VaButton>
      </div>
      <ClassTable :classrooms="classrooms" :loading="loading" @edit="editClass" @delete="onClassDelete" />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowClassFormModal"
    size="small"
    mobile-fullscreen
    close-button
    stateful
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 v-if="classToEdit === null" class="va-h5 mb-4">Add Class</h1>
    <h1 v-else class="va-h5 mb-4">Edit Class</h1>
    <EditClass
      ref="editFormRef"
      :classrooms="classToEdit ?? ({} as Classrooms)"
      :save-button-label="classToEdit === null ? 'Add' : 'Save'"
      @close="cancel"
      @save="
        (classrooms: Classrooms) => {
          onClassSaved(classrooms)
          ok()
        }
      "
    />
  </VaModal>
</template>
