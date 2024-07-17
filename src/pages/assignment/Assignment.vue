<template>
  <VaCard>
    <VaCardContent>
      <VaCard class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton icon="add" :to="{ name: 'create-assignment' }">{{ $t('assignments.assignment') }}</VaButton>
      </VaCard>
      <AssignmentTable :loading="loading" :assignments-by-class="assignmentsByClass" />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import AssignmentTable from '@pages/assignment/widgets/AssignmentTable.vue'
import { useToast } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useClassStore } from '@/stores/modules/class.module'
import { Classrooms } from '../classrooms/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loading = ref(true)
const { init: notify } = useToast()
const classStores = useClassStore()
const assignmentsByClass = ref<Classrooms[]>([])

const dataFilter = ref({
  advancedSearch: {
    fields: ['name'],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})

const getAssignmentByClass = () => {
  loading.value = true
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
        message: notifications.getFailed(t('assignments.assignment')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

onMounted(() => {
  getAssignmentByClass()
})
</script>
