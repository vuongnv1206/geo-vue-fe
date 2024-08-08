<script lang="ts" setup>
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast, VaCard, VaCardTitle } from 'vuestic-ui'
import { Assignment } from '../types'
import { onMounted, ref } from 'vue'

const { t } = useI18n()
const router = useRouter()
const loading = ref(true)
const { init: notify } = useToast()

// const fileStore = useFileStore()
const assignmentStores = useAssignmentStore()

// const filesUploaded = ref<any>()

const assignment = ref<Assignment | null>(null)
const assignmentId = router.currentRoute.value.params.id.toString()
// const url = (import.meta.env.VITE_APP_BASE_URL as string).slice(0, -3)

const getAssignment = () => {
  assignmentStores
    .getAssignment(assignmentId)
    .then((response) => {
      assignment.value = response.data
      console.log('assignment: ', response.data)
    })
    .catch((error) => {
      notify({
        message: t('assignments.get_assignment_failed') + error,
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getAssignment()
})
</script>

<template>
  <VaCard>
    <VaCardTitle>{{ assignment?.name }}</VaCardTitle>
  </VaCard>
</template>
