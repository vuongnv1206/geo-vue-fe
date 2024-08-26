<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { GroupTeacher, SetPermissionInClassGroup, TeacherTeam, SetPermissionInClassTeacher } from './types'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { ClassroomQueryType, GroupClass } from '../classrooms/types'
import { PermissionNameInClass } from './PermissionInClass.enum'
import { useToast } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useI18n } from 'vue-i18n'
import QrcodeVue from 'qrcode.vue'
import TeacherInTeamModal from './widgets/TeacherInTeamModal.vue'

const { t } = useI18n()
const props = defineProps({
  group: {
    type: Object as () => GroupTeacher | null,
    default: null,
  },
  teacherId: {
    type: String as () => string | null,
    default: null,
  },
})

const loading = ref(true)
const showTeacherInTeamModal = ref(false)
const { init: notify } = useToast()

const stores = useGroupTeacherStore()
const groupClassStores = useGroupClassStore()

const valueAccordion = ref([])
const selectedTeacher = ref<string[]>([])
const groupClasses = ref<GroupClass[]>([])
const groupDetail = ref<GroupTeacher | null>(null)
const teacherDetail = ref<TeacherTeam | null>(null)
const teacherOptions = ref<{ label: string; value: string }[]>([])
const currentSelectedTeacher = ref<{ label: string; value: string }[]>([])
const checkedPermissions = ref<{ [key: string]: string[] }>({})
const optionCheckBox = ref<{ key: string; value: string }[]>([])

const groupClassFilter = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
  queryType: ClassroomQueryType.MyClass,
})

const dataFilter = {
  keyword: '',
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
}

