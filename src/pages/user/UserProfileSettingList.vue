<script lang="ts" setup>
import { ref } from 'vue'
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
</script>

<template>
  <VaInnerLoading>
    <VaScrollContainer vertical>
      <VaList class="mb-2">
        <VaListItem
          v-for="item in listSettings"
          :key="item.id"
          class="list__item mb-1 py-2 rounded cursor-pointer"
          :class="{
            'bg-sky-500 text-white hover:bg-sky-500': activeOption === item.name,
            'hover:bg-slate-100': activeOption !== item.name,
          }"
          @click="selectSettingOption(item)"
        >
          <VaListItemSection avatar class="justify-center">
            <VaIcon :name="item.icon" />
          </VaListItemSection>

          <VaListItemSection>
            <VaListItemLabel :class="{ 'text-white': activeOption === item.name }">
              {{ item.name }}
            </VaListItemLabel>
          </VaListItemSection>
        </VaListItem>
      </VaList>
    </VaScrollContainer>
  </VaInnerLoading>
</template>
