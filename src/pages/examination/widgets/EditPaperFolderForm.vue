<script setup lang="ts">
import { ref, watch } from 'vue'
import { PaperFolderDto, UpdatePaperFolderRequest } from '../types'
import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { validators } from '@/services/utils'

const { t } = useI18n()
const props = defineProps({
  folder: {
    type: Object as PropType<PaperFolderDto | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

defineEmits<{
  (event: 'save', folder: UpdatePaperFolderRequest): void
  (event: 'close'): void
}>()

const defaultNewPaperFolder: UpdatePaperFolderRequest = {
  id: '',
  name: '',
  parentId: '',
}

const newPaperFolder = ref({ ...defaultNewPaperFolder })

watch(
  () => props.folder,
  () => {
    if (props.folder) {
      newPaperFolder.value = { ...props.folder }
    }
  },
  { immediate: true },
)
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput
      v-model="newPaperFolder.name"
      :label="t('papers.folder_name')"
      :rules="[validators.required2($t('papers.folder_name'))]"
    />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ t('settings.cancel') }}</VaButton>
      <VaButton @click="validate() && $emit('save', newPaperFolder as UpdatePaperFolderRequest)">
        {{ saveButtonLabel }}
      </VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
