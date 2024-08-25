<template>
  <VaCard>
    <VaCardContent>
      <VaCard v-if="isTeacher" class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton icon="add" :to="{ name: 'create-assignment' }">{{ $t('assignments.assignment') }}</VaButton>
      </VaCard>
      <AssignmentTable
        :loading="loading"
        :assignments-by-class="assignmentsByClass"
        :merge-assignment-by-class="mergeAssignmentByClass"
      />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@modules/auth.module'
import AssignmentTable from '@pages/assignment/widgets/AssignmentTable.vue'
import { useToast } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useClassStore } from '@/stores/modules/class.module'
import { Classrooms, ClassroomWithStats } from '../classrooms/types'
import { useI18n } from 'vue-i18n'
import { MarkAssignmentStatus, SubmissionStats } from './types'
import { useAssignmentStore } from '@/stores/modules/assignment.module'

const { t } = useI18n()
const loading = ref(true)
const { init: notify } = useToast()
const authStore = useAuthStore()
const classStores = useClassStore()
const assignmentStores = useAssignmentStore()

const assignmentsByClass = ref<Classrooms[]>([])
const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))

const dataFilter = ref({
  advancedSearch: {
    fields: ['name'],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})

const mergeAssignmentByClass = ref<ClassroomWithStats[]>([])

const getAssignmentByClass = () => {
  loading.value = true
  classStores
    .getClasses(dataFilter)
    .then((response) => {
      assignmentsByClass.value = response.data
      assignmentsByClass.value.forEach((class1) => {
        class1.assignments.forEach((assignment) => {
          assignmentStores
            .getAssignmentSubmissions({ assignmentId: assignment.id, classId: class1.id })
            .then((response) => {
              const submissionStats: SubmissionStats = {
                totalSubmitted: response.filter(
                  (submission: any) => submission.status === MarkAssignmentStatus.Submitted,
                ).length,
                totalMarked: response.filter((submission: any) => submission.status === MarkAssignmentStatus.Marked)
                  .length,
                totalStudents: response.length,
              }
              mergeData(class1, assignment, submissionStats)
            })
            .catch((error) => {
              notify({
                message: notifications.getFailed(t('assignments.assignment')) + getErrorMessage(error),
                color: 'error',
              })
            })
        })
      })
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('assignments.assignment')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const mergeData = (class1: Classrooms, assignment: any, submissionStats: SubmissionStats) => {
  const classIndex = mergeAssignmentByClass.value.findIndex((c) => c.id === class1.id)

  if (classIndex !== -1) {
    const assignmentIndex = mergeAssignmentByClass.value[classIndex].assignments.findIndex(
      (a) => a.id === assignment.id,
    )
    if (assignmentIndex !== -1) {
      mergeAssignmentByClass.value[classIndex].assignments[assignmentIndex] = {
        ...assignment,
        submissionsStats: submissionStats,
      }
    } else {
      mergeAssignmentByClass.value[classIndex].assignments.push({
        ...assignment,
        submissionsStats: submissionStats,
      })
    }
  } else {
    mergeAssignmentByClass.value.push({
      ...class1,
      assignments: [
        {
          ...assignment,
          submissionsStats: submissionStats,
        },
      ],
    })
  }
}

onMounted(() => {
  getAssignmentByClass()
})
</script>
