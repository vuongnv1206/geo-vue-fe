<template>
  <VaCardContent>
    <VaCard class="flex flex-col md:flex-row gap-2 mb-4">
      <VaCard class="flex-grow justify-start items-center">
        <VaInput v-model="searchQuery" placeholder="Search assignment or paper name">
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
        <VaCollapse
          v-for="(group, index) in filteredGroupedData"
          :key="index"
          :header="format.formatDate(group.createOn)"
          solid
          class="py-1 font-bold"
        >
          <template #header="{ value, attrs, iconAttrs, text }">
            <VaCard v-bind="attrs" class="w-full flex border-2 p-2 items-center">
              <VaIcon name="va-arrow-down" :class="value ? '' : 'rotate-[-90deg]'" v-bind="iconAttrs" />
              <VaCard class="flex justify-between items-center w-full">
                <VaCard>{{ text }}</VaCard>
              </VaCard>
            </VaCard>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            <template>
              <VaCard
                v-for="assignment in group.assignments"
                :key="assignment.id"
                class="border border-gray-200 rounded-lg overflow-hidden p-4 mb-4 flex space-x-4"
              >
                <VaIcon name="description" size="3rem" class="text-gray-500" />
                <div>
                  <VaCardTitle class="font-medium text-lg">{{ assignment.name }}</VaCardTitle>
                  <VaCard>Submited: 0/0</VaCard>
                </div>
              </VaCard>
            </template>
            <template>
              <VaCard
                v-for="paper in group.papers"
                :key="paper.id"
                class="border border-gray-200 rounded-lg overflow-hidden p-4 mb-4 flex space-x-4"
              >
                <VaIcon name="article" size="3rem" class="text-gray-500" />
                <div>
                  <VaCardTitle class="font-medium text-lg">{{ paper.examName }}</VaCardTitle>
                  <VaCard>Submited: 0/0</VaCard>
                </div>
              </VaCard>
            </template>
          </div>
        </VaCollapse>
      </VaAccordion>
    </VaScrollContainer>
  </VaCardContent>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import { format } from '@/services/utils'
import { Classrooms } from '../types'
import router from '@/router'
import { VaAccordion, VaCollapse } from 'vuestic-ui/web-components'

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

const searchQuery = ref('')

// Papers data
const papers = ref([
  { id: '1', examName: 'Paper 1', createOn: '2024-06-30T11:21:35.721019+00:00' },
  { id: '2', examName: 'Paper 2', createOn: '2024-06-30T11:21:35.721019+00:00' },
  { id: '3', examName: 'Paper 3', createOn: '2024-06-30T11:21:35.721019+00:00' },
  { id: '4', examName: 'Paper 4', createOn: '2024-06-30T11:21:35.721019+00:00' },
  { id: '5', examName: 'Paper 5', createOn: '2024-06-30T11:21:35.721019+00:00' },
])

const groupedData = computed(() => {
  const groups: { [key: string]: any } = {}
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

  papers.value.forEach((paper) => {
    const createOn = format.formatDate(new Date(paper.createOn))
    if (!groups[createOn]) {
      groups[createOn] = {
        createOn: paper.createOn,
        assignments: [],
        papers: [],
      }
    }
    groups[createOn].papers.push(paper)
  })

  const sortedGroups = Object.values(groups).sort(
    (a: any, b: any) => (new Date(b.createOn) as any) - (new Date(a.createOn) as any),
  )
  return sortedGroups
})

const filteredGroupedData = computed(() => {
  if (!searchQuery.value) {
    console.log('groupedData.value:', groupedData.value)
    return groupedData.value
  }
  console.log('searchQuery:', searchQuery.value)
  const filteredGroups = groupedData.value
    .map((group) => {
      const filteredAssignments = group.assignments.filter((assignment: any) =>
        assignment.name.toLowerCase().includes(searchQuery.value),
      )
      const filteredPapers = group.papers.filter((paper: any) =>
        paper.examName.toLowerCase().includes(searchQuery.value),
      )

      if (filteredAssignments.length > 0 || filteredPapers.length > 0) {
        return {
          ...group,
          assignments: filteredAssignments,
          papers: filteredPapers,
        }
      }
      return null
    })
    .filter((group) => group !== null)

  console.log('filteredGroups:', filteredGroups)
  return filteredGroups.length > 0 ? filteredGroups : []
})
</script>
