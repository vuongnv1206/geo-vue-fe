<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { GroupTeacher, InviteJoinGroupRequest, TeacherInGroupRequest, TeacherTeam } from '../types'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { getErrorMessage, notifications } from '@/services/utils'
import { useModal, useToast } from 'vuestic-ui'
import { useJoinGroupRequestStore } from '@/stores/modules/joinGroupRequest.module'

const props = defineProps<{
  groupDetail?: GroupTeacher | null
}>()
const { confirm } = useModal()
const teacherTeamStores = useGroupTeacherStore()
const joinGroupStore = useJoinGroupRequestStore()
const loading = ref(true)
const { init: notify } = useToast()
const teacherTeams = ref<TeacherTeam[]>([])
const teachersInGroup = ref<TeacherTeam[]>([])

const dataFilter = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 0,
  orderBy: ['id'],
})

const getTeacherTeams = () => {
  loading.value = true
  teacherTeamStores
    .getTeacherTeams(dataFilter.value)
    .then((res) => {
      teacherTeams.value = res.data
    })
    .catch((error) => {
      notify({
        message: getErrorMessage(error),
        color: 'danger',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const handlerSearch = (event: Event) => {
  const input = event.target as HTMLInputElement
  dataFilter.value.keyword = input.value
  getTeacherTeams()
}

watch(
  () => props.groupDetail,
  (newGroupDetail) => {
    teachersInGroup.value = newGroupDetail?.teacherTeams || []
    getTeacherTeams()
  },
  { immediate: true },
)

const removeTeacherFromGroup = async (id: string, nickName: string) => {
  const messageConfirm = `Are you sure remove "${nickName}" from group`
  confirm(messageConfirm).then(async (agreed) => {
    if (agreed) {
      if (props.groupDetail) {
        const request: TeacherInGroupRequest = {
          teacherId: id,
          groupId: props.groupDetail?.id,
        }
        try {
          await teacherTeamStores.removeTeacherInGroup(request)
          notify({
            message: notifications.deleteSuccessfully(nickName),
            color: 'success',
          })
          teachersInGroup.value = teachersInGroup.value.filter((teacher) => teacher.id !== id)
          getTeacherTeams()
        } catch (error) {
          notify({
            message: getErrorMessage(error),
            color: 'danger',
          })
        }
      }
    }
  })
}

const inviteTeacherJoinGroup = async (id: string, nickName: string) => {
  try {
    if (props.groupDetail) {
      const request: InviteJoinGroupRequest = {
        teacherId: id,
        groupId: props.groupDetail?.id,
      }
      await joinGroupStore.inviteTeacher(request)
      notify({
        message: notifications.inviteSuccess(nickName),
        color: 'success',
      })
    }
  } catch (error) {
    notify({
      message: getErrorMessage(error),
      color: 'danger',
    })
  }
}

const filteredTeacherTeams = computed(() => {
  const keyword = dataFilter.value.keyword.toLowerCase().trim()
  if (!keyword) {
    return teacherTeams.value
  }
  return teacherTeams.value.filter(
    (teacher) =>
      teacher.teacherName.toLowerCase().includes(keyword) ||
      teacher.email?.toLowerCase().includes(keyword) ||
      teacher.phone?.includes(keyword),
  )
})

const mappedTeacherTeams = computed(() => {
  return filteredTeacherTeams.value
    .map((teacherTeam) => {
      const isInGroup = teachersInGroup.value.some((teacherInGroup) => teacherInGroup.id === teacherTeam.id)
      return {
        ...teacherTeam,
        isInGroup: isInGroup,
      }
    })
    .sort((a, b) => {
      if (a.isInGroup && !b.isInGroup) {
        return -1 // Đưa InGroup lên trước
      }
      if (!a.isInGroup && b.isInGroup) {
        return 1 // Đưa NotInGroup xuống sau
      }
      return 0 // Giữ nguyên vị trí nếu cả hai cùng loại
    })
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <span>Teacher in team</span>
      <div class="flex">
        <VaInput v-model="dataFilter.keyword" placeholder="search..." @input="handlerSearch" />
      </div>
    </VaCardTitle>
    <VaDivider />
    <VaCardContent>
      <VaInnerLoading :loading="loading">
        <VaScrollContainer vertical>
          <VaList class="mb-2 max-h-[60vh]">
            <VaListItem v-for="teacher in mappedTeacherTeams" :key="teacher.id" class="mb-1">
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
                  {{ (teacher.email ?? '').toLowerCase() }} {{ teacher.phone }}
                </VaListItemLabel>
              </VaListItemSection>
              <VaListItemSection icon class="m-0">
                <VaButton
                  v-if="teacher.isInGroup"
                  icon="delete"
                  preset="secondary"
                  border-color="danger"
                  color="danger"
                  size="small"
                  @click="removeTeacherFromGroup(teacher.id, teacher.teacherName)"
                />
                <VaButton
                  v-if="!teacher.isInGroup"
                  preset="secondary"
                  border-color="secondary"
                  color="secondary"
                  size="small"
                  @click="inviteTeacherJoinGroup(teacher.id, teacher.teacherName)"
                >
                  Invite
                </VaButton>
              </VaListItemSection>
            </VaListItem>
          </VaList>
        </VaScrollContainer>
      </VaInnerLoading>
    </VaCardContent>
    <VaDivider />
    <div class="flex justify-end">
      <VaButton preset="secondary" color="secondary" @click="closeModal()">{{ $t('settings.close') }}</VaButton>
    </div>
  </VaCard>
</template>
