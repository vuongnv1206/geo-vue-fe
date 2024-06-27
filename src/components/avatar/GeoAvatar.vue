<script setup lang="ts">
import { useAuthStore } from '@/stores/modules/auth.module'
import { ref, watch } from 'vue'

const store = useAuthStore()

const url = import.meta.env.VITE_APP_BASE_URL as string
const url_without_api = url.slice(0, -3)

const avatarImage = ref<string | undefined>(store.user?.avatarUrl ? `${url_without_api}${store.avatarUrl}` : undefined)

watch(
  () => store.avatarUrl,
  () => {
    avatarImage.value = store.avatarUrl ? `${url_without_api}${store.avatarUrl}` : undefined
  },
  { immediate: true },
)

const props = defineProps<{
  txt?: string
  size?: number
  color?: string
  image?: string
}>()

const imageUrl = props.image ? `${url_without_api}${props.image}` : undefined
</script>

<template>
  <VaAvatar v-if="!avatarImage" :size="props.size || 32" :color="props.color || 'primary'">
    {{ props.txt }}
  </VaAvatar>
  <VaAvatar v-else-if="!imageUrl" :size="props.size || 32" :src="avatarImage" />
  <VaAvatar v-else :size="props.size || 32" :src="imageUrl" />
</template>
