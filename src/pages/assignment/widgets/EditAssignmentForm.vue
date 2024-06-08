<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { validators } from '@/services/utils'
import '@vuepic/vue-datepicker/dist/main.css'
import { Subject } from '@pages/subject/types'
import VueDatePicker from '@vuepic/vue-datepicker'
import { useForm, ValidationRule } from 'vuestic-ui'
import { onMounted, computed, ref, watch } from 'vue'
import { useSubjectStore } from '@/stores/modules/subject.module'
import { EmptyAssignment, Attachment, Assignment } from '../types'
import { SelectableOption } from 'vuestic-ui/dist/types/composables'
dayjs.extend(utc)

const { validate } = useForm('form')
const subjects = ref<Subject[]>([])
const subjectStore = useSubjectStore()
const filesUploaded = ref<File[]>([])
const date = ref<[Date, Date]>([new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 0, 0))])

const props = defineProps<{
  assignment: Assignment | null
  saveButtonLabel: string
}>()

const emit = defineEmits<{
  (event: 'save', assignment: Assignment): void
  (event: 'close'): void
}>()

// Default assignment object
const defaultNewAssignment: Assignment = {
  id: '',
  name: '',
  startTime: new Date(),
  endTime: new Date(),
  attachmentPaths: [] as Attachment[],
  content: '',
  canViewResult: false,
  requireLoginToSubmit: false,
  subjectId: '',
  subjectName: '',
}

const newAssignment = ref({ ...defaultNewAssignment })

// Computed property to check for unsaved changes
const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newAssignment.value).some((key) => {
    return (
      newAssignment.value[key as keyof EmptyAssignment] !==
      (props.assignment ?? defaultNewAssignment)?.[key as keyof EmptyAssignment]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

// Watcher to update newAssignment when props.assignment changes
watch(
  () => props.assignment,
  () => {
    if (!props.assignment) {
      return
    }
    newAssignment.value = { ...props.assignment }
  },
  { immediate: true },
)

// Fetch subjects from the store
const getSubjects = async () => {
  try {
    const response = await subjectStore.getSubjects()
    subjects.value = response.data
  } catch (error) {
    console.error('Error fetching subjects:', error)
  }
}
// Computed property to format subjects for select options
const subjectsOptions = computed(() => {
  return subjects.value.map((subject) => ({ text: subject.name, value: subject.id }))
})

const dateInputFormat = {
  format: 'MM/dd/yyyy HH:mm',
}
const handleDatePicker = () => {
  newAssignment.value.startTime = dayjs.utc(date.value[0]).utcOffset(0, true).toDate()
  newAssignment.value.endTime = dayjs.utc(date.value[1]).utcOffset(0, true).toDate()
  console.log('Date: ', date.value)
  console.log('Start Time: ', newAssignment.value)
}

const handleClickUpdate = () => {
  if (validate()) {
    handleDatePicker()
    handleAttachment()
  }
  emit('save', newAssignment.value as Assignment)
}

// Function to save the attachment path
const handleAttachment = async () => {
  const files = filesUploaded.value
  newAssignment.value.attachmentPaths = await Promise.all(
    files.map((file) => {
      return new Promise<Attachment>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64Data = reader.result?.toString() ?? ''
          resolve({
            name: file.name,
            extension: file.type.split('/')[1],
            data: base64Data,
          })
        }
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })
    }),
  )
}

onMounted(() => {
  getSubjects()
})
</script>

<template>
  <VaForm class="flex flex-col gap-2">
    <VaInput
      v-model="newAssignment.name"
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
    <VaFileUpload v-model="filesUploaded" dropzone file-types="jpg,png,pdf" label="Attachment Path" />
    <VaInput v-model="newAssignment.content" label="Content" />
    <VaSwitch v-model="newAssignment.canViewResult" label="Can View Result" />
    <VaSwitch v-model="newAssignment.requireLoginToSubmit" label="Require Login to Submit" />
    <VaSelect
      v-model="newAssignment.subjectId"
      value-by="value"
      :options="subjectsOptions"
      label="Subject"
      :rules="[validators.required2('subject') as ValidationRule<SelectableOption>]"
    />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="emit('close')">Cancel</VaButton>
      <VaButton @click="handleClickUpdate()"> {{ saveButtonLabel }}</VaButton>
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
