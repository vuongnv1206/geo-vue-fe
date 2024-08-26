<template>
  <VaAccordion v-if="props.filteredGroupedData" class="w-full" multiple>
    <VaCollapse
      v-for="(group, index) in props.filteredGroupedData"
      :key="index"
      :header="format.formatDate(group.createOn)"
      solid
      class="py-2 font-semibold"
    >
      <template #header="{ value, attrs, iconAttrs, text }">
        <VaCard
          v-bind="attrs"
          class="w-full flex border-2 p-1 items-center rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" size="1.5rem" />
          <VaCard class="flex justify-between items-center w-full ml-2">
            <VaCard>{{ text }}</VaCard>
          </VaCard>
        </VaCard>
      </template>
      <template #body>
        <VaList>
          <VaListItem
            v-for="(assignment, index2) in group.assignments"
            :key="index2"
            :to="
              isTeacher
                ? { name: 'assignment-details', params: { id: assignment.id, classId: classId } }
                : { name: 'assignment-submission', params: { id: assignment.id, classId: classId } }
            "
            v-on="getAssignmentSubmissions({ assignmentId: assignment?.id, classId: classId })"
          >
            <VaCard
              class="mt-1 border border-gray-200 rounded-lg overflow-hidden p-4 flex space-x-4 hover:bg-gray-50 transition-colors duration-200 w-full"
            >
              <VaListItemSection avatar>
                <VaIcon name="description" size="2.5rem" class="text-gray-500" />
              </VaListItemSection>
              <VaListItemSection class="flex-1 justify-center">
                <VaListItemLabel class="font-large text-bold">{{ assignment.name }}</VaListItemLabel>
                <VaListItemLabel caption>
                  {{ $t('assignments.end_time') }} {{ format.formatDate(assignment.endTime) }}
                </VaListItemLabel>
              </VaListItemSection>

              <VaListItemSection class="ml-auto text-right justify-center">
                <div v-if="submissionStatsMap[assignment.id]" class="flex flex-col">
                  <div v-if="isTeacher">
                    <VaListItemLabel caption>
                      {{ submissionStatsMap[assignment.id].totalMarked }} /
                      {{
                        submissionStatsMap[assignment.id].totalSubmitted + submissionStatsMap[assignment.id].totalMarked
                      }}
                      {{ $t('assignments.marked') }}
                    </VaListItemLabel>
                    <VaListItemLabel caption>
                      {{
                        submissionStatsMap[assignment.id].totalSubmitted + submissionStatsMap[assignment.id].totalMarked
                      }}
                      /
                      {{ submissionStatsMap[assignment.id].totalStudents }}
                      {{ $t('assignments.submitted') }}
                    </VaListItemLabel>
                  </div>
                  <div v-else>
                    <VaListItemLabel caption>
                      {{
                        submissionStatsMap[assignment.id].totalSubmitted
                          ? submissionStatsMap[assignment.id].totalSubmitted
                          : submissionStatsMap[assignment.id].totalMarked
                      }}
                      /
                      {{ submissionStatsMap[assignment.id].totalStudents }}
                      {{ $t('assignments.submitted') }}
                    </VaListItemLabel>
                  </div>
                </div>
              </VaListItemSection>
            </VaCard>
          </VaListItem>

          <VaListItem
            v-for="(paper, index3) in group.papers"
            :key="index3"
            :to="
              isTeacher
                ? { name: 'admin-exam-detail', params: { id: paper.id } }
                : { name: '', params: { id: paper.id, classId: classId } }
            "
          >
            <VaCard
              class="mt-1 border border-gray-200 rounded-lg overflow-hidden p-4 flex space-x-4 hover:bg-gray-50 transition-colors duration-200 w-full"
            >
              <VaListItemSection avatar>
                <VaIcon name="article" size="2.5rem" class="text-gray-500" />
              </VaListItemSection>
              <VaListItemSection class="justify-center">
                <VaListItemLabel class="font-large text-bold">{{ paper.examName }}</VaListItemLabel>
              </VaListItemSection>
            </VaCard>
          </VaListItem>
        </VaList>
      </template>
    </VaCollapse>
  </VaAccordion>
</template>

<script setup lang="ts">
import { computed, PropType, reactive, ref } from 'vue'
import { format, getErrorMessage, notifications } from '@/services/utils'
import { useRouter } from 'vue-router'
import { useToast, VaAccordion, VaCollapse } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useI18n } from 'vue-i18n'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { AssignmentClass, SubmissionStats } from '@/pages/assignment/types'

const load = ref(true)
const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { init: notify } = useToast()
const assignmentStore = useAssignmentStore()
const classId = router.currentRoute.value.params.id.toString()
const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))
const submissionStatsMap = reactive<{ [key: string]: SubmissionStats }>({})

const props = defineProps({
  filteredGroupedData: {
    type: Object as PropType<any>,
    required: true,
  },
})

const getAssignmentSubmissions = async (assignmentClass: AssignmentClass) => {
  load.value = true
  await assignmentStore
    .getAssignmentSubmissions(assignmentClass)
    .then((response) => {
      submissionStatsMap[assignmentClass.assignmentId] = {
        totalSubmitted: response.filter((submission: any) => submission.status === 'Submitted').length,
        totalMarked: response.filter((submission: any) => submission.status === 'Marked').length,
        totalStudents: response.length,
      }
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
