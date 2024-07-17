<script lang="ts" setup>
import { ref } from 'vue'
const dateValue = ref(new Date())
const timeValue = ref(new Date())
const emit = defineEmits(['save'])
const onSave = () => {
  const date = `${dateValue.value.getFullYear()}-${(dateValue.value.getMonth() + 1).toString().padStart(2, '0')}-${dateValue.value.getDate().toString().padStart(2, '0')}`
  const time = `${timeValue.value.getHours().toString().padStart(2, '0')}:${timeValue.value.getMinutes().toString().padStart(2, '0')}:00`
  emit('save', `${date}T${time}`)
}
</script>

<template>
  <div>
    <VaDatePicker v-model="dateValue" />
    <VaTimePicker v-model="timeValue" framed class="flex justify-center" />
    <div class="flex justify-end mt-3">
      <VaButton size="small" color="secondary" class="mr-2">{{ t('settings.cancel') }}</VaButton>
      <VaButton size="small" @click="onSave">{{ t('settings.save') }}</VaButton>
    </div>
  </div>
</template>
