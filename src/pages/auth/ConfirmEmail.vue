<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth.module'
import { ref } from 'vue'

const route = useRoute()
const store = useAuthStore()

const userId = route.query.userId as string
const code = route.query.code as string
const tenant = route.query.tenant as string

const isConfirmed = ref(false)
const isLoading = ref(true)
const isConfirmedBtnClicked = ref(false)

const confirmEmail = () => {
  isConfirmedBtnClicked.value = true
  store
    .confirmEmail(tenant, userId, code)
    .then(() => {
      isConfirmed.value = true
    })
    .catch(() => {
      isConfirmed.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <div>
    <div v-if="isConfirmedBtnClicked">
      <VaInnerLoading :loading="isLoading" :size="60">
        <div v-if="isLoading" class="flex justify-center">
          <VaSkeleton class="w-16 h-16 rounded-full" />
        </div>
        <div v-else>
          <h1 v-if="isConfirmed" class="font-semibold text-4xl mb-4">Success confirmation</h1>
          <h1 v-else class="font-semibold text-4xl mb-4">Failed confirmation</h1>

          <!-- Icon -->
          <div class="flex justify-center">
            <VaIcon v-if="isConfirmed" class="text-6xl text-green-500" name="check_circle" size="4rem" />
            <VaIcon v-else class="text-6xl text-red-500" name="close" size="4rem" />
          </div>

          <p v-if="isConfirmed" class="text-base mb-4 leading-5">
            Your email has been confirmed. You can now log in to your account.
          </p>
          <p v-else class="text-base mb-4 leading-5">
            Your email could not be confirmed. Please try again or contact support.
          </p>

          <div class="flex justify-center mt-4">
            <VaButton :to="{ name: 'login' }" class="w-full">Back to login</VaButton>
          </div>
        </div>
      </VaInnerLoading>
    </div>
    <div v-else>
      <h1 class="font-semibold text-xl mb-4 text-center">
        Click the button below to confirm your email <VaIcon class="text-xl text-blue-500" name="email" size="2rem" />
      </h1>
      <VaButton class="w-full" @click="confirmEmail">Confirm email</VaButton>
    </div>
  </div>
</template>
