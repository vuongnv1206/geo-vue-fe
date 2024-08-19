<script setup lang="ts">
import { computed, PropType, reactive, ref } from 'vue'
import { format, getErrorMessage, notifications } from '@/services/utils'
import { useRouter } from 'vue-router'
import { useToast, VaAccordion, VaCollapse } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useI18n } from 'vue-i18n'
import { useAssignmentStore } from '@/stores/modules/assignment.module'

const { t } = useI18n()
const { init: notify } = useToast()
const load = ref(true)
const assignmentStore = useAssignmentStore()

interface SubmissionStats {
  totalSubmittedCount: number
  totalStudentsCount: number
}
const submissionStatsMap = reactive<{ [key: string]: SubmissionStats }>({})

const router = useRouter()
const authStore = useAuthStore()

const classId = router.currentRoute.value.params.id.toString()
const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))

const props = defineProps({
  filteredGroupedData: {
    type: Object as PropType<any>,
    required: true,
  },
})

const getAssignmentSubmissions = async ({ assignmentId, classId }: { assignmentId: string; classId: string }) => {
  load.value = true
  await assignmentStore
    .getAssignmentSubmissions({ assignmentId, classId })
    .then((response) => {
      submissionStatsMap[assignmentId] = {
        totalSubmittedCount: response.filter((submission: any) => submission.status === 'Submmitted').length,
        totalStudentsCount: response.length,
      }
      console.log('submissionStatsMap:', submissionStatsMap)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('assignments.assignment')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      load.value = false
    })
}
</script>

<template>
  <VaAccordion v-if="props.filteredGroupedData" class="w-full" multiple>
    <VaCollapse
      v-for="(group, index) in props.filteredGroupedData"
      :key="index"
      :header="format.formatDate(group.createOn)"
      solid
      class="py-1 font-bold"
    >
      <template #header="{ value, attrs, iconAttrs, text }">
        <VaCard v-bind="attrs" class="w-full flex border-2 p-2 items-center">
          <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" />
          <VaCard class="flex justify-between items-center w-full">
            <VaCard>{{ text }}</VaCard>
          </VaCard>
        </VaCard>
      </template>
      <template #body>
        <!-- List assignments and papers for this date in rows -->
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1">
          <!-- Loop through assignments -->
          <div v-for="(assignment, index2) in group.assignments" :key="index2">
            <VaCard
              class="border border-gray-200 rounded-lg overflow-hidden p-4 mt-2 flex space-x-4"
              :to="
                isTeacher
                  ? { name: 'assignment-details', params: { id: assignment.id, classId: classId } }
                  : { name: 'assignment-submission', params: { id: assignment.id, classId: classId } }
              "
              v-on="getAssignmentSubmissions({ assignmentId: assignment?.id, classId: classId })"
            >
              <VaIcon name="description" size="3rem" class="text-gray-500" />
              <div>
                <VaCardTitle class="font-medium text-lg">{{ assignment.name }}</VaCardTitle>
                <VaCard v-if="submissionStatsMap[assignment.id]">
                  {{ $t('classes.submited') }}: {{ submissionStatsMap[assignment.id].totalSubmittedCount }} /
                  {{ submissionStatsMap[assignment.id].totalStudentsCount }}
                </VaCard>
              </div>
            </VaCard>
          </div>
          <!-- Loop through papers -->
          <div v-for="(paper, index3) in group.papers" :key="index3">
            <!-- <VaCard
              class="border border-gray-200 rounded-lg overflow-hidden p-4 mt-2 flex space-x-4"
              :to="{ name: 'admin-exam-detail', params: { id: paper.id } }"
            > -->
            <VaCard
              class="border border-gray-200 rounded-lg overflow-hidden p-4 mt-2 flex space-x-4"
              :to="
                isTeacher
                  ? { name: 'admin-exam-detail', params: { id: paper.id } }
                  : { name: '', params: { id: paper.id, classId: classId } }
              "
            >
              <VaIcon name="article" size="3rem" class="text-gray-500" />
              <div>
                <VaCardTitle class="font-medium text-lg">{{ paper.examName }}</VaCardTitle>
                <VaCard v-if="submissionStatsMap[paper.id]">
                  {{ $t('classes.submited') }}: {{ submissionStatsMap[paper.id].totalSubmittedCount }} /
                  {{ submissionStatsMap[paper.id].totalStudentsCount }}
                </VaCard>
              </div>
            </VaCard>
          </div>
        </div>
      </template>
    </VaCollapse>
  </VaAccordion>
</template>
