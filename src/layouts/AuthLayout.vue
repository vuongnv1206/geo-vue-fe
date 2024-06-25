<template>
  <VaLayout v-if="breakpoint.lgUp" class="h-screen bg-[var(--va-background-secondary)]">
    <template #left>
      <RouterLink
        class="bg-primary h-full flex items-center justify-center"
        style="width: 35vw"
        to="/"
        aria-label="Visit homepage"
      >
        <VuesticLogo :height="180" start="#FFF" />
      </RouterLink>
    </template>
    <template #content>
      <div class="h-[40px] flex flex-col items-end justify-end">
        <div class="app-navbar-actions">
          <LanguageSwitcher class="app-navbar-actions__item" />
        </div>
      </div>
      <main class="h-[calc(100%-40px)] flex items-center justify-center mx-auto max-w-[420px]">
        <RouterView />
      </main>
    </template>
  </VaLayout>

  <VaLayout v-else class="h-screen bg-[var(--va-background-secondary)]">
    <template #content>
      <div class="p-4">
        <main class="h-full flex flex-row items-center justify-start mx-auto max-w-[420px]">
          <div class="flex flex-col items-start">
            <RouterLink class="py-4" to="/" aria-label="Visit homepage">
              <VuesticLogo class="mb-2" start="#0E41C9" />
            </RouterLink>
            <RouterView />
          </div>
        </main>
      </div>
    </template>
  </VaLayout>
</template>

<script lang="ts" setup>
import { useBreakpoint } from 'vuestic-ui'
import VuesticLogo from '../components/VuesticLogo.vue'
import LanguageSwitcher from '@/pages/settings/language-switcher/LanguageSwitcher.vue'

const breakpoint = useBreakpoint()
</script>
