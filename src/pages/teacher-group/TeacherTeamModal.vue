<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { TeacherTeamRequest, TeacherTeam } from './types'
import { useForm } from 'vuestic-ui'
import { validators } from '@/services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  teacherTeam: {
    type: Object as PropType<TeacherTeam | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewTeacherTeam: TeacherTeamRequest = {
  id: '',
  teacherName: '',
  contact: '',
}

const newTeacher = ref<TeacherTeamRequest>({ ...defaultNewTeacherTeam })

watch(
  () => props.teacherTeam,
  () => {
    if (props.teacherTeam) {
      newTeacher.value = {
        id: props.teacherTeam.id,
        teacherName: props.teacherTeam.teacherName,
        contact: props.teacherTeam.email || props.teacherTeam.phone,
      }
    }
  },
  { immediate: true },
)

const form = useForm('addForm')
const emit = defineEmits(['close', 'save'])
const onSave = () => {
  if (form.validate()) {
    emit('save', newTeacher.value)
  }
}
</script>

<template>
  <VaCard>
    <VaCardContent>
      <VaForm ref="addForm" stateful class="flex flex-col gap-2">
        <VaInput
          v-model="newTeacher.teacherName"
          name="teacherName"
          :label="t('teacherGroups.teacher_name')"
          :placeholder="t('teacherGroups.enter_teacher_name')"
          :rules="[validators.required2(t('teacherGroups.teacher_name')), validators.maxLength(50)]"
        />
        <VaInput
          v-model="newTeacher.contact"
          name="contact"
          :label="t('teacherGroups.teacher_contact')"
          :placeholder="t('teacherGroups.enter_teacher_contact')"
          :rules="[validators.required2(t('teacherGroups.teacher_contact')), validators.maxLength(200)]"
        />
      </VaForm>
    </VaCardContent>
    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ $t('settings.cancel') }}</VaButton>
      <VaButton @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaCard>
</template>
