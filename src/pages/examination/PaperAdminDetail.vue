<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AssignPaperModal from './widgets/AssignPaperModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaperStore } from '@/stores/modules/paper.module'
import { PaperDto, SubmitPaperDto, AccessType, PaperAccess } from './types'
import { useToast, useModal } from 'vuestic-ui'
import QuestionView from '../question/widgets/QuestionView.vue'
import { Classrooms, GroupClass } from '@/pages/classrooms/types'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useClassStore } from '../../stores/modules/class.module'
import { format } from '@/services/utils'

const route = useRoute()
const router = useRouter()
const paperStore = usePaperStore()
const { init: notify } = useToast()
const { confirm } = useModal()
const paperDetail = ref<PaperDto | null>(null)

const valueClassInGroupTap = ref<string>(' ')

const paperId = route.params.id as string
const getPaperDetail = async () => {
  try {
    const res = await paperStore.paperDetail(paperId)
    paperDetail.value = res
    assignedOptionValue.value = paperDetail.value.shareType
    if (paperDetail.value.shareType === AccessType.ByClass) {
      await getGroupClasses()
      await groupTabFilter()
    } else if (paperDetail.value.shareType === AccessType.Everyone) {
      const allSubmit = (await getSubmittedStudents()) || null
      submittedStudents.value = allSubmit
    }
  } catch (error) {
    notify({
      message: `Not Found ${error}`,
      color: 'danger',
    })
  }
}
const groupClassFilter = ref({ keyword: '', pageNumber: 0, pageSize: 100, orderBy: ['id'] })

const groupClasses = ref<GroupClass[]>([])
const groupClassStores = useGroupClassStore()
const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClasses(groupClassFilter)
    if (paperDetail.value?.paperAccesses) {
      paperDetail.value.paperAccesses
        .filter((element) => element.classId !== null)
        .forEach((element) => {
          res.data.forEach((groupClass) => {
            if (groupClass.classes.some((x) => x.id === element.classId)) {
              if (!groupClasses.value.some((existingGroupClass) => existingGroupClass.id === groupClass.id)) {
                groupClasses.value.push(groupClass)
              }
            }
          })
        })
      await selectClassInGroup(groupClasses.value[0].classes[0].id)
    }
  } catch (error) {
    console.error(error)
  }
}

const showSidebar = ref(true)
const valueCollapses = ref([])

const showModalDetail = ref(false)
const showAssignPaperModal = ref(false)
const assignedOptionValue = ref<AccessType>()

const groupTabFilter = async () => {
  try {
    const studentsInClass = await classStore.getUserInClass(valueClassInGroupTap.value)

    if (submittedStudents.value) {
      const allSubmit = await getSubmittedStudents()
      if (allSubmit !== undefined) {
        submittedStudents.value = allSubmit.filter((submitPaper) => studentsInClass.includes(submitPaper.createdBy))
      }
    }
  } catch (error) {
    console.log(error)
  }
}

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

const handleSaveAssigned = async (selectedOption: AccessType) => {
  assignedOptionValue.value = selectedOption
  showAssignPaperModal.value = false
  if (assignedOptionValue.value === AccessType.ByClass) {
    await getGroupClasses()
    await groupTabFilter()
  }
}

