<template>
  <VaSwitch
    v-model="mode"
    class="mr-5"
    color="#5123a1"
    off-color="#ffd300"
    size="small"
    style="--va-switch-checker-background-color: #252723"
  >
    <template #innerLabel>
      <div class="va-text-center">
        <VaIcon :name="mode ? 'dark_mode' : 'light_mode'" />
      </div>
    </template>
  </VaSwitch>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import { useColors } from 'vuestic-ui'

const { applyPreset, currentPresetName } = useColors()

const mode = ref(0)

const theme = computed({
  get() {
    return currentPresetName.value
  },
  set(value) {
    applyPreset(value)
    localStorage.setItem('theme', value)
  },
})

watch(
  () => mode.value,
  (value) => {
    theme.value = value ? 'dark' : 'light'
  },
)

onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme) {
    applyPreset(theme)
  }
})
</script>
