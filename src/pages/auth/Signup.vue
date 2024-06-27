<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'
import { Register } from './types'
import { getErrorMessage } from '@/services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const store = useAuthStore()

const isLoading = ref(false)

const formData = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  phoneNumber: '',
  repeatPassword: '',
})

const submit = () => {
  if (validate()) {
    const registerData: Register = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      userName: formData.username,
      password: formData.password,
      confirmPassword: formData.repeatPassword,
      phoneNumber: formData.phoneNumber,
      role: roleTabValue.value === 0 ? 'Student' : 'Teacher',
    }

    isLoading.value = true

    store
      .register(registerData)
      .then(() => {
        init({
          title: 'Success',
          message: t('auth.account_created'),
          color: 'success',
        })
        push({ name: 'login' })
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        init({
          title: 'Error',
          message: message,
          color: 'danger',
        })
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}

const roleTabValue = ref(0)

const passwordRules = [
  (v: any) => !!v || t('validation.password.required'),
  (v: any) => (v && v.length >= 8) || t('validation.password.minLength'),
  (v: any) => (v && /[A-Za-z]/.test(v)) || t('validation.password.letter'),
  (v: any) => (v && /\d/.test(v)) || t('validation.password.number'),
  (v: any) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || t('validation.password.specialCharacter'),
]

const usernameRules = [
  (v: any) => !!v || t('validation.username.required'),
  (v: any) => (v && v.length >= 3) || t('validation.username.minLength'),
  (v: any) => (v && v.length <= 20) || t('validation.username.maxLength'),
  (v: any) => (v && /^[a-zA-Z0-9_]*$/.test(v)) || t('validation.username.pattern'),
]

const phoneNumberRules = [
  (v: any) => !!v || t('validation.phoneNumber.required'),
  (v: any) => (v && v.length >= 10) || t('validation.phoneNumber.minLength'),
  (v: any) => (v && v.length <= 15) || t('validation.phoneNumber.maxLength'),
  (v: any) => (v && /^\d+$/.test(v)) || t('validation.phoneNumber.pattern'),
]

const emailRules = [
  (v: any) => !!v || t('validation.email.required'),
  (v: any) => /.+@.+\..+/.test(v) || t('validation.email.pattern'),
]
</script>

<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="form" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">{{ t('auth.sign_up') }}</h1>
      <p class="text-base mb-4 leading-5">
        {{ t('auth.have_account') }}
        <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">{{ t('auth.login') }}</RouterLink>
      </p>
      <VaTabs v-model="roleTabValue">
        <template #tabs>
          <VaTab v-for="tab in [t('auth.tabs.student'), t('auth.tabs.teacher')]" :key="tab">
            {{ tab }}
          </VaTab>
        </template>
      </VaTabs>
      <VaDivider class="mb-4" />
      <div class="grid grid-cols-2 gap-4 items-start">
        <VaInput
          v-model="formData.firstName"
          :rules="[(v: any) => !!v || t('auth.first_name_required')]"
          class="mb-4"
          :label="t('auth.first_name')"
        />
        <VaInput
          v-model="formData.lastName"
          :rules="[(v: any) => !!v || t('auth.last_name_required')]"
          class="mb-4"
          :label="t('auth.last_name')"
        />
      </div>
      <VaInput v-model="formData.username" :rules="usernameRules" class="mb-4" :label="t('auth.username')" />
      <VaInput v-model="formData.phoneNumber" :rules="phoneNumberRules" class="mb-4" :label="t('auth.phone_number')" />
      <VaInput v-model="formData.email" :rules="emailRules" class="mb-4" :label="t('auth.email')" type="email" />
      <VaValue v-slot="isPasswordVisible" :default-value="false">
        <VaInput
          ref="password1"
          v-model="formData.password"
          :rules="passwordRules"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          :label="t('auth.password')"
          :messages="t('auth.password_hint')"
          @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
        >
          <template #appendInner>
            <VaIcon
              :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
              class="cursor-pointer"
              color="secondary"
            />
          </template>
        </VaInput>
        <VaInput
          ref="password2"
          v-model="formData.repeatPassword"
          :rules="[
            (v: any) => !!v || t('auth.repeat_password_required'),
            (v: string) => v === formData.password || t('auth.password_match'),
          ]"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          :label="t('auth.repeat_password')"
          @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
        >
          <template #appendInner>
            <VaIcon
              :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
              class="cursor-pointer"
              color="secondary"
            />
          </template>
        </VaInput>
      </VaValue>

      <div class="flex justify-center mt-4">
        <VaButton class="w-full" @click="submit">{{ t('auth.create_account') }}</VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
</template>
