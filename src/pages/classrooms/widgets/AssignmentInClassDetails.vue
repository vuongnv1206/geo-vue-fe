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
    <VaScrollContainer vertical class="max-h-[66vh] pb-0">
      <AcordionOfAssignment :key="forceUpdate" :filtered-grouped-data="filteredGroupedData" />
    </VaScrollContainer>
  </VaCardContent>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch } from 'vue'
import { format } from '@/services/utils'
import { Classrooms } from '../types'
import AcordionOfAssignment from './AccordionOfAssignment.vue'
import router from '@/router'

const forceUpdate = ref(0)

const forceRerender = () => {
  forceUpdate.value += 1
}

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

watch(filteredGroupedData, () => {
  forceRerender()
})
</script>
