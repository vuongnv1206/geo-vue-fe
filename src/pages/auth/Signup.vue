<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'
import { Register } from './types'
import { getErrorMessage } from '@/services/utils'

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
          message: 'Account created successfully',
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

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]

const usernameRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Username field is required',
  (v) => (v && v.length >= 3) || 'Username must be at least 3 characters long',
  (v) => (v && v.length <= 20) || 'Username must be at most 20 characters long',
  (v) => (v && /^[a-zA-Z0-9_]*$/.test(v)) || 'Username must contain only letters, numbers, and underscores',
]

const phoneNumberRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Phone Number field is required',
  (v) => (v && v.length >= 10) || 'Phone Number must be at least 10 characters long',
  (v) => (v && v.length <= 15) || 'Phone Number must be at most 15 characters long',
  (v) => (v && /^\d+$/.test(v)) || 'Phone Number must contain only numbers',
]

const emailRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Email field is required',
  (v) => /.+@.+\..+/.test(v) || 'Email should be valid',
]
</script>

<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="form" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
      <p class="text-base mb-4 leading-5">
        Have an account?
        <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
      </p>
      <VaTabs v-model="roleTabValue">
        <template #tabs>
          <VaTab v-for="tab in ['Student', 'Teacher']" :key="tab">
            {{ tab }}
          </VaTab>
        </template>
      </VaTabs>
      <VaDivider class="mb-4" />
      <div class="grid grid-cols-2 gap-4 items-start">
        <VaInput
          v-model="formData.firstName"
          :rules="[(v) => !!v || 'First Name field is required']"
          class="mb-4"
          label="First Name"
        />
        <VaInput
          v-model="formData.lastName"
          :rules="[(v) => !!v || 'Last Name field is required']"
          class="mb-4"
          label="Last Name"
        />
      </div>
      <VaInput v-model="formData.username" :rules="usernameRules" class="mb-4" label="Username" />
      <VaInput v-model="formData.phoneNumber" :rules="phoneNumberRules" class="mb-4" label="Phone Number" />
      <VaInput v-model="formData.email" :rules="emailRules" class="mb-4" label="Email" type="email" />
      <VaValue v-slot="isPasswordVisible" :default-value="false">
        <VaInput
          ref="password1"
          v-model="formData.password"
          :rules="passwordRules"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          label="Password"
          messages="Password should be 8+ characters: letters, numbers, and special characters."
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
            (v) => !!v || 'Repeat Password field is required',
            (v) => v === formData.password || 'Passwords don\'t match',
          ]"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          label="Repeat Password"
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
        <VaButton class="w-full" @click="submit"> Create account</VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
</template>
