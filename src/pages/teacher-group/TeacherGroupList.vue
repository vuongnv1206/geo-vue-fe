<script lang="ts" setup>
// const loading = ref(true)
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { ref, onMounted, computed } from 'vue'
import { GroupTeacher, TeacherTeam } from './types'
import { getErrorMessage, notifications } from '@/services/utils'
import { useModal, useToast } from 'vuestic-ui'
import TeacherGroupModal from './TeacherGroupModal.vue'
import TeacherTeamModal from './TeacherTeamModal.vue'

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})
const stores = useGroupTeacherStore()
const { init: notify } = useToast()
const groupTeachers = ref<GroupTeacher[]>([])
const teacherTeams = ref<TeacherTeam[]>([])
const loading = ref(true)

const doShowGroupEditModal = ref(false)
const doShowTeacherEditModal = ref(false)

const modalToGroupEdit = ref<GroupTeacher | null>(null)
const modalToTeacherEdit = ref<TeacherTeam | null>(null)

const editFormRef = ref()
const { confirm } = useModal()
const titleModal = ref<string>()

const emit = defineEmits(['select-group', 'select-teacher'])

const selectGroup = (group: GroupTeacher) => {
  emit('select-group', group)
}

const detailTeacherInTeam = (teacherId: string) => {
  emit('select-teacher', teacherId)
}

const getTeacherGroups = () => {
  loading.value = true
  dataFilter.value.advancedSearch.fields = ['name']
  stores
    .getGroupTeachers(dataFilter.value)
    .then((res) => {
      groupTeachers.value = res.data
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('group teacher') + getErrorMessage(error),
        color: 'danger',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const getTeacherTeams = () => {
  loading.value = true
  dataFilter.value.advancedSearch.fields = ['phone', 'teacherName']
  stores
    .getTeacherTeams(dataFilter.value)
    .then((res) => {
      teacherTeams.value = res.data
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('teacher team') + getErrorMessage(error),
        color: 'danger',
      })
    })
    .finally(() => {
      loading.value = false
    })
}
const onGroupSaved = async (group: GroupTeacher) => {
  if (modalToGroupEdit.value) {
    await stores
      .updateGroupTeacher(group.id, group)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(group.name),
          color: 'success',
        })
        getTeacherGroups()
        getTeacherTeams()
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed(group.name) + getErrorMessage(error),
          color: 'danger',
        })
      })
  } else {
    await stores
      .addGroup(group)
      .then(() => {
        notify({
          message: notifications.createSuccessfully(group.name),
          color: 'success',
        })
        getTeacherGroups()
        getTeacherTeams()
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed(group.name) + getErrorMessage(error),
          color: 'danger',
        })
      })
  }
}

const onTeacherSaved = async (teacher: TeacherTeam) => {
  if (modalToTeacherEdit.value) {
    await stores
      .updateTeacherInTeam(teacher.id, teacher)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(teacher.teacherName),
          color: 'success',
        })
        getTeacherGroups()
        getTeacherTeams()
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed(teacher.teacherName) + getErrorMessage(error),
          color: 'danger',
        })
      })
  } else {
    await stores
      .addTeacherIntoTeam(teacher)
      .then(() => {
        notify({
          message: notifications.createSuccessfully(teacher.teacherName),
          color: 'success',
        })
        getTeacherGroups()
        getTeacherTeams()
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed(teacher.teacherName) + getErrorMessage(error),
          color: 'danger',
        })
      })
  }
}

const showAddGroupModal = (title: string) => {
  modalToGroupEdit.value = null
  doShowGroupEditModal.value = true
  titleModal.value = title
}

const showAddTeacherModal = (title: string) => {
  modalToTeacherEdit.value = null
  doShowTeacherEditModal.value = true
  titleModal.value = title
}

const currentType = computed(() => {
  return titleModal.value === 'Teacher' ? modalToTeacherEdit.value : modalToGroupEdit.value
})

