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
          <VaButton icon="add" @click="createNewGroupClass()">{{ $t('groupClasses.group_class') }}</VaButton>
          <VaButton icon="add" @click="createNewClass()">{{ $t('classes.class') }}</VaButton>
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
                :icon="dataFilter.queryType === ClassroomQueryType.All ? 'check' : ''"
                @click="filterClassHandle(ClassroomQueryType.All)"
              >
                {{ $t('classes.all_class') }}
              </VaButton>
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="dataFilter.queryType === ClassroomQueryType.MyClass ? 'check' : ''"
                @click="filterClassHandle(ClassroomQueryType.MyClass)"
              >
                {{ $t('classes.my_class') }}
              </VaButton>
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="dataFilter.queryType === ClassroomQueryType.SharedClass ? 'check' : ''"
                @click="filterClassHandle(ClassroomQueryType.SharedClass)"
              >
                {{ $t('classes.share_class') }}
              </VaButton>
            </VaDropdownContent>
          </VaDropdown>
        </VaCard>
      </VaCard>
    </VaCard>

    <VaCard v-if="!loading">
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
                      v-if="currentUser == groupClass.createdBy"
                      :options="[
                        { text: t('settings.edit'), value: groupClass.id, icon: 'edit' },
                        { text: t('settings.delete'), value: groupClass.id, icon: 'delete' },
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
                    class="border rounded-lg overflow-hidden"
                  >
                    <VaCard class="p-2">
                      <VaCard class="flex flex-row justify-between items-center">
                        <VaCardContent class="text-md font-bold flex-grow">{{ classItem.name }}</VaCardContent>
                        <VaMenu
                          v-if="currentUser == groupClass.createdBy"
                          :options="[
                            { text: t('settings.edit'), value: classItem.id, icon: 'edit' },
                            { text: t('settings.delete'), value: classItem.id, icon: 'delete' },
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
                      <VaCardContent class="flex flex-row justify-between items-center font-semibold">
                        <p class="text-sx">{{ $t('classes.students') }}: {{ classItem.numberUserOfClass }}</p>
                        <p class="text-sx">
                          {{ $t('classes.school_year') }}: {{ classItem.schoolYear }} -
                          {{ Number(classItem.schoolYear) + 1 }}
                        </p>
                      </VaCardContent>
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
    <VaModalHeader>
      <h3 class="text-lg font-bold">
        {{ classToEdit ? $t('settings.edit') : $t('settings.create') }} {{ $t('classes.class_2') }}
      </h3>
    </VaModalHeader>
    <EditClass
      ref="editFormRef"
      :classrooms="classToEdit ?? ({} as Classrooms)"
      :save-button-label="classToEdit === null ? $t('settings.add') : $t('settings.save')"
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
    <VaModalHeader>
      <h3 class="text-lg font-bold">
        {{ groupClassToEdit ? $t('settings.edit') : $t('settings.create') }} {{ $t('groupClasses.group_class_2') }}
      </h3>
    </VaModalHeader>
    <EditGroupClass
      ref="editFormRef"
      :group-class="groupClassToEdit ?? ({} as GroupClass)"
      :save-button-label="groupClassToEdit === null ? $t('settings.add') : $t('settings.save')"
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

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ClassroomQueryType, Classrooms, GroupClass } from './types'
import { useClassStore } from '@/stores/modules/class.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useModal, useToast, VaCardContent } from 'vuestic-ui'
import EditClass from './widgets/EditClass.vue'
import EditGroupClass from './widgets/EditGroupClass.vue'
import { getErrorMessage, notifications } from '@/services/utils'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/modules/auth.module'

const { t } = useI18n()
const loading = ref(true)
const editFormRef = ref()
const { confirm } = useModal()
const { init: notify } = useToast()

const classStore = useClassStore()
const groupclassStore = useGroupClassStore()
const authStore = useAuthStore()
const classrooms = ref<Classrooms[]>([])
const groupClasses = ref<GroupClass[]>([])

const classToEdit = ref<Classrooms | null>(null)
const groupClassToEdit = ref<GroupClass | null>(null)

const doShowClassFormModal = ref(false)
const doShowGroupClassFormModal = ref(false)

const currentUser = authStore.user?.id

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
  queryType: ClassroomQueryType.All,
})

const filterClassHandle = (filterType: ClassroomQueryType) => {
  dataFilter.value.queryType = filterType
  getGroupClasses(dataFilter.value)
}

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
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('groupClasses.group_class')) + getErrorMessage(error),
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
  if (option.text === t('settings.edit')) {
    editClass(getClassById(option.value) as Classrooms)
  } else if (option.text === t('settings.delete')) {
    deleteClass(getClassById(option.value) as Classrooms)
  }
}

const onClassSaved = async (classrooms: Classrooms) => {
  doShowClassFormModal.value = false
  if (classrooms.id) {
    classStore
      .updateClassroom(classrooms.id, classrooms as Classrooms)
      .then(() => {
        getGroupClasses(dataFilter.value)
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
        getGroupClasses(dataFilter.value)
        notify({
          message: notifications.createSuccessfully(t('classes.class')),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed(t('classes.class')) + getErrorMessage(error),
          color: 'error',
        })
      })
  }
}

const deleteClass = (classroom: Classrooms) => {
  confirm({
    title: t('classes.edit_class'),
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
  if (option.text === t('settings.edit')) {
    editGroupClass(getGroupClassById(option.value) as GroupClass)
  } else if (option.text === t('settings.delete')) {
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
          message: notifications.createSuccessfully(t('groupClasses.group_class')),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed(t('groupClasses.group_class')) + getErrorMessage(error),
          color: 'error',
        })
      })
  }
  getGroupClasses(dataFilter.value)
}

const deletedGroupClass = (groupClass: GroupClass) => {
  confirm({
    title: t('groupClasses.delete_group_class'),
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
