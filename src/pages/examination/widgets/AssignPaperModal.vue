<script lang="ts" setup>
import { ref, PropType, onMounted } from 'vue'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { GroupClass, Student } from '@/pages/classrooms/types'
import { useClassStore } from '@/stores/modules/class.module'
import { Classrooms } from '../../classrooms/types'
import { useToast } from 'vuestic-ui'
import { AccessType, PaperAccess, PaperDto } from '../types'
import StudentListInClassModal from '@pages/examination/widgets/StudentListInClassModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  paper: {
    type: Object as PropType<PaperDto | null>,
    default: null,
  },
})

const { init: notify } = useToast()

const groupClassStores = useGroupClassStore()
const classStores = useClassStore()

const valueOption = ref<AccessType>(props.paper?.shareType as AccessType)
const emit = defineEmits(['close', 'save'])

const groupClasses = ref<GroupClass[] | null>(null)
const groupClassFilter = ref({ keyword: '', pageNumber: 0, pageSize: 100, orderBy: ['id'] })

const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClasses(groupClassFilter)
    groupClasses.value = res.data
  } catch (error) {
    console.error(error)
  }
}
const checkedPermissionsClassAccess = ref<string[]>([])
const checkedPermissionsStudentAccess = ref<string[]>([])

const classRoomsInGroup = ref<Classrooms[]>([])
const selectedGroupClass = ref<string>('')
const classFilter = ref({ keyword: '', pageNumber: 0, pageSize: 100, orderBy: ['id'], groupClassId: '' })
const getClassByGroupClass = (groupId: string) => {
  classFilter.value.groupClassId = groupId
  classStores
    .getClasses(classFilter.value)
    .then((res) => {
      classRoomsInGroup.value = res.data
      selectedGroupClass.value = groupId
    })
    .catch((error) => {
      notify({
        message: `get classrooms fail \n ${error}`,
        color: 'danger',
      })
    })
}

const onSave = () => {
  if (props.paper) {
    const accessPaperSet = ref<PaperAccess[] | null>(null)
    if (valueOption.value === AccessType.ByClass) {
      accessPaperSet.value = checkedPermissionsClassAccess.value.map((classId) => ({ classId: classId }))
    } else if (valueOption.value === AccessType.ByStudent) {
      accessPaperSet.value = checkedPermissionsStudentAccess.value.map((userId) => ({ userId: userId }))
    }
    emit('save', valueOption.value, accessPaperSet)
  }
}

const accessOptions = [
  { value: AccessType.ByClass, text: t('papers.by_class') },
  { value: AccessType.ByStudent, text: t('papers.by_student') },
]

const showListStudentModal = ref(false)
const studentList = ref<Student[]>([])
const selectedClassInAccess = ref<Classrooms | undefined>()

const getListStudentModal = (classroom: Classrooms, students: Student[]) => {
  showListStudentModal.value = !showListStudentModal.value
  studentList.value = students
  selectedClassInAccess.value = classroom
}

const updateSelectedStudent = (selectedStudents: string[]) => {
  checkedPermissionsStudentAccess.value = selectedStudents
}

onMounted(() => {
  if (props.paper?.paperAccesses !== undefined) {
    props.paper.paperAccesses?.forEach((item: PaperAccess) => {
      if (item.classId !== undefined) {
        checkedPermissionsClassAccess.value.push(item.classId)
      }
      if (item.userId !== undefined) {
        checkedPermissionsStudentAccess.value.push(item.userId)
      }
    })
  }
  getGroupClasses()
})
</script>

<template>
  <VaCard class="p-0">
    <b class="pr-3 text-xs">{{ t('papers.who_can_take_exam') }}</b>
    <VaRadio v-model="valueOption" :options="accessOptions" value-by="value" class="assign-radio mb-2" />
    <div
      v-if="(valueOption === AccessType.ByClass || valueOption === AccessType.ByStudent) && groupClasses !== null"
      class="grid grid-cols-1 md:grid-cols-3 gap-2 items-start"
    >
      <VaCard outlined class="border-style col-span-1">
        <div class="p-2">
          <VaInput :placeholder="t('papers.search_group_class')" />
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
          <VaButton preset="secondary" icon="menu_open" />
          <div>
            <VaInput :placeholder="t('papers.search_class')" class="p-0" />
          </div>
        </div>
        <VaDivider class="m-0" />
        <VaCardContent>
          <VaScrollContainer v-if="valueOption === AccessType.ByClass" class="max-h-50" vertical>
            <VaOptionList
              v-model="checkedPermissionsClassAccess"
              :options="classRoomsInGroup"
              :text-by="(op: Classrooms) => op.name"
              value-by="id"
            />
          </VaScrollContainer>
          <VaScrollContainer v-if="valueOption === AccessType.ByStudent" class="max-h-50" vertical>
            <div class="grid xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
              <VaButton
                v-for="classroom in classRoomsInGroup"
                :key="classroom.id"
                border-color="primary"
                :preset="
                  classroom.students?.some((student) => checkedPermissionsStudentAccess.includes(student.id))
                    ? 'primary'
                    : 'secondary'
                "
                @click="getListStudentModal(classroom, classroom.students)"
              >
                {{ classroom.name.length > 6 ? `${classroom.name.slice(0, 6)}...` : `${classroom.name}` }}
              </VaButton>
            </div>
          </VaScrollContainer>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="d-flex">
      <VaButton preset="primary" size="small" class="m-1 mt-2">{{ t('settings.cancel') }}</VaButton>
      <VaButton size="small" class="m-1 mt-2" @click="onSave">{{ t('settings.save') }}</VaButton>
    </div>
  </VaCard>

  <VaModal v-slot="{ ok }" v-model="showListStudentModal" hide-default-actions>
    <StudentListInClassModal
      :students="studentList"
      :class-room="selectedClassInAccess"
      :selected-students="checkedPermissionsStudentAccess"
      @save="
        (selectedStudents: string[]) => {
          updateSelectedStudent(selectedStudents)
          ok()
        }
      "
    />
  </VaModal>
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
