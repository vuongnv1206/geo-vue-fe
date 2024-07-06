<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Classrooms, GroupClass } from './types'
import { useClassStore } from '@/stores/modules/class.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useModal, useToast } from 'vuestic-ui'
import EditClass from './widgets/EditClass.vue'
import EditGroupClass from './widgets/EditGroupClass.vue'
import { getErrorMessage, notifications } from '@/services/utils'
import SharedClass from './SharedClass.vue'

const loading = ref(true)
const editFormRef = ref()
const { confirm } = useModal()
const { init: notify } = useToast()
const filterClassList = ref(true)

const classStore = useClassStore()
const groupclassStore = useGroupClassStore()

const classrooms = ref<Classrooms[]>([])
const groupClasses = ref<GroupClass[]>([])

const classToEdit = ref<Classrooms | null>(null)
const groupClassToEdit = ref<GroupClass | null>(null)

const doShowClassFormModal = ref(false)
const doShowGroupClassFormModal = ref(false)

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

const getGroupClasses = (filter: typeof dataFilter.value) => {
  loading.value = true
  groupclassStore
    .getGroupClasses(filter)
    .then((response) => {
      groupClasses.value = response.data
      classrooms.value = response.data.flatMap((gc) => gc.classes)
      dataFilter.value = {
        ...dataFilter.value,
        pageNumber: response.currentPage,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
        pageSize: response.pageSize,
      }
      // console.log('Department: ', groupClasses.value)
      // console.log('Classrooms: ', classrooms.value)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('group class') + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const getClassById = (id: string) => classrooms.value.find((c) => c.id === id)
const getGroupClassById = (id: string) => groupClasses.value.find((gc) => gc.id === id)

const handlerSearch = (input: string) => {
  dataFilter.value.advancedSearch.keyword = input
  getGroupClasses(dataFilter.value)
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

const createNewClass = () => {
  classToEdit.value = null
  doShowClassFormModal.value = true
}

const editClass = (classrooms: Classrooms) => {
  classToEdit.value = classrooms
  doShowClassFormModal.value = true
}

const handleMenuClassClick = (option: any) => {
  if (option.text === 'Edit') {
    editClass(getClassById(option.value) as Classrooms)
  } else if (option.text === 'Delete') {
    deleteClass(getClassById(option.value) as Classrooms)
  }
}

const onClassSaved = async (classrooms: Classrooms) => {
  doShowClassFormModal.value = false
  if (classrooms.id) {
    classStore
      .updateClassroom(classrooms.id, classrooms as Classrooms)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(classrooms.name),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed(classrooms.name) + getErrorMessage(error),
          color: 'error',
        })
      })
  } else {
    classStore
      .addClassroom(classrooms as Classrooms)
      .then(() => {
        notify({
          message: notifications.createSuccessfully('class'),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed('class') + getErrorMessage(error),
          color: 'error',
        })
      })
  }
  getGroupClasses(dataFilter.value)
}

const deleteClass = (classroom: Classrooms) => {
  confirm({
    title: 'Delete Class',
    message: notifications.confirmDelete(classroom.name),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    classStore
      .deleteClassroom(classroom.id)
      .then(() => {
        notify({
          message: notifications.deleteSuccessfully(classroom.name),
          color: 'success',
        })
        getGroupClasses(dataFilter.value)
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed(classroom.name) + getErrorMessage(error),
          color: 'error',
        })
      })
  })
}

const createNewGroupClass = () => {
  groupClassToEdit.value = null
  doShowGroupClassFormModal.value = true
}

const editGroupClass = (gc: GroupClass) => {
  groupClassToEdit.value = gc
  doShowGroupClassFormModal.value = true
}

const handleMenuGroupClassClick = (option: any) => {
  if (option.text === 'Edit') {
    editGroupClass(getGroupClassById(option.value) as GroupClass)
  } else if (option.text === 'Delete') {
    deletedGroupClass(getGroupClassById(option.value) as GroupClass)
  }
}

