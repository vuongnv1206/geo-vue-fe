<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import VaIconEnglish from '@/components/icons/VaIconEnglish.vue'
import VaIconVietnamese from '@/components/icons/VaIconVietnamese.vue'
import { useToast } from 'vuestic-ui'

const { t, locale } = useI18n()
const { init } = useToast()

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  init({ message: t('languageSwitcher.change_language_success'), color: 'success', position: 'bottom-right' })
}
</script>

<template>
  <div class="flex items-center justify-between">
    <VaMenu class="mr-2">
      <template #anchor>
        <VaIconEnglish v-if="locale === 'gb'" class="va-icon-message" />
        <VaIconVietnamese v-else class="va-icon-message" />
      </template>
      <VaMenuItem @selected="changeLanguage('gb')"> <VaIconEnglish class="va-icon-message" /> English </VaMenuItem>
      <VaMenuItem @selected="changeLanguage('vi')">
        <VaIconVietnamese class="va-icon-message" /> Tiếng Việt
      </VaMenuItem>
    </VaMenu>
  </div>
</template>
