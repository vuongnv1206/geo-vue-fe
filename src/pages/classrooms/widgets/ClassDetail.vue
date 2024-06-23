<script setup>
import { ref, computed } from 'vue'
// import { Classrooms } from '../types'
import StudentInClassDetails from './StudentInClassDetails.vue'
import AssignmentInClassDetails from './AssignmentInClassDetails.vue'
import NewsInClassDetails from './NewsInClassDetails.vue'
// import { useRouter } from 'vue-router'
// import { useClassStore } from '@/stores/modules/class.module'

const tabs = [
  { title: 'Student list', icon: 'groups' },
  { title: 'Assignment & Exam', icon: 'assignment_add' },
  { title: 'News board', icon: 'newspaper' },
]

// const router = useRouter()
// const classStore = useClassStore()
// const classDetails = (ref < Classrooms) | (null > null)

// const classId = router.currentRoute.value.params.id.toString()
const selectedTab = ref(tabs[0].title)
const currentTab = computed(() => tabs.find((tab) => tab.title === selectedTab.value))

// const getClassById = async () => {
//   classStore
//     .getClassroomById(classId)
//     .then((response) => {
//       console.log('Classroom:', response)
//       classDetails.value = response.data
//       console.log('Classrooms:', classDetails.value)
//     })
//     .catch((error) => {
//       notify({
//         message: 'Failed to get class\n' + error.message,
//         color: 'error',
//       })
//     })
// }

// onMounted(() => {
//   getClassById()
// })
</script>

<template>
  <VaDivider />
  <VaCard class="flex">
    <VaCard class="w-1/6 mt-3">
      <VaTabs v-model="selectedTab" vertical grow class="mr">
        <template #tabs>
          <VaTab v-for="tab in tabs" :key="tab.title" :name="tab.title">
            <VaIcon :name="tab.icon" class="mr-2" />
            {{ tab.title }}
          </VaTab>
        </template>
      </VaTabs>
    </VaCard>

    <VaDivider vertical class="" />

    <VaCard class="flex-1 min-h-80">
      <VaCardTitle>
        {{ currentTab.title }}
      </VaCardTitle>
      <StudentInClassDetails v-if="currentTab.title === 'Student list'" />
      <AssignmentInClassDetails v-if="currentTab.title === 'Assignment & Exam'" />
      <NewsInClassDetails v-if="currentTab.title === 'News board'" />
    </VaCard>
  </VaCard>
</template>
