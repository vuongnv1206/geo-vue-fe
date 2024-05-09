<script lang="ts" setup>
import { computed } from 'vue'
import { useAuthStore } from '../../../stores/modules/auth.module'

const authStore = useAuthStore()
const isTeacher = computed(() => authStore?.musHaveRole('Admin')) // just for testing
const isStudent = computed(() => authStore?.musHaveRole('Basic')) // just for testing
</script>

<template>
  <h1 class="page-title font-bold">Dashboard</h1>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <div v-if="isTeacher" class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-lg font-bold">Teacher can see this</h2>
      <p class="text-3xl font-bold">hola</p>
    </div>
    <div v-if="isStudent" class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-lg font-bold">Student can see this</h2>
      <p class="text-3xl font-bold">laho</p>
    </div>
  </div>
</template>
