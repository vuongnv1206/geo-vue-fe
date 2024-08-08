<script lang="ts" setup>
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast, VaCard, VaCardContent, VaCardTitle, VaDivider, VaForm } from 'vuestic-ui'
import { Assignment, AssignmentSubmit } from '../types'
import { onMounted, ref } from 'vue'
import { format, getErrorMessage, notifications } from '@/services/utils'
import { useFileStore } from '@/stores/modules/file.module'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

const { t } = useI18n()
const router = useRouter()
const loading = ref(true)
const { init: notify } = useToast()

const fileStore = useFileStore()
const assignmentStores = useAssignmentStore()

const attachmentPaths = ref<string[]>([])
const rawAttachmentPaths = ref<string[]>([])
const filesUploaded = ref<any>()
const attachmentString = ref<string>('')
const answerString = ref<string>('')

const assignment = ref<Assignment | null>(null)
const assignmentId = router.currentRoute.value.params.id.toString()
const url = (import.meta.env.VITE_APP_BASE_URL as string).slice(0, -3)
const assignmentSubmit = ref<AssignmentSubmit | null>(null)

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
        message: t('assignments.assignment') + error,
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const fileUpload = async () => {
  fileStore
    .uploadFile(filesUploaded.value)
    .then((response) => {
      attachmentString.value = JSON.stringify(response)
    })
    .catch((error) => {
      notify({
        message: notifications.createFailed('') + getErrorMessage(error),
        color: 'error',
      })
    })
}

const onAssignmentSubmit = async () => {
  assignmentSubmit.value = {
    assignmentId: assignmentId,
    answerRaw: answerString.value,
    attachmentPath: attachmentString.value,
  }
  assignmentStores
    .submitAssignment(assignmentSubmit.value)
    .then(() => {
      notify({
        message: t('assignments.assignment'),
        color: 'success',
      })
      router.push({ name: 'assignments' })
    })
    .catch((error) => {
      notify({
        message: t('assignments.assignment') + getErrorMessage(error),
        color: 'error',
      })
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
    <VaDivider />
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
      <div v-if="attachmentPaths.length < 1" class="flex flex-col justify-center items-center h-full">
        <VaIcon name="description" size="large" class="material-symbols-outlined mb-2" />
        <p>{{ $t('assignments.empty_file') }}</p>
      </div>
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
    <VaDivider />
    <VaCardTitle>{{ $t('assignments.submit_homeworks') }}</VaCardTitle>
    <VaForm>
      <div
        v-if="new Date() >= new Date(assignment.startTime) && new Date() <= new Date(assignment.endTime)"
        class="px-3.5"
      >
        <QuillEditor
          v-model:content="answerString"
          class="border rounded"
          :placeholder="$t('posts.enter_content')"
          theme="bubble"
          content-type="html"
        />
        <VaCardContent class="flex flex-col items-center">
          <VaFileUpload
            v-model="filesUploaded"
            dropzone
            :upload-button-text="$t('file_upload.upload_button_text')"
            :drop-zone-text="$t('file_upload.drop_zone_text')"
            file-types="jpg,png,jpeg,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,7z,mp4,avi,mkv,
              flv,wmv,mov,webm,mp3,wav,flac,ogg,wma,json,xml,csv,tsv"
            class="border-2 border-dashed border-gray-300 flex items-center justify-center w-full p-6"
            @fileAdded="fileUpload"
          />
          <VaButton class="mt-4" @click="onAssignmentSubmit">{{ $t('settings.submit') }}</VaButton>
        </VaCardContent>
      </div>
      <div v-else class="text-center text-red-500 border-2 border-dashed rounded p-4 mx-3">
        {{ $t('assignments.submission_time_over') }}
      </div>
    </VaForm>
  </VaCard>
</template>
