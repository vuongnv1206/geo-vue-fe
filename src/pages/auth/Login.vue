<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="form" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">Log in</h1>
      <p class="text-base mb-4 leading-5">
        New to GEO?
        <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
      </p>
      <VaInput
        v-model="formData.email"
        :rules="[validators.required, validators.email]"
        class="mb-4"
        label="Email"
        type="email"
      />
      <VaValue v-slot="isPasswordVisible" :default-value="false">
        <VaInput
          v-model="formData.password"
          :rules="[validators.required]"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          label="Password"
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

      <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
        <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
          Forgot password?
        </RouterLink>
      </div>

      <div class="flex justify-center mt-4">
        <VaButton class="w-full" @click="submit"> Login</VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators, getErrorMessage } from '@services/utils'
import { useAuthStore } from '@modules/auth.module'
import { useReCaptcha } from 'vue-recaptcha-v3'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const reCaptcha = useReCaptcha()

const isLoading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
})

const store = useAuthStore()

const submit = async () => {
  if (validate()) {
    isLoading.value = true
    await reCaptcha?.recaptchaLoaded()
    const captchaToken = await reCaptcha?.executeRecaptcha('login')
    store
      .login(formData.email, formData.password, captchaToken ?? '', formData.keepLoggedIn)
      .then(() => {
        init({ message: "You've successfully logged in", color: 'success', position: 'bottom-right' })
        push({ name: 'dashboard' })
      })
      .catch((error: any) => {
        const message = getErrorMessage(error)
        init({ message: message, color: 'danger' })
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}

onBeforeMount(() => {
  if (store.isAuthenticated) {
    push({ name: 'dashboard' })
    init({ message: 'You are already logged in', color: 'success', position: 'bottom-right' })
  }
})
</script>
