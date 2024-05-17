<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { TeacherTeamRequest } from './types'
import { useForm } from 'vuestic-ui'

const props = defineProps({
  teacherTeam: {
    type: Object as PropType<TeacherTeamRequest | null>,
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
      newTeacher.value = { ...props.teacherTeam }
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
    <VaDivider />
    <VaCardContent>
      <VaForm ref="addForm" stateful class="flex flex-col gap-2">
        <VaInput
          v-model="newTeacher.teacherName"
          name="teacherName"
          label="Teacher name"
          placeholder="Teacher name"
          :rules="[(v) => !!v || 'Required']"
        />
        <VaInput
          v-model="newTeacher.contact"
          name="contact"
          label="Contact"
          placeholder="Contact"
          :rules="[(v) => !!v || 'Required']"
        />
      </VaForm>
    </VaCardContent>
    <VaDivider />
    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaCard>
</template>
