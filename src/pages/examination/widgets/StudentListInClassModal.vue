<script setup lang="ts">
import { Classrooms, Student } from '@/pages/classrooms/types'
import { onMounted, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  students: Student[]
  classRoom: Classrooms | undefined
  selectedStudents: string[]
}>()

const selectionStudent = ref<string[]>([])
const selectAll = ref(false)
const selectedAll = ref(false)
const searchQuery = ref('')

const emit = defineEmits<{
  (event: 'save', selectedStudent: string[]): void
}>()

const getSelectStudentAll = () => {
  if (selectAll.value) {
    const allStudentIds = props.students.map((student) => student.id)
    selectionStudent.value = Array.from(new Set([...selectionStudent.value, ...allStudentIds]))
  } else {
    selectionStudent.value = []
  }
}

onMounted(() => {
  selectionStudent.value = props.selectedStudents
})

// Watch for changes in selectAll and trigger getSelectStudentAll
watch(selectAll, getSelectStudentAll)

// Computed property to filter students based on search query in either firstName or lastName
const filteredStudents = computed(() => {
  const query = searchQuery.value.toLowerCase()
  let students = props.students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
    return fullName.includes(query)
  })

  if (selectedAll.value) {
    students = students.filter((student) => selectionStudent.value.includes(student.id))
  }

  return students
})
</script>

<template>
  <VaCard>
    <VaCardTitle> {{ props.classRoom?.name }} </VaCardTitle>
    <VaCardTitle>
      <div class="grid grid-cols-3">
        <VaInput v-model="searchQuery" :placeholder="t('papers.search_student')" class="col-span-1" />
        <VaCardTitle class="col-span-2 va-title justify-end gap-3">
          <VaCheckbox v-model="selectAll" class="checkbox_custom-style" :label="t('papers.select_all')" />
          <VaCheckbox v-model="selectedAll" class="checkbox_custom-style" :label="t('papers.selected_students')" />
        </VaCardTitle>
      </div>
    </VaCardTitle>
    <VaDivider />
    <VaCardContent class="grid grid-cols-4">
      <template v-for="student in filteredStudents" :key="student.id">
        <VaCheckbox
          v-model="selectionStudent"
          :label="`${student.firstName} ${student.lastName}`"
          :array-value="student.id"
        />
      </template>
      <p v-if="filteredStudents.length == 0" class="col-span-4">{{ t('papers.no_matching_students') }}</p>
    </VaCardContent>
    <VaDivider />
    <VaCardContent class="p-0 flex justify-end">
      <VaButton @click="emit('save', selectionStudent as string[])">{{ t('papers.choose_student') }}</VaButton>
    </VaCardContent>
  </VaCard>
</template>

<style scoped>
.checkbox_custom-style {
  --va-checkbox-font-size: 0.5rem;
}
</style>
