<script setup lang="ts">
import { PropType } from 'vue'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'
import { Classrooms } from '../type'

const { show } = useMenu()

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: 'School Year', key: 'schoolYear', sortable: true },
  { label: 'Group', key: 'groupClassName', sortable: true },
  { label: 'Created By', key: 'ownerId', sortable: true },
  { label: ' ', key: 'actions' },
])

const props = defineProps({
  classrooms: {
    type: Array as PropType<Classrooms[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const selectedItemsEmitted = defineModel('selectedItemsEmitted', {
  type: Array as PropType<Classrooms[]>,
  default: [],
})

const emit = defineEmits<{
  (event: 'edit', classsroom: Classrooms): void
  (event: 'delete', classsroom: Classrooms): void
  (event: 'selectedClass', classsroom: Classrooms): void
}>()

const contextmenu = (event: any) => {
  console.log('contextmenu', event)
  event.event.preventDefault()
  show({
    event: event.event,
    options: [
      { text: 'Rename', icon: 'edit' },
      { text: 'Share', icon: 'share' },
      { text: 'Delete', icon: 'delete' },
    ],
    onSelected(option) {
      console.log('selected', option)
      console.log('selected', event.item)
    },
  })
}

const dblclick = (event: any) => {
  emit('selectedClass', event.item)
}

const handleSelectionChange = (selectedItems: Classrooms[]) => {
  selectedItemsEmitted.value = selectedItems
}
</script>

<template>
  <div>
    <VaDataTable
      :items="classrooms"
      :columns="columns"
      :loading="props.loading"
      hoverable
      clickable
      selectable
      select-mode="multiple"
      :disable-client-side-sorting="false"
      @row:contextmenu="contextmenu($event)"
      @selectionChange="handleSelectionChange($event.currentSelectedItems)"
      @row:dblclick="dblclick($event)"
    >
      <template #cell(name)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ rowData.name }}
        </div>
      </template>
      <template #cell(schoolYear)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          {{ rowData.schoolYear }}
        </div>
      </template>
      <template #cell(groupClassName)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          {{ rowData.groupClassName }}
        </div>
      </template>
      <template #cell(ownerId)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          {{ rowData.ownerId }}
        </div>
      </template>
      <template #cell(actions)="{ rowData: classrooms }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit Class"
            @click="$emit('edit', classrooms as Classrooms)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete Class"
            @click="$emit('delete', classrooms as Classrooms)"
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
