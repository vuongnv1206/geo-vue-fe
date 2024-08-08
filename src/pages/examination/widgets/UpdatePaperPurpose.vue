<script setup lang="ts">
import { PropType } from 'vue'
import { CreatePaperRequest } from '../types'
import { computed, ref, watch, onMounted } from 'vue'
import { validators } from '@services/utils'
import { useSubjectStore } from '../../../stores/modules/subject.module'
import { Subject } from '@/pages/subject/types'
import { useForm, useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const storeSubject = useSubjectStore()
const { init: notify } = useToast()

const props = defineProps({
  paperRequest: {
    type: Object as PropType<CreatePaperRequest | null>,
    default: null,
  },
})

const emit = defineEmits(['cancel', 'save'])

const paper = ref<CreatePaperRequest>({
  examName: '',
  status: 1,
  password: '' || undefined,
  type: 0,
  paperFolderId: '' || undefined,
  description: '' || undefined,
  questions: [],
  subjectId: '' || undefined,
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
const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})
const subjects = ref<Subject[]>([])
const getSubject = () => {
  storeSubject
    .getSubjects(dataFilter.value)
    .then((response) => {
      subjects.value = response.data
    })
    .catch((error) => {
      notify({
        message: 'Failed to get subjects\n' + error.message,
        color: 'error',
      })
    })
}
const { validate } = useForm('form')
const onSavePaper = () => {
  if (validate()) {
    emit('save', paper.value)
  }
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
    <VaForm ref="form">
      <VaCardContent class="grid grid-cols-2 gap-2">
        <VaInput
          v-model="paper.examName"
          :placeholder="t('papers.enter_exam_name')"
          :label="t('papers.exam_name')"
          :rules="[validators.required]"
          class="col-span-2"
        />
        <VaSelect
          v-model="paper.subjectId"
          :placeholder="t('papers.select_a_subject')"
          :label="t('subjects.subject')"
          searchable
          highlight-matched-text
          :options="subjects"
          :text-by="(subject: Subject) => subject.name"
          :value-by="(subject: Subject) => subject.id"
          :rules="[validators.required]"
        />
        <VaInput v-model="paper.password" :placeholder="t('papers.enter_password')" :label="t('papers.password')" />
        <VaTextarea
          v-model="paper.description"
          :placeholder="t('papers.enter_description')"
          :label="t('papers.description')"
          class="col-span-2"
        />
        <VaSwitch v-model="isPublished" :label="t('papers.publish')" size="small" class="col-span-2 justify-self-end" />
      </VaCardContent>
    </VaForm>
  </VaCard>
  <div class="flex justify-end gap-3 mt-3">
    <VaButton preset="primary" @click="cancelPaper">{{ t('settings.cancel') }}</VaButton>
    <VaButton @click="onSavePaper">{{ t('settings.save ') }}</VaButton>
  </div>
</template>
