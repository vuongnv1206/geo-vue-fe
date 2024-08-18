<script lang="ts" setup>
// const loading = ref(true)
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { ref, onMounted, computed } from 'vue'
import { GroupTeacher, TeacherTeam, InviteTeacherJoinTeamRequest, TeacherTeamRequest } from './types'
import { getErrorMessage, notifications } from '@/services/utils'
import { useModal, useToast } from 'vuestic-ui'
import TeacherGroupModal from './TeacherGroupModal.vue'
import TeacherTeamModal from './TeacherTeamModal.vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useJoinTeacherTeamStore } from '@/stores/modules/joinTeacherTeam.module'
import InvitationsJoinTeam from './widgets/InvitationsJoinTeam.vue'
import SharedTeacherGroupList from './SharedTeacherGroupList.vue'

const { t } = useI18n()
const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  orderBy: ['id'],
})
const stores = useGroupTeacherStore()
const { init: notify } = useToast()
const groupTeachers = ref<GroupTeacher[]>([])
const teacherTeams = ref<TeacherTeam[]>([])
const loading = ref(true)
const authStore = useAuthStore()

const useJoinTeacherTeamRequest = useJoinTeacherTeamStore()

const doShowGroupEditModal = ref(false)
const doShowTeacherEditModal = ref(false)

const modalToGroupEdit = ref<GroupTeacher | null>(null)
const modalToTeacherEdit = ref<TeacherTeam | null>(null)
const isInviteTeacher = ref(false)
const editFormRef = ref()
const { confirm } = useModal()
const titleModal = ref<string>()

const emit = defineEmits(['select-group', 'select-teacher'])
const selectedItemId = ref<string>('')

const selectGroup = (group: GroupTeacher) => {
  selectedItemId.value = group.id
  emit('select-group', group)
}

