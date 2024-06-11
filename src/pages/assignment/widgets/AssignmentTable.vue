<script lang="ts" setup>
import { onMounted, PropType, ref } from 'vue'
import { Assignment } from '../types'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'
import { format } from '@/services/utils'
import { useClassStore } from '@/stores/modules/class.module'
import { ClassResponse } from '@/pages/classrooms/type'

const { show } = useMenu()

const classStores = useClassStore()
const assignmentsByClass = ref<ClassResponse[]>([])

const columns = defineVaDataTableColumns([
  { label: 'Subject', key: 'subjectName', sortable: true },
  { label: 'Assignment', key: 'name', sortable: true },
  { label: 'Content', key: 'content' },
  { label: 'Attachment', key: 'attachmentPath' },
  { label: 'Start Time', key: 'startTime', sortable: true },
  { label: 'End Time', key: 'endTime', sortable: true },
  { label: 'Can View Result', key: 'canViewResult', sortable: true },
  { label: 'Require Login To Submit', key: 'requireLoginToSubmit', sortable: true },
  { label: ' ', key: 'actions' },
])

const emit = defineEmits<{
  (event: 'selectedAssignment', assignment: Assignment): void
  (event: 'edit', assignment: Assignment): void
  (event: 'delete', assignment: Assignment): void
}>()

const props = defineProps({
  assignments: {
    type: Array as PropType<Assignment[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const contextmenu = (event: any) => {
  console.log('contextmenu', event)
  event.event.preventDefault()
  show({
    event: event.event,
    options: [
      { text: 'Rename', icon: 'edit' },
      { text: 'Delete', icon: 'delete' },
    ],
    onSelected(option) {
      console.log('selected', option)
      console.log('selected', event.item)
    },
  })
}

const dblclick = (event: any) => {
  emit('selectedAssignment', event.item)
}

const selectedItemsEmitted = defineModel('selectedItemsEmitted', {
  type: Array as PropType<Assignment[]>,
  default: [],
})

const handleSelectionChange = (selectedItems: Assignment[]) => {
  selectedItemsEmitted.value = selectedItems
}

const getAssignmentByClass = () => {
  classStores
    .getClasses()
    .then((response) => {
      assignmentsByClass.value = response.data
      console.log('ClassAssignment:', response)
      console.log('ClassAssignment222:', assignmentsByClass.value)
    })
    .catch(() => {
      console.log('error')
    })
}

onMounted(() => {
  getAssignmentByClass()
})
</script>

<template>
  <div>
    <VaDataTable
      hoverable
      clickable
      selectable
      :columns="columns"
      select-mode="multiple"
      :loading="props.loading"
      :items="props.assignments"
      :disable-client-side-sorting="false"
      @row:dblclick="dblclick($event)"
      @row:contextmenu="contextmenu($event)"
      @selectionChange="handleSelectionChange($event.currentSelectedItems)"
    >
      <template #cell(subjectName)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.subjectName }}</div>
        </div>
      </template>
      <template #cell(name)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ rowData.name }}
        </div>
      </template>
      <template #cell(content)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.content }}</div>
        </div>
      </template>
      <!-- <template #cell(attachmentPath)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>
            <div>{{ rowData.attachmentPath }}</div>
          </div>
        </div>
      </template> -->
      <template #cell(startTime)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.startTime ? format.formatDate(rowData.startTime) : '' }}</div>
        </div>
      </template>
      <template #cell(endTime)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.endTime ? format.formatDate(rowData.endTime) : '' }}</div>
        </div>
      </template>
      <template #cell(canViewResult)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.canViewResult }}</div>
        </div>
      </template>
      <template #cell(requireLoginToSubmit)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.requireLoginToSubmit }}</div>
        </div>
      </template>
      <template #cell(actions)="{ rowData: assignment }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit assignment"
            @click="$emit('edit', assignment as Assignment)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete assignment"
            @click="$emit('delete', assignment as Assignment)"
          />
        </div>
      </template>
    </VaDataTable>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[4rem]">
    <div v-for="assClass in assignmentsByClass" :key="assClass.id" class="border p-2 rounded">
      <VaCard class="flex justify-between items-center mb-2">
        <VaCard>{{ assClass.name }}</VaCard>
        <VaChip outline class="ml-1" size="small">Share</VaChip>
        <!-- isOnwer ? 'Share' : '' -->
        <div class="flex items-center space-x-2 ml-auto">
          <!-- <a href="#" class="text-blue-500">Xem tất cả</a> -->
          <VaButton preset="plain" size="small">Xem tất cả</VaButton>
        </div>
      </VaCard>
      <VaDivider />
      <VaList>
        <VaListItem v-for="assignment in assClass.assignments" :key="assignment.id" class="mb-1">
          <VaCard class="flex flex-row items-center border rounded-lg p-2 w-full">
            <VaListItemSection avatar>
              <VaIcon name="book" size="3rem" />
            </VaListItemSection>
            <VaListItemSection>
              <VaListItemLabel>
                {{ assignment.name }}
              </VaListItemLabel>
              <VaListItemLabel caption>
                {{ format.formatDate(assignment.startTime) }}
              </VaListItemLabel>
              <VaListItemLabel caption>
                {{ format.formatDate(assignment.endTime) }}
              </VaListItemLabel>
            </VaListItemSection>
            <VaListItemSection icon>
              <VaCard>0/100</VaCard>
            </VaListItemSection>
          </VaCard>
        </VaListItem>
      </VaList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
