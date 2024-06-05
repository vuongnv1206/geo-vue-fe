<script setup lang="ts">
import { useModal, useToast } from 'vuestic-ui'
import { computed, onMounted, ref } from 'vue'
import { AssignmentDetails, EmptyAssignmentDetails } from '../types'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { validators } from '@/services/utils'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useRouter } from 'vue-router'
dayjs.extend(utc)

const router = useRouter()
const { confirm } = useModal()
const { init: notify } = useToast()
const stores = useAssignmentStore()
const formRef = ref()
const date = ref<[Date, Date]>([new Date(), new Date()])
const assignmentDetails = ref<AssignmentDetails | null>(null)
const assignmentId = router.currentRoute.value.params.id.toString()
const newAssignmentDetails = ref<AssignmentDetails>({
  id: '',
  name: '',
  startTime: new Date(),
  endTime: new Date(),
  canViewResult: false,
  requireLoginToSubmit: false,
  subjectId: '',
})

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newAssignmentDetails.value).some((key) => {
    return (
      newAssignmentDetails.value[key as keyof EmptyAssignmentDetails] !==
      (assignmentDetails.value ?? newAssignmentDetails.value)?.[key as keyof EmptyAssignmentDetails]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

const getAssignment = (id: string) => {
  stores
    .getAssignment(id)
    .then((response) => {
      assignmentDetails.value = response
      newAssignmentDetails.value = {
        id: response.id,
        name: response.name,
        startTime: response.startTime,
        endTime: response.endTime,
        canViewResult: response.canViewResult,
        requireLoginToSubmit: response.requireLoginToSubmit,
        subjectId: response.subject.id,
      }
    })
    .catch((error) => {
      console.log('Error:', error)
      notify({
        message: 'Failed to get assignment',
        color: 'error',
      })
    })
}

const goBack = async () => {
  if (isFormHasUnsavedChanges.value) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'You have unsaved changes. Are you sure you want to discard them?',
      size: 'small',
    })
    if (agreed) {
      router.push({ name: 'assignment-details', params: { id: assignmentId } })
    }
  } else {
    router.push({ name: 'assignment-details', params: { id: assignmentId } })
  }
}

const handleDatePicker = () => {
  newAssignmentDetails.value.startTime = dayjs.utc(date.value[0]).utcOffset(0, true).toDate()
  newAssignmentDetails.value.endTime = dayjs.utc(date.value[1]).utcOffset(0, true).toDate()
}

const dateInputFormat = {
  format: 'MM/dd/yyyy HH:mm',
}

const handleClickUpdate = async () => {
  if (formRef.value?.validate()) {
    handleDatePicker()
    try {
      await stores.updateAssignment(assignmentId, newAssignmentDetails.value as EmptyAssignmentDetails)
      notify({ message: 'Assignment updated successfully', color: 'success' })
      router.push({ name: 'assignment-details', params: { id: assignmentId } })
    } catch (error) {
      console.error('Error:', error)
      notify({ message: 'Failed to update assignment\n' + error, color: 'error' })
    }
  }
}

onMounted(() => {
  if (assignmentId) {
    getAssignment(assignmentId)
  }
})
</script>

<template>
  <VaForm ref="formRef" class="flex flex-col gap-2" @submit.prevent="handleClickUpdate">
    <VaInput
      v-model="newAssignmentDetails.name"
      label="Name"
      :rules="[validators.required2('name'), validators.maxLength(50)]"
    />
    <VueDatePicker
      v-model="date"
      label="Time To Do"
      range
      model-auto
      :action-row="{ showNow: true }"
      :is-24="true"
      enable-seconds
      :clearable="true"
      :text-input="dateInputFormat"
      :month-change-on-scroll="true"
      :month-change-on-arrows="true"
      placeholder="Start choosing or typing date and time"
    />
    <VaSwitch v-model="newAssignmentDetails.canViewResult" label="Can View Result" />
    <VaSwitch v-model="newAssignmentDetails.requireLoginToSubmit" label="Require Login to Submit" />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="goBack()">Cancel</VaButton>
      <VaButton type="submit">Save</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
