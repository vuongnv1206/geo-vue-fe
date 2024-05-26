<script lang="ts" setup>
import { PropType } from 'vue'
import { Subject } from '../types'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'

const { show } = useMenu()

const columns = defineVaDataTableColumns([
  { label: 'Subject', key: 'name', sortable: true },
  { label: 'Description', key: 'description', sortable: true },
  { label: ' ', key: 'actions' },
])

const emit = defineEmits<{
  (event: 'edit', subject: Subject): void
  (event: 'delete', subject: Subject): void
}>()

const props = defineProps({
  subjects: {
    type: Array as PropType<Subject[]>,
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
      :items="props.subjects"
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
      <template #cell(description)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <div>{{ rowData.description }}</div>
        </div>
      </template>
      <template #cell(actions)="{ rowData: subject }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit subject"
            @click="emit('edit', subject as Subject)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete subject"
            @click="emit('delete', subject as Subject)"
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
