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

<style lang="scss" scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
}

.radio-group .font {
  margin-bottom: 0.5rem;
  font-size: 10px;
  font-weight: bold;
  color: var(--va-primary);
}

.radio-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: calc(50% - 1rem); /* Adjust width for two items per line, accounting for gap */
}

.radio-item input[type='radio'] {
  width: 20px;
  height: 20px;
  accent-color: #007bff;
}

.radio-item label {
  font-size: 1rem;
  color: #333;
}

.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
