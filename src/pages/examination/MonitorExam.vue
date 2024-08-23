<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { PaperDto, AccessType, StudentMonitorResponse, StudentMonitor } from './types'
import { format, getErrorMessage } from '@/services/utils'
import { usePaperStore } from '@/stores/modules/paper.module'
import { useToast } from 'vuestic-ui'
import { GroupClass } from '../classrooms/types'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useExamMonitorStore } from '@/stores/modules/examMonitor.module'
import MonitorExamTable from './widgets/MonitorExamTable.vue'
import ReassignExamModal from './widgets/ReassignExamModal.vue'
import SupendStudentExamModal from './widgets/SupendStudentExamModal.vue'
import ViewLogExamModal from './widgets/ViewLogExamModal.vue'

const route = useRoute()
const { init: notify } = useToast()
const paperStore = usePaperStore()
const examMonitorStore = useExamMonitorStore()
const paperDetail = ref<PaperDto | null>(null)

const showSidebar = ref(true)

const backToPage = () => {
  // back to previous page
  window.history.back()
}

const paperId = route.params.id as string
const getPaperDetail = async () => {
  try {
    const res = await paperStore.paperDetail(paperId)
    paperDetail.value = res
    if (paperDetail.value.shareType === AccessType.ByClass || paperDetail.value.shareType === AccessType.ByStudent) {
      await getGroupClasses()
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
        .filter((element) => element.classId !== null || element.userId !== null)
        .forEach((element) => {
          res.data.forEach((groupClass) => {
            if (
              groupClass.classes.some((x) => x.id === element.classId) ||
              groupClass.classes.some((x) => x.students.some((s) => s.id === element.userId))
            ) {
              if (!groupClasses.value.some((existingGroupClass) => existingGroupClass.id === groupClass.id)) {
                groupClasses.value.push(groupClass)
              }
            }
          })
        })
    }
  } catch (error) {
    console.error(error)
  }
}

const StudentMonitorRes = ref<StudentMonitorResponse | null>(null)

const connectedStudentMonitor = ref(false)

const getStudentMonitor = async () => {
  try {
    const payload = {
      paperId: paperId,
    }
    const res = await examMonitorStore.getExamMonitor(payload)
    StudentMonitorRes.value = res
    connectedStudentMonitor.value = true
  } catch (error) {
    connectedStudentMonitor.value = false
  }
}

const countSubmitted = ref(0)
const countDoing = ref(0)
const countNotStarted = ref(0)

watch(
  () => StudentMonitorRes.value,
  (newVal) => {
    if (newVal) {
      countSubmitted.value = newVal.data.filter((x) => x.completionStatus === 2).length
      countDoing.value = newVal.data.filter((x) => x.completionStatus === 1).length
      countNotStarted.value = newVal.data.filter((x) => x.completionStatus === 0).length
    }
  },
)

getStudentMonitor()
getPaperDetail()

// auto refresh every 3s
setInterval(() => {
  getStudentMonitor()
}, 6000)

const dblclick = (studentMonitor: any) => {
  console.log('dblclick', studentMonitor)
}

const showReassignModal = (studentMonitor: StudentMonitor | null) => {
  // if status is doing, can reassign else not
  if (studentMonitor?.completionStatus !== 1 && studentMonitor !== null) {
    notify({
      message: `Student is not doing exam, can not reassign`,
      color: 'warning',
    })
    return
  }
  dataModal.value = studentMonitor
  doShowReassignModal.value = true
}

const reassign = (reassignExamRequest: any) => {
  console.log(reassignExamRequest)
  try {
    examMonitorStore
      .reassign(reassignExamRequest)
      .then(() => {
        notify({
          message: `Reassign exam success`,
          color: 'success',
        })
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        notify({
          message: `Reassign exam failed: ${message}`,
          color: 'danger',
        })
      })
  } catch (error) {
    const message = getErrorMessage(error)
    notify({
      message: `Reassign exam failed: ${message}`,
      color: 'danger',
    })
  }
}

const doShowReassignModal = ref(false)
const dataModal = ref<StudentMonitor | null>(null)

const doShowSupendStudentModal = ref(false)
const dataModalSupend = ref<StudentMonitor | null>(null)

const showSupendStudentModal = (studentMonitor: StudentMonitor | null) => {
  dataModalSupend.value = studentMonitor
  doShowSupendStudentModal.value = true
}

