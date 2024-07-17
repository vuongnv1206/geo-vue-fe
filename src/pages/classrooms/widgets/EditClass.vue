<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { ClassroomQueryType, Classrooms, EmptyClassrooms, GroupClass } from '@pages/classrooms/types'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { getErrorMessage, notifications, validators } from '@/services/utils'
import { useToast, VaSelect } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { init: notify } = useToast()
const loading = ref(true)
const store = useGroupClassStore()
const groupClasses = ref<GroupClass[]>([])

const props = defineProps<{
  classrooms: Classrooms | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', classroom: Classrooms): void
  (event: 'close'): void
}>()

const defaultNewClass: EmptyClassrooms = {
  name: '',
  schoolYear: '',
  groupClassId: '',
}
const newClass = ref({ ...defaultNewClass })

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  queryType: ClassroomQueryType.MyClass,
})

const getGroupClasses = () => {
  loading.value = true
  store
    .getGroupClasses(dataFilter.value)
    .then((response) => {
      groupClasses.value = response.data
      loading.value = false
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('groupClasses.group_class')) + getErrorMessage(error),
        color: 'error',
      })
      loading.value = false
    })
}

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newClass.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return (
      newClass.value[key as keyof EmptyClassrooms] !==
      (props.classrooms ?? defaultNewClass)?.[key as keyof EmptyClassrooms]
    )
  })
})

watch(
  () => props.classrooms,
  () => {
    if (!props.classrooms) {
      return
    }

    newClass.value = {
      ...props.classrooms,
    }
  },
  {
    immediate: true,
  },
)

defineExpose({
  isFormHasUnsavedChanges,
})

onMounted(() => {
  getGroupClasses()
})
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput
      v-model="newClass.name"
      :label="t('classes.class_name')"
      :placeholder="t('classes.enter_name')"
      :rules="[validators.required2(t('classes.class_name')), validators.maxLength(50)]"
    />
    <VaInput
      v-model="newClass.schoolYear"
      :label="t('classes.school_year')"
      :placeholder="t('classes.enter_school_year')"
      :rules="[
        validators.required2(t('classes.school_year')),
        validators.isNumber(t('classes.school_year')),
        validators.minValue(new Date().getFullYear()),
        validators.maxValue(new Date().getFullYear() + 10),
      ]"
    />
    <VaSelect
      v-model="newClass.groupClassId"
      value-by="value"
      :options="groupClasses.map((gc) => ({ text: gc.name, value: gc.id }))"
      :label="t('groupClasses.group_class_2')"
      :placeholder="t('groupClasses.select_group_class')"
      clearable
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ t('settings.cancel') }}</VaButton>
      <VaButton @click="validate() && $emit('save', newClass as Classrooms)">{{ saveButtonLabel }}</VaButton>
    </VaCard>
  </VaForm>
</template>
