<script lang="ts" setup>
import { PropType } from 'vue'
import { Assignment } from '../types'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'

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
  (event: 'edit', assignment: Assignment): void
  (event: 'delete', assignment: Assignment): void
}>()

const props = defineProps({
  assignments: {
    type: Array as PropType<Assignment[]>,
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
</script>

<template>
  <div>
    <VaDataTable
      :items="props.assignments"
      :columns="columns"
      hoverable
      clickable
      selectable
      select-mode="multiple"
      :disable-client-side-sorting="false"
      @row:contextmenu="contextmenu($event)"
    >
      <template #cell(name)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>
            <span>{{ rowData.name }}</span>
          </div>
        </div>
      </template>
      <template #cell(subjectName)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.subjectName }}</div>
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
                        // show only name of the attachmentPath
                        
                        

                    </div>
                </div>
            </template> -->
      <template #cell(startTime)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.startTime }}</div>
        </div>
      </template>
      <template #cell(endTime)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.endTime }}</div>
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
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
