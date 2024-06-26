<script setup lang="ts">
import { validators } from '@/services/utils'
import { computed, reactive, ref, watch } from 'vue'
import { EmptyUserInClass, UserInClass } from '../types'

const props = defineProps<{
  userInClass: UserInClass | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', userInClass: UserInClass): void
  (event: 'close'): void
}>()

const defaultNewUserInClass: EmptyUserInClass = {
  userId: '',
  classesId: '',
  studentCode: '',
  firstName: '',
  lastName: '',
  email: '',
  dob: new Date(),
  gender: false,
  phoneNumber: '',
}

const newUserInClass = ref({ ...defaultNewUserInClass })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUserInClass.value).some((key) => {
    return (
      newUserInClass.value[key as keyof EmptyUserInClass] !==
      (props.userInClass ?? defaultNewUserInClass)?.[key as keyof EmptyUserInClass]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.userInClass,
  () => {
    if (!props.userInClass) {
      return
    }

    newUserInClass.value = { ...props.userInClass }
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
      v-model="newUserInClass.firstName"
      label="First name"
      placeholder="Enter your first name"
      :rules="[validators.required2('First name'), validators.isCharacter('First name'), validators.maxLength(50)]"
    />
    <VaInput
      v-model="newUserInClass.lastName"
      label="Last name"
      placeholder="Enter your last name"
      :rules="[validators.required2('Last name'), validators.isCharacter('Last name'), validators.maxLength(50)]"
    />
    <VaInput
      v-model="newUserInClass.studentCode"
      label="Student code"
      placeholder="Enter your student code"
      :rules="[validators.required2('Student code'), validators.maxLength(50)]"
    />
    <VaDateInput v-model="newUserInClass.dob" label="Birth date" placeholder="Enter your date of birth" />
    <VaRadio v-model="newUserInClass.gender" :options="genderOptions" value-by="value" />
    <VaInput
      v-model="newUserInClass.phoneNumber"
      label="Phone Number"
      placeholder="Enter your phone number"
      :rules="[validators.required2('Phone number'), validators.isNumber('phone number'), validators.phone]"
    />
    <VaInput
      v-model="newUserInClass.email"
      label="Email"
      placeholder="Enter your email"
      :rules="[validators.required2('Email'), validators.email]"
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newUserInClass as UserInClass)">{{ saveButtonLabel }} </VaButton>
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
