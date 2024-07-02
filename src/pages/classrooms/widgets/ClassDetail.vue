<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { Classrooms } from '../types'
import AssignmentInClassDetails from './AssignmentInClassDetails.vue'
import { useRouter } from 'vue-router'
import { useClassStore } from '@/stores/modules/class.module'
import { useToast, VaCardContent } from 'vuestic-ui/web-components'
import { getErrorMessage, notifications } from '@/services/utils'
import StudentsInClassDetails from './StudentsInClassDetails.vue'
import { VaCard } from 'vuestic-ui'
import PostsInClassDetails from './PostsInClassDetails.vue'

const loading = ref(true)
const showTabs = ref(true)
const router = useRouter()
const { init: notify } = useToast()
const classStore = useClassStore()
const classId = router.currentRoute.value.params.id.toString()

const tabs = [
  { title: 'Student list', icon: 'groups' },
  { title: 'Assignment & Exam', icon: 'assignment_add' },
  { title: 'News board', icon: 'newspaper' },
]
const selectedTab = ref(localStorage.getItem('selectedTab') || tabs[0].title)

watch(selectedTab, (value) => {
  localStorage.setItem('selectedTab', value)
})
const currentTab = computed(() => tabs.find((tab) => tab.title === selectedTab.value) || tabs[0])
const defaultClassDetails: Classrooms = {
  id: '',
  name: '',
  schoolYear: '',
  ownerId: '',
  groupClassId: '',
  groupClassName: '',
  numberUserOfClass: 0,
  assignments: [],
  students: [],
}
const classDetails = ref({ ...defaultClassDetails })

const getClassById = () => {
  loading.value = true
  classStore
    .getClassById(classId)
    .then((response) => {
      classDetails.value = response
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(`class with id ${classId}`) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getClassById()
})
</script>

<template>
  <VaLayout>
    <template #top>
      <VaNavbar class="py-2 rounded">
        <template #left>
          <VaLayout>
            <VaButton icon="va-arrow-left" preset="plainOpacity" :to="{ name: 'classroom' }" />
          </VaLayout>
        </template>
      </VaNavbar>
    </template>

    <template #left>
      <VaCard class="mt-2" :class="showTabs ? 'mr-2' : ''">
        <VaTabs v-if="showTabs" v-model="selectedTab" vertical grow class="p-2">
          <template #tabs>
            <VaTab v-for="tab in tabs" :key="tab.title" :name="tab.title">
              <VaIcon :name="tab.icon" class="mr-2" />
              {{ tab.title }}
            </VaTab>
          </template>
        </VaTabs>
      </VaCard>
    </template>

    <template #content>
      <VaCard class="mt-2 min-h-80">
        <VaCard class="pl-2">
          <VaCard class="flex flex-row pl-2">
            <VaButton :icon="showTabs ? 'menu_open' : 'menu'" preset="plain" @click="showTabs = !showTabs" />
            <VaCardContent>
              {{ currentTab.title }}
            </VaCardContent>
          </VaCard>
          <StudentsInClassDetails
            v-if="currentTab.title === 'Student list'"
            :students="classDetails.students"
            :loading="loading"
            @load="getClassById"
          />
          <AssignmentInClassDetails v-if="currentTab.title === 'Assignment & Exam'" :class-details="classDetails" />
          <PostsInClassDetails v-if="currentTab.title === 'News board'" :class-id="classId" />
        </VaCard>
      </VaCard>
    </template>
  </VaLayout>
</template>