const detailTeacherInTeam = (teacherId: string) => {
  selectedItemId.value = teacherId
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
        message: notifications.getFailed(t('teacherGroups.group_teacher')) + getErrorMessage(error),
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
        message: notifications.getFailed(t('teacherGroups.group_teacher')) + getErrorMessage(error),
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

const onTeacherSaved = async (teacher: TeacherTeamRequest) => {
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
    const inviteRequest: InviteTeacherJoinTeamRequest = {
      contact: teacher.contact,
    }

    await useJoinTeacherTeamRequest
      .inviteTeacherJoinTeam(inviteRequest)
      .then(() => {
        notify({
          message: notifications.inviteSuccess(teacher.contact),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: getErrorMessage(error),
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
  isInviteTeacher.value = true
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
      ? t('settings.add')
      : t('settings.save')
    : modalToGroupEdit.value
      ? t('settings.add')
      : t('settings.save')
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
  isInviteTeacher.value = false
  modalToTeacherEdit.value = teacher
  doShowTeacherEditModal.value = true
  titleModal.value = 'Teacher'
}

const confirmDeleteGroupModal = async (groupId: string, groupName: string) => {
  const result = await confirm({
    message: notifications.confirmDelete(groupName),
    title: t('teacherGroups.delete_group'),
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
    title: t('teacherGroups.delete_teacher'),
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
const currentUser = authStore.user?.id
const copyLinkInvite = () => {
  const baseUrl = window.location.origin

  const inviteLink = `${baseUrl}/invite-join-team/${currentUser}`

  navigator.clipboard
    .writeText(inviteLink)
    .then(() => {
      notify({
        message: 'Copy successfully',
        color: 'success',
      })
    })
    .catch((error) => {
      notify({
        message: `Failed to copy. ${error}`,
        color: 'danger',
      })
    })
}

const showInvitation = ref(false)

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
  <VaCard class="flex-wrap">
    <div>
      <VaCardTitle>
        <div class="flex gap-1">
          <div class="flex-grow">
            <VaInput class="" :placeholder="t('teacherGroups.search_name_phone_email')" @input="handlerSearch">
              <template #appendInner>
                <VaIcon color="secondary" class="material-icons"> search </VaIcon>
              </template>
            </VaInput>
          </div>
          <div>
            <VaDropdown placement="bottom-end">
              <template #anchor>
                <VaButton icon="add" />
              </template>
              <VaDropdownContent class="p-0">
                <VaButton
                  icon="add"
                  preset="secondary"
                  size="small"
                  style="width: 100%"
                  class="p-2"
                  @click="showAddTeacherModal('Teacher')"
                >
                  {{ t('teacherGroups.invite-teacher') }}
                </VaButton>
              </VaDropdownContent>
              <VaDropdownContent class="p-0">
                <VaButton
                  icon="add"
                  preset="secondary"
                  size="small"
                  style="width: 100%"
                  class="p-2"
                  @click="showAddGroupModal('Group')"
                >
                  {{ t('teacherGroups.teacher_group') }}
                </VaButton>
              </VaDropdownContent>
            </VaDropdown>
          </div>
        </div>
        <VaDivider class="m-0" />
      </VaCardTitle>
      <VaDivider class="m-0" />
      <InvitationsJoinTeam v-if="showInvitation" :search-filter="dataFilter.advancedSearch.keyword" />
      <VaCardContent v-else>
        <VaInnerLoading :loading="loading">
          <VaScrollContainer vertical>
            <VaList class="mb-2 max-h-[60vh]">
              <VaListItem
                v-for="group in groupTeachers"
                :key="group.id"
                class="list__item cursor-pointer"
                :class="{ selectItem: selectedItemId === group.id }"
                @click="selectGroup(group)"
              >
                <VaListItemSection avatar class="justify-center">
                  <VaIcon name="group" />
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
                        <VaIcon name="edit_square" class="mr-1" /> {{ t('settings.edit') }}
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
                        <VaIcon name="delete" class="mr-1" color="danger" /> {{ t('settings.delete') }}
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
                    {{ (teacher.email ?? '').toLowerCase() }}
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
                        <VaIcon name="edit_square" class="mr-1" /> {{ t('settings.edit') }}
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
                        <VaIcon name="delete" class="mr-1" color="danger" /> {{ t('settings.delete') }}
                      </VaButton>
                    </VaDropdownContent>
                  </VaDropdown>
                </VaListItemSection>
              </VaListItem>
              <SharedTeacherGroupList
                :search-filter="dataFilter.advancedSearch.keyword"
                :selected-item-id="selectedItemId"
                @selectedGroup="
                  (data: GroupTeacher) => {
                    selectGroup(data)
                  }
                "
              />
            </VaList>
          </VaScrollContainer>
        </VaInnerLoading>
      </VaCardContent>
    </div>

    <VaCardContent class="flex justify-end">
      <div class="flex gap-2">
        <VaButton preset="secondary" border-color="primary" size="small" @click="showInvitation = !showInvitation"
          >Invitation</VaButton
        >
        <VaButton preset="secondary" border-color="primary" size="small" @click="copyLinkInvite"
          >Copy Invite link to team</VaButton
        >
      </div>
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowGroupEditModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h3 class="va-text-bold">{{ modalToGroupEdit ? t('settings.edit') : $t('settings.add') }} {{ titleModal }}</h3>
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
    <h3 class="va-text-bold">{{ modalToTeacherEdit ? t('settings.edit') : $t('settings.add') }} {{ titleModal }}</h3>
    <TeacherTeamModal
      ref="editFormRef"
      :user="currentType"
      :teacher-team="modalToTeacherEdit"
      :save-button-label="saveButtonLabel"
      :disable-button="!isInviteTeacher"
      :is-show-name-input="!isInviteTeacher"
      @close="cancel"
      @save="
        (data: TeacherTeamRequest) => {
          onTeacherSaved(data)
          ok()
        }
      "
    />
  </VaModal>
</template>

<style lang="scss" scoped>
.list__item:hover {
  background-color: #f1f5f9;
}

.selectItem {
  background-color: #f1f5f9;
}
</style>
