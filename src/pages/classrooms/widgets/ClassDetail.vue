<script setup>
import { ref, computed } from 'vue'
import StudentInClassDetails from './StudentInClassDetails.vue'
import AssignmentInClassDetails from './AssignmentInClassDetails.vue'
import NewsInClassDetails from './NewsInClassDetails.vue'

const tabs = [
  { title: 'Student list', icon: 'groups' },
  { title: 'Assignment & Exam', icon: 'assignment_add' },
  { title: 'News board', icon: 'newspaper' },
]

const value = ref(tabs[0].title)
const currentTab = computed(() => tabs.find((tab) => tab.title === value.value))
</script>

<template>
  <VaDivider />
  <VaCard class="flex">
    <VaCard class="w-1/6 mt-3">
      <VaTabs v-model="value" vertical grow class="mr">
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
