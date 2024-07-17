<script lang="ts" setup>
import { PropType } from 'vue'
import { Subject } from '../types'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { show } = useMenu()

const columns = defineVaDataTableColumns([
  { label: t('subjects.subject'), key: 'name', sortable: true },
  { label: t('subjects.description'), key: 'description', sortable: true },
  { label: ' ', key: 'actions' },
])

const emit = defineEmits<{
  (event: 'edit', subject: Subject): void
  (event: 'delete', subject: Subject): void
  (event: 'selectedSubject', subject: Subject): void
}>()

const props = defineProps({
  subjects: {
    type: Array as PropType<Subject[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const contextmenu = (event: any) => {
  event.event.preventDefault()
  show({
    event: event.event,
    options: [
      { text: t('settings.edit'), icon: 'edit' },
      { text: t('settings.delete'), icon: 'delete' },
    ],
    onSelected(option) {
      console.log('selected', option)
      console.log('selected', event.item)
    },
  })
}

const dblclick = (event: any) => {
  emit('selectedSubject', event.item)
}

const selectedItemsEmitted = defineModel('selectedItemsEmitted', {
  type: Array as PropType<Subject[]>,
  default: [],
})

const handleSelectionChange = (selectedItems: Subject[]) => {
  selectedItemsEmitted.value = selectedItems
}
</script>

<template>
  <VaDataTable
    hoverable
    clickable
    selectable
    :columns="columns"
    select-mode="multiple"
    :items="props.subjects"
    :disable-client-side-sorting="false"
    @row:dblclick="dblclick($event)"
    @row:contextmenu="contextmenu($event)"
    @selectionChange="handleSelectionChange($event.currentSelectedItems)"
  >
    <!-- <template #cell(name)="{ rowData }">
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
    </template> -->
    <template #cell(actions)="{ rowData: subject }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          :aria-label="$t('subjects.edit_subject')"
          @click="emit('edit', subject as Subject)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          :aria-label="$t('subjects.delete_subject')"
          @click="emit('delete', subject as Subject)"
        />
      </div>
    </template>
  </VaDataTable>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
