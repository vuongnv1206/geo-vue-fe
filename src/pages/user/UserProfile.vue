<template>
  <div class="flex flex-col md:flex-row">
    <div class="p-3 rounded mr-1 ml-1 mb-2 h-fit md:w-1/4 sm:w-1/3" style="background-color: #fff">
      <UserProfileSettingList @selectSettingOption="handleSelectedSettingOption" />
    </div>
    <div class="item w-full flex-1">
      <UserProfileDetail :setting-option="selectedSettingOption" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import UserProfileSettingList from './UserProfileSettingList.vue'
import UserProfileDetail from './UserProfileDetail.vue'
import { ref } from 'vue'
import { SettingProfile } from './types'
const selectedSettingOption = ref<SettingProfile | null>(null)
function handleSelectedSettingOption(item: SettingProfile) {
  selectedSettingOption.value = item
}
</script>
