<template>
  <div class="flex flex-col sm:flex-row">
    <div class="item">
      <VaCard class="p-2 ml-1 mb-5 rounded">
        <UserProfileSettingList @selectSettingOption="handleSelectedSettingOption" />
      </VaCard>
    </div>
    <div class="item w-full">
      <UserProfileDetail :setting-option="selectedSettingOption" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import UserProfileSettingList from './UserProfileSettingList.vue'
import UserProfileDetail from './UserProfileDetail.vue'
import { ref } from 'vue'
import { SettingProfile } from './types'
import { useI18n } from 'vue-i18n'
import { VaCard } from 'vuestic-ui/web-components'

const { t } = useI18n()
const selectedSettingOption = ref<SettingProfile | null>({
  id: '1',
  name: t('settings.general'),
  icon: 'person',
})
function handleSelectedSettingOption(item: SettingProfile) {
  selectedSettingOption.value = item
}
</script>
