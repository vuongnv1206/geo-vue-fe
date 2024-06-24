<script lang="ts" setup>
import { ref, PropType, watch, onMounted } from 'vue'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { GroupClass } from '@/pages/classrooms/types'
import { useClassStore } from '@/stores/modules/class.module'
import { Classrooms } from '../../classrooms/types'
import { useToast } from 'vuestic-ui'
import { AccessType, PaperAccess, PaperDto } from '../types'

const props = defineProps({
  currentAssigned: {
    type: Object as PropType<AccessType>,
    default: null,
  },
  paper: {
    type: Object as PropType<PaperDto | null>,
    default: null,
  },
})

const { init: notify } = useToast()

const groupClassStores = useGroupClassStore()
const classStores = useClassStore()

const valueOption = ref<AccessType>()
const emit = defineEmits(['close', 'save'])

const groupClasses = ref<GroupClass[] | null>(null)

const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClass()
    groupClasses.value = res
  } catch (error) {
    console.error(error)
  }
}
const checkedPermissionsClassAccess = ref<string[]>([])
const classRoomsInGroup = ref<Classrooms[]>([])
const selectedGroupClass = ref<string>('')

const getClassByGroupClass = (groupId: string) => {
  classStores
    .getClassroomByGroupClassId(groupId)
    .then((res) => {
      classRoomsInGroup.value = res
      selectedGroupClass.value = groupId
    })
    .catch((error) => {
      notify({
        message: `get classrooms fail \n ${error}`,
        color: 'danger',
      })
    })
}

watch(
  () => props.currentAssigned,
  () => {
    if (props.currentAssigned) {
      valueOption.value = props.currentAssigned
    }
    if (props.paper?.paperAccesses !== undefined) {
      props.paper.paperAccesses.forEach((item: PaperAccess) => {
        if (item.classId !== undefined) {
          checkedPermissionsClassAccess.value.push(item.classId)
        }
      })
    }
  },
  { immediate: true },
)

const onSave = () => {
  emit('save', valueOption.value)
}

const accessOptions = [
  { value: AccessType.Everyone, text: 'Everyone' },
  { value: AccessType.ByClass, text: 'By Class' },
  { value: AccessType.ByStudent, text: 'By Student' },
]

onMounted(() => {
  getGroupClasses()
})
</script>

<template>
  <VaCard class="p-0">
    <b class="pr-3 text-xs"> Who is allowed to take the exam </b>
    <VaRadio v-model="valueOption" :options="accessOptions" value-by="value" class="assign-radio mb-2" />
    <div
      v-if="valueOption == AccessType.ByClass && groupClasses !== null"
      class="grid grid-cols-1 md:grid-cols-3 gap-2 items-start"
    >
      <VaCard outlined class="border-style col-span-1">
        <div class="p-2">
          <VaInput placeholder="Search group class" />
        </div>
        <VaDivider class="m-0" />
        <VaCardContent class="p-1">
          <VaScrollContainer vertical class="max-h-[60vh]">
            <VaSidebarItem
              v-for="groupClass in groupClasses"
              :key="groupClass.id"
              :active="selectedGroupClass === groupClass.id"
            >
              <VaSidebarItemContent class="p-1 min-h-[30px]" @click="getClassByGroupClass(groupClass.id)">
                {{ groupClass.name }}
              </VaSidebarItemContent>
            </VaSidebarItem>
          </VaScrollContainer>
        </VaCardContent>
      </VaCard>

      <VaCard outlined class="border-style col-span-2">
        <div class="p-2 flex justify-between">
          <VaButton preset="secondary"> <VaIcon name="menu_open" /></VaButton>
          <div>
            <VaInput placeholder="Search class in group" class="p-0" />
          </div>
        </div>
        <VaDivider class="m-0" />
        <VaCardContent class="grid grid-cols-3">
          <VaOptionList
            v-model="checkedPermissionsClassAccess"
            :options="classRoomsInGroup"
            :text-by="(op: Classrooms) => op.name"
            value-by="id"
          />
        </VaCardContent>
      </VaCard>
    </div>
    <div class="d-flex">
      <VaButton preset="primary" size="small" class="m-1 mt-2">Cancel</VaButton>
      <VaButton size="small" class="m-1 mt-2" @click="onSave">Save</VaButton>
    </div>
  </VaCard>
</template>

<style scoped>
.assign-radio {
  font-size: 0.7rem;
  --va-radio-icon-width: 1rem;
  --va-radio-icon-height: 1rem;
}

.border-style {
  --va-card-outlined-border: 1px solid var(--va-background-element);
}
</style>
