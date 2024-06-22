<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { Classrooms, EmptyClassrooms, GroupClass } from '../type'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
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

const loading = ref(true)
const store = useGroupClassStore()
const groupClasses = ref<GroupClass[]>([])
function getGroupClasses() {
  loading.value = true
  store
    .getGroupClass()
    .then((res) => {
      groupClasses.value = res
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
    <VaInput v-model="newClass.name" label="Class name" :rules="[(v) => v.length > 0 || `Class name is required`]" />
    <VaInput
      v-model="newClass.schoolYear"
      label="School Year"
      :rules="[(v) => v.length > 0 || `School year is required`]"
    />
    <div class="radio-group">
      <div class="font">
        <span>CHOICE THE GROUPCLASS</span>
      </div>
      <div class="radio-buttons">
        <div v-for="gc in groupClasses" :key="gc.id" class="radio-item">
          <input id="gc-{{ gc.id }}" v-model="newClass.groupClassId" type="radio" :value="gc.id" />
          <label :for="'gc-' + gc.id">{{ gc.name }}</label>
        </div>
      </div>
    </div>
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newClass as Classrooms)">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped></style>
