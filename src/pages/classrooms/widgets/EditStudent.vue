<script setup lang="ts">
import { validators } from '@/services/utils'
import { computed, reactive, ref, watch } from 'vue'
import { EmptyStudent, Student } from '../types'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const { t } = useI18n()
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
  dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - 12)),
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
    text: t('students.male'),
    value: true,
  },
  {
    text: t('students.female'),
    value: false,
  },
])
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2 min-h-[60vh] pt-6">
    <VaInput
      v-model="newStudent.firstName"
      :label="t('students.first_name')"
      :placeholder="t('students.enter_first_name')"
      :rules="[
        validators.required2(t('students.enter_first_name')),
        validators.isCharacter(t('students.enter_first_name')),
        validators.maxLength(50),
      ]"
    />
    <VaInput
      v-model="newStudent.lastName"
      :label="t('students.last_name')"
      :placeholder="t('students.enter_last_name')"
      :rules="[
        validators.required2(t('students.last_name')),
        validators.isCharacter(t('students.last_name')),
        validators.maxLength(50),
      ]"
    />
    <!-- <VaInput v-model="newStudent.avatarUrl" label="Avatar" placeholder="tam the da" /> -->
    <VaInput
      v-model="newStudent.studentCode"
      :label="t('students.code')"
      :placeholder="t('students.enter_code')"
      :rules="[
        validators.required2(t('students.code')),
        validators.isAlphanumeric(t('students.code')),
        validators.maxLength(50),
      ]"
    />
    <label
      id="input-label-510"
      aria-hidden="true"
      class="va-input-label va-input-wrapper__label va-input-wrapper__label--outer"
      style="color: var(--va-primary)"
    >
      {{ $t('students.date_of_birth') }}
    </label>
    <VueDatePicker
      v-model="newStudent.dateOfBirth"
      auto-apply
      partial-flow
      :clearable="true"
      :flow="['year', 'month', 'calendar']"
      :month-change-on-scroll="true"
      :month-change-on-arrows="true"
      :enable-time-picker="false"
      :placeholder="$t('students.enter_date_of_birth')"
      :min-date="new Date(new Date(new Date().setFullYear(new Date().getFullYear() - 100)).setHours(0, 0, 0, 0))"
      :max-date="new Date(new Date(new Date().setFullYear(new Date().getFullYear() - 12)).setHours(23, 59, 59, 999))"
    />
    <VaRadio v-model="newStudent.gender" :options="genderOptions" value-by="value" />
    <VaInput
      v-model="newStudent.phoneNumber"
      :label="t('students.phone_number')"
      :placeholder="t('students.enter_phone_number')"
      :rules="[validators.phone]"
    />
    <VaInput
      v-model="newStudent.email"
      :label="t('students.email')"
      :placeholder="t('students.enter_email')"
      :rules="[validators.required2(t('students.email')), validators.email]"
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2 pt-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ t('settings.cancel') }}</VaButton>
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
