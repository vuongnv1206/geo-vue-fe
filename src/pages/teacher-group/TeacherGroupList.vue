<script lang="ts" setup>
// const loading = ref(true)
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { ref, onMounted, computed } from 'vue'
import { GroupTeacher, TeacherTeam } from './types'

import { useModal, useToast } from 'vuestic-ui'
import TeacherGroupModal from './TeacherGroupModal.vue'
import TeacherTeamModal from './TeacherTeamModal.vue'

const dataFilter = {
  keyword: '',
  pageNumber: 0,
  pageSize: 10,
  orderBy: ['id'],
}
const stores = useGroupTeacherStore()
const { init: notify } = useToast()
const groupTeachers = ref<GroupTeacher[]>([])
const teacherTeams = ref<TeacherTeam[]>([])

const getTeacherGroups = () => {
  stores.getGroupTeachers(dataFilter).then((res) => {
    groupTeachers.value = res.data
  })
  stores.getTeacherTeams(dataFilter).then((res) => {
    teacherTeams.value = res.data
  })
}

const onGroupSaved = async (group: GroupTeacher) => {
  if (modalToGroupEdit.value) {
    await stores
      .updateGroupTeacher(group.id, group)
      .then(() => {
        notify({
          message: `${group.name} has been updated`,
          color: 'success',
        })
        getTeacherGroups()
      })
      .catch((error) => {
        notify({
          message: 'Failed to update group teacher\n' + error.message,
          color: 'danger',
        })
      })
  } else {
    await stores
      .addGroup(group)
      .then(() => {
        notify({
          message: `${group.name} has been created`,
          color: 'success',
        })
        getTeacherGroups()
      })
      .catch((err) => {
        notify({
          message: 'Failed to create group teacher\n' + err.message,
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
          message: `${teacher.teacherName} has been updated`,
          color: 'success',
        })
        getTeacherGroups()
      })
      .catch((error) => {
        notify({
          message: 'Failed to Update teacher\n' + error.message,
          color: 'danger',
        })
      })
  } else {
    await stores
      .addTeacherIntoTeam(teacher)
      .then(() => {
        notify({
          message: `${teacher.teacherName} has been created`,
          color: 'success',
        })
        getTeacherGroups()
      })
      .catch((err) => {
        notify({
          message: 'Failed to add teacher into team\n' + err.message,
          color: 'danger',
        })
      })
  }
}

const doShowGroupEditModal = ref(false)
const doShowTeacherEditModal = ref(false)

const modalToGroupEdit = ref<GroupTeacher | null>(null)
const modalToTeacherEdit = ref<TeacherTeam | null>(null)

const titleModal = ref<string>()

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

const editFormRef = ref()
const { confirm } = useModal()
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
    message: `Are you sure want to delete "${groupName}"?`,
    title: 'Delete Group',
    okText: 'Confirm',
    size: 'small',
  })

  if (result) {
    stores
      .deleteGroupTeacher(groupId)
      .then(() => {
        notify({
          message: `Delete ${groupName} successfully`,
          color: 'success',
        })
        getTeacherGroups()
      })
      .catch((error) => {
        notify({
          message: `Failed to delete \n ${error}`,
          color: 'danger',
        })
      })
  }
}
const confirmDeleteTeacherInTeam = async (teacherId: string, teacherName: string) => {
  const result = await confirm({
    message: `Are you sure want to delete "${teacherName}"?`,
    title: 'Delete Teacher',
    okText: 'Confirm',
    size: 'small',
  })

  if (result) {
    stores
      .deleteTeacherInTeam(teacherId)
      .then(() => {
        notify({
          message: `Delete ${teacherName} successfully`,
          color: 'success',
        })
        getTeacherGroups()
      })
      .catch((error) => {
        notify({
          message: `Failed to delete \n ${error}`,
          color: 'danger',
        })
      })
  }
}

onMounted(() => {
  getTeacherGroups()
})
</script>

<template>
  <div class="flex mt-2">
    <div class="mr-3 flex-grow">
      <VaInput class="" placeholder="Search name, phone or email">
        <template #appendInner>
          <VaIcon color="secondary" class="material-icons"> search </VaIcon>
        </template>
      </VaInput>
    </div>
    <div class="">
      <VaDropdown placement="bottom-end">
        <template #anchor>
          <VaButton>
            <span class="material-symbols-outlined"> add </span>
          </VaButton>
        </template>
        <VaDropdownContent class="p-0">
          <VaButton
            preset="secondary"
            size="small"
            style="width: 100%"
            class="p-2"
            @click="showAddTeacherModal('Teacher')"
            >New teacher
          </VaButton>
        </VaDropdownContent>
        <VaDropdownContent class="p-0">
          <VaButton preset="secondary" size="small" style="width: 100%" class="p-2" @click="showAddGroupModal('Group')">
            New teacher group
          </VaButton></VaDropdownContent
        >
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
  <div class="my-8">
    <VaDivider />
  </div>
  <VaList class="mb-2">
    <VaListItem v-for="group in groupTeachers" :key="group.id" class="list__item mb-1">
      <VaListItemSection avatar class="justify-center">
        <VaIcon name="group" color="black" />
      </VaListItemSection>

      <VaListItemSection>
        <VaListItemLabel>
          {{ group.name }}
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
    <VaListItem v-for="teacher in teacherTeams" :key="teacher.id" class="list__item mb-2">
      <VaListItemSection avatar class="justify-center">
        <VaAvatar size="small">
          <img src="" :alt="teacher.teacherName" />
        </VaAvatar>
      </VaListItemSection>

      <VaListItemSection>
        <VaListItemLabel>
          {{ teacher.teacherName }}
          <VaIcon v-if="teacher.teacherId === '00000000-0000-0000-0000-000000000000'" class="mr-2" name="no_accounts" />
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
</template>

<style lang="scss" scoped>
.list__item:hover {
  background-color: #f1f5f9;
  cursor: pointer;
}
</style>
