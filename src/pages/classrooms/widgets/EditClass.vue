<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { Classrooms, EmptyClassrooms, GroupClass } from '@pages/classrooms/types'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { validators } from '@/services/utils'

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

defineExpose({
  isFormHasUnsavedChanges,
})
const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
})

const loading = ref(true)
const store = useGroupClassStore()
const groupClasses = ref<GroupClass[]>([])
function getGroupClasses() {
  loading.value = true
  store
    .getGroupClasses(dataFilter)
    .then((response) => {
      groupClasses.value = response.data
    })
    .finally(() => {
      loading.value = false
    })
  loading.value = false
}

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
onMounted(() => {
  getGroupClasses()
})
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput
      v-model="newClass.name"
      label="Class name"
      placeholder="Enter class name"
      :rules="[validators.required2('Class name'), validators.isCharacter('Class name'), validators.maxLength(50)]"
    />
    <VaInput
      v-model="newClass.schoolYear"
      label="School Year"
      placeholder="Enter school year"
      :rules="[
        validators.required2('School year'),
        validators.isNumber('School year'),
        validators.minValue(new Date().getFullYear()),
        validators.maxValue(new Date().getFullYear() + 10),
      ]"
    />
    <VaSelect
      v-model="newClass.groupClassId"
      value-by="value"
      :options="groupClasses.map((gc) => ({ text: gc.name, value: gc.id }))"
      label="Group Class"
      placeholder="Select a group class"
      clearable
      :rules="[validators.required2('Group class')]"
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newClass as Classrooms)">{{ saveButtonLabel }}</VaButton>
    </VaCard>
  </VaForm>
</template>

<style lang="scss" scoped></style>
