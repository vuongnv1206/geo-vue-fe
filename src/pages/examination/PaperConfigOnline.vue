<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { VaButton, VaCard, VaCardTitle, VaIcon, useToast } from 'vuestic-ui'
import { usePaperStore } from '@/stores/modules/paper.module'
import { PaperDto, ShowQuestionAnswer, ShowResult } from '@/pages/examination/types'
import { useRoute, useRouter } from 'vue-router'
import { Classrooms, GroupClass, Student } from '@/pages/classrooms/types'
import { useClassStore } from '@/stores/modules/class.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { UpdatePaperRequest, PaperAccess, AccessType } from './types'
import DatePickerModal from '@/pages/examination/widgets/DatePickerModal.vue'
import StudentListInClassModal from '@pages/examination/widgets/StudentListInClassModal.vue'
import { useSubjectStore } from '@/stores/modules/subject.module'
import { Subject } from '../subject/types'
import { getErrorMessage, notifications } from '@/services/utils'

const paperDetail = ref<PaperDto | null>(null)
const route = useRoute()
const paperStore = usePaperStore()
const classStores = useClassStore()
const subjectStores = useSubjectStore()
const router = useRouter()
const { init: notify } = useToast()

const paperId = route.params.id

const getPaperDetail = () => {
  paperStore
    .paperDetail(paperId.toString())
    .then((res) => {
      paperDetail.value = res
    })
    .catch((error) => {
      notify({
        message: `Not Found ${error}`,
        color: 'danger',
      })
    })
}

const formatDateTimeForDisplay = (dateTime: string | undefined): string | undefined => {
  if (!dateTime) return undefined
  const [date, timeWithZone] = dateTime.split('T')
  const [time] = timeWithZone ? timeWithZone.split('+') : ['00:00:00']
  return `${date} ${time}`
}

const formatDateTimeForSave = (dateTime: string | undefined): string | undefined => {
  if (!dateTime) return undefined
  const [date, time] = dateTime.split(' ')
  return `${date}T${time}`
}

const subjects = ref<Subject[]>([])

const subjectFilter = {
  keyword: '',
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
}

const getSubjects = async () => {
  try {
    const res = await subjectStores.getSubjects(subjectFilter)
    subjects.value = res.data
  } catch (error) {
    notify({
      message: notifications.getFailed('subject') + getErrorMessage(error),
      color: 'danger',
    })
  }
}

const editPaper = ref<UpdatePaperRequest>({
  id: paperId.toString(),
  examName: '',
  status: 0,
  startTime: undefined,
  endTime: undefined,
  paperLabelId: undefined,
  duration: 0,
  shuffle: false,
  showMarkResult: 0,
  showQuestionAnswer: 0,
  password: undefined,
  type: 0,
  isPublish: false,
  description: '',
  paperAccesses: undefined,
  shareType: 1,
  subjectId: undefined,
})

const valueOption = ref<AccessType>(AccessType.Everyone)

watch(
  () => paperDetail.value,
  () => {
    if (paperDetail.value !== null) {
      editPaper.value = {
        id: paperDetail.value.id,
        examName: paperDetail.value.examName,
        status: 0,
        startTime: formatDateTimeForDisplay(paperDetail.value.startTime ?? undefined),
        endTime: formatDateTimeForDisplay(paperDetail.value.endTime ?? undefined),
        paperLabelId: paperDetail.value.paperLabelId ?? undefined,
        duration: paperDetail.value.duration ?? 0,
        shuffle: false, // Assuming a default value
        showMarkResult: paperDetail.value.showMarkResult ?? 0,
        showQuestionAnswer: paperDetail.value.showQuestionAnswer ?? 0,
        password: paperDetail.value.password ?? '',
        type: parseInt(paperDetail.value.type ?? '0'), // Assuming type needs to be converted to a number
        isPublish: paperDetail.value.isPublish ?? false,
        description: paperDetail.value.description ?? '',
        paperAccesses: paperDetail.value.paperAccesses,
        shareType: paperDetail.value.shareType,
        subjectId: paperDetail.value.subjectId,
      }

      valueOption.value = paperDetail.value.shareType as AccessType
      if (paperDetail.value.paperAccesses !== undefined) {
        paperDetail.value.paperAccesses.forEach((item: PaperAccess) => {
          if (item.classId !== undefined && item.classId !== null) {
            checkedPermissionsClassAccess.value.push(item.classId)
          }
          if (item.userId !== undefined && item.userId !== null) {
            checkedPermissionsStudentAccess.value.push(item.userId)
          }
        })
      }
    }
  },
  { immediate: true },
)

const valueSwitch = ref(true)

const accessOptions = [
  { value: AccessType.Everyone, text: 'Everyone' },
  { value: AccessType.ByClass, text: 'By Class' },
  { value: AccessType.ByStudent, text: 'By Student' },
]

