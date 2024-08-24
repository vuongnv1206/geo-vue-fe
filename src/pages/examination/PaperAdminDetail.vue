<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AssignPaperModal from './widgets/AssignPaperModal.vue'
import { usePaperStore } from '@/stores/modules/paper.module'
import {
  PaperDto,
  AccessType,
  PaperAccess,
  UpdatePaperRequest,
  SubmitPaperResponse,
  StatusPaper,
  GetAccessPaperRequest,
  GroupClassAccessPaper,
  PaperPermission,
  SharePaperRequest,
} from './types'
import { useToast, useModal } from 'vuestic-ui'
import QuestionView from '../question/widgets/QuestionView.vue'
import { avatarColor, format } from '@/services/utils'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/modules/auth.module'
import WhoAssignedPaperDetailModal from './widgets/WhoAssignedPaperDetailModal.vue'
import { getErrorMessage } from '@/services/utils'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { GroupTeacher, TeacherTeam, TeacherTeamTeacherGroupCombine } from '../teacher-group/types'
import { UserDetail } from '../user/types'

const authStore = useAuthStore()
const currentUserId = authStore.user?.id

const route = useRoute()
const router = useRouter()
const paperStore = usePaperStore()
const { init: notify } = useToast()
const { confirm } = useModal()
const paperDetail = ref<PaperDto | null>(null)

const paperId = route.params.id as string
const getPaperDetail = async () => {
  try {
    const res = await paperStore.paperDetail(paperId)
    paperDetail.value = res
  } catch (error) {
    notify({
      message: `Not Found ${error}`,
      color: 'danger',
    })
  }
}

const showSidebar = ref(true)
const valueCollapses = ref([])

const showModalDetail = ref(false)
const showAssignPaperModal = ref(false)

const deletePaper = async () => {
  const result = await confirm({
    message: `Are you sure want to delete "${paperDetail.value?.examName}"?`,
    title: 'Delete Paper',
    okText: 'Confirm',
    cancelText: 'Cancel',
    size: 'small',
  })

  if (result && paperDetail.value !== null) {
    await paperStore
      .deletePaper(paperDetail.value.id)
      .then(() => {
        notify({
          message: `Delete ${paperDetail.value?.examName} successfully`,
          color: 'success',
        })
        router.push({ name: 'paper-folder' })
      })
      .catch((error) => {
        notify({
          message: `Failed to delete \n ${error}`,
          color: 'danger',
        })
      })
  }
}

const paperConfigAction = () => {
  router.push({ name: 'paper-config', params: { id: route.params.id } })
}

const examMonitorAction = () => {
  router.push({ name: 'monitor-exam', params: { id: route.params.id } })
}

const editPaper = ref<UpdatePaperRequest>({
  id: '',
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
  paperFolderId: '',
})

const handleSaveAssigned = async (shareType: AccessType, accessPaperList: PaperAccess[]) => {
  showAssignPaperModal.value = false
  if (paperDetail.value) {
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
      paperAccesses: accessPaperList,
      shareType: shareType,
      subjectId: paperDetail.value.subjectId,
      paperFolderId: paperDetail.value.paperFolderId,
    }

    paperStore
      .paperUpdate(paperId.toString(), editPaper.value)
      .then(async () => {
        notify({
          message: 'Update successfully',
          color: 'success',
        })
        await getPaperDetail()
        await getAccessPaperGroups()
      })
      .catch((error) => {
        notify({
          message: getErrorMessage(error),
          color: 'danger',
        })
      })
  }
}

const submittedStudents = ref<SubmitPaperResponse | null>(null)
const dataFilterSubmittedStudent = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 10,
  orderBy: [],
  paperId: paperId,
  classId: '',
})

const valueClassInGroupTap = ref('')

const getSubmittedStudents = async (classId?: string) => {
  try {
    dataFilterSubmittedStudent.value.classId = valueClassInGroupTap.value

    if (classId) {
      dataFilterSubmittedStudent.value.classId = classId
    }

    submittedStudents.value = await paperStore.getSubmittedStudentsInPaper(paperId, dataFilterSubmittedStudent.value)
  } catch (error) {
    notify({
      message: `Failed to get submitted students \n ${error}`,
      color: 'danger',
    })
  }
}

