<script setup lang="ts">
import { VaButton, VaCard, VaCardContent } from 'vuestic-ui/web-components'
</script>

<template>
  <VaLayout class="h-[80vh]">
    <!-- Navbar ở phần trên cùng -->
    <template #top>
      <VaButton>aaaa</VaButton>
    </template>

    <!-- Phần bên trái chiếm 70% chiều rộng màn hình -->
    <template #left>
      <div class="w-[70vw] bg-gray-200 p-4 h-full mr-2 rounded-md">
        <VaCard>
          <VaCardContent> abc </VaCardContent>
        </VaCard>
      </div>
    </template>

    <!-- Phần nội dung chiếm 30% chiều rộng màn hình -->
    <template #content>
      <div class="w-[30vw] bg-gray-200 p-4 h-full rounded-md">
        <VaCard>
          <VaCardContent> abc </VaCardContent>
        </VaCard>
      </div>
    </template>
  </VaLayout>
</template>