const groupClasses = ref<GroupClass[] | null>(null)
const classRoomsInGroup = ref<Classrooms[]>([])
const selectedGroupClass = ref<string>('')
const classFilter = ref({ keyword: '', pageNumber: 0, pageSize: 100, orderBy: ['id'], groupClassId: '' })

const getClassByGroupClass = async (groupId: string) => {
  classFilter.value.groupClassId = groupId
  await classStores
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

const groupClassStores = useGroupClassStore()
const groupClassFilter = ref({ keyword: '', pageNumber: 0, pageSize: 100, orderBy: ['id'] })

const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClasses(groupClassFilter)
    groupClasses.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const showFromDatePickerModal = ref(false)
const showToDatePickerModal = ref(false)
const getDatePickerModal = (date: string, type: string) => {
  if (type === 'fromDate') {
    editPaper.value.startTime = formatDateTimeForDisplay(date)
  } else {
    editPaper.value.endTime = formatDateTimeForDisplay(date)
  }
}

const saveDraffPaper = (isPublish: boolean) => {
  editPaper.value.startTime = formatDateTimeForSave(editPaper.value.startTime)
  editPaper.value.endTime = formatDateTimeForSave(editPaper.value.endTime)
  if (isPublish) {
    editPaper.value.isPublish = true
  }
  const accessPaperSet = ref<PaperAccess[] | null>(null)

  if (valueOption.value === AccessType.ByClass) {
    accessPaperSet.value = checkedPermissionsClassAccess.value.map((classId) => ({ classId: classId }))
  }
  if (valueOption.value === AccessType.ByStudent) {
    accessPaperSet.value = checkedPermissionsStudentAccess.value.map((userId) => ({ userId: userId }))
  }

  const payload = {
    ...editPaper.value,
    startTime: editPaper.value.startTime,
    endTime: editPaper.value.endTime,
    isPublish: editPaper.value.isPublish,
    paperAccesses: accessPaperSet.value,
    shareType: valueOption.value,
  }
  paperStore
    .paperUpdate(paperId.toString(), payload)
    .then(() => {
      notify({
        message: 'Update successfully',
        color: 'success',
      })
      editPaper.value.startTime = formatDateTimeForDisplay(editPaper.value.startTime)
      editPaper.value.endTime = formatDateTimeForDisplay(editPaper.value.endTime)
    })
    .catch((error) => {
      notify({
        message: `Update failing \n ${error}`,
        color: 'danger',
      })
    })
}

const resetAccessTime = () => {
  editPaper.value.startTime = undefined
  editPaper.value.endTime = undefined
}

const checkedPermissionsClassAccess = ref<string[]>([])
const checkedPermissionsStudentAccess = ref<string[]>([])

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

const showMarkResultOptions = computed(() => [
  { label: 'No', value: ShowResult.No },
  { label: 'When submitted', value: ShowResult.WhenSubmitted },
  { label: 'When all students submitted', value: ShowResult.WhenAllStudentSubmitted },
])
const showQuestionAnswerOptions = computed(() => [
  { label: 'No', value: ShowQuestionAnswer.No },
  { label: 'When submitted', value: ShowQuestionAnswer.WhenSubmitted },
  { label: 'When all students submitted', value: ShowQuestionAnswer.WhenAllStudentSubmitted },
])

const backToPage = () => {
  router.push({ name: 'paper-config', params: { id: paperId } })
}

onMounted(() => {
  getPaperDetail()
  getGroupClasses()
  getSubjects()
})
</script>
<template>
  <div class="">
    <div class="flex justify-center" style="align-items: center">
      <VaCardTitle>Exam name: {{ paperDetail?.examName }}- Code: {{ paperDetail?.examCode }}</VaCardTitle>
    </div>
    <VaCard class="mb-3">
      <VaCardTitle class="justify-between align-center">
        <VaButton size="small" @click="backToPage">
          <VaIcon name="keyboard_arrow_left" />
        </VaButton>
        <p>Configuration type</p>
        <VaSwitch v-model="valueSwitch" true-inner-label="Exam" false-inner-label="Practice" />
      </VaCardTitle>
    </VaCard>
    <VaCard class="mb-3">
      <VaCardTitle> General configuration </VaCardTitle>
      <VaDivider class="m-0" />
      <VaCardContent>
        <div class="grid grid-cols-2">
          <VaInput
            v-model="editPaper.examName"
            :rules="[(value: any) => (value && value.length > 0) || 'Exam name is required']"
            label="Exam name"
            class="mb-2 col-span-2"
          />
          <VaSelect
            v-model="editPaper.subjectId"
            :options="subjects"
            :text-by="(option: Subject) => option.name"
            :value-by="(option: Subject) => option.id"
            label="Subject"
            class="mb-2 pl-1"
          />
          <VaCounter
            v-model="editPaper.duration"
            label="Test duration (minutes)"
            :rules="[(v: any) => v >= 0 || 'Field is required']"
            manual-input
            class="mb-2 w-full pl-1"
          />
          <div class="mb-2 pr-1">
            <VaInput
              v-model="editPaper.startTime"
              label="Access time"
              placeholder="From"
              readonly
              @focus="showFromDatePickerModal = !showFromDatePickerModal"
            >
              <template #appendInner>
                <VaIcon name="calendar_today" color="secondary" />
              </template>
            </VaInput>
            <VaModal v-slot="{ cancel, ok }" v-model="showFromDatePickerModal" size="auto" hide-default-actions>
              <DatePickerModal
                @close="cancel"
                @save="
                  (data: string) => {
                    getDatePickerModal(data, 'fromDate')
                    ok()
                  }
                "
              />
            </VaModal>
          </div>
          <div class="mb-2 pr-1">
            <VaInput
              v-model="editPaper.endTime"
              class="mb-2 pl-1"
              label=" "
              placeholder="To"
              readonly
              @focus="showToDatePickerModal = !showToDatePickerModal"
            >
              <template #appendInner>
                <VaIcon name="calendar_today" color="secondary" />
              </template>
            </VaInput>
            <VaModal v-slot="{ cancel, ok }" v-model="showToDatePickerModal" size="auto" hide-default-actions>
              <DatePickerModal
                @close="cancel"
                @save="
                  (data: string) => {
                    getDatePickerModal(data, 'toDate')
                    ok()
                  }
                "
              />
            </VaModal>
          </div>
          <div class="col-span-2 justify-end flex">
            <VaButton size="small" preset="secondary" border-color="primary" @click="resetAccessTime"
              >Reset time</VaButton
            >
          </div>
          <div class="col-span-2">
            <p class="mt-2 text-xs va-text-bold">Who is allowed to take the exam?</p>
            <VaRadio v-model="valueOption" :options="accessOptions" class="assign-radio mb-2" value-by="value" />
          </div>
          <div class="col-span-2">
            <div
              v-if="
                (valueOption === AccessType.ByClass || valueOption === AccessType.ByStudent) && groupClasses !== null
              "
              class="grid grid-cols-3 gap-2"
            >
              <VaCard outlined class="border-style col-span-1">
                <VaCardTitle>
                  <VaInput placeholder="Search group class" />
                </VaCardTitle>
                <VaDivider class="m-0" />
                <VaCardContent class="p-1">
                  <VaScrollContainer vertical class="max-h-[40vh]">
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
                <VaCardTitle>
                  <VaInput placeholder="Search class in group" />
                </VaCardTitle>
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
                    <div class="grid xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      <VaButton
                        v-for="classroom in classRoomsInGroup"
                        :key="classroom.id"
                        :preset="
                          classroom.students?.some((student) => checkedPermissionsStudentAccess.includes(student.id))
                            ? 'primary'
                            : 'secondary'
                        "
                        border-color="primary"
                        @click="getListStudentModal(classroom, classroom.students)"
                        >{{ classroom.name }}</VaButton
                      >
                    </div>
                  </VaScrollContainer>
                </VaCardContent>
              </VaCard>
            </div>
          </div>
        </div>
      </VaCardContent>
    </VaCard>
    <VaCard class="mb-3">
      <VaCardTitle>Security</VaCardTitle>
      <VaDivider class="m-0" />
      <VaCardContent>
        <div class="grid grid-cols-2">
          <VaInput
            v-model="editPaper.password"
            class="mb-2 pr-1"
            label="Exam password"
            placeholder="Enter password..."
          />
          <VaCounter v-model="editPaper.duration" label="Submitted" manual-input class="mb-2 w-full pl-1" />
        </div>
      </VaCardContent>
    </VaCard>

    <VaCard class="mb-3">
      <VaCardTitle> point an answers review </VaCardTitle>
      <VaDivider class="m-0" />
      <VaCardContent>
        <div class="mb-2">
          <span class="va-title">Show result</span>
          <VaRadio
            v-model="editPaper.showMarkResult"
            :options="showMarkResultOptions"
            :text-by="(op: any) => op.label"
            :value-by="(op: any) => op.value"
            type="radio"
            class="assign-radio"
            vertical
          />
        </div>
        <div>
          <span class="va-title">Show the exam and answers</span>
          <VaRadio
            v-model="editPaper.showQuestionAnswer"
            :options="showQuestionAnswerOptions"
            :text-by="(op: any) => op.label"
            :value-by="(op: any) => op.value"
            type="radio"
            class="assign-radio"
            vertical
          />
        </div>
      </VaCardContent>
    </VaCard>

    <div class="flex justify-end">
      <VaButton color="warning" size="small" class="p-1 pr-2 pl-2 mr-1" @click="saveDraffPaper(false)"
        >Save draft</VaButton
      >
      <VaButton size="small" class="p-1 pr-2 pl-2 ml-1" @click="saveDraffPaper(true)">Publish</VaButton>
    </div>
  </div>

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
.border-style {
  --va-card-outlined-border: 1px solid var(--va-background-element);
}

.assign-radio {
  font-size: 0.7rem;
  --va-radio-icon-width: 1rem;
  --va-radio-icon-height: 1rem;
}
</style>
