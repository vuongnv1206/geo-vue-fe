<script setup lang="ts">
import { ref, watch } from 'vue'
import { AccessType, PaperAccess } from '../types'

const props = defineProps<{
  accessType: AccessType | AccessType.ByClass
  paperAccessList: PaperAccess[] | []
}>()

const accessTypeDefault = ref<AccessType>(AccessType.ByClass)

watch(
  () => props.accessType,
  (newAccess) => {
    accessTypeDefault.value = newAccess
  },
)

const accessOptions = [
  { value: AccessType.ByClass, text: 'By Class' },
  { value: AccessType.ByStudent, text: 'By Student' },
]
</script>

<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <p>List of assignees</p>
      <VaRadio v-model="accessTypeDefault" :options="accessOptions" class="assign-radio mb-2" value-by="value" />
    </VaCardTitle>
    <VaDivider />
    <VaCardContent>
      <VaScrollContainer vertical> </VaScrollContainer>
    </VaCardContent>
  </VaCard>
</template>
