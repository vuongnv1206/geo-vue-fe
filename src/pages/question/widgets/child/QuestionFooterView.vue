<script setup lang="ts">
import { Question } from '../../types'
import { format, getErrorMessage } from '@services/utils'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import { useQuestionStore } from '@/stores/modules/question.module'
import { useToast } from 'vuestic-ui/web-components'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  question: Question | null
  showActionButton: boolean
}>()

const emit = defineEmits<{
  (event: 'edit', question: Question): void
  (event: 'delete', question: Question): void
}>()

const tabs = {
  Questions: 0,
  Folders: 1,
  ApproveQueue: 2,
  MyRequests: 3,
}

const status = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
}
const stores = useQuestionFolderStore()
const questionsStore = useQuestionStore()
const { init } = useToast()
const { t } = useI18n()

const options = [
  { text: props.question?.owner?.userName, value: 'createdBy', icon: 'person' },
  { text: format.getTimeString(props.question?.createdOn || ''), value: 'createdOn', icon: 'mso-event_upcoming' },
  { text: format.getTimeString(props.question?.lastModifiedOn || ''), value: 'updatedOn', icon: 'edit_calendar' },
]

const rejectPendingQuestion = (question: Question) => {
  const dataReject = {
    questionIds: question?.id ? [question.id] : [],
  }
  questionsStore
    .RejectPendingQuestion(dataReject)
    .then(() => {
      init({
        title: t('questions.success'),
        message: 'Reject question successfully!',
        color: 'success',
      })
      questionsStore.setRefresh(true)
      stores.setRefresh(true)
    })
    .catch((err) => {
      const message = getErrorMessage(err)
      init({
        title: t('questions.error'),
        message: message,
        color: 'danger',
      })
    })
}

const approvePendingQuestion = (question: Question) => {
  const dataApprove = {
    questionIds: question?.id ? [question.id] : [],
  }
  questionsStore
    .ApprovePendingQuestion(dataApprove)
    .then(() => {
      init({
        title: t('questions.success'),
        message: 'Approve question successfully!',
        color: 'success',
      })
      questionsStore.setRefresh(true)
      stores.setRefresh(true)
    })
    .catch((err) => {
      const message = getErrorMessage(err)
      init({
        title: t('questions.error'),
        message: message,
        color: 'danger',
      })
    })
}

const getQuestionsStatusText = (statusNumber: number | null | undefined) => {
  switch (statusNumber) {
    case status.Pending:
      return t('questions.pendingStatus')
    case status.Approved:
      return t('questions.approvedStatus')
    case status.Rejected:
      return t('questions.rejectedStatus')
    default:
      return 'status'
  }
}

const getQuestionsStatusColor = (statusNumber: number | null | undefined) => {
  switch (statusNumber) {
    case status.Pending:
      return 'warning'
    case status.Approved:
      return 'success'
    case status.Rejected:
      return 'danger'
    default:
      return 'primary'
  }
}
</script>

<template>
  <div class="flex justify-between">
    <div class="flex gap-2">
      <h1 class="mt-3">
        <VaBadge
          :text="props.question?.questionLable?.name"
          :color="props.question?.questionLable?.color || 'primary'"
        />
      </h1>
      <h1 v-if="stores?.currentTab === tabs.MyRequests" class="mt-3">
        <VaBadge
          :text="getQuestionsStatusText(props.question?.questionStatus)"
          :color="getQuestionsStatusColor(props.question?.questionStatus)"
        />
      </h1>
    </div>
    <div v-if="showActionButton" class="flex gap-2">
      <div class="flex gap-2">
        <VaMenu v-if="stores?.currentTab !== tabs.MyRequests" :options="options">
          <template #anchor>
            <div>
              <VaIcon name="mso-info" color="primary" />
            </div>
          </template>
        </VaMenu>
        <VaIcon
          v-if="
            stores?.currentTab === tabs.Questions ||
            (stores?.currentTab === tabs.MyRequests && props.question?.questionStatus === status.Pending)
          "
          name="mso-edit"
          color="primary"
          @click="emit('edit', props.question as Question)"
        />
        <VaIcon
          v-if="
            stores?.currentTab === tabs.Questions ||
            (stores?.currentTab === tabs.MyRequests && props.question?.questionStatus === status.Pending)
          "
          name="mso-delete"
          color="danger"
          @click="emit('delete', props.question as Question)"
        />
        <VaIcon
          v-if="stores?.currentTab === tabs.ApproveQueue"
          name="check"
          color="success"
          @click="approvePendingQuestion(props.question as Question)"
        />
        <VaIcon
          v-if="stores?.currentTab === tabs.ApproveQueue"
          name="close"
          color="danger"
          @click="rejectPendingQuestion(props.question as Question)"
        />
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2">
        <VaMenu :options="options">
          <template #anchor>
            <div>
              <VaIcon name="mso-info" color="primary" />
            </div>
          </template>
        </VaMenu>
      </div>
    </div>
  </div>
</template>
