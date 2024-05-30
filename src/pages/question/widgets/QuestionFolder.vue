<script setup lang="ts">
import { onBeforeMount, PropType } from 'vue'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'
import { QuestionTree } from '../types'

const { show } = useMenu()

const columns = defineVaDataTableColumns([
  { label: 'Folder Name', key: 'name', sortable: true },
  { label: 'Total Questions', key: 'totalQuestions', sortable: true },
  { label: 'Created By', key: 'createdBy', sortable: true },
  { label: 'Created On', key: 'createdOn', sortable: true },
  { label: 'Last Modified On', key: 'lastModifiedOn', sortable: true },
  { label: ' ', key: 'actions' },
])

const props = defineProps({
  questionTrees: {
    type: Array as PropType<QuestionTree[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
})

const selectedItemsEmitted = defineModel('selectedItemsEmitted', {
  type: Array as PropType<QuestionTree[]>,
  default: [],
})

const emit = defineEmits<{
  (event: 'edit', questionTree: QuestionTree): void
  (event: 'delete', questionTree: QuestionTree): void
  (event: 'selectedFolder', questionTree: QuestionTree): void
  (event: 'share', questionTree: QuestionTree): void
}>()

const contextmenu = (event: any) => {
  event.event.preventDefault()
  show({
    event: event.event,
    options: [
      { text: 'Rename', icon: 'edit' },
      { text: 'Share', icon: 'share' },
      { text: 'Delete', icon: 'delete' },
    ],
    onSelected(option) {
      if (option.text === 'Rename') {
        emit('edit', event.item)
      }
      if (option.text === 'Share') {
        emit('share', event.item)
      }
      if (option.text === 'Delete') {
        emit('delete', event.item)
      }
    },
  })
}

const dblclick = (event: any) => {
  emit('selectedFolder', event.item)
}

const handleSelectionChange = (selectedItems: QuestionTree[]) => {
  selectedItemsEmitted.value = selectedItems
}

const hasChildren = (node: QuestionTree) => {
  return node.children && node.children.length > 0
}

onBeforeMount(() => {
  // edit column if mode is lite
  if (props.mode == 'lite') {
    columns.splice(2, 3)
  }
})
</script>

<template>
  <div>
    <VaDataTable
      :items="questionTrees"
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
          <div>
            <VaIcon v-if="hasChildren(rowData as QuestionTree)" class="mr-2" name="folder_copy" size="large" />
            <VaIcon v-else class="mr-2" name="folder" size="large" />
            <span>{{ rowData.name }}</span>
          </div>
        </div>
      </template>
      <template #cell(totalQuestions)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <div>{{ rowData.totalQuestions }}</div>
        </div>
      </template>
      <template v-if="props.mode == 'full'" #cell(createdBy)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          {{ rowData.owner?.firstName }} {{ rowData.owner?.lastName }}
        </div>
      </template>
      <template v-if="props.mode == 'full'" #cell(createdOn)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <div>{{ rowData.createdOn.split('T')[0] }}</div>
          <div>{{ rowData.createdOn.split('T')[1].split('.')[0] }}</div>
        </div>
      </template>
      <template v-if="props.mode == 'full'" #cell(lastModifiedOn)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <div>{{ rowData.lastModifiedOn?.split('T')[0] }}</div>
          <div>{{ rowData.lastModifiedOn?.split('T')[1].split('.')[0] }}</div>
        </div>
      </template>
      <template v-if="props.mode == 'full'" #cell(actions)="{ rowData: questionTree }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit Folder"
            @click="$emit('edit', questionTree as QuestionTree)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete Folder"
            @click="$emit('delete', questionTree as QuestionTree)"
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