const navigateToExamReview = (paperId: string, userId: string, submitPaperId: string) => {
  router.push({
    name: 'exam-review',
    params: {
      paperId,
      userId,
      submitPaperId,
    },
  })
}
const navigateToManageQuestions = () => {
  router.push({ name: 'manage-questions', params: { paperId: paperId } })
}

const showSelectClassModal = ref(false)
const selectedGroupClassName = ref('')

const selectedGroupClass = ref<GroupClassAccessPaper>()

const selectClassInGroup = async (classId: string) => {
  try {
    // lấy ra group có class được chọn
    selectedGroupClass.value = accessPaperGroups.value.find((group) =>
      group.classes.some((classroom) => classroom.id == classId),
    )

    selectedGroupClassName.value = selectedGroupClass.value?.name || ''
    // Update the v-model value for VaTabs
    showSelectClassModal.value = false

    await onTabChange(classId)

    await getSubmittedStudents(classId)
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = (newPage: number) => {
  dataFilterSubmittedStudent.value.pageNumber = newPage
  getSubmittedStudents()
}

const statisticExam = () => {
  router.push({ name: 'admin-exam-statistic', params: { id: route.params.id } })
}

const getAccessPaperRequest = ref<GetAccessPaperRequest>({
  paperId: paperId,
})

const accessPaperGroups = ref<GroupClassAccessPaper[]>([])

const getAccessPaperGroups = async () => {
  try {
    const res = await paperStore.getGroupClassesAccessPaper(getAccessPaperRequest.value)
    accessPaperGroups.value = res.data
  } catch (error) {
    notify({
      message: `Get fail access group ${error}`,
      color: 'danger',
    })
  }
}

const showWhoAssignedDetail = ref(false)

const onTabChange = async (classId: string) => {
  valueClassInGroupTap.value = classId
  await getSubmittedStudents(classId)
}

// const statusSubmitOptions: any = [
//   { label: 'done', value: 1 },
//   { label: 'not yet', value: 2 },
//   { label: 'miss', value: 3 },
// ]

// const statusSubmitValue = ref(1)

//Share paper
const onPaperShare = () => {
  getTeacherGroups()
  doShowSharePaperModal.value = true
}
const doShowSharePaperModal = ref(false)
const doShowPaperPermissionFormAddModal = ref(false)
const doShowPaperPermissionFormModal = ref(false)
const singleSelect = ref<TeacherTeamTeacherGroupCombine | null>(null)
const autoCompleteSearchValue = ref('')
const editPermissionValue = ref<PaperPermission>({} as PaperPermission)
const optionsSelect = ref<TeacherTeamTeacherGroupCombine | null>(null)
const isLoadingSelect = ref(false)
const groupTeacherStore = useGroupTeacherStore()
const groupTeachers = ref<GroupTeacher[]>([])
const teacherTeams = ref<TeacherTeam[]>([])
const dataFilter = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 1000,
  orderBy: ['id'],
})
const options = ref<TeacherTeamTeacherGroupCombine[]>([])
const getTeacherGroups = () => {
  isLoadingSelect.value = true
  groupTeacherStore.getGroupTeachers(dataFilter).then((res) => {
    groupTeachers.value = res.data
    groupTeacherStore
      .getTeacherTeams(dataFilter)
      .then((res) => {
        teacherTeams.value = res.data
        options.value = []
        groupTeachers.value.forEach((groupTeacher) => {
          options.value.push({
            groupTeacher: groupTeacher,
            teacherTeam: null,
          })
        })
        teacherTeams.value.forEach((teacherTeam) => {
          options.value.push({
            groupTeacher: null,
            teacherTeam: teacherTeam,
          })
        })
      })
      .finally(() => {
        isLoadingSelect.value = false
      })
  })
}

const permissionEdit = ref({
  canView: false,
  canAdd: false,
  canUpdate: false,
  canDelete: false,
  canShare: false,
})
const getOptionName = (option: TeacherTeamTeacherGroupCombine) => {
  if (option.groupTeacher) {
    const optionData = { data: option.groupTeacher.name, isUser: false }
    return optionData
  } else {
    const optionData = { data: option.teacherTeam?.teacherName, isUser: true }
    return optionData
  }
}

