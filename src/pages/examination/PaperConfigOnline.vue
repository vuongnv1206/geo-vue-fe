<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { VaButton, VaCard, VaCardTitle, VaIcon, useForm, useModal, useToast } from 'vuestic-ui'
import { usePaperStore } from '@/stores/modules/paper.module'
import {
  GetAccessPaperRequest,
  GroupClassAccessPaper,
  PaperDto,
  ShowQuestionAnswer,
  ShowResult,
  StatusPaper,
} from '@/pages/examination/types'
import { useRoute, useRouter } from 'vue-router'
import { Classrooms, GroupClass, Student } from '@/pages/classrooms/types'
import { useClassStore } from '@/stores/modules/class.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { UpdatePaperRequest, PaperAccess, AccessType } from './types'
import StudentListInClassModal from '@pages/examination/widgets/StudentListInClassModal.vue'
import { useSubjectStore } from '@/stores/modules/subject.module'
import { Subject } from '../subject/types'
import { getErrorMessage, notifications } from '@/services/utils'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import WhoAssignedPaperDetailModal from './widgets/WhoAssignedPaperDetailModal.vue'
const paperDetail = ref<PaperDto | null>(null)
const route = useRoute()
const paperStore = usePaperStore()
const classStores = useClassStore()
const subjectStores = useSubjectStore()
const router = useRouter()
const { init: notify } = useToast()
const { confirm } = useModal()
const paperId = route.params.id
const loading = ref(true)
const getPaperDetail = async () => {
  loading.value = true
  await paperStore
    .paperDetail(paperId.toString())
    .then((res) => {
      paperDetail.value = res
      getGroupAccessPaper()
    })
    .catch((error) => {
      notify({
        message: `Not Found ${error}`,
        color: 'danger',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const dateInputFormat = {
  format: 'MM/dd/yyyy HH:mm',
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
  status: StatusPaper.unpublish,
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
  publicIpAllowed: undefined,
  localIpAllowed: undefined,
  numberAttempt: undefined,
})

const valueOption = ref<AccessType>(AccessType.ByClass)

watch(
  () => paperDetail.value,
  () => {
    if (paperDetail.value !== null) {
      editPaper.value = {
        id: paperDetail.value.id,
        examName: paperDetail.value.examName,
        status: paperDetail.value.status === 'Publish' ? StatusPaper.publish : StatusPaper.unpublish,
        startTime: paperDetail.value.startTime ?? undefined,
        endTime: paperDetail.value.endTime ?? undefined,
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
        paperFolderId: paperDetail.value.paperFolderId,
        localIpAllowed: paperDetail.value.localIpAllowed,
        publicIpAllowed: paperDetail.value.publicIpAllowed,
        numberAttempt: paperDetail.value.numberAttempt || 1,
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

const accessOptions = [
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
const groupClassFilter = ref({ keyword: '', pageNumber: 0, pageSize: 100, orderBy: ['id'], queryType: 1 })

const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClasses(groupClassFilter.value)
    groupClasses.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const confirmPublish = async () => {
  const confirmed = await confirm({
    title: 'Confirm Publish',
    message: `Are you sure you want to publish this exam?`,
    okText: 'Publish',
    cancelText: 'Cancel',
    size: 'small',
  })

  if (confirmed) {
    saveDraffPaper(StatusPaper.publish)
  }
}

const saveDraffPaper = (status: StatusPaper) => {
  loading.value = true
  editPaper.value.status = status

  const accessPaperSet = ref<PaperAccess[] | null>(null)

  if (valueOption.value === AccessType.ByClass) {
    accessPaperSet.value = checkedPermissionsClassAccess.value.map((classId) => ({ classId: classId }))
    // lấy lại những accesspaper cho học sinh ở trước đó không cập nhật
    const accessOldUser = editPaper.value.paperAccesses?.filter((access) => access.userId !== null)
    if (accessOldUser) {
      accessPaperSet.value.push(...accessOldUser)
    }
  }
  if (valueOption.value === AccessType.ByStudent) {
    accessPaperSet.value = checkedPermissionsStudentAccess.value.map((userId) => ({ userId: userId }))

    const accessOldClass = editPaper.value.paperAccesses?.filter((access) => access.classId !== null)
    if (accessOldClass) {
      accessPaperSet.value.push(...accessOldClass)
    }
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
    .then(async () => {
      notify({
        message: 'Update successfully',
        color: 'success',
      })
      await getPaperDetail()
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        message: message,
        color: 'danger',
      })
    })
    .finally(() => {
      loading.value = false
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
  { label: 'When all students submitted or exam runs out', value: ShowResult.WhenAllStudentSubmitted },
])
const showQuestionAnswerOptions = computed(() => [
  { label: 'No', value: ShowQuestionAnswer.No },
  { label: 'When submitted', value: ShowQuestionAnswer.WhenSubmitted },
  { label: 'When all students submitted', value: ShowQuestionAnswer.WhenAllStudentSubmitted },
])

const backToPage = () => {
  router.push({ name: 'paper-config', params: { id: paperId } })
}

const showWhoAssignedDetail = ref(false)

const getAccessPaperRequest = ref<GetAccessPaperRequest>({
  paperId: paperId.toString(),
})

const groupAccessPaper = ref<GroupClassAccessPaper[]>([])

const getGroupAccessPaper = async () => {
  try {
    const res = await paperStore.getGroupClassesAccessPaper(getAccessPaperRequest.value)
    groupAccessPaper.value = res.data
  } catch (error) {
    notify({
      message: `Get fail access group ${error}`,
      color: 'danger',
    })
  }
}

const checkClassHasSelectedStudent = (students?: Student[]) => {
  if (students) {
    return students.some((student) => checkedPermissionsStudentAccess.value.includes(student.id))
  }
  return false
}

onMounted(async () => {
  await getPaperDetail()
  getGroupClasses()
  getSubjects()
})

const form = useForm('paperConfigForm')
</script>
<template>
  <VaInnerLoading :loading="loading">
    <VaForm ref="paperConfigForm" stateful class="flex flex-col gap-2">
      <div class="">
        <div class="flex justify-center" style="align-items: center">
          <VaCardTitle class="flex gap-2"
            ><span>Exam name:</span><span class="va-h5 va-text-bold">{{ paperDetail?.examName }}</span></VaCardTitle
          >
        </div>
        <VaCard class="mb-3">
          <VaCardTitle class="justify-between align-center">
            <VaButton size="small" @click="backToPage">
              <VaIcon name="keyboard_arrow_left" />
            </VaButton>
            <p>Configuration type</p>
            <div></div>
            <!-- <VaSwitch v-model="valueSwitch" true-inner-label="Exam" false-inner-label="Practice" /> -->
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
                :rules="[
                  (v: any) => (v !== null && v !== undefined) || 'Field is required',
                  (v: any) => v > 0 || 'Value must be greater than 0',
                ]"
                manual-input
                class="mb-2 w-full pl-1"
              />
              <div class="mb-2 pr-1">
                <VueDatePicker
                  v-model="editPaper.startTime"
                  mode="single"
                  :action-row="{ showNow: true }"
                  :is-24="true"
                  enable-seconds
                  :clearable="true"
                  :text-input="dateInputFormat"
                  :month-change-on-scroll="true"
                  :month-change-on-arrows="true"
                  :min-date="new Date(new Date())"
                  placeholder="Enter start time"
                />
              </div>
              <div class="mb-2 pr-1">
                <VueDatePicker
                  v-model="editPaper.endTime"
                  mode="single"
                  :action-row="{ showNow: true }"
                  :is-24="true"
                  enable-seconds
                  :clearable="true"
                  :text-input="dateInputFormat"
                  :month-change-on-scroll="true"
                  :month-change-on-arrows="true"
                  placeholder="Enter end time"
                  :min-date="new Date(editPaper.startTime ?? new Date())"
                />
              </div>
              <div class="col-span-2 justify-end flex">
                <VaButton size="small" preset="secondary" border-color="primary" @click="resetAccessTime"
                  >Reset time
                </VaButton>
              </div>
              <div class="col-span-2">
                <VaTextarea v-model="editPaper.description" label="description" class="min-w-[100%]" />
              </div>
              <div class="col-span-2">
                <p class="mt-2 text-xs va-text-bold">Student is allowed to take the exam?</p>
                <VaButton
                  preset="secondary"
                  class="mr-6 mb-2"
                  size="small"
                  @click="showWhoAssignedDetail = !showWhoAssignedDetail"
                >
                  Show assigned student list
                </VaButton>
                <VaRadio v-model="valueOption" :options="accessOptions" class="assign-radio mb-2" value-by="value" />
              </div>
              <div class="col-span-2">
                <div v-if="groupClasses !== null" class="grid grid-cols-3 gap-2">
                  <VaCard outlined class="border-style col-span-1">
                    <VaCardTitle>
                      <VaInput
                        v-model="groupClassFilter.keyword"
                        placeholder="Search group class"
                        @input="getGroupClasses()"
                      />
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
                      <VaInput
                        v-model="classFilter.keyword"
                        placeholder="Search class in group"
                        @input="getClassByGroupClass(selectedGroupClass)"
                      />
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
                            :preset="checkClassHasSelectedStudent(classroom.students) ? 'primary' : 'secondary'"
                            :color="checkClassHasSelectedStudent(classroom.students) ? 'success' : 'secondary'"
                            :border-color="checkClassHasSelectedStudent(classroom.students) ? 'success' : 'primary'"
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
              <!-- <VaCounter
                v-model="editPaper.numberAttempt"
                :rules="[(v: any) => v > 0 || 'Field is required']"
                label="Submitted"
                manual-input
                class="mb-2 w-full pl-1"
              /> -->
            </div>

            <div class="grid grid-cols-2">
              <VaInput
                v-model="editPaper.publicIpAllowed"
                class="mb-2 pr-1"
                label="Allowed Public Ip Address"
                placeholder="Enter Ip Address"
              />
              <VaInput
                v-model="editPaper.localIpAllowed"
                class="mb-2 pr-1 pl-1"
                label="Allowed local Ip Address"
                placeholder="Enter Ip Address"
              />
            </div>
          </VaCardContent>
        </VaCard>

        <VaCard class="mb-3">
          <!-- <VaCardTitle> point an answers review </VaCardTitle> -->
          <VaDivider class="m-0" />
          <VaCardContent>
            <div class="mb-2">
              <span class="va-title">Show score</span>
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
          <VaButton
            color="warning"
            size="small"
            class="p-1 pr-2 pl-2 mr-1"
            :disabled="!form.validate()"
            @click="saveDraffPaper(StatusPaper.unpublish)"
            >Save draft
          </VaButton>
          <VaButton size="small" class="p-1 pr-2 pl-2 ml-1" :disabled="!form.validate()" @click="confirmPublish"
            >Publish</VaButton
          >
        </div>
      </div>
    </VaForm>
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

    <VaModal v-model="showWhoAssignedDetail" close-button hide-default-actions>
      <WhoAssignedPaperDetailModal
        :paper-detail="paperDetail"
        :group-access-paper="groupAccessPaper"
        :access-type="paperDetail?.shareType as AccessType"
      />
    </VaModal>
  </VaInnerLoading>
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
