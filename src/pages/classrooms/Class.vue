<script lang="ts" setup>
import { onMounted, ref, PropType } from 'vue'
import { Classrooms, GroupClass } from './type'
import { useClassStore } from '@/stores/modules/class.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useModal, useToast } from 'vuestic-ui'
import EditClass from './widgets/EditClass.vue'
import EditGroupClass from './widgets/EditGroupClass.vue'

const loading = ref(true)
const stores = useClassStore()
const classrooms = ref<Classrooms[]>([])
const classToEdit = ref<Classrooms | null>(null)
const doShowClassFormModal = ref(false)
const searchTerm = ref<string>('')

const editClass = (classrooms: Classrooms) => {
  classToEdit.value = classrooms
  doShowClassFormModal.value = true
}

const createNewClass = () => {
  classToEdit.value = null
  doShowClassFormModal.value = true
}

const groupClassToEdit = ref<GroupClass | null>(null)
const doShowGroupClassFormModal = ref(false)
const store = useGroupClassStore()
const listGroupClass = ref<GroupClass[]>([])
const getGroupClassById = (id: string) => listGroupClass.value.find((gc) => gc.id === id)
const getClassById = (id: string) => classrooms.value.find((c) => c.id === id)
const expandedGroupClasses = ref<string[]>([])

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

const toggleGroupClass = (groupId: string) => {
  if (expandedGroupClasses.value.includes(groupId)) {
    expandedGroupClasses.value = expandedGroupClasses.value.filter((id) => id !== groupId)
  } else {
    expandedGroupClasses.value.push(groupId)
  }
}

const editGroupClass = (gc: GroupClass) => {
  groupClassToEdit.value = gc
  doShowGroupClassFormModal.value = true
}

// const createNewGroupClass = () => {
//   groupClassToEdit.value = null
//   doShowGroupClassFormModal.value = true
// }

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
      console.log('Class: ', classrooms.value)
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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  <div class="header-container">
    <h2 class="page-title font-bold">Class</h2>
    <VaButton style="padding: 0.5rem 0.8rem; margin: 0; line-height: 1" icon="add" @click="createNewClass()"
      >Class</VaButton
    >
  </div>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
      </div>
      <div style="display: flex; align-items: center">
        <VaInput v-model="searchTerm" placeholder="Search..." style="margin-right: 10px" />
      </div>
      <div v-if="listGroupClass.length > 0" style="margin-top: 20px">
        <ul class="font-bold">
          <li v-for="groupClass in listGroupClass" :key="groupClass.id" class="group-class">
            <div class="group-class-container">
              <div class="group-class-header" @click="toggleGroupClass(groupClass.id)">
                <i
                  :class="expandedGroupClasses.includes(groupClass.id) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                  style="margin-left: 10px"
                ></i>
                <span style="margin-left: 10px">
                  {{ groupClass.name }}
                </span>
              </div>
              <div>
                <VaMenu
                  :options="[
                    { text: 'Edit', value: groupClass.id, icon: 'edit' },
                    { text: 'Delete', value: groupClass.id, icon: 'delete' },
                  ]"
                  @selected="(v) => handleMenuGroupClassClick(v)"
                >
                  <template #anchor>
                    <div class="group-class-more">
                      <span class="material-symbols-outlined more-vert-icon">more_vert</span>
                    </div>
                  </template>
                </VaMenu>
              </div>
            </div>
            <ul v-if="expandedGroupClasses.includes(groupClass.id)" class="class-grid">
              <li
                v-for="classItem in groupClass.classes"
                :key="classItem.id"
                class="class-card"
                style="margin-left: 20px"
              >
                <VaCard color="primary" gradient class="card">
                  <div class="card-header">
                    <VaCardTitle style="font-size: 15px">{{ classItem.name }}</VaCardTitle>
                    <VaMenu
                      :options="[
                        { text: 'Edit', value: classItem.id, icon: 'edit' },
                        { text: 'Delete', value: classItem.id, icon: 'delete' },
                      ]"
                      @selected="(v) => handleMenuClassClick(v)"
                    >
                      <template #anchor>
                        <div class="group-class-more">
                          <span class="material-symbols-outlined more-horiz-icon">more_horiz</span>
                        </div>
                      </template>
                    </VaMenu>
                  </div>
                  <VaCardContent style="font-size: 14px">{{ classItem.schoolYear }}</VaCardContent>
                </VaCard>
              </li>
            </ul>
          </li>
        </ul>
      </div>
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

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.header-container .page-title {
  margin: 0;
  flex: 1; /* Allow the title to take available space */
}

.group-class {
  margin-bottom: 20px;
}

.group-class-container {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Spread items across the available space */
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.group-class-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px 0;
  flex: 1; /* Allow the header to take available space */
}

.group-class-header i {
  margin-left: 10px;
}

.group-class-header span {
  margin-left: 10px;
}

.group-class-more {
  cursor: pointer;
  margin-left: 10px;
  margin-top: 5px;
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding: 10px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more-horiz-icon {
  cursor: pointer;
  margin-left: 10px;
  margin-right: 20px;
}

.more-vert-icon {
  cursor: pointer;
  margin-bottom: 4px;
}

@media (max-width: 1200px) {
  .class-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .class-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .class-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .class-grid {
    grid-template-columns: 1fr;
  }

  .more-horiz-icon {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
