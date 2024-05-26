<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { GroupTeacher, TeacherInGroupRequest, SetPermissionInClassGroup } from './types'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { GroupClass } from '../classrooms/type'
import { PermissionNameInClass } from './PermissionInClass.enum'
import { useToast } from 'vuestic-ui'

const props = defineProps({
  group: {
    type: Object as () => GroupTeacher | null,
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
  pageSize: 10,
  orderBy: ['id'],
}

const groupDetail = ref<GroupTeacher | null>(null)

const getGroupDetail = async () => {
  if (props.group !== null) {
    try {
      const response = await stores.getGroupDetail(props.group.id)
      groupDetail.value = response
      if (groupDetail.value?.teacherTeams != undefined) {
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
      console.log(error)
    }
  }
}

const selectTeacherTeam = () => {
  showSelect.value = !showSelect.value
}

const updateTeacherIntoGroup = (selectedTeacherList: string[]) => {
  const newSelectedTeacherValue = selectedTeacherList.map((id) => ({
    label: teacherOptions.value.find((option) => option.value === id)?.label || '',
    value: id,
  }))

  for (const teacher of newSelectedTeacherValue) {
    const existTeacher = currentSelectedTeacher.value.some((t) => t.value === teacher.value)
    if (!existTeacher && groupDetail.value !== null) {
      const teacherInGroupRequest: TeacherInGroupRequest = {
        groupId: groupDetail.value.id,
        teacherId: teacher.value,
      }
      stores.addTeacherIntoGroup(teacherInGroupRequest)
    }
  }

  for (let i = currentSelectedTeacher.value.length - 1; i >= 0; i--) {
    const value = currentSelectedTeacher.value[i].value
    if (!newSelectedTeacherValue.some((item) => item.value === value) && groupDetail.value !== null) {
      const teacherInGroupRequest: TeacherInGroupRequest = {
        groupId: groupDetail.value.id,
        teacherId: value,
      }
      stores.removeTeacherInGroup(teacherInGroupRequest)
    }
  }
  getGroupDetail()
}

const groupClasses = ref<GroupClass[]>([])
const value = ref([])
const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClass()
    groupClasses.value = res
    initializeCheckedPermissions()
  } catch (error) {
    console.log(error)
  }
}

const optionCheckBox = ref<{ key: string; value: string }[]>([])

const optionPermissionIncLass = () => {
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
      checked[classRoom.id] =
        groupDetail.value?.groupPermissionInClasses
          .filter((permission) => permission.classId == classRoom.id)
          .map((permission) => permission.permissionType) || []
    })
  })

  checkedPermissions.value = checked
}

const permissionTypeMap: { [key: string]: number } = {
  AssignAssignment: 1,
  Marking: 2,
  ManageStudentList: 3,
}

const getPermissionGroupUserSelected = computed(() => {
  return Object.entries(checkedPermissions.value).flatMap(([id, permissions]) =>
    permissions.map((permission) => ({
      classId: id,
      permissionType: permissionTypeMap[permission],
    })),
  )
})

const updatePermissionGroup = () => {
  const request: SetPermissionInClassGroup = {
    groupTeacherId: groupDetail.value?.id || '',
    permissionInClassDtos: getPermissionGroupUserSelected.value,
  }
  stores
    .setPermissionGroupInClass(request)
    .then(() => {
      notify({
        message: `Update permission successfully`,
        color: 'success',
      })
    })
    .catch((error) => {
      notify({
        message: `Update permission failed \n ${error}`,
        color: 'danger',
      })
    })
}

watch(
  () => props.group,
  (group) => {
    if (group !== null) {
      getGroupDetail().then(() => {
        getGroupClasses()
      })
      optionPermissionIncLass()
    }
  },
  { immediate: true },
)
</script>

<template>
  <VaCard v-if="props.group" class="p-2 ml-1 rounded mb-2">
    <VaCardTitle>
      Member in group: <span v-if="groupDetail !== null" class="ml-1">{{ groupDetail.name }}</span>
    </VaCardTitle>
    <VaDivider />
    <VaCardContent class="p-0">
      <div class="flex gap-2 flex-wrap">
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
              autocomplete
              multiple
              @update:modelValue="updateTeacherIntoGroup"
            />
          </div>
        </div>
        <VaAvatar v-for="teacher in groupDetail?.teacherTeams" :key="teacher.id" color="info" size="small">
          {{ teacher.teacherName.charAt(0).toUpperCase() }}
        </VaAvatar>
      </div>
    </VaCardContent>
  </VaCard>
  <VaCard class="p-2 ml-1 rounded">
    <VaCardTitle>Permission management</VaCardTitle>
    <VaDivider />
    <VaCardContent v-if="props.group" class="p-0 mb-2">
      <VaInput placeholder="search class" />
    </VaCardContent>
    <VaAccordion v-model="value" class="max-W-sm mb-3" multiple>
      <VaCollapse v-for="groupClass in groupClasses" :key="groupClass.id" :header="groupClass.name">
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
    <div v-if="props.group" class="flex justify-end">
      <VaButton preset="primary" size="small" class="mr-2"> Cancel </VaButton>
      <VaButton color="success" size="small" @click="updatePermissionGroup"> Save </VaButton>
    </div>
  </VaCard>
</template>
