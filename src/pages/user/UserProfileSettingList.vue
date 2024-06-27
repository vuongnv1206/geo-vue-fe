<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { SettingProfile } from './types'
import { SettingProfileOptions } from './UserProfile.enum'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const listSettings = ref<SettingProfile[]>([
  {
    id: '1',
    name: t('settings.general'),
    icon: 'person',
  },
  {
    id: '2',
    name: t('auth.change_password'),
    icon: 'lock',
  },
])
const activeOption = ref(SettingProfileOptions.General)
const emit = defineEmits(['select-setting-option'])

function selectSettingOption(item: SettingProfile) {
  emit('select-setting-option', item)
  activeOption.value = item.name
}

const tabs = [
  { id: '1', name: t('settings.general'), icon: 'person' },
  { id: '2', name: t('auth.change_password'), icon: 'lock' },
]

const selectedTab = ref(tabs[0].id)

onMounted(() => {
  selectSettingOption(listSettings.value[0])
})
</script>

<template>
  <VaTabs v-model="selectedTab" vertical grow class="mr-5">
    <template #tabs>
      <VaTab v-for="tab in tabs" :key="tab.id" :name="tab.id" @click="selectSettingOption(tab)">
        <VaIcon :name="tab.icon" class="mr-2" />
        {{ tab.name }}
      </VaTab>
    </template>
  </VaTabs>
</template>
