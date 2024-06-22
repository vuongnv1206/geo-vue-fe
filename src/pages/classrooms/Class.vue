<script lang="ts" setup>
import { onMounted, ref, PropType } from 'vue'
import { Classrooms, GroupClass } from './type'
import { useClassStore } from '@/stores/modules/class.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useModal, useToast, VaCard } from 'vuestic-ui'
import EditClass from './widgets/EditClass.vue'
import EditGroupClass from './widgets/EditGroupClass.vue'

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
const createNewGroupClass = () => {
  groupClassToEdit.value = null
  doShowGroupClassFormModal.value = true
}

const groupClassToEdit = ref<GroupClass | null>(null)
const doShowGroupClassFormModal = ref(false)
const store = useGroupClassStore()
const listGroupClass = ref<GroupClass[]>([])
const getGroupClassById = (id: string) => listGroupClass.value.find((gc) => gc.id === id)
const getClassById = (id: string) => classrooms.value.find((c) => c.id === id)

const selectedItemsEmitted = defineModel('selectedItemsEmitted', {
  type: Array as PropType<GroupClass[]>,
  default: [],
})

function getGroupClasses() {
  loading.value = true
  store
    .getGroupClass()
    .then((res) => {
      listGroupClass.value = res
      console.log('Department: ', listGroupClass.value)
    })
    .finally(() => {
      loading.value = false
    })
}
const editGroupClass = (gc: GroupClass) => {
  groupClassToEdit.value = gc
  doShowGroupClassFormModal.value = true
}

const handleMenuGroupClassClick = (option: any) => {
  if (option.text === 'Edit') {
    editGroupClass(getGroupClassById(option.value) as GroupClass)
  } else if (option.text === 'Delete') {
    onGroupClassDeleted(getGroupClassById(option.value) as GroupClass)
  }
}

const handleMenuClassClick = (option: any) => {
  if (option.text === 'Edit') {
    editClass(getClassById(option.value) as Classrooms)
  } else if (option.text === 'Delete') {
    onClassDelete(getClassById(option.value) as Classrooms)
  }
}

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

const onGroupClassDeleted = async (gc: GroupClass) => {
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
    message: 'Class deleted successfully',
    color: 'success',
  })
  getGroupClasses()
}

const onClassSaved = async (classrooms: Classrooms) => {
  doShowClassFormModal.value = false
  if ('id' in classrooms) {
    stores
      .updateClassroom(classrooms.id, classrooms as Classrooms)
      .then(() => {
        notify({
          message: 'Class updated successfully',
          color: 'success',
        })
        getGroupClasses()
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
          message: 'Class created successfully',
          color: 'success',
        })
        getGroupClasses()
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
  getGroupClasses()
  getClassByUser()
})
</script>
<template>
  <link rel="stylesheet" />
  <VaCard>
    <VaCard class="flex flex-col md:flex-row gap-2 p-2">
      <VaCard class="flex justify-start items-center flex-grow">
        <VaCard class="flex flex-grow">
          <VaInput placeholder="Search" class="flex-grow">
            <template #appendInner>
              <VaIcon color="secondary" class="material-icons">search</VaIcon>
            </template>
          </VaInput>
        </VaCard>
      </VaCard>
      <VaCard class="flex justify-end items-center">
        <VaCard class="flex gap-2">
          <VaButton icon="add" @click="createNewGroupClass()">Group Class</VaButton>
          <VaButton icon="add" class="mr-2" @click="createNewClass()">Class</VaButton>
        </VaCard>
      </VaCard>
    </VaCard>

    <VaCard>
      <VaCard v-if="listGroupClass.length > 0" class="mt-5 p-2">
        <VaScrollContainer vertical>
          <VaAccordion class="max-W-sm" multiple>
            <VaCollapse
              v-for="groupClass in listGroupClass"
              :key="groupClass.id"
              :header="groupClass.name"
              solids
              class="py-1"
            >
              <template #header="{ value, attrs, iconAttrs, text }">
                <VaCard v-bind="attrs" class="w-full flex border-2 p-2">
                  <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" />
                  <VaCard class="flex justify-between items-center w-full">
                    <VaCard> {{ text }} </VaCard>
                    <VaMenu
                      :options="[
                        { text: 'Edit', value: groupClass.id, icon: 'edit' },
                        { text: 'Delete', value: groupClass.id, icon: 'delete' },
                      ]"
                      @selected="(v) => handleMenuGroupClassClick(v)"
                    >
                      <template #anchor>
                        <VaCard class="cursor-pointer text-gray-500 hover:text-gray-700" @click.stop>
                          <span class="material-symbols-outlined">more_horiz</span>
                        </VaCard>
                      </template>
                    </VaMenu>
                  </VaCard>
                </VaCard>
              </template>
              <VaCard class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <VaCard v-for="classItem in groupClass.classes" :key="classItem.id">
                  <VaCard
                    color="primary"
                    gradient
                    :to="{ name: 'class-details', params: { id: classItem.id } }"
                    class="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <VaCard class="p-4">
                      <VaCard class="flex justify-between items-center mb-2">
                        <VaCardTitle class="text-lg font-bold flex-grow">{{ classItem.name }}</VaCardTitle>
                        <VaMenu
                          :options="[
                            { text: 'Edit', value: classItem.id, icon: 'edit' },
                            { text: 'Delete', value: classItem.id, icon: 'delete' },
                          ]"
                          @selected="(v) => handleMenuClassClick(v)"
                        >
                          <template #anchor>
                            <VaCard class="cursor-pointer text-gray-500 hover:text-gray-700" @click.stop>
                              <span class="material-symbols-outlined">more_horiz</span>
                            </VaCard>
                          </template>
                        </VaMenu>
                      </VaCard>
                      <VaCardContent class="text-sm text-gray-600">{{ classItem.schoolYear }}</VaCardContent>
                    </VaCard>
                  </VaCard>
                </VaCard>
              </VaCard>
            </VaCollapse>
          </VaAccordion>
        </VaScrollContainer>
      </VaCard>
    </VaCard>
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
</template>

<style scoped></style>