const saveButtonLabel = computed(() => {
  return titleModal.value === 'Teacher'
    ? modalToTeacherEdit.value
      ? 'Save'
      : 'Add'
    : modalToGroupEdit.value
      ? 'Save'
      : 'Add'
})

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
const showEditGroupModal = (group: GroupTeacher) => {
  modalToGroupEdit.value = group
  doShowGroupEditModal.value = true
  titleModal.value = 'Group'
}

const showEditTeacherModal = (teacher: TeacherTeam) => {
  modalToTeacherEdit.value = teacher
  doShowTeacherEditModal.value = true
  titleModal.value = 'Teacher'
}

const confirmDeleteGroupModal = async (groupId: string, groupName: string) => {
  const result = await confirm({
    message: notifications.confirmDelete(groupName),
    title: 'Delete Group',
    okText: 'Confirm',
    size: 'small',
  })

  if (result) {
    stores
      .deleteGroupTeacher(groupId)
      .then(() => {
        notify({
          message: notifications.deleteSuccessfully(groupName),
          color: 'success',
        })
        getTeacherGroups()
        getTeacherTeams()
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed(groupName) + getErrorMessage(error),
          color: 'danger',
        })
      })
  }
}
const confirmDeleteTeacherInTeam = async (teacherId: string, teacherName: string) => {
  const result = await confirm({
    message: notifications.confirmDelete(teacherName),
    title: 'Delete Teacher',
    okText: 'Confirm',
    size: 'small',
  })

  if (result) {
    stores
      .deleteTeacherInTeam(teacherId)
      .then(() => {
        notify({
          message: notifications.deleteSuccessfully(teacherName),
          color: 'success',
        })
        getTeacherGroups()
        getTeacherTeams()
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed(teacherName) + getErrorMessage(error),
          color: 'danger',
        })
      })
  }
}

onMounted(() => {
  getTeacherGroups()
  getTeacherTeams()
})

const handlerSearch = (event: Event) => {
  const input = event.target as HTMLInputElement
  dataFilter.value.advancedSearch.keyword = input.value
  getTeacherGroups()
  getTeacherTeams()
}
</script>

