<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import AssignmentTable from '@pages/assignment/widgets/AssignmentTable.vue'
import { useToast } from 'vuestic-ui'
import { notifications } from '@/services/utils'
import { useClassStore } from '@/stores/modules/class.module'
import { Classrooms } from '../classrooms/types'

const loading = ref(true)
const { init: notify } = useToast()
const classStores = useClassStore()
const assignmentsByClass = ref<Classrooms[]>([])

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})

const getAssignmentByClass = () => {
  loading.value = true
  dataFilter.value.advancedSearch.fields = ['name']
  classStores
    .getClasses(dataFilter)
    .then((response) => {
      assignmentsByClass.value = response.data
      // console.log('ClassAssignment:', assignmentsByClass.value)
      loading.value = false
    })
    .catch((error) => {
      loading.value = false
      notify({
        message: notifications.getFailed('class assignments') + error.message,
        color: 'error',
      })
    })
}

onMounted(() => {
  getAssignmentByClass()
})
</script>

<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton icon="add" :to="{ name: 'create-assignment' }">Assignment</VaButton>
      </div>
      <AssignmentTable :loading="loading" :assignments-by-class="assignmentsByClass" />
    </VaCardContent>
  </VaCard>
</template>
