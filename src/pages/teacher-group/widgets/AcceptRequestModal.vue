<script setup lang="ts">
import { ref, watch } from 'vue'
import { AcceptJoinTeamRequest, JoinTeacherTeamRequestDto } from '../types'
import { useI18n } from 'vue-i18n'
import { validators } from '@/services/utils'
import { useForm } from 'vuestic-ui'

const props = defineProps<{
  requestJoin: JoinTeacherTeamRequestDto
  saveButtonLabel: string | 'Save'
}>()

const { t } = useI18n()

const defaultRequest = ref<AcceptJoinTeamRequest>({
  requestId: '',
  nickname: '',
})

const emailSender = ref<string>('')

const emit = defineEmits(['close', 'save'])
const onSave = () => {
  if (form.validate()) {
    emit('save', defaultRequest.value)
  }
}

watch(
  () => props.requestJoin,
  () => {
    if (props.requestJoin) {
      defaultRequest.value = {
        requestId: props.requestJoin.id,
        nickname: props.requestJoin.senderEmail || '',
      }
      emailSender.value = props.requestJoin.senderEmail || ''
    }
  },
  { immediate: true },
)

const form = useForm('addForm')
</script>

<template>
  <VaCard>
    <VaCardContent>
      <VaForm ref="addForm" stateful class="flex flex-col gap-2">
        <VaInput
          v-model="defaultRequest.nickname"
          name="teacherName"
          :label="t('teacherGroups.teacher_name')"
          :placeholder="t('teacherGroups.enter_teacher_name')"
          :rules="[validators.required2(t('teacherGroups.teacher_name')), validators.maxLength(50)]"
        />
        <VaInput
          v-model="emailSender"
          name="contact"
          :label="t('teacherGroups.teacher_contact')"
          :placeholder="t('teacherGroups.enter_teacher_contact')"
          disabled
        />
      </VaForm>
    </VaCardContent>
    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ $t('settings.cancel') }}</VaButton>
      <VaButton @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaCard>
</template>
