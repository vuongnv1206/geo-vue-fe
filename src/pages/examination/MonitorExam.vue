<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { PaperDto, AccessType, StudentMonitorResponse } from './types'
import { format } from '@/services/utils'
import { usePaperStore } from '@/stores/modules/paper.module'
import { useToast } from 'vuestic-ui'
import { GroupClass } from '../classrooms/types'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useExamMonitorStore } from '@/stores/modules/examMonitor.module'
import MonitorExamTable from './widgets/MonitorExamTable.vue'

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

const getStudentMonitor = async () => {
  try {
    const payload = {
      paperId: paperId,
    }
    const res = await examMonitorStore.getExamMonitor(payload)
    StudentMonitorRes.value = res
  } catch (error) {
    console.error(error)
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

const dblclick = (studentMonitor: any) => {
  console.log('dblclick', studentMonitor)
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
                <VaMenuItem> <VaIcon name="assignment_add" class="material-symbols-outlined" /> Reassign</VaMenuItem>
                <VaMenuItem class="va-text-danger">
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
          <VaDivider class="mb-0" />
        </VaCardContent>
        <VaCardContent class="p-2 mt-3">
          <MonitorExamTable
            v-if="paperDetail?.shareType === AccessType.ByClass || paperDetail?.shareType === AccessType.ByStudent"
            :student-monitors="StudentMonitorRes?.data || []"
            :loading="StudentMonitorRes === null"
            @dblclick="dblclick"
          />
        </VaCardContent>
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
