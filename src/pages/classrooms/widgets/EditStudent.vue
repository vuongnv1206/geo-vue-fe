<script setup lang="ts">
import { validators } from '@/services/utils'
import { computed, reactive, ref, watch } from 'vue'
import { EmptyStudent, Student } from '../types'
import { useRouter } from 'vue-router'

const router = useRouter()
const classId = router.currentRoute.value.params.id.toString()

const props = defineProps<{
  student: Student | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', student: Student): void
  (event: 'close'): void
}>()

const defaultNewStudent: EmptyStudent = {
  firstName: '',
  lastName: '',
  avatarUrl: '',
  dateOfBirth: new Date(),
  email: '',
  phoneNumber: '',
  studentCode: '',
  gender: false,
  classesId: '',
}

const newStudent = ref({ ...defaultNewStudent })
newStudent.value.classesId = classId

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newStudent.value).some((key) => {
    return (
      newStudent.value[key as keyof EmptyStudent] !== (props.student ?? defaultNewStudent)?.[key as keyof EmptyStudent]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.student,
  () => {
    if (!props.student) {
      return
    }

    newStudent.value = { ...props.student }
  },
  { immediate: true },
)
const genderOptions = reactive([
  {
    text: 'Male',
    value: true,
  },
  {
    text: 'Female',
    value: false,
  },
])
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput
      v-model="newStudent.firstName"
      label="First name"
      placeholder="Enter your first name"
      :rules="[validators.required2('First name'), validators.isCharacter('First name'), validators.maxLength(50)]"
    />
    <VaInput
      v-model="newStudent.lastName"
      label="Last name"
      placeholder="Enter your last name"
      :rules="[validators.required2('Last name'), validators.isCharacter('Last name'), validators.maxLength(50)]"
    />
    <VaInput v-model="newStudent.avatarUrl" label="Avatar" placeholder="tam the da" />
    <VaInput
      v-model="newStudent.studentCode"
      label="Student code"
      placeholder="Enter your student code"
      :rules="[validators.required2('Student code'), validators.maxLength(50)]"
    />
    <VaDateInput v-model="newStudent.dateOfBirth" label="Birth date" placeholder="Enter your date of birth" />
    <VaRadio v-model="newStudent.gender" :options="genderOptions" value-by="value" />
    <VaInput
      v-model="newStudent.phoneNumber"
      label="Phone Number"
      placeholder="Enter your phone number"
      :rules="[validators.isNumber('phone number'), validators.phone]"
    />
    <VaInput
      v-model="newStudent.email"
      label="Email"
      placeholder="Enter your email"
      :rules="[validators.required2('Email'), validators.email]"
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newStudent as Student)">{{ saveButtonLabel }} </VaButton>
    </VaCard>
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
