<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { GroupTeacher } from './types'
import { useForm } from 'vuestic-ui'
import { validators } from '@/services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  groupTeacher: {
    type: Object as PropType<GroupTeacher | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewGroupTeacher: GroupTeacher = {
  id: '',
  name: '',
  teacherTeams: [],
  groupPermissionInClasses: [],
}

const newGroup = ref<GroupTeacher>({ ...defaultNewGroupTeacher })

watch(
  () => props.groupTeacher,
  () => {
    if (props.groupTeacher) {
      newGroup.value = { ...props.groupTeacher }
    }
  },
  { immediate: true },
)

const form = useForm('addForm')
const emit = defineEmits(['close', 'save'])
const onSave = () => {
  if (form.validate()) {
    emit('save', newGroup.value)
  }
}
</script>

<template>
  <VaCard>
    <VaCardContent>
      <VaForm ref="addForm" stateful class="flex flex-col gap-2">
        <VaInput
          v-model="newGroup.name"
          name="name"
          :label="t('teacherGroups.group_name')"
          :placeholder="t('teacherGroups.enter_group_name')"
          :rules="[validators.required2(t('teacherGroups.group_name')), validators.maxLength(50)]"
        />
      </VaForm>
    </VaCardContent>
    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ $t('settings.cancel') }}</VaButton>
      <VaButton @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaCard>
</template>