const suspendStudent = (suspendStudentRequest: any) => {
  console.log(suspendStudentRequest)
  try {
    examMonitorStore
      .suspend(suspendStudentRequest)
      .then(() => {
        notify({
          message: `Suspend student success`,
          color: 'success',
        })
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        notify({
          message: `Suspend student failed: ${message}`,
          color: 'danger',
        })
      })
  } catch (error) {
    const message = getErrorMessage(error)
    notify({
      message: `Suspend student failed: ${message}`,
      color: 'danger',
    })
  }
}

const doShowViewLogModal = ref(false)
const dataModalViewLog = ref<StudentMonitor | null>(null)

const showViewLogModal = (studentMonitor: StudentMonitor | null) => {
  dataModalViewLog.value = studentMonitor
  doShowViewLogModal.value = true
}
</script>

<template>
  <VaLayout style="height: 500px">
    <template #top>
      <VaNavbar class="py-2">
        <template #left>
          <VaButton size="small" icon="chevron_left" icon-color="#ffffff" @click="backToPage"> Back </VaButton>
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
          <span>Exam name: {{ paperDetail?.examName }}</span>
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
            <VaListItem>
              <VaIcon name="task" class="mr-1 material-symbols-outlined" /> Submitted: {{ countSubmitted }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="skip_next" class="mr-1 material-symbols-outlined" /> Doing: {{ countDoing }}
            </VaListItem>
            <VaListItem>
              <VaIcon name="do_not_disturb_on" class="mr-1 material-symbols-outlined" /> Not Started:
              {{ countNotStarted }}
            </VaListItem>
          </VaList>

          <VaCard outlined class="mb-2">
            <VaCardTitle>Menu</VaCardTitle>
            <VaCardContent>
              <VaMenuList class="w-full">
                <VaMenuItem @click="showReassignModal(null)">
                  <VaIcon name="assignment_add" class="material-symbols-outlined" /> Reassign</VaMenuItem
                >
                <VaMenuItem class="va-text-danger" @click="showSupendStudentModal(null)">
                  <VaIcon name="report" class="material-symbols-outlined" />
                  Supend student
                </VaMenuItem>
              </VaMenuList>
            </VaCardContent>
          </VaCard>
        </VaCardContent>
      </VaCard>
    </template>

    <template #content>
      <VaCardTitle>Monitor exam</VaCardTitle>
      <VaCard class="mt-2 ml-2" style="height: 60vh">
        <VaCardContent
          v-if="paperDetail?.shareType === AccessType.ByClass || paperDetail?.shareType === AccessType.ByStudent"
          class="p-0"
        >
          <VaCardTitle>List of students</VaCardTitle>
          <VaCardTitle v-if="connectedStudentMonitor === false" class="text-center text-danger">
            <VaSpinner />
            Connecting to server...
          </VaCardTitle>
          <VaDivider class="mb-0" />
        </VaCardContent>
        <VaCardContent class="p-2 mt-3">
          <MonitorExamTable
            v-if="paperDetail?.shareType === AccessType.ByClass || paperDetail?.shareType === AccessType.ByStudent"
            :student-monitors="StudentMonitorRes?.data || []"
            :loading="StudentMonitorRes === null || connectedStudentMonitor === false"
            @dblclick="dblclick"
            @reassign="showReassignModal"
            @suspend="showSupendStudentModal"
            @viewLogs="showViewLogModal"
          />
        </VaCardContent>
      </VaCard>
    </template>
  </VaLayout>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowReassignModal"
    size="small"
    mobile-fullscreen
    close-button
    stateful
    hide-default-actions
  >
    <ReassignExamModal
      v-if="doShowReassignModal"
      :student-monitor="dataModal"
      :paper-id="paperId"
      @close="cancel"
      @reassign="
        (reassignExamRequest) => {
          reassign(reassignExamRequest)
          ok()
        }
      "
    />
  </VaModal>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowSupendStudentModal"
    size="small"
    mobile-fullscreen
    close-button
    stateful
    hide-default-actions
  >
    <SupendStudentExamModal
      v-if="doShowSupendStudentModal"
      :student-monitor="dataModalSupend"
      :paper-id="paperId"
      @close="cancel"
      @supend="
        (suspendStudentRequest) => {
          suspendStudent(suspendStudentRequest)
          ok()
        }
      "
    />
  </VaModal>

  <VaModal
    v-slot="{ cancel }"
    v-model="doShowViewLogModal"
    size="large"
    mobile-fullscreen
    close-button
    stateful
    hide-default-actions
  >
    <ViewLogExamModal
      v-if="doShowViewLogModal"
      :student-monitor="dataModalViewLog"
      :paper-id="paperId"
      @close="cancel"
      @showReassign="showReassignModal"
      @showSupend="showSupendStudentModal"
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
