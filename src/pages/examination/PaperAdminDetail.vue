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
} from './types'
import { useToast, useModal } from 'vuestic-ui'
import QuestionView from '../question/widgets/QuestionView.vue'
import { format } from '@/services/utils'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/modules/auth.module'
import WhoAssignedPaperDetailModal from './widgets/WhoAssignedPaperDetailModal.vue'
import { getErrorMessage } from '@/services/utils'

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

const statusSubmitOptions: any = [
  { label: 'done', value: 1 },
  { label: 'not yet', value: 2 },
  { label: 'miss', value: 3 },
]

const statusSubmitValue = ref(1)

onMounted(async () => {
  await getPaperDetail()
  await getAccessPaperGroups()
})
</script>

<template>
  <VaLayout style="height: 500px">
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
                <VaMenuItem @click="paperConfigAction">
                  <VaIcon name="settings" class="material-symbols-outlined" /> Setting
                </VaMenuItem>
                <!-- <VaMenuItem> <VaIcon name="monitoring" class="material-symbols-outlined" /> Statistics </VaMenuItem> -->
                <VaMenuItem @click="statisticExam">
                  <VaIcon name="monitoring" class="material-symbols-outlined" /> Statistics
                </VaMenuItem>
                <VaMenuItem @click="examMonitorAction">
                  <VaIcon name="settings" class="material-symbols-outlined" /> Advanced monitoring
                </VaMenuItem>
                <VaMenuItem class="va-text-danger" @click="deletePaper">
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
                  v-if="currentUserId === paperDetail?.createdBy"
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
                  v-if="currentUserId === paperDetail?.createdBy"
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
            <VaSelect
              v-model="statusSubmitValue"
              :options="statusSubmitOptions"
              text-by="label"
              value-by="value"
              class="max-w-[120px]"
            />
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
</template>

<style scoped>
.container-groupClass {
  --va-card-outlined-border: 1px solid var(--va-background-element);
}

.class-button {
  --va-button-sm-font-size: 0.6rem;
}
</style>
