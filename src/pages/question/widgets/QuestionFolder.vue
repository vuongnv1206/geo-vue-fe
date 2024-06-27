<script setup lang="ts">
import { computed, onBeforeMount, PropType, ref, watch } from 'vue'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'
import { Pagination, QuestionTree } from '../types'
import { useI18n } from 'vue-i18n'
import { format } from '@services/utils'

const { t } = useI18n()
const { show } = useMenu()

const columns = defineVaDataTableColumns([
  { label: t('questionFolderTable.folder_name'), key: 'name', sortable: true },
  { label: t('questionFolderTable.total_questions'), key: 'totalQuestions', sortable: true },
  { label: t('questionFolderTable.created_by'), key: 'createdBy', sortable: true },
  { label: t('questionFolderTable.created_on'), key: 'createdOn', sortable: true },
  { label: t('questionFolderTable.last_modified_on'), key: 'lastModifiedOn', sortable: true },
  { label: t('questionFolderTable.actions'), key: 'actions' },
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
  totalQuestions: {
    type: Number,
    required: false,
    default: 0,
  },
  currentShowFolderId: {
    type: String,
    required: false,
    default: '',
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
  (event: 'viewQuestions', id: string): void
}>()

const contextmenu = (event: any) => {
  event.event.preventDefault()
  show({
    event: event.event,
    options: [
      { text: t('questionFolderTable.rename'), icon: 'edit' },
      { text: t('questionFolderTable.share'), icon: 'share' },
      { text: t('questionFolderTable.delete'), icon: 'delete' },
    ],
    onSelected(option) {
      if (option.text === t('questionFolderTable.rename')) {
        emit('edit', event.item)
      }
      if (option.text === t('questionFolderTable.share')) {
        emit('share', event.item)
      }
      if (option.text === t('questionFolderTable.delete')) {
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

const pagination = ref<Pagination>({
  page: 1,
  perPage: 20,
  total: 0,
})

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.perPage))

const questionTreesPagination = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.perPage
  const end = start + pagination.value.perPage
  return props.questionTrees.slice(start, end)
})

watch(
  () => props.questionTrees,
  () => {
    console.log('props.questionTrees', props.questionTrees)
    pagination.value.total = props.questionTrees.length
  },
)

onBeforeMount(() => {
  if (props.mode == 'lite') {
    columns.splice(2, 3)
  }
  pagination.value.total = props.questionTrees.length
})
</script>

<template>
  <div>
    <VaDataTable
      :items="questionTreesPagination"
      :columns="columns"
      :loading="props.loading"
      hoverable
      clickable
      selectable
      height="63vh"
      sticky-header
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
          <VaPopover icon="info" :message="format.formatDate(rowData.createdOn)">
            <div>{{ format.getTimeString(rowData.createdOn) }}</div>
          </VaPopover>
        </div>
      </template>
      <template v-if="props.mode == 'full'" #cell(lastModifiedOn)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <VaPopover icon="info" :message="format.formatDate(rowData.lastModifiedOn)">
            <div>{{ format.getTimeString(rowData.lastModifiedOn) }}</div>
          </VaPopover>
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

    <VaCardContent>
      <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center pt-0 pb-0">
        <div>
          <b>{{ pagination.total }} {{ t('questionFolderTable.results') }}.</b>
          {{ t('questionFolderTable.results_per_page') }}
          <VaSelect v-model="pagination.perPage" class="!w-20" :options="[20, 50, 100]" />
        </div>

        <div v-if="totalPages > 1" class="flex">
          <VaButton
            preset="secondary"
            icon="va-arrow-left"
            :aria-label="t('questionFolderTable.previous_page')"
            :disabled="pagination.page === 1"
            @click="pagination.page--"
          />
          <VaButton
            class="mr-2"
            preset="secondary"
            icon="va-arrow-right"
            :aria-label="t('questionFolderTable.next_page')"
            :disabled="pagination.page === totalPages"
            @click="pagination.page++"
          />
          <VaPagination
            v-model="pagination.page"
            buttons-preset="secondary"
            :pages="totalPages"
            :visible-pages="5"
            :boundary-links="false"
            :direction-links="false"
          />
        </div>
      </div>
    </VaCardContent>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
