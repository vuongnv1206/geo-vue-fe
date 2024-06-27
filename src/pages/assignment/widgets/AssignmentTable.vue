<template v-for="assClass in props.assignmentsByClass" :key="assClass.id" :loading="props.loading">
  <VaCard>
    <VaCardContent class="font-bold">Recommend</VaCardContent>
    <VaList class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-for="assignment in recentAssignments" :key="assignment.id">
        <VaListItem
          class="mb-2"
          :to="{ name: 'assignment-details', params: { id: assignment.id, classId: assignment.classId } }"
        >
          <VaCard class="border rounded-lg p-3 hover:scale-105 transition-transform duration-200 w-full">
            <div class="flex items-center">
              <VaListItemSection avatar>
                <VaIcon name="description" size="3rem" />
              </VaListItemSection>
              <VaListItemSection>
                <VaListItemLabel>{{ assignment.name }}</VaListItemLabel>
                <VaListItemLabel caption>
                  <VaPopover
                    class="mb-2"
                    placement="right"
                    color="#FFFFFF"
                    :message="format.formatDate(assignment.createOn)"
                  >
                    Create At: {{ format.formatDateFromNow(assignment.createOn) }}
                  </VaPopover>
                </VaListItemLabel>
                <VaListItemLabel caption>End Time: {{ format.formatDate(assignment.endTime) }}</VaListItemLabel>
              </VaListItemSection>
              <VaListItemSection icon>
                <VaCard>0/100</VaCard>
              </VaListItemSection>
            </div>
          </VaCard>
        </VaListItem>
      </template>
    </VaList>
  </VaCard>
  <VaCard>
    <VaCardContent class="font-bold">All</VaCardContent>
    <VaCard class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-for="assClass in props.assignmentsByClass" :key="assClass.id">
        <VaCard v-if="assClass.assignments.length > 0" class="border p-4 rounded">
          <div class="flex justify-between items-center mb-4">
            <span class="font-semibold">{{ assClass.name }}</span>
            <VaChip v-if="currentUserId != assClass.ownerId" outline class="ml-2" size="small"> Share </VaChip>
            <div class="flex items-center space-x-2 ml-auto">
              <VaButton preset="plain" size="small" :to="{ name: 'class-details', params: { id: assClass.id } }"
                >Show All</VaButton
              >
            </div>
          </div>
          <VaDivider />
          <VaList>
            <template v-for="assignment in assClass.assignments.slice().reverse().slice(0, 2)" :key="assignment.id">
              <VaListItem
                class="mb-2"
                :to="{ name: 'assignment-details', params: { id: assignment.id, classId: assClass.id } }"
              >
                <VaCard
                  class="flex items-center border rounded-lg p-3 w-full hover:scale-105 transition-transform duration-200"
                >
                  <VaListItemSection avatar>
                    <VaIcon name="description" size="3rem" />
                  </VaListItemSection>
                  <VaListItemSection>
                    <VaListItemLabel>{{ assignment.name }}</VaListItemLabel>
                    <VaListItemLabel caption>
                      <VaPopover
                        class="mb-2"
                        placement="right"
                        color="#FFFFFF"
                        :message="format.formatDate(assignment.createOn)"
                      >
                        Create At: {{ format.formatDateFromNow(assignment.createOn) }}
                      </VaPopover>
                    </VaListItemLabel>
                    <VaListItemLabel caption>End Time: {{ format.formatDate(assignment.endTime) }}</VaListItemLabel>
                  </VaListItemSection>
                  <VaListItemSection icon>
                    <VaCard>0/100</VaCard>
                  </VaListItemSection>
                </VaCard>
              </VaListItem>
            </template>
          </VaList>
        </VaCard>
      </template>
    </VaCard>
  </VaCard>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { format } from '@/services/utils'
import { Classrooms } from '@/pages/classrooms/types'
import { useAuthStore } from '@/stores/modules/auth.module'

const authStore = useAuthStore()
const currentUserId = authStore.user?.id

const props = defineProps({
  assignmentsByClass: {
    type: Array as PropType<Classrooms[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const recentAssignments = computed(() => {
  const allAssignmentsWithClassId = props.assignmentsByClass.flatMap((assClass) =>
    assClass.assignments.map((assignment) => ({
      ...assignment,
      classId: assClass.id,
      className: assClass.name,
    })),
  )
  // console.log('All Assignments:', allAssignmentsWithClassId)
  // console.log('All Assignments:', allAssignmentsWithClassId)
  // Sort the assignments by date in descending order
  allAssignmentsWithClassId.sort((a, b) => (new Date(b.createOn) as any) - (new Date(a.createOn) as any)).reverse()
  // console.log('Abc: ', allAssignmentsWithClassId.slice(0, 4))
  // Return the first 4 assignments
  return allAssignmentsWithClassId.slice(0, 4)
})
</script>

<style lang="scss" scoped></style>
