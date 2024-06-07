<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'vue-router'
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, onMounted, ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { notifications, validators } from '@/services/utils'
import { useModal, useToast } from 'vuestic-ui/web-components'
import { AssignmentDetails, EmptyAssignmentDetails } from '../types'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
dayjs.extend(utc)

const formRef = ref()
const router = useRouter()
const { confirm } = useModal()
const showSidebar = ref(false)
const { init: notify } = useToast()
const stores = useAssignmentStore()
const assignmentDetails = ref<AssignmentDetails | null>(null)
const assignmentId = router.currentRoute.value.params.id.toString()
const date = ref<[Date, Date]>([new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 0, 0))])
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
      notify({
        message: notifications.getFailed('assignments') + error.message,
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

const dateInputFormat = {
  format: 'MM/dd/yyyy HH:mm',
}

const handleClickUpdate = async () => {
  if (formRef.value?.validate()) {
    newAssignmentDetails.value.startTime = dayjs.utc(date.value[0]).utcOffset(0, true).toDate()
    newAssignmentDetails.value.endTime = dayjs.utc(date.value[1]).utcOffset(0, true).toDate()
    try {
      await stores.updateAssignment(assignmentId, newAssignmentDetails.value as EmptyAssignmentDetails)
      notify({ message: notifications.updatedSuccessfully(newAssignmentDetails.value.name), color: 'success' })
      router.push({ name: 'assignment-details', params: { id: assignmentId } })
    } catch (error) {
      notify({ message: notifications.updateFailed(newAssignmentDetails.value.name), color: 'error' })
    }
  }
}

onMounted(() => {
  getAssignment(assignmentId)
})
</script>

<template>
  <VaLayout>
    <template #top>
      <VaButton icon="va-arrow-left" preset="plainOpacity" @click="goBack" />
    </template>
    <template #content>
      <VaDivider />
      <VaForm
        ref="formRef"
        class="flex flex-col gap-2"
        style="margin-left: 350px; margin-right: 350px"
        @submit.prevent="handleClickUpdate"
      >
        <CardTitle>Global Setting</CardTitle>
        <VaInput
          v-model="newAssignmentDetails.name"
          label="Name"
          :rules="[validators.required2('name'), validators.maxLength(50)]"
        />
        <VueDatePicker
          v-model="date"
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
        <VaSwitch v-model="newAssignmentDetails.canViewResult" size="small" label="Can View Result" />
        <VaSwitch v-model="newAssignmentDetails.requireLoginToSubmit" size="small" label="Require Login to Submit" />
        <VaLayout style="height: 350px">
          <template #left>
            <VaSidebar v-model="showSidebar" style="margin-right: 5px">
              <div class="mt-2 mr-1 ml-1">
                <VaInput class="" placeholder="Search">
                  <template #appendInner>
                    <VaIcon color="secondary" class="material-icons"> search </VaIcon>
                  </template>
                </VaInput>
              </div>
              <VaDivider />
              <VaCardContent> abc </VaCardContent>
            </VaSidebar>
          </template>
          <template #content>
            <VaLayout>
              <template #top>
                <VaNavbar class="py-1">
                  <template #left>
                    <VaButton
                      preset="secondary"
                      :icon="showSidebar ? 'menu_open' : 'menu'"
                      @click="showSidebar = !showSidebar"
                    />
                  </template>
                  <template #right>
                    <div class="flex">
                      <VaInput class="" placeholder="Search">
                        <template #appendInner>
                          <VaIcon color="secondary" class="material-icons"> search </VaIcon>
                        </template>
                      </VaInput>
                    </div>
                  </template>
                </VaNavbar>
              </template>
              <template #content>
                <VaDivider />
                <p>
                  Page content must be wrapped in main tag. You must do it manually. Here you can place any blocks you
                  need in your application.
                </p>
              </template>
            </VaLayout>
          </template>
        </VaLayout>

        <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
          <VaButton preset="secondary" color="secondary" @click="goBack()">Cancel</VaButton>
          <VaButton type="submit">Save</VaButton>
        </div>
      </VaForm>
    </template>
  </VaLayout>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
