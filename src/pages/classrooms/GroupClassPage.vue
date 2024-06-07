<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GroupClass } from './type'
import EditGroupClass from './widgets/EditGroupClass.vue'
import { useToast, useModal } from 'vuestic-ui'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import GroupClassCard from './widgets/GroupClassCard.vue'

const loading = ref(true)
const groupClassToEdit = ref<GroupClass | null>(null)
const doShowGroupClassFormModal = ref(false)
const store = useGroupClassStore()

const listGroupClass = ref<GroupClass[]>([])
function getGroupClasses() {
  loading.value = true
  store
    .getGroupClass()
    .then((res) => {
      listGroupClass.value = res
    })
    .finally(() => {
      loading.value = false
    })
  loading.value = false
}

const editGroupClass = (gc: GroupClass) => {
  groupClassToEdit.value = gc
  doShowGroupClassFormModal.value = true
}

const createNewGroupClass = () => {
  groupClassToEdit.value = null
  doShowGroupClassFormModal.value = true
}

const { init: notify } = useToast()

const onGroupClassSaved = async (gc: GroupClass) => {
  doShowGroupClassFormModal.value = false
  if ('id' in gc) {
    await store.update(gc.id, gc as GroupClass)
    notify({
      message: 'GroupClass updated',
      color: 'success',
    })
  } else {
    await store.add(gc as GroupClass)
    notify({
      message: 'GroupClass created',
      color: 'success',
    })
  }
  getGroupClasses()
}

const { confirm } = useModal()

const onProjectDeleted = async (gc: GroupClass) => {
  const response = await confirm({
    title: 'Delete GroupClass',
    message: `Are you sure you want to delete GroupClass "${gc.name}"?`,
    okText: 'Delete',
    size: 'small',
    maxWidth: '380px',
  })

  if (!response) {
    return
  }

  await store.remove(gc.id)
  notify({
    message: 'GroupClass deleted',
    color: 'success',
  })
  getGroupClasses()
}

const editFormRef = ref()

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

onMounted(() => {
  getGroupClasses()
})
</script>

<template>
  <h1 class="page-title">Group Class</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add" @click="createNewGroupClass">GroupClass</VaButton>
      </div>
      <GroupClassCard
        :group-classes="listGroupClass"
        :loading="loading"
        @edit="editGroupClass"
        @delete="onProjectDeleted"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowGroupClassFormModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 v-if="groupClassToEdit === null" class="va-h5 mb-4">Add Group Class</h1>
      <h1 v-else class="va-h5 mb-4">Edit Group Class</h1>
      <EditGroupClass
        ref="editFormRef"
        :group-class="groupClassToEdit ?? ({} as GroupClass)"
        :save-button-label="groupClassToEdit === null ? 'Add' : 'Save'"
        @close="cancel"
        @save="
          (gc: GroupClass) => {
            onGroupClassSaved(gc)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
