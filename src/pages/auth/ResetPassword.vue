<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="form" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">Reset password</h1>
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
      <VaButton class="w-full" @click="submit">Reset password</VaButton>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'
import { ref } from 'vue'
import { ResetPassword } from './types'
import { getErrorMessage } from '@/services/utils'
import { useReCaptcha } from 'vue-recaptcha-v3'

const route = useRoute()
const { push } = useRouter()
const store = useAuthStore()
const reCaptcha = useReCaptcha()

const { validate } = useForm('form')
const { init } = useToast()

const isLoading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  repeatPassword: '',
  token: '',
})

const userEmail = route.query.Email as string
const token = route.query.Token as string

const submit = async () => {
  if (validate()) {
    await reCaptcha?.recaptchaLoaded()
    const captchaToken = await reCaptcha?.executeRecaptcha('reset_password')
    const resetPasswordData: ResetPassword = {
      email: userEmail,
      password: formData.password,
      token: token,
      captchaToken: captchaToken ?? '',
    }
    isLoading.value = true
    store
      .resetPassword(resetPasswordData)
      .then(() => {
        init({
          title: 'Success',
          message: 'Password has been reset successfully',
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

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]
</script>
