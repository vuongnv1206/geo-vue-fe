<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Classrooms } from '../types'
import AssignmentInClassDetails from './AssignmentInClassDetails.vue'
import NewsInClassDetails from './NewsInClassDetails.vue'
import { useRouter } from 'vue-router'
import { useClassStore } from '@/stores/modules/class.module'
import { useToast } from 'vuestic-ui/web-components'
import { notifications } from '@/services/utils'
import StudentsInClassDetails from './StudentsInClassDetails.vue'

const tabs = [
  { title: 'Student list', icon: 'groups' },
  { title: 'Assignment & Exam', icon: 'assignment_add' },
  { title: 'News board', icon: 'newspaper' },
]
const { init: notify } = useToast()
const router = useRouter()

const classStore = useClassStore()
const defaultClassDetails: Classrooms = {
  id: '',
  name: '',
  schoolYear: '',
  ownerId: '',
  groupClassId: '',
  groupClassName: '',
  numberUserOfClass: 0,
  assignments: [],
  userStudents: [],
}

const classDetails = ref<Classrooms>(defaultClassDetails)

const classId = router.currentRoute.value.params.id.toString()
const selectedTab = ref(tabs[0].title)
const currentTab = computed(() => tabs.find((tab) => tab.title === selectedTab.value) || tabs[0])

const getClassById = async () => {
  classStore
    .getClassroomById(classId)
    .then((response) => {
      // console.log('Classroom:', response)
      classDetails.value = response
      console.log('classDetails:', classDetails.value)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(`class with id ${classId}`) + error.message,
        color: 'error',
      })
    })
}

onMounted(() => {
  getClassById()
})
</script>

<template>
  <VaLayout>
    <VaButton icon="va-arrow-left" preset="plainOpacity" :to="{ name: 'classroom' }" />
  </VaLayout>
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
      <StudentsInClassDetails v-if="currentTab.title === 'Student list'" :students="classDetails.userStudents" />
      <AssignmentInClassDetails v-if="currentTab.title === 'Assignment & Exam'" :class-details="classDetails" />
      <NewsInClassDetails v-if="currentTab.title === 'News board'" />
    </VaCard>
  </VaCard>
</template>
