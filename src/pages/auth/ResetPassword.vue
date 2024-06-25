<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="form" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">{{ t('auth.reset_password') }}</h1>
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
      <VaButton class="w-full" @click="submit">{{ t('auth.reset_password') }}</VaButton>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'
import { ResetPassword } from './types'
import { getErrorMessage } from '@/services/utils'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
          title: t('auth.success'),
          message: t('auth.password_reset_success'),
          color: 'success',
        })
        push({ name: 'login' })
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        init({
          title: t('auth.error'),
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
  (v) => !!v || t('auth.password_required'),
  (v) => (v && v.length >= 8) || t('auth.password_min_length'),
  (v) => (v && /[A-Za-z]/.test(v)) || t('auth.password_letter_required'),
  (v) => (v && /\d/.test(v)) || t('auth.password_number_required'),
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || t('auth.password_special_character_required'),
]
</script>
