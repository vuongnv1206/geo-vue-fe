<script setup lang="ts">
import { PropTypes } from 'vuestic-ui/dist/types/services/component-config'
import { CreatePaperRequest } from '../types'
import { ref, watch } from 'vue'
import { validators } from '@services/utils'

const props = defineProps({
  paperRequest: {
    type: Object as PropTypes<CreatePaperRequest | null>,
    default: null,
  },
})

const paper = ref<CreatePaperRequest>({
  examName: '',
  status: 1,
  password: '',
  type: 0,
  paperFolderId: '',
  description: '',
  questions: [],
})
watch(
  () => props.paperRequest,
  () => {
    if (props.paperRequest) {
      paper.value = { ...props.paperRequest }
    }
  },
  { immediate: true },
)
</script>

<template>
  <VaCard>
    <VaCardTitle>General configuration</VaCardTitle>
    <VaDivider class="m-0" />
    <VaCardContent class="grid grid-cols-2 gap-2">
      <VaInput
        v-model="paper.examName"
        placeholder="Enter name..."
        label="Name"
        :rules="[validators.required]"
        class="col-span-2"
      />
      <VaSelect placeholder="Select a grade" label="grade" />
      <VaSelect placeholder="Select a subject" label="Subject" />
      <VaSelect placeholder="Select a type" label="type" />
      <VaInput v-model="paper.password" placeholder="Enter password" label="Password(optional)" />
      <VaTextarea v-model="paper.description" placeholder="Description..." label="Description" class="col-span-2" />
      <VaSwitch v-model="paper.status" label="Publish" size="small" class="col-span-2 justify-self-end" />
    </VaCardContent>
  </VaCard>
  <div class="flex justify-end gap-3 mt-3">
    <VaButton preset="primary">Cancel</VaButton>
    <VaButton>Save</VaButton>
  </div>
</template>
