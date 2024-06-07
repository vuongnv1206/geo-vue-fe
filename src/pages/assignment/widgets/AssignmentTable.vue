<script lang="ts" setup>
import { PropType } from 'vue'
import { Assignment } from '../types'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'
import { format } from '@/services/utils'

const { show } = useMenu()

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
            @click="emit('edit', assignment as Assignment)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete assignment"
            @click="emit('delete', assignment as Assignment)"
          />
        </div>
      </template>
    </VaDataTable>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[4rem]">
    <VaCard
      v-for="assignment in assignments"
      :key="assignment.id"
      :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
      outlined
    >
      <VaCardContent class="flex flex-col h-full">
        <div class="flex flex-col items-center gap-4 grow">
          <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
            {{ assignment.name }}
          </h4>
          <!-- Display other assignment details here -->
        </div>
        <VaDivider class="my-6" />
      </VaCardContent>
    </VaCard>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
