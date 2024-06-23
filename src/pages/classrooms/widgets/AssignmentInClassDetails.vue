<template>
  <VaScrollContainer vertical>
    <VaAccordion class="w-full" multiple>
      <!-- Loop through grouped assignments and papers -->
      <template v-for="(group, index) in groupedData" :key="index">
        <VaCollapse :header="format.formatDate(group.createdOn)" solid class="py-1 font-bold">
          <template #header="{ value, attrs, iconAttrs, text }">
            <VaCard v-bind="attrs" class="w-full flex border-2 p-2 items-center">
              <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" />
              <VaCard class="flex justify-between items-center w-full">
                <VaCard>{{ text }}</VaCard>
              </VaCard>
            </VaCard>
          </template>
          <!-- List assignments and papers for this date in rows -->
          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            <!-- Loop through assignments -->
            <template v-for="assignment in group.assignments" :key="assignment.id">
              <VaCard class="border border-gray-200 rounded-lg overflow-hidden p-4 mb-4 flex space-x-4">
                <!-- :to="{ name: 'assignment-details', params: { id: assignment.id, classId: assignment.classId } }"> -->
                <VaIcon name="description" size="3rem" class="text-gray-500" />
                <div>
                  <VaCardTitle class="font-medium text-lg">{{ assignment.name }}</VaCardTitle>
                  <VaCard>{{ assignment.content }}</VaCard>
                </div>
              </VaCard>
            </template>
            <!-- Loop through papers -->
            <template v-for="paper in group.papers" :key="paper.id">
              <VaCard class="border border-gray-200 rounded-lg overflow-hidden p-4 mb-4 flex space-x-4">
                <VaIcon name="article" size="3rem" class="text-gray-500" />
                <div>
                  <VaCardTitle class="font-medium text-lg">{{ paper.examName }}</VaCardTitle>
                  <VaCard>Created On: {{ format.formatDate(paper.createdOn) }}</VaCard>
                </div>
              </VaCard>
            </template>
          </div>
        </VaCollapse>
      </template>
    </VaAccordion>
  </VaScrollContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from '@/services/utils'

// Assignments data
const assignments = ref([
  {
    id: '1',
    name: 'Assignment 1',
    content: 'Content for assignment 1',
    createdOn: '2024-06-23T03:59:17.437Z',
  },
  {
    id: '2',
    name: 'Assignment 2',
    content: 'Content for assignment 2',
    createdOn: '2024-06-23T03:59:17.437Z',
  },
  {
    id: '3',
    name: 'Assignment 3',
    content: 'Content for assignment 3',
    createdOn: '2024-06-23T03:59:17.437Z',
  },
  {
    id: '4',
    name: 'Assignment 4',
    content: 'Content for assignment 4',
    createdOn: '2024-06-24T03:59:17.437Z',
  },
  {
    id: '5',
    name: 'Assignment 5',
    content: 'Content for assignment 5',
    createdOn: '2024-06-25T03:59:17.437Z',
  },
])

// Papers data
const papers = ref([
  {
    id: '1',
    examName: 'Paper 1',
    createdOn: '2024-06-23T03:59:17.437Z',
  },
  {
    id: '2',
    examName: 'Paper 2',
    createdOn: '2024-06-24T03:59:17.437Z',
  },
  {
    id: '3',
    examName: 'Paper 3',
    createdOn: '2024-06-25T03:59:17.437Z',
  },
  {
    id: '4',
    examName: 'Paper 4',
    createdOn: '2024-06-26T03:59:17.437Z',
  },
  {
    id: '5',
    examName: 'Paper 5',
    createdOn: '2024-06-27T03:59:17.437Z',
  },
])

// Combined and grouped data
const groupedData = computed(() => {
  const groups = {}

  // Add assignments to groups
  assignments.value.forEach((assignment) => {
    const createdOn = format.formatDate(assignment.createdOn)
    if (!groups[createdOn]) {
      groups[createdOn] = {
        createdOn: assignment.createdOn,
        assignments: [],
        papers: [],
      }
    }
    groups[createdOn].assignments.push(assignment)
  })

  // Add papers to groups
  papers.value.forEach((paper) => {
    const createdOn = format.formatDate(paper.createdOn)
    if (!groups[createdOn]) {
      groups[createdOn] = {
        createdOn: paper.createdOn,
        assignments: [],
        papers: [],
      }
    }
    groups[createdOn].papers.push(paper)
  })

  return Object.values(groups)
})
</script>
