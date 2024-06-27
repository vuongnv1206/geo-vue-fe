<template>
  <VaCardContent>
    <VaCard class="flex flex-col md:flex-row gap-2 mb-4">
      <VaCard class="flex-grow justify-start items-center">
        <VaInput placeholder="Search">
          <template #appendInner>
            <VaIcon color="secondary" class="material-icons">search</VaIcon>
          </template>
        </VaInput>
      </VaCard>
      <VaMenu class="justify-end" :options="options" @selected="selectedOption">
        <template #anchor>
          <VaButton>
            <VaIcon name="add" />
            Assignment
          </VaButton>
        </template>
      </VaMenu>
    </VaCard>
    <VaScrollContainer vertical>
      <VaAccordion class="w-full" multiple>
        <!-- Loop through grouped assignments and papers -->
        <template v-for="(group, index) in groupedData" :key="index">
          <VaCollapse :header="format.formatDate(group.createOn)" solid class="py-1 font-bold">
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
                <VaCard
                  class="border border-gray-200 rounded-lg overflow-hidden p-4 mb-4 flex space-x-4"
                  :to="{ name: 'assignment-details', params: { id: assignment.id, classId: props.classDetails.id } }"
                >
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
                    <VaCard>Created On: {{ format.formatDate(paper.createOn) }}</VaCard>
                  </div>
                </VaCard>
              </template>
            </div>
          </VaCollapse>
        </template>
      </VaAccordion>
    </VaScrollContainer>
  </VaCardContent>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import { format } from '@/services/utils'
import { Classrooms } from '../types'
import { VaCard, VaIcon } from 'vuestic-ui/web-components'
import router from '@/router'

const props = defineProps({
  classDetails: {
    type: Object as PropType<Classrooms>,
    required: true,
  },
})

const options = ref([
  { text: 'Assignment', value: 'create-assignment', icon: 'description' },
  { text: 'Paper', value: 'create-paper', icon: 'article' },
])

const selectedOption = (v: { text: string; value: string }) => {
  if (v.text === 'Paper') {
    router.push({ name: v.value, params: { folderId: null } })
  } else {
    router.push({ name: v.value })
  }
}

// Papers data
const papers = ref([
  { id: '1', examName: 'Paper 1', createOn: new Date('2024-06-23T03:59:17.437Z') },
  { id: '2', examName: 'Paper 2', createOn: new Date('2024-06-24T03:59:17.437Z') },
  { id: '3', examName: 'Paper 3', createOn: new Date('2024-06-25T03:59:17.437Z') },
  { id: '4', examName: 'Paper 4', createOn: new Date('2024-06-26T03:59:17.437Z') },
  { id: '5', examName: 'Paper 5', createOn: new Date('2024-06-27T03:59:17.437Z') },
])

// Combined and grouped data
const groupedData = computed(() => {
  const groups: { [key: string]: any } = {}
  // Add assignments to groups
  props.classDetails.assignments.forEach((assignment) => {
    const createOn = format.formatDate(assignment.createdOn)
    if (!groups[createOn]) {
      groups[createOn] = {
        createOn: assignment.createdOn,
        assignments: [],
        papers: [],
      }
    }
    groups[createOn].assignments.push(assignment)
  })

  // Add papers to groups
  papers.value.forEach((paper) => {
    const createOn = format.formatDate(paper.createOn)
    if (!groups[createOn]) {
      groups[createOn] = {
        createOn: paper.createOn,
        assignments: [],
        papers: [],
      }
    }
    groups[createOn].papers.push(paper)
  })

  return Object.values(groups)
})
</script>
