<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import {
  GroupTeacher,
  TeacherInGroupRequest,
  SetPermissionInClassGroup,
  TeacherTeam,
  SetPermissionInClassTeacher,
} from './types'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { GroupClass } from '../classrooms/type'
import { PermissionNameInClass } from './PermissionInClass.enum'
import { useToast } from 'vuestic-ui'

const loading = ref(true)

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

const showSelect = ref(false)
const teacherOptions = ref<{ label: string; value: string }[]>([])
const currentSelectedTeacher = ref<{ label: string; value: string }[]>([])
const selectedTeacher = ref<string[]>([])
const stores = useGroupTeacherStore()

const { init: notify } = useToast()
const groupClassStores = useGroupClassStore()

const dataFilter = {
  keyword: '',
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
}

const groupDetail = ref<GroupTeacher | null>(null)

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
    loading.value = false
  } catch (error) {
    loading.value = false
    console.error(error)
  }
}

const teacherDetail = ref<TeacherTeam | null>(null)

const getTeacherDetail = async () => {
  if (!props.teacherId) return
  try {
    groupDetail.value = null
    const response = await stores.getTeacherPermissionDetail(props.teacherId)
    teacherDetail.value = response
  } catch (error) {
    console.error(error)
  }
}

const selectTeacherTeam = () => {
  showSelect.value = !showSelect.value
  getGroupDetail()
}

const updateTeacherIntoGroup = async (selectedTeacherList: string[]) => {
  const newSelectedTeacherValue = selectedTeacherList.map((id) => ({
    label: teacherOptions.value.find((option) => option.value === id)?.label || '',
    value: id,
  }))

  for (const teacher of newSelectedTeacherValue) {
    if (!currentSelectedTeacher.value.some((t) => t.value === teacher.value) && groupDetail.value) {
      const teacherInGroupRequest: TeacherInGroupRequest = {
        groupId: groupDetail.value.id,
        teacherId: teacher.value,
      }
      await stores
        .addTeacherIntoGroup(teacherInGroupRequest)
        .then(() => {
          notify({
            message: `Add ${teacher.label} into group success`,
            color: 'success',
          })
        })
        .catch((error) => {
          notify({
            message: `Add ${teacher.label} into group fail \n ${error}`,
            color: 'danger',
          })
        })
    }
  }

  for (let i = currentSelectedTeacher.value.length - 1; i >= 0; i--) {
    const value = currentSelectedTeacher.value[i].value
    if (!newSelectedTeacherValue.some((item) => item.value === value) && groupDetail.value) {
      const teacherInGroupRequest: TeacherInGroupRequest = {
        groupId: groupDetail.value.id,
        teacherId: value,
      }
      await stores
        .removeTeacherInGroup(teacherInGroupRequest)
        .then(() => {
          notify({
            message: `Remove ${currentSelectedTeacher.value[i].label} into group success`,
            color: 'success',
          })
        })
        .catch((error) => {
          notify({
            message: `Remove ${currentSelectedTeacher.value[i].label} into group fail \n ${error}`,
            color: 'danger',
          })
        })
    }
  }
  await getGroupDetail()
}

const groupClasses = ref<GroupClass[]>([])
const value = ref([])

const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClass()
    groupClasses.value = res
    initializeCheckedPermissions()
  } catch (error) {
    console.error(error)
  }
}

const optionCheckBox = ref<{ key: string; value: string }[]>([])

const optionPermissionInClass = () => {
  optionCheckBox.value = Object.entries(PermissionNameInClass).map(([key, value]) => ({
    key: String(key),
    value: String(value),
  }))
}

const checkedPermissions = ref<{ [key: string]: string[] }>({})

const initializeCheckedPermissions = () => {
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
      loading.value = false
      notify({
        message: 'Update permission successfully',
        color: 'success',
      })
      getGroupDetail()
    } catch (error) {
      loading.value = false
      notify({
        message: `Update permission failed \n ${error}`,
        color: 'danger',
      })
    }
  }
  if (props.teacherId) {
    const requestTeacher: SetPermissionInClassTeacher = {
      teacherId: teacherDetail.value?.id || '',
      permissionInClassDtos: getPermissionGroupUserSelected.value,
    }

    try {
      await stores.setPermissionTeacherInClass(requestTeacher)
      loading.value = false
      notify({
        message: 'Update permission successfully',
        color: 'success',
      })
      getTeacherDetail()
    } catch (error) {
      loading.value = false
      notify({
        message: `Update permission failed \n ${error}`,
        color: 'danger',
      })
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
</script>

<template>
  <VaCard v-if="groupDetail !== null" class="p-2 ml-1 rounded mb-2">
    <VaCardTitle>
      Member in group: <span v-if="groupDetail" class="ml-1">{{ groupDetail.name }}</span>
    </VaCardTitle>
    <VaDivider />
    <VaCardContent class="p-0">
      <VaCardContent class="p-0">
        <div class="flex gap-2">
          <div class="text-center" style="cursor: pointer">
            <VaAvatar color="secondary" size="small" @click="selectTeacherTeam">
              <VaIcon name="add" />
            </VaAvatar>
            <div v-if="showSelect">
              <VaSelect
                v-model="selectedTeacher"
                label="Select more"
                :options="teacherOptions"
                text-by="label"
                value-by="value"
                :max-visible-options="3"
                autocomplete
                multiple
                searchable
                highlight-matched-text
                @update:modelValue="updateTeacherIntoGroup"
              >
                <template #content="{ value2 }">
                  <VaChip v-for="chip in value2.slice(0, 3)" :key="chip" size="small" class="mr-1 my-1">
                    {{ chip.label }}
                  </VaChip>
                </template>
              </VaSelect>
            </div>
          </div>
          <div class="flex gap-2 flex-wrap">
            <div v-for="teacher in groupDetail?.teacherTeams" :key="teacher.id">
              <VaDropdown trigger="hover">
                <template #anchor>
                  <VaAvatar color="info" size="small" class="text-center">
                    {{ teacher.teacherName.charAt(0).toUpperCase() }}
                  </VaAvatar>
                </template>
                <VaDropdownContent> {{ teacher.teacherName }} </VaDropdownContent>
              </VaDropdown>
            </div>
          </div>
        </div>
      </VaCardContent>
    </VaCardContent>
  </VaCard>

  <VaCard class="p-2 ml-1 rounded">
    <VaCardTitle>Permission management: {{ groupDetail?.name || teacherDetail?.teacherName }}</VaCardTitle>
    <VaDivider />
    <VaInnerLoading v-if="groupDetail !== null || teacherDetail !== null" :loading="loading">
      <VaCardContent v-if="props.group" class="p-0 mb-2">
        <VaInput v-model="searchQuery" placeholder="search class" />
      </VaCardContent>
      <VaScrollContainer vertical>
        <VaAccordion v-model="value" class="max-W-sm mb-3" multiple style="max-height: 55vh">
          <VaCollapse v-for="groupClass in filteredGroupClasses" :key="groupClass.id" :header="groupClass.name">
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
        <VaButton preset="primary" size="small" class="mr-2" @click="initializeCheckedPermissions"> Cancel </VaButton>
        <VaButton color="success" size="small" @click="updatePermissionGroup"> Save </VaButton>
      </div>
    </VaInnerLoading>
  </VaCard>
</template>