const onGroupClassSaved = async (groupClass: GroupClass) => {
  doShowGroupClassFormModal.value = false
  if (groupClass.id) {
    await groupclassStore
      .updateGroupClass(groupClass.id, groupClass as GroupClass)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(groupClass.name),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed(groupClass.name) + getErrorMessage(error),
          color: 'error',
        })
      })
  } else {
    await groupclassStore
      .createGroupClass(groupClass as GroupClass)
      .then(() => {
        notify({
          message: notifications.createSuccessfully('Group class'),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed('Group class') + getErrorMessage(error),
          color: 'error',
        })
      })
  }
  getGroupClasses(dataFilter.value)
}

const deletedGroupClass = (groupClass: GroupClass) => {
  confirm({
    title: 'Delete GroupClass',
    message: notifications.confirmDelete(groupClass.name),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    groupclassStore
      .deleteGroupClass(groupClass.id)
      .then(() => {
        notify({
          message: notifications.deleteSuccessfully(groupClass.name),
          color: 'success',
        })
        getGroupClasses(dataFilter.value)
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed(groupClass.name) + getErrorMessage(error),
          color: 'error',
        })
      })
  })
}

onMounted(() => {
  getGroupClasses(dataFilter.value)
})
</script>

<template>
  <link rel="stylesheet" />
  <VaCard>
    <VaCard class="flex flex-col md:flex-row gap-2 p-2">
      <VaCard class="flex justify-start items-center flex-grow">
        <VaCard class="flex flex-grow">
          <VaInput
            v-model="dataFilter.advancedSearch.keyword"
            placeholder="Search group class name"
            class="flex-grow"
            @update:modelValue="handlerSearch"
          >
            <template #appendInner>
              <VaIcon color="secondary" class="material-icons">search</VaIcon>
            </template>
          </VaInput>
        </VaCard>
      </VaCard>
      <VaCard class="flex justify-end items-center">
        <VaCard class="flex gap-2">
          <VaButton icon="add" @click="createNewGroupClass()">Group Class</VaButton>
          <VaButton icon="add" @click="createNewClass()">Class</VaButton>
          <VaDropdown placement="bottom-end">
            <template #anchor>
              <VaButton icon="filter_alt" />
            </template>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="filterClassList ? 'check' : ''"
                @click="filterClassList = true"
                >My class</VaButton
              >
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="filterClassList ? '' : 'check'"
                @click="filterClassList = false"
              >
                Shared class
              </VaButton>
            </VaDropdownContent>
          </VaDropdown>
        </VaCard>
      </VaCard>
    </VaCard>

    <VaCard v-if="filterClassList && !loading">
      <VaCard v-if="groupClasses.length > 0" class="mt-5 p-2">
        <VaScrollContainer vertical>
          <VaAccordion class="max-W-sm" multiple>
            <VaCollapse
              v-for="groupClass in groupClasses"
              :key="groupClass.id"
              :header="groupClass.name"
              solid
              class="py-1 font-bold"
            >
              <template #header="{ value, attrs, iconAttrs, text }">
                <VaCard v-bind="attrs" class="w-full flex border-2 p-2 items-center">
                  <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" />
                  <VaCard class="flex justify-between items-center w-full">
                    <VaCard> {{ text }} </VaCard>
                    <VaMenu
                      :options="[
                        { text: 'Edit', value: groupClass.id, icon: 'edit' },
                        { text: 'Delete', value: groupClass.id, icon: 'delete' },
                      ]"
                      @selected="(v: any) => handleMenuGroupClassClick(v)"
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
              <VaCard class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                          @selected="(v: any) => handleMenuClassClick(v)"
                        >
                          <template #anchor>
                            <VaCard class="cursor-pointer text-gray-500 hover:text-gray-700" @click.stop>
                              <span class="material-symbols-outlined">more_horiz</span>
                            </VaCard>
                          </template>
                        </VaMenu>
                      </VaCard>
                      <VaCard class="flex flex-row justify-between items-center gap-2">
                        <VaCardContent class="text-sm">Member: {{ classItem.numberUserOfClass }}</VaCardContent>
                        <VaCardContent class="text-sm">Year: {{ classItem.schoolYear }}</VaCardContent>
                      </VaCard>
                    </VaCard>
                  </VaCard>
                </VaCard>
              </VaCard>
            </VaCollapse>
          </VaAccordion>
        </VaScrollContainer>
      </VaCard>
    </VaCard>
    <VaCard v-else>
      <SharedClass />
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