const AddPermission = (option: TeacherTeamTeacherGroupCombine) => {
  optionsSelect.value = option

  const user = ref<UserDetail | null>(null)
  if (option.teacherTeam) {
    user.value = {
      id: option.teacherTeam.teacherId,
      email: option.teacherTeam.email,
      firstName: option.teacherTeam.teacherName,
      emailConfirmed: false,
      phoneNumberConfirmed: false,
      lastName: '',
      phoneNumber: '',
      imageUrl: '',
      isActive: false,
      userName: '',
      birthDate: '',
      gender: true,
    }
  }

  editPermissionValue.value = {
    user: user.value,
    groupTeacherId: option.groupTeacher?.id || '',
    groupTeacher: option.groupTeacher,
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
    createdBy: '',
    createdOn: '',
    lastModifiedBy: '',
    lastModifiedOn: '',
    id: '',
    paperId: paperDetail.value?.id || '',
    userId: '',
  }

  permissionEdit.value = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
  }
  doShowPaperPermissionFormAddModal.value = true
}
const getNameUserGroup = (option: PaperPermission | null) => {
  if (option?.user) {
    return option.user.firstName + ' ' + option.user.lastName
  } else {
    return option?.groupTeacher?.name
  }
}

const allPermissionFalse = (permission: PaperPermission) => {
  return !permission.canView && !permission.canAdd && !permission.canUpdate && !permission.canDelete
}

const editPermission = (permission: PaperPermission) => {
  editPermissionValue.value = { ...permission }

  permissionEdit.value = {
    canView: permission.canView,
    canAdd: permission.canAdd,
    canUpdate: permission.canUpdate,
    canDelete: permission.canDelete,
    canShare: permission.canShare,
  }
  doShowPaperPermissionFormModal.value = true
}

const canEdit = ref(false)
watch(
  () => permissionEdit.value,
  (value) => {
    if (!value.canView) {
      canEdit.value = false
    }
  },
  { deep: true },
)

watch(
  () => canEdit.value,
  (value) => {
    if (!value) {
      permissionEdit.value = {
        canView: false,
        canAdd: false,
        canUpdate: false,
        canDelete: false,
        canShare: false,
      }
    } else {
      permissionEdit.value.canView = true
      permissionEdit.value.canAdd = true
      permissionEdit.value.canUpdate = true
      permissionEdit.value.canDelete = true
    }
  },
)

watch(
  () => permissionEdit.value.canShare,
  (value) => {
    if (value) {
      canEdit.value = true
    }
  },
  { deep: true },
)

const handleDeletePermission = () => {
  permissionEdit.value = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
  }
  onSharePaperPermission()
}

const onSharePaperPermission = () => {
  const sharePermission = ref<SharePaperRequest>({
    canView: permissionEdit.value.canView,
    canAdd: permissionEdit.value.canAdd,
    canUpdate: permissionEdit.value.canUpdate,
    canDelete: permissionEdit.value.canDelete,
    canShare: permissionEdit.value.canShare,
    paperId: editPermissionValue.value.paperId,
    userId: null,
    groupId: null,
  })
  if (editPermissionValue.value?.user) {
    sharePermission.value.userId = editPermissionValue.value.user.id
  }
  if (editPermissionValue.value?.groupTeacherId) {
    sharePermission.value.groupId = editPermissionValue.value.groupTeacherId
  }

  paperStore
    .sharePaper(editPermissionValue.value.paperId, sharePermission.value)
    .then(() => {
      notify({
        message: 'Paper folder permission update',
        color: 'success',
      })
      doShowSharePaperModal.value = false

      getPaperDetail()
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        message:
          'Failed to update paper folder permission ' +
          editPermissionValue.value?.user?.firstName +
          ' ' +
          editPermissionValue.value?.user?.lastName +
          '\n' +
          message,
        color: 'danger',
      })
    })
}

