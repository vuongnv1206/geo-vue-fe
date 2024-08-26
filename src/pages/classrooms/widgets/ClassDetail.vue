<template>
  <VaLayout>
    <template #top>
      <VaNavbar class="py-2 rounded">
        <template #left>
          <VaLayout>
            <VaButton icon="va-arrow-left" preset="plainOpacity" :to="{ name: 'classroom' }">
              {{ classDetails.name }}
            </VaButton>
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
            v-if="currentTab.title === t('classes.students_list')"
            :classroom="classDetails"
            @load="getClassById"
          />
          <AssignmentInClassDetails
            v-if="currentTab.title === t('classes.assignment_and_exam')"
            :class-details="classDetails"
          />
          <PostsInClassDetails v-if="currentTab.title === t('classes.news_board')" :class-id="classId" />
        </VaCard>
      </VaCard>
    </template>
  </VaLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { Classrooms } from '../types'
import AssignmentInClassDetails from './AssignmentInClassDetails.vue'
import StudentsInClassDetails from './StudentsInClassDetails.vue'
import PostsInClassDetails from './PostsInClassDetails.vue'
import { useRouter } from 'vue-router'
import { useClassStore } from '@/stores/modules/class.module'
import { useToast, VaCard } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/modules/auth.module'

const { t } = useI18n()
const loading = ref(true)
const showTabs = ref(true)
const router = useRouter()
const { init: notify } = useToast()
const classStore = useClassStore()
const authStore = useAuthStore()
const classId = router.currentRoute.value.params.id.toString()
const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))

// Define tabs based on the user role
const tabs = computed(() => {
  const baseTabs = [
    { title: t('classes.assignment_and_exam'), icon: 'assignment_add' },
    { title: t('classes.news_board'), icon: 'newspaper' },
  ]
  if (isTeacher.value) {
    baseTabs.unshift({ title: t('classes.students_list'), icon: 'groups' })
  }
  return baseTabs
})

const selectedTab = ref(localStorage.getItem('selectedTab') || tabs.value[0].title)

watch(selectedTab, (value) => {
  localStorage.setItem('selectedTab', value)
})

const currentTab = computed(() => tabs.value.find((tab) => tab.title === selectedTab.value) || tabs.value[0])

const defaultClassDetails: Classrooms = {
  id: '',
  name: '',
  schoolYear: '',
  ownerId: '',
  groupClassId: '',
  groupClassName: '',
  numberUserOfClass: 0,
  assignments: [],
  papers: [],
  students: [],
  permissions: [],
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