const getGroupDetail = async () => {
  loading.value = true
  if (!props.group) {
    loading.value = false
    return
  }

  try {
    teacherDetail.value = null
    const response = await stores.getGroupDetail(props.group.id)
    groupDetail.value = response
    if (groupDetail.value?.teacherTeams) {
      currentSelectedTeacher.value = groupDetail.value.teacherTeams.map((teacher) => ({
        value: teacher.id,
        label: teacher.teacherName,
      }))
      selectedTeacher.value = groupDetail.value.teacherTeams.map((teacher) => teacher.id)
    }
    const res = await stores.getTeacherTeams(dataFilter)
    teacherOptions.value = res.data.map((teacher) => ({
      value: teacher.id,
      label: teacher.teacherName,
    }))
  } catch (error) {
    notify({
      message: notifications.getFailed(t('groupClasses.group_detail')) + getErrorMessage(error),
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}

const getTeacherDetail = async () => {
  if (!props.teacherId) return
  try {
    loading.value = true
    groupDetail.value = null
    const response = await stores.getTeacherPermissionDetail(props.teacherId)
    teacherDetail.value = response
  } catch (error) {
    notify({
      message: notifications.getFailed(t('groupClasses.teacher')) + getErrorMessage(error),
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}

const getGroupClasses = async () => {
  try {
    loading.value = true
    const res = await groupClassStores.getGroupClasses(groupClassFilter.value)
    groupClasses.value = res.data
    initializeCheckedPermissions()
  } catch (error) {
    notify({
      message: notifications.getFailed(t('groupClasses.group_class')) + getErrorMessage(error),
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}

const selectTeacherTeam = () => {
  showTeacherInTeamModal.value = !showTeacherInTeamModal.value
}

const optionPermissionInClass = () => {
  optionCheckBox.value = Object.entries(PermissionNameInClass).map(([key, value]) => ({
    key: String(key),
    value: String(value),
  }))
}

const initializeCheckedPermissions = () => {
  loading.value = true
  const checked: { [key: string]: string[] } = {}
  groupClasses.value.forEach((groupClass) => {
    groupClass.classes.forEach((classRoom) => {
      if (groupDetail.value !== null) {
        checked[classRoom.id] =
          groupDetail.value.groupPermissionInClasses
            .filter((permission) => permission.classId === classRoom.id)
            .map((permission) => permission.permissionType) || []
      }
      if (teacherDetail.value !== null) {
        checked[classRoom.id] =
          teacherDetail.value.teacherPermissionInClassDto
            .filter((permission) => permission.classId === classRoom.id)
            .map((permission) => permission.permissionType) || []
      }
    })
  })

  checkedPermissions.value = checked
  loading.value = false
}
const permissionTypeMap: { [key: string]: number } = {
  AssignAssignment: 1,
  Marking: 2,
  ManageStudentList: 3,
}

const getPermissionGroupUserSelected = computed(() =>
  Object.entries(checkedPermissions.value).flatMap(([id, permissions]) =>
    permissions.map((permission) => ({
      classId: id,
      permissionType: permissionTypeMap[permission],
    })),
  ),
)

const updatePermissionGroup = async () => {
  loading.value = true
  if (props.group) {
    const requestGroup: SetPermissionInClassGroup = {
      groupTeacherId: groupDetail.value?.id || '',
      permissionInClassDtos: getPermissionGroupUserSelected.value,
    }
    try {
      await stores.setPermissionGroupInClass(requestGroup)
      notify({
        message: notifications.updatedSuccessfully(t('teacherGroups.permission')),
        color: 'success',
      })
      getGroupDetail()
    } catch (error) {
      notify({
        message: notifications.updateFailed(t('teacherGroups.permission')) + getErrorMessage(error),
        color: 'danger',
      })
    } finally {
      loading.value = false
    }
  }
  if (props.teacherId) {
    const requestTeacher: SetPermissionInClassTeacher = {
      teacherId: teacherDetail.value?.id || '',
      permissionInClassDtos: getPermissionGroupUserSelected.value,
    }

    try {
      await stores.setPermissionTeacherInClass(requestTeacher)
      notify({
        message: notifications.updatedSuccessfully(t('teacherGroups.permission')),
        color: 'success',
      })
      getTeacherDetail()
    } catch (error) {
      notify({
        message: notifications.updateFailed(t('teacherGroups.permission')) + getErrorMessage(error),
        color: 'danger',
      })
    } finally {
      loading.value = false
    }
  }
}

watch(
  () => props.group,
  async (group) => {
    if (group) {
      await getGroupDetail()
      await getGroupClasses()
      optionPermissionInClass()
    }
  },
  { immediate: true },
)

watch(
  () => props.teacherId,
  async (teacher) => {
    if (teacher) {
      await getTeacherDetail()
      await getGroupClasses()
      optionPermissionInClass()
    }
  },
  { immediate: true },
)

const searchQuery = ref('')

const filteredGroupClasses = computed(() => {
  if (!searchQuery.value) {
    return groupClasses.value
  }
  return groupClasses.value
    .map((groupClass) => {
      const filteredClasses = groupClass.classes.filter((classRoom) =>
        classRoom.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
      return {
        ...groupClass,
        classes: filteredClasses,
      }
    })
    .filter((groupClass) => groupClass.classes.length > 0)
})

const copyJoinLink = (linkCopy: string) => {
  if (linkCopy) {
    navigator.clipboard
      .writeText(`${baseUrl}/${linkCopy}`)
      .then(() => {
        notify({
          message: 'Copy successfully',
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: `Failed to copy. ${error}`,
        })
      })
  }
}

const downloadQRCode = () => {
  const canvas = document.querySelector('canvas')
  if (canvas) {
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${groupDetail.value?.name}qr_code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    notify({
      message: 'Failed to download QR code. Canvas not found.',
      color: 'danger',
    })
  }
}

const qrCodeSrc = ref<string | null>(null)
const baseUrl = window.location.origin
watch(
  () => groupDetail?.value?.joinLink,
  (newLink) => {
    if (newLink) {
      qrCodeSrc.value = `${baseUrl}/${newLink}`
    }
  },
  { immediate: true },
)

watch(searchQuery, () => {
  accordionKey.value += 1
})
const accordionKey = ref(0)

const closeTeacherModal = async () => {
  await getGroupDetail()
}
</script>

<template>
  <VaInnerLoading v-if="groupDetail !== null || teacherDetail !== null" :loading="loading">
    <div>
      <VaCard v-if="groupDetail !== null" class="mb-2">
        <VaCardContent class="flex gap-2">
          <VaButton
            preset="secondary"
            border-color="primary"
            size="small"
            @click="copyJoinLink(groupDetail.joinLink || '')"
            >Link invite</VaButton
          >
          <VaDropdown>
            <template #anchor>
              <VaButton icon="qr_code_2" preset="secondary" border-color="primary" size="small" />
            </template>
            <VaDropdownContent>
              <div>
                <QrcodeVue v-if="qrCodeSrc" :value="qrCodeSrc" />
                <div>
                  <div>
                    <VaButton preset="secondary" size="small" @click="downloadQRCode">download</VaButton>
                  </div>
                </div>
              </div>
            </VaDropdownContent>
          </VaDropdown>
        </VaCardContent>
      </VaCard>
      <VaCard v-if="groupDetail !== null" class="mb-2">
        <VaCardContent>
          <div class="flex gap-2">
            <div class="text-center cursor-pointer">
              <VaAvatar color="secondary" size="small" @click="selectTeacherTeam">
                <VaIcon name="add" />
              </VaAvatar>
            </div>
            <div class="flex gap-2 flex-wrap">
              <div v-for="teacher in groupDetail?.teacherTeams" :key="teacher.id">
                <VaDropdown trigger="hover">
                  <template #anchor>
                    <VaAvatar color="info" size="small" class="text-center">
                      {{
                        teacher.teacherName
                          .split(' ')
                          .filter((_, index, array) => index === 0 || index === array.length - 1)
                          .map((w) => w.charAt(0).toUpperCase())
                          .join('')
                      }}
                    </VaAvatar>
                  </template>
                  <VaDropdownContent> {{ teacher.teacherName }} </VaDropdownContent>
                </VaDropdown>
              </div>
            </div>
          </div>
        </VaCardContent>
      </VaCard>
      <VaCard class="min-h-[60vh]">
        <VaCardTitle>
          {{ t('teacherGroups.permission_management') }}: {{ groupDetail?.name || teacherDetail?.teacherName }}
        </VaCardTitle>
        <VaDivider />
        <VaCardContent>
          <VaCardContent v-if="groupDetail !== null || teacherDetail !== null" class="p-0 mb-2">
            <VaInput v-model="searchQuery" :placeholder="t('teacherGroups.search_class')" />
          </VaCardContent>
          <VaScrollContainer vertical>
            <VaAccordion :key="accordionKey" v-model="valueAccordion" class="max-W-sm mb-3 max-h-[60vh]" multiple>
              <VaCollapse v-for="(groupClass, index) in filteredGroupClasses" :key="index" :header="groupClass.name">
                <template #content>
                  <div class="grid md:grid-cols-4 sm:grid-cols-3 gap-3">
                    <div v-for="classRoom in groupClass.classes" :key="classRoom.id">
                      <VaCard stripe stripe-color="success" class="border flex flex-col">
                        <VaCardTitle>{{ classRoom.name }}</VaCardTitle>
                        <VaCardContent>
                          <VaOptionList
                            v-model="checkedPermissions[classRoom.id]"
                            :options="optionCheckBox"
                            :text-by="(op: any) => op.value"
                            :value-by="(op: any) => op.key"
                          />
                        </VaCardContent>
                      </VaCard>
                    </div>
                  </div>
                </template>
              </VaCollapse>
            </VaAccordion>
          </VaScrollContainer>
          <div v-if="props.group || props.teacherId" class="flex justify-end">
            <VaButton preset="primary" size="small" class="mr-2" @click="initializeCheckedPermissions">
              {{ $t('settings.cancel') }}
            </VaButton>
            <VaButton color="success" size="small" @click="updatePermissionGroup">{{ $t('settings.save') }}</VaButton>
          </div>
        </VaCardContent>
      </VaCard>
    </div>

    <VaModal
      v-slot="{ cancel }"
      v-model="showTeacherInTeamModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
    >
      <TeacherInTeamModal
        :group-detail="groupDetail"
        @close="
          () => {
            closeTeacherModal()
            cancel()
          }
        "
      />
    </VaModal>
  </VaInnerLoading>
</template>