<template>
  <VaCard>
    <VaCardTitle>
      <div class="flex gap-1">
        <div class="flex-grow">
          <VaInput class="" placeholder="Search name, phone or email" @input="handlerSearch">
            <template #appendInner>
              <VaIcon color="secondary" class="material-icons"> search </VaIcon>
            </template>
          </VaInput>
        </div>
        <div class="">
          <VaDropdown placement="bottom-end">
            <template #anchor>
              <VaButton icon="add" />
            </template>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                @click="showAddTeacherModal('Teacher')"
              >
                New teacher
              </VaButton>
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                @click="showAddGroupModal('Group')"
              >
                New teacher group
              </VaButton>
            </VaDropdownContent>
          </VaDropdown>
        </div>
        <VaModal
          v-slot="{ cancel, ok }"
          v-model="doShowGroupEditModal"
          size="small"
          mobile-fullscreen
          close-button
          hide-default-actions
          :before-cancel="beforeEditFormModalClose"
        >
          <h3 class="va-text-bold">{{ modalToGroupEdit ? 'Edit ' : 'Add ' }} {{ titleModal }}</h3>
          <TeacherGroupModal
            ref="editFormRef"
            :group-teacher="modalToGroupEdit"
            :user="currentType"
            :save-button-label="saveButtonLabel"
            @close="cancel"
            @save="
              (data: GroupTeacher) => {
                onGroupSaved(data)
                ok()
              }
            "
          />
        </VaModal>
        <VaModal
          v-slot="{ cancel, ok }"
          v-model="doShowTeacherEditModal"
          size="small"
          mobile-fullscreen
          close-button
          hide-default-actions
          :before-cancel="beforeEditFormModalClose"
        >
          <h3 class="va-text-bold">{{ modalToTeacherEdit ? 'Edit ' : 'Add ' }} {{ titleModal }}</h3>
          <TeacherTeamModal
            ref="editFormRef"
            :user="currentType"
            :teacher-team="modalToTeacherEdit"
            :save-button-label="saveButtonLabel"
            @close="cancel"
            @save="
              (data: TeacherTeam) => {
                onTeacherSaved(data)
                ok()
              }
            "
          />
        </VaModal>
      </div>
      <VaDivider class="m-0" />
    </VaCardTitle>
    <VaDivider class="m-0" />
    <VaCardContent>
      <VaInnerLoading :loading="loading">
        <VaScrollContainer vertical>
          <VaList class="mb-2 max-h-[60vh]">
            <VaListItem
              v-for="group in groupTeachers"
              :key="group.id"
              class="list__item cursor-pointer"
              @click="selectGroup(group)"
            >
              <VaListItemSection avatar class="justify-center">
                <VaIcon name="group" />
              </VaListItemSection>

              <VaListItemSection>
                <VaListItemLabel>
                  {{
                    group.name
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  }}
                </VaListItemLabel>
              </VaListItemSection>

              <VaListItemSection icon class="m-0">
                <VaDropdown placement="bottom-end">
                  <template #anchor>
                    <VaButton preset="secondary">
                      <VaIcon name="more_vert" />
                    </VaButton>
                  </template>
                  <VaDropdownContent class="p-0">
                    <VaButton
                      preset="secondary"
                      size="small"
                      style="width: 100%"
                      class="flex justify-between"
                      @click="showEditGroupModal(group)"
                    >
                      <VaIcon name="edit_square" class="mr-1" /> Edit
                    </VaButton>
                  </VaDropdownContent>
                  <VaDropdownContent class="p-0">
                    <VaButton
                      preset="secondary"
                      size="small"
                      style="width: 100%"
                      class="flex justify-between"
                      @click="confirmDeleteGroupModal(group.id, group.name)"
                    >
                      <VaIcon name="delete" class="mr-1" color="danger" /> Delete
                    </VaButton>
                  </VaDropdownContent>
                </VaDropdown>
              </VaListItemSection>
            </VaListItem>
            <VaListItem
              v-for="teacher in teacherTeams"
              :key="teacher.id"
              class="list__item cursor-pointer pt-1 pb-1"
              @click="detailTeacherInTeam(teacher.id)"
            >
              <VaListItemSection avatar class="justify-center">
                <VaAvatar size="small">
                  {{
                    teacher.teacherName
                      .split(' ')
                      .filter((_, index, array) => index === 0 || index === array.length - 1)
                      .map((w) => w.charAt(0).toUpperCase())
                      .join('')
                  }}
                </VaAvatar>
              </VaListItemSection>

              <VaListItemSection>
                <VaListItemLabel>
                  {{
                    teacher.teacherName
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  }}
                  <VaIcon
                    v-if="teacher.teacherId === '00000000-0000-0000-0000-000000000000'"
                    class="mr-2"
                    name="no_accounts"
                  />
                </VaListItemLabel>
                <VaListItemLabel caption>
                  {{ teacher.email }}
                  {{ teacher.phone }}
                </VaListItemLabel>
              </VaListItemSection>

              <VaListItemSection icon class="m-0">
                <VaDropdown placement="bottom-end">
                  <template #anchor>
                    <VaButton preset="secondary">
                      <VaIcon name="more_vert" />
                    </VaButton>
                  </template>
                  <VaDropdownContent class="p-0">
                    <VaButton
                      preset="secondary"
                      size="small"
                      style="width: 100%"
                      class="flex justify-between"
                      @click="showEditTeacherModal(teacher)"
                    >
                      <VaIcon name="edit_square" class="mr-1" /> Edit
                    </VaButton>
                  </VaDropdownContent>
                  <VaDropdownContent class="p-0">
                    <VaButton
                      preset="secondary"
                      size="small"
                      style="width: 100%"
                      class="flex justify-between"
                      @click="confirmDeleteTeacherInTeam(teacher.id, teacher.teacherName)"
                    >
                      <VaIcon name="delete" class="mr-1" color="danger" /> Delete
                    </VaButton>
                  </VaDropdownContent>
                </VaDropdown>
              </VaListItemSection>
            </VaListItem>
          </VaList>
        </VaScrollContainer>
      </VaInnerLoading>
    </VaCardContent>
  </VaCard>
</template>

<style lang="scss" scoped>
.list__item:hover {
  background-color: #f1f5f9;
}
</style>
