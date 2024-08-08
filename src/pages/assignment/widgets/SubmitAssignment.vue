<script lang="ts" setup>
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast, VaCard, VaCardTitle } from 'vuestic-ui'
import { Assignment } from '../types'
import { onMounted, ref } from 'vue'
import { format } from '@/services/utils'

const { t } = useI18n()
const router = useRouter()
const loading = ref(true)
const { init: notify } = useToast()

// const fileStore = useFileStore()
const assignmentStores = useAssignmentStore()
const attachmentPaths = ref<string[]>([])
const rawAttachmentPaths = ref<string[]>([])

// const filesUploaded = ref<any>()

const assignment = ref<Assignment | null>(null)
const assignmentId = router.currentRoute.value.params.id.toString()
const url = (import.meta.env.VITE_APP_BASE_URL as string).slice(0, -3)

const getAssignment = () => {
  assignmentStores
    .getAssignment(assignmentId)
    .then((response) => {
      assignment.value = response
      if (assignment.value?.content == '<p><br></p>') {
        assignment.value.content = ''
      }
      if (assignment.value?.attachment) {
        attachmentPaths.value = JSON.parse(assignment.value.attachment)
        rawAttachmentPaths.value = JSON.parse(assignment.value.attachment)
        for (let i = 0; i < attachmentPaths.value.length; i++) {
          const parts = attachmentPaths.value[i].split('_')
          const newPart = parts.slice(1).join('_')
          // attachmentPaths.value[i] = `${url}${newPart}`
          attachmentPaths.value[i] = `${newPart}`
        }
      }
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
  <VaCard v-if="assignment">
    <VaCardTitle>{{ assignment.name }}</VaCardTitle>
    <VaCardContent>
      <div class="flex items-center mb-1">
        <VaIcon name="event" class="material-symbols-outlined mr-1" />
        <span class="font-semibold mr-1">{{ $t('assignments.start_time') }} </span>
        {{ format.formatDate(assignment.startTime) }}
      </div>
      <div class="flex items-center">
        <VaIcon name="event" class="material-symbols-outlined mr-1" />
        <span class="font-semibold mr-1">{{ $t('assignments.end_time') }}</span>
        {{ format.formatDate(assignment.endTime) }}
      </div>
    </VaCardContent>
    <VaCardTitle>{{ $t('assignments.content') }}</VaCardTitle>
    <VaCardContent>
      <div v-if="!assignment.content" class="flex flex-col justify-center items-center h-full">
        <VaIcon name="description" size="large" class="material-symbols-outlined mb-2" />
        <p>{{ $t('assignments.empty_content') }}</p>
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <div v-html="assignment.content" />
      <!--eslint-enable-->
    </VaCardContent>
    <VaCardTitle>{{ $t('assignments.attachments') }}</VaCardTitle>
    <VaCardContent>
      <VaCard v-for="(attachmentPath, index) in attachmentPaths" :key="index">
        <VaButton
          class="font-medium geo-text"
          icon="description"
          size="small"
          preset="plain"
          :href="`${url}${rawAttachmentPaths[index]}`"
        >
          {{ attachmentPath }}
        </VaButton>
      </VaCard>
    </VaCardContent>
  </VaCard>
</template>
