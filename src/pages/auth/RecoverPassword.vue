<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="passwordForm" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">{{ t('auth.forgot_password') }}</h1>
      <p class="text-base mb-4 leading-5">
        {{ t('auth.forgot_password_description') }}
      </p>
      <VaInput v-model="email" :rules="emailRules" class="mb-4" :label="t('auth.enter_email')" type="email" />
      <VaButton class="w-full mb-2" @click="submit">{{ t('auth.send_password') }}</VaButton>
      <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary">{{ t('auth.go_back') }}</VaButton>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const email = ref('')
const form = useForm('passwordForm')
const router = useRouter()
const store = useAuthStore()

const isLoading = ref(false)

const emailRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || t('auth.email_required'),
  (v) => /.+@.+\..+/.test(v) || t('auth.email_valid'),
]

const submit = () => {
  if (form.validate()) {
    isLoading.value = true
    store
      .forgotPassword(email.value)
      .finally(() => {
        router.push({ name: 'recover-password-email' })
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}
</script>
