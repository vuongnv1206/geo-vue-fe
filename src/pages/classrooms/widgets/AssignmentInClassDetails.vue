<template>
  <VaCardContent>
    <VaCard class="flex flex-col md:flex-row gap-2 mb-4">
      <VaCard class="flex-grow justify-start items-center">
        <VaInput v-model="searchQuery" :placeholder="$t('classes.search_assignment_paper')">
          <template #appendInner>
            <VaIcon color="secondary" class="material-icons">search</VaIcon>
          </template>
        </VaInput>
      </VaCard>
      <VaMenu v-if="isTeacher" class="justify-end" :options="options" @selected="selectedOption">
        <template #anchor>
          <VaButton :disabled="!canAssignmentManage">
            <VaIcon name="add" />
            {{ t('assignments.assignment') }}
          </VaButton>
        </template>
      </VaMenu>
    </VaCard>
    <VaScrollContainer vertical class="max-h-[66vh] pb-0">
      <AccordionOfAssignment :key="forceUpdate" :filtered-grouped-data="filteredGroupedData" />
    </VaScrollContainer>
  </VaCardContent>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch } from 'vue'
import { format } from '@/services/utils'
import { Classrooms } from '../types'
import AccordionOfAssignment from './AccordionOfAssignment.vue'
import router from '@/router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/modules/auth.module'

const { t } = useI18n()
const props = defineProps({
  classDetails: {
    type: Object as PropType<Classrooms>,
    required: true,
  },
})
const authStore = useAuthStore()

const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))
const canAssignmentManage = computed(() => {
  if (props.classDetails.permissions === null || props.classDetails.permissions === undefined) {
    return true
  }
  return props.classDetails.permissions?.some((permission) => permission.permissionType === 1)
})

const forceUpdate = ref(0)

const forceRerender = () => {
  forceUpdate.value += 1
}

const options = ref([
  { text: t('assignments.assignment'), value: 'create-assignment', icon: 'description' },
  { text: t('papers.paper'), value: 'create-paper', icon: 'article' },
])

const selectedOption = (v: { text: string; value: string }) => {
  if (v.text === 'Paper') {
    router.push({ name: v.value, params: { folderId: null } })
  } else {
    router.push({ name: v.value })
  }
}

const searchQuery = ref('')

const groupedData = computed(() => {
  const groups: { [key: string]: any } = {}
  props.classDetails.assignments?.forEach((assignment) => {
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

  props.classDetails.papers?.forEach((paper) => {
    const createOn = format.formatDate(new Date(paper.createdOn))
    if (!groups[createOn]) {
      groups[createOn] = {
        createOn: new Date(paper.createdOn),
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
    return groupedData.value
  }
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
  return filteredGroups.length > 0 ? filteredGroups : []
})

watch(filteredGroupedData, () => {
  forceRerender()
})
</script>
