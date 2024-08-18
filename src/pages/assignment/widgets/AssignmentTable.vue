<template v-for="assClass in props.assignmentsByClass" :key="assClass.id" :loading="props.loading">
  <VaCard class="min-h-[78vh]">
    <VaCard>
      <VaCardContent class="font-bold">{{ $t('assignments.recommend') }}</VaCardContent>
      <VaList v-if="recentAssignments" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-for="assignment in recentAssignments" :key="assignment.id">
          <VaListItem
            class="mb-2"
            :to="
              isTeacher
                ? { name: 'assignment-details', params: { id: assignment?.id, classId: assignment?.classId } }
                : { name: 'assignment-submission', params: { id: assignment?.id, classId: assignment?.classId } }
            "
            v-on="getAssignmentSubmissions({ assignmentId: assignment?.id, classId: assignment.classId })"
          >
            <VaCard class="border rounded-lg p-3 hover:scale-105 transition-transform duration-200 w-full">
              <div class="flex items-center">
                <VaListItemSection avatar>
                  <VaIcon name="description" size="3rem" />
                </VaListItemSection>
                <VaListItemSection>
                  <VaListItemLabel class="font-semibold mb-1"
                    >{{ assignment?.className }} - {{ assignment?.name }}</VaListItemLabel
                  >
                  <VaListItemLabel caption>
                    <VaPopover placement="right" color="#FFFFFF" :message="format.formatDate(assignment?.createdOn)">
                      {{ $t('assignments.create_at') }} {{ format.formatDateFromNow(assignment?.createdOn) }}
                    </VaPopover>
                  </VaListItemLabel>
                  <VaListItemLabel caption
                    >{{ $t('assignments.end_time') }} {{ format.formatDate(assignment?.endTime) }}
                  </VaListItemLabel>
                </VaListItemSection>
                <VaListItemSection icon>
                  <VaCard v-if="submissionStatsMap[assignment.id]">
                    {{ submissionStatsMap[assignment.id].totalSubmittedCount }} /
                    {{ submissionStatsMap[assignment.id].totalStudentsCount }}
                  </VaCard>
                </VaListItemSection>
              </div>
            </VaCard>
          </VaListItem>
        </template>
      </VaList>
    </VaCard>
    <VaCard>
      <VaCardContent class="font-bold">{{ $t('assignments.all') }}</VaCardContent>
      <VaCard class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-for="assClass in props.assignmentsByClass" :key="assClass.id">
          <VaCard v-if="assClass.assignments && assClass.assignments.length > 0" class="border p-4 pb-0 rounded">
            <div class="flex justify-between items-center mb-4">
              <span class="font-bold">{{ assClass.name }}</span>
              <VaChip v-if="currentUserId != assClass.ownerId && isTeacher" outline class="ml-2" size="small">
                {{ $t('settings.share') }}
              </VaChip>
              <div class="flex items-center space-x-2 ml-auto">
                <VaButton preset="plain" size="small" :to="{ name: 'class-details', params: { id: assClass.id } }">
                  {{ $t('assignments.show_all') }}
                </VaButton>
              </div>
            </div>
            <VaDivider />
            <VaList>
              <template v-for="assignment in assClass.assignments.slice().reverse().slice(0, 2)" :key="assignment.id">
                <VaListItem
                  class="mb-2"
                  :to="
                    isTeacher
                      ? { name: 'assignment-details', params: { id: assignment?.id, classId: assClass.id } }
                      : { name: 'assignment-submission', params: { id: assignment?.id, classId: assClass.id } }
                  "
                  v-on="getAssignmentSubmissions({ assignmentId: assignment?.id, classId: assClass.id })"
                >
                  <VaCard
                    class="flex items-center border rounded-lg p-3 w-full hover:scale-105 transition-transform duration-200"
                  >
                    <VaListItemSection avatar>
                      <VaIcon name="description" size="3rem" />
                    </VaListItemSection>
                    <VaListItemSection>
                      <VaListItemLabel class="font-semibold mb-1">{{ assignment.name }}</VaListItemLabel>
                      <VaListItemLabel caption>
                        <VaPopover placement="right" color="#FFFFFF" :message="format.formatDate(assignment.createdOn)">
                          {{ $t('assignments.create_at') }} {{ format.formatDateFromNow(assignment.createdOn) }}
                        </VaPopover>
                      </VaListItemLabel>
                      <VaListItemLabel caption
                        >{{ $t('assignments.end_time') }} {{ format.formatDate(assignment.endTime) }}</VaListItemLabel
                      >
                    </VaListItemSection>
                    <VaListItemSection icon>
                      <VaCard v-if="submissionStatsMap[assignment.id]">
                        {{ submissionStatsMap[assignment.id].totalSubmittedCount }} /
                        {{ submissionStatsMap[assignment.id].totalStudentsCount }}
                      </VaCard>
                    </VaListItemSection>
                  </VaCard>
                </VaListItem>
              </template>
            </VaList>
          </VaCard>
        </template>
      </VaCard>
    </VaCard>
  </VaCard>
</template>

<script lang="ts" setup>
import { computed, PropType, reactive, ref } from 'vue'
import { format, getErrorMessage, notifications } from '@/services/utils'
import { Classrooms } from '@/pages/classrooms/types'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useToast, VaCard } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { init: notify } = useToast()
const load = ref(true)

const authStore = useAuthStore()
const currentUserId = authStore.user?.id
const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))
const assignmentStore = useAssignmentStore()

interface SubmissionStats {
  totalSubmittedCount: number
  totalStudentsCount: number
}

const submissionStatsMap = reactive<{ [key: string]: SubmissionStats }>({})

const props = defineProps({
  assignmentsByClass: {
    type: Array as PropType<Classrooms[]>,
    required: true,
  },
  loading: {
    type: Boolean,
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

const recentAssignments = computed(() => {
  const allAssignmentsWithClassId = props.assignmentsByClass.flatMap(
    (assClass) =>
      assClass.assignments?.map((assignment) => ({
        ...assignment,
        classId: assClass.id,
        className: assClass.name,
      })) || [],
  )

  allAssignmentsWithClassId.sort((a, b) => {
    const dateA = a ? new Date(a.createdOn).getTime() : 0
    const dateB = b ? new Date(b.createdOn).getTime() : 0
    return dateB - dateA
  })

  return allAssignmentsWithClassId.slice(0, 4)
})
</script>
