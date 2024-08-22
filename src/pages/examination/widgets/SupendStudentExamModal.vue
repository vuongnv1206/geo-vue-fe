<script setup lang="ts">
import { ref } from 'vue'
import { SupendStudentExamRequest, StudentMonitor } from '../types'
import { validators } from '@services/utils'
const props = defineProps<{
  studentMonitor: StudentMonitor | null
  paperId: string
}>()

console.log(props.studentMonitor)

const emit = defineEmits<{
  (event: 'supend', supendStudentExamRequest: SupendStudentExamRequest): void
  (event: 'close'): void
}>()

const studentEmail = ref('')
const reasonSupend = ref('')

// fill from props
studentEmail.value = props.studentMonitor?.student?.email || ''

const res = ref<SupendStudentExamRequest | null>(null)

const prepareSupend = () => {
  res.value = {
    paperId: props.studentMonitor?.submitPaper.paperId || props.paperId || '',
    studentEmail: studentEmail.value,
    reason: reasonSupend.value,
  }
  console.log(res.value)
  emit('supend', res.value)
}
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <h3 class="text-lg font-semibold">Supend exam</h3>
    <VaInput v-model="studentEmail" label="Student Email" :rules="[validators.required, validators.email]" />
    <VaTextarea
      v-model="reasonSupend"
      :max-length="125"
      label="Reason"
      counter
      required-mark
      :rules="[(v: string | any[]) => (v && v.length > 0) || 'Required', (v: string | any[]) => v && v.length < 125]"
    />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton color="danger" @click="validate() && prepareSupend()">Supend</VaButton>
    </div>
  </VaForm>
</template>
