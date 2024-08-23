<template :loading="props.loading">
  <VaCard class="min-h-[78vh]">
    <VaCard>
      <VaCardContent class="font-bold">{{ $t('assignments.recommend') }}</VaCardContent>
      <VaList v-if="recentAssignments" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-for="assignment in recentAssignments" :key="assignment.id">
          <VaListItem
            class="mb-2"
            :to="
              isTeacher
                ? { name: 'assignment-details', params: { id: assignment?.id, classId: assignment?.classId } }
                : { name: 'assignment-submission', params: { id: assignment?.id, classId: assignment?.classId } }
            "
          >
            <VaCard class="border rounded-lg p-3 hover:scale-105 transition-transform duration-200 w-full">
              <div class="flex items-center">
                <VaListItemSection avatar>
                  <VaIcon name="description" size="3rem" />
                </VaListItemSection>
                <VaListItemSection>
                  <VaListItemLabel class="font-semibold mb-1"
                    >{{ assignment?.className }} - {{ assignment?.name }}</VaListItemLabel
                  >
                  <VaListItemLabel caption>
                    <VaPopover placement="right" color="#FFFFFF" :message="format.formatDate(assignment?.createdOn)">
                      {{ $t('assignments.create_at') }} {{ format.formatDateFromNow(assignment?.createdOn) }}
                    </VaPopover>
                  </VaListItemLabel>
                  <VaListItemLabel caption>
                    {{ $t('assignments.end_time') }} {{ format.formatDate(assignment?.endTime) }}
                  </VaListItemLabel>
                </VaListItemSection>
                <VaListItemSection icon>
                  <VaCard v-if="isTeacher" class="flex flex-col">
                    <VaListItemLabel caption>
                      {{ assignment.submissionsStats?.totalMarked }} /
                      {{ assignment.submissionsStats?.totalSubmitted + assignment.submissionsStats?.totalMarked }}
                      {{ $t('assignments.marked') }}
                    </VaListItemLabel>

                    <VaListItemLabel caption>
                      {{ assignment.submissionsStats?.totalSubmitted + assignment.submissionsStats?.totalMarked }} /
                      {{ assignment.submissionsStats?.totalStudents }} {{ $t('assignments.submitted') }}
                    </VaListItemLabel>
                  </VaCard>
                </VaListItemSection>
              </div>
            </VaCard>
          </VaListItem>
        </template>
      </VaList>
    </VaCard>
    <VaCard>
      <VaCardContent class="font-bold">{{ $t('assignments.all') }}</VaCardContent>
      <VaCard class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-for="assClass in props.mergeAssignmentByClass" :key="assClass.id">
          <VaCard v-if="assClass.assignments && assClass.assignments.length > 0" class="border p-4 pb-0 rounded">
            <div class="flex justify-between items-center mb-4">
              <span class="font-bold">{{ assClass.name }}</span>
              <VaChip v-if="currentUserId != assClass.ownerId && isTeacher" outline class="ml-2" size="small">
                {{ $t('settings.share') }}
              </VaChip>
              <div class="flex items-center space-x-2 ml-auto">
                <VaButton preset="plain" size="small" :to="{ name: 'class-details', params: { id: assClass.id } }">
                  {{ $t('assignments.show_all') }}
                </VaButton>
              </div>
            </div>
            <VaDivider />
            <VaList>
              <template v-for="assignment in assClass.assignments.slice().reverse().slice(0, 2)" :key="assignment.id">
                <VaListItem
                  class="mb-2"
                  :to="
                    isTeacher
                      ? { name: 'assignment-details', params: { id: assignment?.id, classId: assClass.id } }
                      : { name: 'assignment-submission', params: { id: assignment?.id, classId: assClass.id } }
                  "
                >
                  <VaCard
                    class="flex items-center border rounded-lg p-3 w-full hover:scale-105 transition-transform duration-200"
                  >
                    <VaListItemSection avatar>
                      <VaIcon name="description" size="3rem" />
                    </VaListItemSection>
                    <VaListItemSection>
                      <VaListItemLabel class="font-semibold mb-1">{{ assignment.name }}</VaListItemLabel>
                      <VaListItemLabel caption>
                        <VaPopover placement="right" color="#FFFFFF" :message="format.formatDate(assignment.createdOn)">
                          {{ $t('assignments.create_at') }} {{ format.formatDateFromNow(assignment.createdOn) }}
                        </VaPopover>
                      </VaListItemLabel>
                      <VaListItemLabel caption
                        >{{ $t('assignments.end_time') }} {{ format.formatDate(assignment.endTime) }}</VaListItemLabel
                      >
                    </VaListItemSection>
                    <VaListItemSection icon>
                      <VaCard v-if="isTeacher" class="flex flex-col">
                        <VaListItemLabel caption>
                          {{ assignment.submissionsStats?.totalMarked }} /
                          {{ assignment.submissionsStats?.totalSubmitted + assignment.submissionsStats?.totalMarked }}
                          {{ $t('assignments.marked') }}
                        </VaListItemLabel>

                        <VaListItemLabel caption>
                          {{ assignment.submissionsStats?.totalSubmitted + assignment.submissionsStats?.totalMarked }} /
                          {{ assignment.submissionsStats?.totalStudents }} {{ $t('assignments.submitted') }}
                        </VaListItemLabel>
                      </VaCard>
                    </VaListItemSection>
                  </VaCard>
                </VaListItem>
              </template>
            </VaList>
          </VaCard>
        </template>
      </VaCard>
    </VaCard>
  </VaCard>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { format } from '@/services/utils'
import { ClassroomWithStats } from '@/pages/classrooms/types'
import { useAuthStore } from '@/stores/modules/auth.module'

const authStore = useAuthStore()
const currentUserId = authStore.user?.id
const isTeacher = computed(() => authStore?.musHaveRole('Teacher'))

const props = defineProps({
  mergeAssignmentByClass: {
    type: Array as PropType<ClassroomWithStats[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const recentAssignments = computed(() => {
  const allAssignmentsWithClassId = props.mergeAssignmentByClass.flatMap(
    (assClass) =>
      assClass.assignments?.map((assignment) => ({
        ...assignment,
        classId: assClass.id,
        className: assClass.name,
      })) || [],
  )
  console.log(allAssignmentsWithClassId)
  return allAssignmentsWithClassId
    .sort((a, b) => {
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
    })
    .slice(0, 4)
})
</script>
