<script setup lang="ts">
import { PropTypes } from 'vuestic-ui/dist/types/services/component-config'
import { CreatePaperRequest } from '../types'
import { computed, ref, watch, onMounted } from 'vue'
import { validators } from '@services/utils'
import { useSubjectStore } from '../../../stores/modules/subject.module'
import { Subject } from '@/pages/subject/types'
import { useToast } from 'vuestic-ui'

const storeSubject = useSubjectStore()
const { init: notify } = useToast()

const props = defineProps({
  paperRequest: {
    type: Object as PropTypes<CreatePaperRequest | null>,
    default: null,
  },
})

const emit = defineEmits(['cancel', 'save'])

const paper = ref<CreatePaperRequest>({
  examName: '',
  status: 1,
  password: '' || null,
  type: 0,
  paperFolderId: '' || null,
  description: '' || null,
  questions: [],
})

const isPublished = computed({
  get() {
    return paper.value.status === 1
  },
  set(value) {
    paper.value.status = value ? 1 : 2
  },
})

watch(
  () => props.paperRequest,
  () => {
    if (props.paperRequest) {
      paper.value = { ...props.paperRequest }
    }
  },
  { immediate: true },
)

const subjects = ref<Subject[]>([])
const getSubject = () => {
  storeSubject
    .getSubjects()
    .then((response) => {
      subjects.value = response.data
    })
    .catch((error) => {
      console.log('Error:', error)
      notify({
        message: 'Failed to get subjects\n' + error.message,
        color: 'error',
      })
    })
}

const onSavePaper = () => {
  emit('save', paper.value)
}

const cancelPaper = () => {
  emit('cancel')
}

onMounted(() => {
  getSubject()
})
</script>

<template>
  <VaCard>
    <VaCardTitle>General configuration</VaCardTitle>
    <VaDivider class="m-0" />
    <VaCardContent class="grid grid-cols-2 gap-2">
      <VaInput
        v-model="paper.examName"
        placeholder="Enter name..."
        label="Name"
        :rules="[validators.required]"
        class="col-span-2"
      />
      <VaSelect
        placeholder="Select a subject"
        label="Subject"
        searchable
        highlight-matched-text
        :options="subjects"
        :text-by="(subject: Subject) => subject.name"
        :value-by="(subject: Subject) => subject.id"
      />
      <VaSelect placeholder="Select a type" label="type" />
      <VaInput v-model="paper.password" placeholder="Enter password" label="Password(optional)" />
      <VaTextarea v-model="paper.description" placeholder="Description..." label="Description" class="col-span-2" />
      <VaSwitch v-model="isPublished" label="Publish" size="small" class="col-span-2 justify-self-end" />
    </VaCardContent>
  </VaCard>
  <div class="flex justify-end gap-3 mt-3">
    <VaButton preset="primary" @click="cancelPaper">Cancel</VaButton>
    <VaButton @click="onSavePaper">Save</VaButton>
  </div>
</template>
