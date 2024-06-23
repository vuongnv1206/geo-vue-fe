<template>
  <VaScrollContainer vertical>
    <VaAccordion class="max-w-sm" multiple>
      <!-- Loop through assignment groups -->
      <template v-for="(assignmentGroup, index) in groupedAssignments" :key="index">
        <VaCollapse :header="format.formatDate(assignmentGroup.createdOn)" solid class="py-1 font-bold">
          <template #header="{ value, attrs, iconAttrs, text }">
            <VaCard v-bind="attrs" class="w-full flex border-2 p-2 items-center">
              <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" />
              <VaCard class="flex justify-between items-center w-full">
                <VaCard>{{ text }}</VaCard>
              </VaCard>
            </VaCard>
          </template>
          <!-- List assignments for this date -->
          <VaCard class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <template v-for="assignment in assignmentGroup.assignments" :key="assignment.id">
              <VaCard class="border border-gray-200 rounded-lg overflow-hidden">
                <VaCard class="p-4 flex items-center space-x-4">
                  <VaIcon name="description" size="3rem" class="text-gray-500" />
                  <div>
                    <VaCardTitle class="font-medium text-lg">{{ assignment.name }}</VaCardTitle>
                    <VaCard>{{ assignment.content }}</VaCard>
                  </div>
                </VaCard>
              </VaCard>
            </template>
          </VaCard>
        </VaCollapse>
      </template>
    </VaAccordion>
  </VaScrollContainer>
</template>

<script setup>
import { format } from '@/services/utils'
import { computed, ref } from 'vue'
const assignments = ref([
  {
    id: '1',
    name: 'Assignment 1',
    startTime: '2024-06-23T03:59:17.437Z',
    endTime: '2024-06-30T03:59:17.437Z',
    attachmentPath: 'path/to/assignment1',
    content: 'Content for assignment 1',
    canViewResult: true,
    requireLoginToSubmit: true,
    subjectId: 'subject1',
    createdOn: '2024-06-23T03:59:17.437Z',
  },
  {
    id: '2',
    name: 'Assignment 2',
    startTime: '2024-06-24T03:59:17.437Z',
    endTime: '2024-07-01T03:59:17.437Z',
    attachmentPath: 'path/to/assignment2',
    content: 'Content for assignment 2',
    canViewResult: false,
    requireLoginToSubmit: false,
    subjectId: 'subject2',
    createdOn: '2024-06-23T03:59:17.437Z',
  },
  {
    id: '3',
    name: 'Assignment 3',
    startTime: '2024-06-25T03:59:17.437Z',
    endTime: '2024-07-02T03:59:17.437Z',
    attachmentPath: 'path/to/assignment3',
    content: 'Content for assignment 3',
    canViewResult: true,
    requireLoginToSubmit: true,
    subjectId: 'subject3',
    createdOn: '2024-06-23T03:59:17.437Z',
  },
  {
    id: '4',
    name: 'Assignment 4',
    startTime: '2024-06-26T03:59:17.437Z',
    endTime: '2024-07-03T03:59:17.437Z',
    attachmentPath: 'path/to/assignment4',
    content: 'Content for assignment 4',
    canViewResult: true,
    requireLoginToSubmit: false,
    subjectId: 'subject4',
    createdOn: '2024-06-24T03:59:17.437Z',
  },
  {
    id: '5',
    name: 'Assignment 5',
    startTime: '2024-06-27T03:59:17.437Z',
    endTime: '2024-07-04T03:59:17.437Z',
    attachmentPath: 'path/to/assignment5',
    content: 'Content for assignment 5',
    canViewResult: false,
    requireLoginToSubmit: true,
    subjectId: 'subject5',
    createdOn: '2024-06-25T03:59:17.437Z',
  },
])
const groupedAssignments = computed(() => {
  const groups = {}
  assignments.value.forEach((assignment) => {
    const createdOn = format.formatDate(assignment.createdOn)
    if (!groups[createdOn]) {
      groups[createdOn] = {
        createdOn: assignment.createdOn,
        assignments: [],
      }
    }
    groups[createdOn].assignments.push(assignment)
  })
  return Object.values(groups)
})
</script>
