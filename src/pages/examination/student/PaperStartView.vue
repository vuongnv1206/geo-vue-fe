<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { usePaperStore } from '@/stores/modules/paper.module'
import { ref, onMounted } from 'vue'
import { PaperStudentDto, SubmitPaperDto } from '../types'
import { useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const { init: notify } = useToast()
const paperStore = usePaperStore()

const paperDetail = ref<PaperStudentDto | null>(null)

const paperId = route.params.id
const getPaperDetail = () => {
  paperStore
    .paperDetailByStudentRole(paperId.toString())
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

const isShowHistory = ref(false)
const showTestHistory = () => {
  isShowHistory.value = !isShowHistory.value
  getSubmittedStudents()
}

const submittedStudents = ref<SubmitPaperDto[] | null>(null)
const dataFilterSubmittedStudent = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 10,
  orderBy: ['id'],
  paperId: paperId.toString(),
})
const getSubmittedStudents = () => {
  paperStore
    .getSubmittedStudentsInPaper(paperId.toString(), dataFilterSubmittedStudent.value)
    .then((res) => {
      submittedStudents.value = res.data
    })
    .catch((error) => {
      notify({
        message: `get fail submitted students \n ${error}`,
        color: 'danger',
      })
    })
}
const getFormattedDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const durationInSeconds = (end.getTime() - start.getTime()) / 1000

  if (durationInSeconds < 60) {
    return `${Math.round(durationInSeconds)} sec`
  } else if (durationInSeconds < 3600) {
    return `${Math.round(durationInSeconds / 60)} min`
  } else if (durationInSeconds < 86400) {
    return `${Math.round(durationInSeconds / 3600)} hours`
  } else {
    return `${Math.round(durationInSeconds / 86400)} days`
  }
}

onMounted(() => {
  getPaperDetail()
})
</script>

<template>
  <div style="display: flex; justify-content: center">
    <VaCard class="mt-3 min-w-[70%]">
      <div>
        <VaSidebarItemContent class="p-2">
          <VaSidebarItemTitle class="text-center va-h6 mb-0"> {{ paperDetail?.examName }} </VaSidebarItemTitle>
        </VaSidebarItemContent>
        <VaSidebarItemContent class="p-1">
          <VaSidebarItemTitle class="text-center mt-0"> Exam code: {{ paperDetail?.examCode }} </VaSidebarItemTitle>
        </VaSidebarItemContent>
      </div>

      <VaCardContent>
        <div class="flex justify-between mt-2 mb-2">
          <p><VaIcon name="timer" class="material-symbols-outlined mr-2" /> {{ t('papers.duration') }}</p>
          <p class="font-bold">{{ paperDetail?.duration || 0 }} {{ t('papers.minutes') }}</p>
        </div>
        <div class="flex justify-between mt-2 mb-2">
          <p><VaIcon name="more_time" class="material-symbols-outlined mr-2" />{{ t('papers.exam_time') }}</p>
          <p class="font-bold">{{ t('papers.indefinite') }}</p>
        </div>
        <div class="flex justify-between mt-2 mb-2">
          <p><VaIcon name="info" class="material-symbols-outlined mr-2" />{{ t('papers.number_of_questions') }}</p>
          <p class="font-bold">{{ paperDetail?.numberOfQuestion }}</p>
        </div>
        <div class="flex justify-between mt-2 mb-2">
          <p><VaIcon name="request_page" class="material-symbols-outlined mr-2" />{{ t('papers.indefinite') }}</p>
          <p class="font-bold">{{ paperDetail?.type }}</p>
        </div>
        <div class="flex justify-between mt-2 mb-2">
          <p><VaIcon name="groups" class="material-symbols-outlined mr-2" />{{ t('papers.number_of_quizzes') }}</p>
          <p class="font-bold">{{ paperDetail?.NumberOfQuizzes || 0 }} in turn</p>
        </div>
        <VaButton color="success" class="w-full mt-3"
          >{{ t('papers.start_exam') }}
          <VaIcon name="chevron_right" />
        </VaButton>
      </VaCardContent>
    </VaCard>
  </div>
  <div class="mt-3 mb-3 justify-center" style="display: flex">
    <VaButton preset="secondary" border-color="secondary" @click="showTestHistory"
      >{{ t('papers.show_tested_history') }}
    </VaButton>
  </div>
  <div v-if="isShowHistory">
    <VaCard>
      <VaCardTitle>{{ t('papers.your_work_history') }}</VaCardTitle>
      <VaCardContent v-if="submittedStudents === null && submittedStudents === undefined"
        >{{ t('papers.empty') }}
      </VaCardContent>
      <VaCardContent class="grid grid-cols-3">
        <VaCard
          v-for="submittedStudent in submittedStudents"
          :key="submittedStudent.id"
          outlined
          class="cursor-pointer mr-2 mb-2"
        >
          <VaCardTitle class="justify-center" style="font-size: 0.8rem">
            {{ t('papers.your_score') }}: {{ submittedStudent.totalMark }}
          </VaCardTitle>
          <VaDivider class="m-0" />
          <VaCardContent v-if="submittedStudent.endTime !== null && submittedStudent.endTime !== undefined">
            <div class="flex justify-between mb-2">
              <p><VaIcon name="timer" class="material-symbols-outlined mr-2" />{{ t('papers.duration') }}</p>
              <p class="font-semibold">
                {{ getFormattedDuration(submittedStudent.startTime, submittedStudent.endTime) }}
              </p>
            </div>
            <div class="flex justify-between mt-2 mb-2">
              <p>
                <VaIcon name="check_circle" color="success" class="material-symbols-outlined mr-2" />{{
                  t('papers.correct_amount')
                }}
              </p>
              <p class="font-semibold">40</p>
            </div>
            <div class="flex justify-between mt-2 mb-2">
              <p><VaIcon name="info" class="material-symbols-outlined mr-2" />{{ t('papers.total_questions') }}</p>
              <p class="font-semibold">4</p>
            </div>
            <div class="flex justify-end mt-2">
              <p>03/06/2024 21:39</p>
            </div>
          </VaCardContent>
        </VaCard>
      </VaCardContent>
    </VaCard>
  </div>
</template>