type PermissionType = 'canView' | 'canUpdate' | 'canShare'
const checkPaperPermission = (permissionType: PermissionType) => {
  if (currentUserId === paperDetail.value?.createdBy) {
    return true
  }

  if (paperDetail.value?.paperPermissions) {
    // Check individual teacher permission
    const individualPermission = paperDetail.value.paperPermissions.some(
      (permission) => permission.userId === currentUserId && permission[permissionType],
    )

    // Check group teacher permission
    const groupPermission = paperDetail.value.paperPermissions.some(
      (permission) =>
        permission.groupTeacherId !== null &&
        permission.groupTeacher?.teacherTeams?.some(
          (teacher) => teacher.teacherId === currentUserId && permission[permissionType],
        ),
    )

    return individualPermission || groupPermission
  }

  return false
}

const canViewGuest = computed(() => checkPaperPermission('canView'))
const canEditGuest = computed(() => checkPaperPermission('canUpdate'))
const canShareGuest = computed(() => checkPaperPermission('canShare'))

onMounted(async () => {
  await getPaperDetail()
  await getAccessPaperGroups()
})
</script>

<template>
  <VaLayout v-if="canViewGuest" style="height: 500px">
    <template #top>
      <VaNavbar class="py-2">
        <template #left>
          <VaButton :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar" />
        </template>
        <template #right>
          <VaNavbarItem class="">
            <VaInput placeholder="Search" />
          </VaNavbarItem>
        </template>
      </VaNavbar>
    </template>

    <template #left>
      <VaCard v-if="showSidebar" class="mt-2" style="min-width: 20rem; max-width: 30rem">
        <VaCardTitle class="flex justify-between">
          <span style="font-size: 1rem"> {{ paperDetail?.examName }}</span>
        </VaCardTitle>
        <VaCardContent>
          <VaList class="va-text-secondary text-xs mb-2">
            <VaListItem>
              <VaIcon name="person" class="mr-1 material-symbols-outlined" /> Creator: {{ paperDetail?.creatorName }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="event" class="mr-1 material-symbols-outlined" /> Created at:
              {{ format.formatDate(new Date(paperDetail?.createdOn || '')) }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="pending_actions" class="mr-1 material-symbols-outlined" /> Access time:
              {{ paperDetail?.startTime ? format.formatDateNoTime(new Date(paperDetail?.startTime)) : 'N/a' }} -
              {{ paperDetail?.endTime ? format.formatDateNoTime(new Date(paperDetail?.endTime)) : 'N/a' }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="timer" class="mr-1 material-symbols-outlined" /> Duration:
              {{ format.formatDurationMinute(paperDetail?.duration) }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="task" class="mr-1 material-symbols-outlined" /> Submitted: {{ paperDetail?.totalAttended }}
            </VaListItem>
          </VaList>

          <VaCard outlined class="mb-2">
            <VaCardTitle>Menu</VaCardTitle>
            <VaCardContent>
              <VaMenuList class="w-full">
                <VaMenuItem :disabled="!canEditGuest" @click="paperConfigAction">
                  <VaIcon name="settings" class="material-symbols-outlined" /> Setting
                </VaMenuItem>
                <VaMenuItem :disabled="!canShareGuest" @click="onPaperShare()">
                  <VaIcon name="share" class="material-symbols-outlined" /> Share
                </VaMenuItem>
                <VaMenuItem @click="statisticExam">
                  <VaIcon name="monitoring" class="material-symbols-outlined" /> Statistics
                </VaMenuItem>
                <VaMenuItem @click="examMonitorAction">
                  <VaIcon name="settings" class="material-symbols-outlined" /> Advanced monitoring
                </VaMenuItem>
                <VaMenuItem
                  class="va-text-danger"
                  :disabled="currentUserId != paperDetail?.createdBy"
                  @click="deletePaper"
                >
                  <VaIcon name="delete" class="material-symbols-outlined" />
                  Delete
                </VaMenuItem>
              </VaMenuList>
            </VaCardContent>
          </VaCard>

          <VaCard>
            <VaCardTitle class="flex justify-between">
              <VaButton
                preset="plain"
                class="mr-6 mb-2"
                size="small"
                color="textPrimary"
                @click="showWhoAssignedDetail = !showWhoAssignedDetail"
              >
                Assigned to
              </VaButton>
              <div>
                <VaButton
                  v-if="canEditGuest || canShareGuest"
                  preset="secondary"
                  size="small"
                  @click="showAssignPaperModal = !showAssignPaperModal"
                >
                  <VaIcon name="edit_square" size="small" class="material-symbols-outlined" />
                  edit
                </VaButton>
              </div>
            </VaCardTitle>
            <VaModal v-slot="{ cancel, ok }" v-model="showAssignPaperModal" hide-default-actions>
              <AssignPaperModal
                :paper="paperDetail"
                @close="cancel"
                @save="
                  (shareType: AccessType, accessPaperList: PaperAccess[]) => {
                    handleSaveAssigned(shareType, accessPaperList)
                    ok()
                  }
                "
              />
            </VaModal>
            <VaCardContent v-if="accessPaperGroups.length > 0" class="p-0">
              <VaCard outlined class="container-groupClass">
                <VaCardContent class="p-1">
                  <VaAccordion v-model="valueCollapses" class="max-w-sm text-xs" multiple>
                    <VaCollapse v-for="(groupClass, index) in accessPaperGroups" :key="index" :header="groupClass.name">
                      <template #content>
                        <div class="grid md:grid-cols-3 sm:grid-cols-2 gap-2">
                          <VaButton
                            v-for="classroom in groupClass.classes"
                            :key="classroom.id"
                            preset="secondary"
                            size="small"
                            border-color="secondary"
                            text-color="secondary"
                            class="class-button"
                            @click="selectClassInGroup(classroom.id)"
                          >
                            {{ classroom.name.slice(0, 10) }}
                          </VaButton>
                        </div>
                      </template>
                    </VaCollapse>
                  </VaAccordion>
                </VaCardContent>
              </VaCard>
            </VaCardContent>
          </VaCard>

          <VaCard>
            <VaCardTitle class="flex justify-between">
              <span> Content</span>
              <div>
                <VaButton
                  v-if="canEditGuest || canShareGuest"
                  preset="secondary"
                  size="small"
                  @click="navigateToManageQuestions"
                >
                  <VaIcon name="edit_square" size="small" class="material-symbols-outlined" />
                  edit
                </VaButton>
              </div>
            </VaCardTitle>
            <VaCardContent>
              <VaButton
                preset="secondary"
                size="small"
                text-color="secondary"
                class="w-full"
                @click="showModalDetail = true"
              >
                See detail
              </VaButton>
              <VaModal v-model="showModalDetail" close-button hide-default-actions max-height="80vh">
                <VaCard class="p-0">
                  <p>{{ paperDetail?.examName }}</p>
                  <VaDivider />
                  <VaCardContent class="p-0">
                    <template v-for="question in paperDetail?.questions" :key="question.id">
                      <QuestionView :question="question" :index="null" :is-stripe="false" :show-action-button="false" />
                    </template>
                  </VaCardContent>
                </VaCard>
              </VaModal>
            </VaCardContent>
          </VaCard>
        </VaCardContent>
      </VaCard>
    </template>

    <template #content>
      <VaCardTitle>Student submit ({{ submittedStudents?.data.length || 0 }}/0)</VaCardTitle>
      <VaCard class="mt-2 ml-2" style="height: 60vh">
        <VaCardContent
          v-if="paperDetail?.shareType === AccessType.ByClass || paperDetail?.shareType === AccessType.ByStudent"
          class="p-0"
        >
          <VaCardTitle class="flex justify-between">
            <VaButton size="small" @click="showSelectClassModal = !showSelectClassModal"
              >Select class group: {{ selectedGroupClassName }}
            </VaButton>
          </VaCardTitle>
          <VaModal v-model="showSelectClassModal" size="large" hide-default-actions>
            <VaCard outlined>
              <VaCardContent>
                <VaScrollContainer class="min-h-[80vh] max-h-[90vh]">
                  <VaCollapse v-for="(groupClass, index) in accessPaperGroups" :key="index" :header="groupClass.name">
                    <template #content>
                      <div
                        v-if="paperDetail?.shareType === AccessType.ByClass"
                        class="grid md:grid-cols-6 sm:grid-cols-4 gap-2"
                      >
                        <VaButton
                          v-for="classroom in groupClass.classes"
                          :key="classroom.id"
                          preset="secondary"
                          size="small"
                          border-color="secondary"
                          text-color="secondary"
                          class="class-button"
                          @click="selectClassInGroup(classroom.id)"
                        >
                          {{ classroom.name.slice(0, 10) }}
                        </VaButton>
                      </div>

                      <div
                        v-if="paperDetail?.shareType === AccessType.ByStudent"
                        class="grid md:grid-cols-6 sm:grid-cols-4 gap-2"
                      >
                        <VaButton
                          v-for="classroom in groupClass.classes"
                          :key="classroom.id"
                          preset="secondary"
                          size="small"
                          border-color="secondary"
                          text-color="secondary"
                          class="class-button"
                          @click="selectClassInGroup(classroom.id)"
                        >
                          {{ classroom.name.slice(0, 10) }}
                        </VaButton>
                      </div>
                    </template>
                  </VaCollapse>
                </VaScrollContainer>
              </VaCardContent>
            </VaCard>
          </VaModal>
          <VaDivider class="mb-0" />
          <VaTabs v-model="valueClassInGroupTap" @update:modelValue="onTabChange">
            <template #tabs>
              <VaTab
                v-for="classroom in selectedGroupClass?.classes"
                :key="classroom.id"
                :name="classroom.id"
                class="pr-2 pl-2"
              >
                {{ classroom.name }}
              </VaTab>
            </template>
          </VaTabs>
        </VaCardContent>
        <VaCardContent class="p-2 grid md:grid-cols-4 xs:grid-cols-2 mt-3">
          <VaCard
            v-for="submittedStudent in submittedStudents?.data"
            :key="submittedStudent.id"
            outlined
            class="mr-2 cursor-pointer"
            @click="navigateToExamReview(submittedStudent.paperId, submittedStudent.createdBy, submittedStudent.id)"
          >
            <div class="p-2 flex justify-between">
              <div class="flex">
                <VaAvatar size="small" class="mr-2">
                  {{ submittedStudent.creatorName.charAt(0).toUpperCase() }}
                </VaAvatar>
                <div>
                  <p>
                    <b>{{ submittedStudent.creatorName }}</b>
                  </p>
                  <span style="font-weight: none">Point: {{ submittedStudent.totalMark }}</span>
                </div>
              </div>
              <div>
                <VaChip
                  square
                  size="small"
                  :color="
                    submittedStudent.status === 'Doing'
                      ? 'warning'
                      : submittedStudent.status === 'End'
                        ? 'success'
                        : 'secondary'
                  "
                  >{{ submittedStudent.status }}</VaChip
                >
              </div>
            </div>
            <VaDivider class="m-0" />
            <VaCardContent class="p-2">
              <template v-if="submittedStudent.endTime !== null && submittedStudent.endTime !== undefined">
                <div class="flex justify-between">
                  <p class="va-text-secondary text-xs">Duration:</p>
                  <p class="va-text-secondary text-xs">
                    {{
                      format.formatTimeDifference(
                        new Date(submittedStudent.startTime),
                        new Date(submittedStudent.endTime),
                      )
                    }}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="va-text-secondary text-xs">Start:</p>
                  <p class="va-text-secondary text-xs">{{ format.formatDate(new Date(submittedStudent.startTime)) }}</p>
                </div>
                <div class="flex justify-between">
                  <p class="va-text-secondary text-xs">Finish:</p>
                  <p class="va-text-secondary text-xs">{{ format.formatDate(new Date(submittedStudent.endTime)) }}</p>
                </div>
              </template>
              <template v-if="submittedStudent.endTime === null && submittedStudent.endTime === undefined">
                <div class="flex justify-between">
                  <p class="va-text-secondary text-xs">Start:</p>
                  <p class="va-text-secondary text-xs">{{ format.formatDate(new Date(submittedStudent.startTime)) }}</p>
                </div>
              </template>
            </VaCardContent>
          </VaCard>
        </VaCardContent>
        <VaPagination
          v-if="submittedStudents?.totalPages"
          v-model="submittedStudents.currentPage"
          :pages="submittedStudents.totalPages"
          :visible-pages="3"
          buttons-preset="secondary"
          class="justify-center sm:justify-end mr-2"
          @update:modelValue="handlePageChange"
        />
      </VaCard>
    </template>
  </VaLayout>
  <VaModal v-model="showWhoAssignedDetail" close-button hide-default-actions>
    <WhoAssignedPaperDetailModal
      :paper-detail="paperDetail"
      :group-access-paper="accessPaperGroups"
      :access-type="paperDetail?.shareType as AccessType"
    />
  </VaModal>

  <VaModal v-model="doShowSharePaperModal" mobile-fullscreen size="small" close-button stateful hide-default-actions>
    <h1 class="va-h5 mb-4">Share paper "{{ paperDetail?.examName }}"</h1>
    <VaSelect
      v-model="singleSelect"
      v-model:search="autoCompleteSearchValue"
      class="col-span-1"
      :loading="isLoadingSelect"
      label="Select User or Group"
      :options="options"
      searchable
      :text-by="
        (option: TeacherTeamTeacherGroupCombine) => getOptionName(option as TeacherTeamTeacherGroupCombine).data
      "
      placeholder="Search user or Group"
      track-by="id"
    >
      <template #appendInner>
        <VaIcon name="fas-search" />
      </template>
      <template #option="{ option }">
        <div class="flex justify-between items-center p-2">
          <div class="flex items-center gap-2">
            <VaAvatar
              v-if="getOptionName(option as TeacherTeamTeacherGroupCombine).isUser"
              :size="48"
              :color="avatarColor(getOptionName(option as TeacherTeamTeacherGroupCombine).data)"
              >{{
                getOptionName(option as TeacherTeamTeacherGroupCombine)
                  .data?.charAt(0)
                  .toUpperCase()
              }}
            </VaAvatar>
            <VaAvatar v-else :size="48" color="warning" icon="group"> </VaAvatar>
            <div>
              <div>{{ getOptionName(option as TeacherTeamTeacherGroupCombine).data }}</div>
              <div class="text-sm text-gray-500">
                {{ getOptionName(option as TeacherTeamTeacherGroupCombine).data }}
              </div>
            </div>
          </div>
          <div>
            <VaPopover
              v-if="
                (option as TeacherTeamTeacherGroupCombine).teacherTeam?.teacherId ===
                '00000000-0000-0000-0000-000000000000'
              "
              class="mr-2 mb-2"
              message="Not registered yet"
            >
              <VaIcon class="mr-2" name="no_accounts" />
            </VaPopover>
            <VaButton
              :disabled="
                (option as TeacherTeamTeacherGroupCombine).teacherTeam?.teacherId ===
                '00000000-0000-0000-0000-000000000000'
              "
              size="small"
              preset="secondary"
              border-color="primary"
              @click="AddPermission(option as TeacherTeamTeacherGroupCombine)"
            >
              Select
            </VaButton>
          </div>
        </div>
      </template>
    </VaSelect>
    <div class="mt-5">
      <VaScrollContainer class="h-80" vertical>
        <VaList>
          <VaListLabel> Permissions </VaListLabel>

          <VaListItem v-for="(permission, index) in paperDetail?.paperPermissions" :key="index" class="list__item ml-5">
            <VaListItemSection avatar>
              <VaAvatar
                v-if="permission.userId !== null ? true : false"
                :size="42"
                :color="avatarColor(getNameUserGroup(permission))"
              >
                {{ getNameUserGroup(permission)?.charAt(0) }}
              </VaAvatar>
              <VaAvatar v-else :size="42" color="warning" icon="group"> </VaAvatar>
            </VaListItemSection>

            <VaListItemSection>
              <VaListItemLabel>
                {{ getNameUserGroup(permission) }}
              </VaListItemLabel>

              <VaListItemLabel caption>
                {{ permission.user?.email }}
              </VaListItemLabel>
            </VaListItemSection>

            <VaListItemSection v-if="!allPermissionFalse(permission as PaperPermission)" icon>
              <VaButton
                v-if="paperDetail?.createdBy && paperDetail.createdBy == permission.user?.id"
                size="small"
                disabled
                preset="secondary"
                border-color="primary"
                class="mr-6 mb-2"
              >
                Owner
              </VaButton>
              <VaButton
                v-else
                size="small"
                preset="secondary"
                border-color="primary"
                class="mr-6 mb-2"
                @click="editPermission(permission)"
              >
                Edit Permissions
              </VaButton>
            </VaListItemSection>
          </VaListItem>
        </VaList>
      </VaScrollContainer>
    </div>
  </VaModal>

  <VaModal
    v-model="doShowPaperPermissionFormAddModal"
    ok-text="Save"
    size="small"
    @ok="
      () => {
        onSharePaperPermission()
      }
    "
  >
    <span class="va-h5 mb-5"
      >Grand Permissions for <b>"{{ getNameUserGroup(editPermissionValue) }}"</b></span
    >
    <VaForm>
      <div class="gap-4 ml-10 mt-10">
        <VaListItem>
          <VaListItemSection avatar>
            <VaAvatar :size="48" :color="avatarColor(getNameUserGroup(editPermissionValue))">{{
              getNameUserGroup(editPermissionValue)?.charAt(0)
            }}</VaAvatar>
          </VaListItemSection>
          <VaListItemSection>
            <VaListItemLabel>
              {{ getNameUserGroup(editPermissionValue) }}
            </VaListItemLabel>

            <VaListItemLabel caption>
              {{ editPermissionValue?.user?.email }}
            </VaListItemLabel>
          </VaListItemSection>
          <VaListItemSection icon>
            <VaPopover message="Delete permission" position="top">
              <VaButton
                round
                icon="mso-delete"
                color="danger"
                @click="
                  () => {
                    onSharePaperPermission()
                  }
                "
              >
                Delete
              </VaButton>
            </VaPopover>
          </VaListItemSection>
        </VaListItem>
      </div>
      <div class="flex flex-col gap-4 p-10">
        <VaCheckbox v-model="permissionEdit.canView" label="View" />
        <VaCheckbox v-model="editPaper" label="Edit" />
        <VaCheckbox v-model="permissionEdit.canShare" label="Share" />
      </div>
    </VaForm>
  </VaModal>

  <VaModal
    v-model="doShowPaperPermissionFormModal"
    ok-text="Save"
    size="small"
    @ok="
      () => {
        onSharePaperPermission()
      }
    "
  >
    <span class="va-h5 mb-5"
      >Edit Permissions for <b>"{{ getNameUserGroup(editPermissionValue) }}"</b></span
    >
    <VaForm>
      <div class="gap-4 ml-10 mt-10">
        <VaListItem>
          <VaListItemSection avatar>
            <VaAvatar :size="48" :color="avatarColor(getNameUserGroup(editPermissionValue))">{{
              getNameUserGroup(editPermissionValue)?.charAt(0)
            }}</VaAvatar>
          </VaListItemSection>
          <VaListItemSection>
            <VaListItemLabel>
              {{ getNameUserGroup(editPermissionValue) }}
            </VaListItemLabel>

            <VaListItemLabel caption>
              {{ editPermissionValue?.user?.email }}
            </VaListItemLabel>
          </VaListItemSection>
          <VaListItemSection icon>
            <VaPopover message="Delete permission" position="top">
              <VaButton
                round
                icon="mso-delete"
                color="danger"
                @click="
                  () => {
                    handleDeletePermission()
                  }
                "
              >
                Delete
              </VaButton>
            </VaPopover>
          </VaListItemSection>
        </VaListItem>
      </div>
      <div class="flex flex-col gap-4 p-10">
        <VaCheckbox v-model="permissionEdit.canView" label="View" />
        <VaCheckbox v-model="canEdit" label="Edit" />
        <VaCheckbox v-model="permissionEdit.canShare" label="Share" />
      </div>
    </VaForm>
  </VaModal>
</template>

<style scoped>
.container-groupClass {
  --va-card-outlined-border: 1px solid var(--va-background-element);
}

.class-button {
  --va-button-sm-font-size: 0.6rem;
}
</style>
