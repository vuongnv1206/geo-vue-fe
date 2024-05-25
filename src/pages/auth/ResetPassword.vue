<template>
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
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useForm, useToast } from 'vuestic-ui'

const { validate } = useForm('form')
const { init } = useToast()

const formData = reactive({
  email: '',
  password: '',
  repeatPassword: '',
  token: '',
})

const submit = async () => {
  if (validate()) {
    init({ message: "You've successfully logged in", color: 'success' })
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
