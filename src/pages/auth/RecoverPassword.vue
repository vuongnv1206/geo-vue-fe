<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="passwordForm" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">Forgot your password?</h1>
      <p class="text-base mb-4 leading-5">
        If you've forgotten your password, don't worry. Simply enter your email address below, and we'll send you an
        email with a temporary password. Restoring access to your account has never been easier.
      </p>
      <VaInput v-model="email" :rules="emailRules" class="mb-4" label="Enter your email" type="email" />
      <VaButton class="w-full mb-2" @click="submit">Send password</VaButton>
      <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary" @click="submit">Go back</VaButton>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth.module'

const email = ref('')
const form = useForm('passwordForm')
const router = useRouter()
const store = useAuthStore()

const isLoading = ref(false)

const emailRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Email field is required',
  (v) => /.+@.+\..+/.test(v) || 'Email should be valid',
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