const submittedStudents = ref<SubmitPaperDto[] | null>(null)
const dataFilterSubmittedStudent = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 10,
  orderBy: ['id'],
  paperId: paperId,
})
const getSubmittedStudents = async () => {
  try {
    const res = await paperStore.getSubmittedStudentsInPaper(paperId, dataFilterSubmittedStudent.value)
    return res.data
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

const showSelectClassModal = ref(false)
const classInSelectedGroup = ref<Classrooms[]>([])
const selectedGroupClassName = ref('')
const classStore = useClassStore()
const selectClassInGroup = async (classId: string) => {
  valueClassInGroupTap.value = classId
  try {
    const classDetail = await classStore.getClassById(classId)
    const res = await classStore.getClassroomByGroupClassId(classDetail.groupClassId)
    classInSelectedGroup.value = res.filter((classroom: Classrooms) =>
      paperDetail.value?.paperAccesses?.some((x: PaperAccess) => x.classId == classroom.id),
    )
    selectedGroupClassName.value = classDetail.groupClassName
    showSelectClassModal.value = false
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await getPaperDetail()
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
          <span> {{ paperDetail?.examName }}</span>
          <div>
            <VaButton preset="secondary" border-color="primary" size="small"> Copy link </VaButton>
          </div>
        </VaCardTitle>
        <VaCardContent>
          <VaList class="va-text-secondary text-xs mb-2">
            <VaListItem>
              <VaIcon name="event" class="mr-1 material-symbols-outlined" /> Created at:
              {{ format.formatDate(new Date(paperDetail?.createdOn || '')) }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="person" class="mr-1 material-symbols-outlined" /> Creator: {{ paperDetail?.creatorName }}
            </VaListItem>
            <VaListItem> <VaIcon name="task" class="mr-1 material-symbols-outlined" /> Submitted: 0 </VaListItem>
          </VaList>

          <VaCard outlined class="mb-2">
            <VaCardTitle>Menu</VaCardTitle>
            <VaCardContent>
              <VaMenuList class="w-full">
                <VaMenuItem @click="paperConfigAction">
                  <VaIcon name="settings" class="material-symbols-outlined" /> Setting
                </VaMenuItem>
                <VaMenuItem> <VaIcon name="monitoring" class="material-symbols-outlined" /> Statistics </VaMenuItem>
                <VaMenuItem>
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
              <span> Assigned to</span>
              <div>
                <VaButton preset="secondary" size="small" @click="showAssignPaperModal = !showAssignPaperModal">
                  <VaIcon name="edit_square" size="small" class="material-symbols-outlined" />
                  edit
                </VaButton>
              </div>
            </VaCardTitle>
            <VaModal v-slot="{ cancel, ok }" v-model="showAssignPaperModal" hide-default-actions>
              <AssignPaperModal
                :current-assigned="assignedOptionValue"
                :paper="paperDetail"
                @close="cancel"
                @save="
                  (data: AccessType) => {
                    handleSaveAssigned(data)
                    ok()
                  }
                "
              />
            </VaModal>
            <VaCardContent class="p-0">
              <VaButton
                v-if="assignedOptionValue == AccessType.Everyone"
                preset="secondary"
                border-color="none"
                size="small"
                text-color="secondary"
                class="w-full"
                @click="showAssignPaperModal = !showAssignPaperModal"
              >
                Everyone
              </VaButton>
              <div v-if="assignedOptionValue == AccessType.ByClass">
                <VaInput placeholder="Search by name" class="mb-1" />
                <VaCard outlined class="container-groupClass">
                  <VaCardContent class="p-1">
                    <VaAccordion v-model="valueCollapses" class="max-w-sm text-xs" multiple>
                      <VaCollapse v-for="(groupClass, index) in groupClasses" :key="index" :header="groupClass.name">
                        <template #content>
                          <div class="grid md:grid-cols-3 sm:grid-cols-2 gap-2">
                            <VaButton
                              v-for="classroom in groupClass.classes.filter((classroom: Classrooms) =>
                                paperDetail?.paperAccesses?.some((x: PaperAccess) => x.classId == classroom.id),
                              )"
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
              </div>
            </VaCardContent>
          </VaCard>

          <VaCard>
            <VaCardTitle class="flex justify-between">
              <span> Content</span>
              <div>
                <VaButton preset="secondary" size="small">
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
      <VaCardTitle>Student submit (0/0)</VaCardTitle>
      <VaCard class="mt-2 ml-2" style="height: 60vh">
        <VaCardContent v-if="assignedOptionValue === AccessType.ByClass" class="p-0">
          <VaCardTitle>
            <VaButton size="small" @click="showSelectClassModal = !showSelectClassModal"
              >Select class group: {{ selectedGroupClassName }}
            </VaButton>
          </VaCardTitle>
          <VaModal v-model="showSelectClassModal" size="large" hide-default-actions>
            <VaCard outlined>
              <VaCardContent>
                <VaScrollContainer class="min-h-[80vh] max-h-[90vh]">
                  <VaCollapse v-for="(groupClass, index) in groupClasses" :key="index" :header="groupClass.name">
                    <template #content>
                      <div class="grid md:grid-cols-6 sm:grid-cols-4 gap-2">
                        <VaButton
                          v-for="classroom in groupClass.classes.filter((classroom: Classrooms) =>
                            paperDetail?.paperAccesses?.some((x: PaperAccess) => x.classId == classroom.id),
                          )"
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
          <VaTabs v-model="valueClassInGroupTap">
            <template #tabs>
              <VaTab
                v-for="classroom in classInSelectedGroup"
                :key="classroom.id"
                :name="classroom.id"
                class="pr-2 pl-2"
                @click="groupTabFilter"
              >
                {{ classroom.name }}
              </VaTab>
            </template>
          </VaTabs>
        </VaCardContent>
        <VaCardContent class="p-2 grid md:grid-cols-4 xs:grid-cols-2 mt-3">
          <VaCard
            v-for="submittedStudent in submittedStudents"
            :key="submittedStudent.id"
            outlined
            class="mr-2 cursor-pointer"
            @click="navigateToExamReview(submittedStudent.paperId, submittedStudent.createdBy, submittedStudent.id)"
          >
            <div class="p-2 flex justify-between">
              <div class="flex">
                <VaAvatar size="small" class="mr-2"> Q </VaAvatar>
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
                    submittedStudent.status === 'doing'
                      ? 'warning'
                      : submittedStudent.status === 'end'
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
                    {{ format.formatTimeToX(new Date(submittedStudent.endTime), new Date(submittedStudent.startTime)) }}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="va-text-secondary text-xs">Due Date:</p>
                  <p class="va-text-secondary text-xs">{{ format.formatDate(new Date(submittedStudent.endTime)) }}</p>
                </div>
              </template>
              <template v-if="submittedStudent.endTime === null">
                <div class="flex justify-between">
                  <p class="va-text-secondary text-xs">Start time:</p>
                  <p class="va-text-secondary text-xs">{{ format.formatDate(new Date(submittedStudent.startTime)) }}</p>
                </div>
              </template>
            </VaCardContent>
          </VaCard>
        </VaCardContent>
        <VaPagination :pages="10" :visible-pages="3" buttons-preset="secondary" class="justify-center sm:justify-end" />
      </VaCard>
    </template>
  </VaLayout>
</template>

<style scoped>
.container-groupClass {
  --va-card-outlined-border: 1px solid var(--va-background-element);
}

.class-button {
  --va-button-sm-font-size: 0.6rem;
}
</style>
