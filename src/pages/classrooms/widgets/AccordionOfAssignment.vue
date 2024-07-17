<script setup lang="ts">
import { PropType } from 'vue'
import { format } from '@/services/utils'
import { useRouter } from 'vue-router'
import { VaAccordion, VaCollapse } from 'vuestic-ui'

const router = useRouter()
const classId = router.currentRoute.value.params.id.toString()

const props = defineProps({
  filteredGroupedData: {
    type: Object as PropType<any>,
    required: true,
  },
})
</script>

<template>
  <VaAccordion v-if="props.filteredGroupedData" class="w-full" multiple>
    <VaCollapse
      v-for="(group, index) in props.filteredGroupedData"
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
      <template #body>
        <!-- List assignments and papers for this date in rows -->
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1">
          <!-- Loop through assignments -->
          <div v-for="(assignment, index2) in group.assignments" :key="index2">
            <VaCard
              class="border border-gray-200 rounded-lg overflow-hidden p-4 mt-2 flex space-x-4"
              :to="{ name: 'assignment-details', params: { id: assignment.id, classId: classId } }"
            >
              <VaIcon name="description" size="3rem" class="text-gray-500" />
              <div>
                <VaCardTitle class="font-medium text-lg">{{ assignment.name }}</VaCardTitle>
                <VaCard>{{ $t('classes.submited') }}: 0/0</VaCard>
              </div>
            </VaCard>
          </div>
          <!-- Loop through papers -->
          <div v-for="(paper, index3) in group.papers" :key="index3">
            <VaCard class="border border-gray-200 rounded-lg overflow-hidden p-4 mt-2 flex space-x-4">
              <VaIcon name="article" size="3rem" class="text-gray-500" />
              <div>
                <VaCardTitle class="font-medium text-lg">{{ paper.examName }}</VaCardTitle>
                <VaCard>{{ $t('classes.submited') }}: 0/0</VaCard>
              </div>
            </VaCard>
          </div>
        </div>
      </template>
    </VaCollapse>
  </VaAccordion>
</template>
