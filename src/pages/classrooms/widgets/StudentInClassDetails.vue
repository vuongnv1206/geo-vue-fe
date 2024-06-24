<script setup lang="ts">
import { ref } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { UserInClass } from '../types'
// const props = defineProps({
//   userInClass: {
//     type: Array as PropType<UserInClass[]>,
//     required: true,
//   },
//   loading: {
//     type: Boolean,
//     required: true,
//   },
// })

const sampleData = ref<UserInClass[]>([
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S001',
    isGender: true,
    email: 'john@example.com',
    phoneNumber: '123-456-7890',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S002',
    isGender: true,
    email: 'jane@example.com',
    phoneNumber: '987-654-3210',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S003',
    isGender: false,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S004',
    isGender: false,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S005',
    isGender: false,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S006',
    isGender: true,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S007',
    isGender: true,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S008',
    isGender: true,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S001',
    isGender: true,
    email: 'john@example.com',
    phoneNumber: '123-456-7890',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S002',
    isGender: true,
    email: 'jane@example.com',
    phoneNumber: '987-654-3210',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S003',
    isGender: false,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S004',
    isGender: false,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S005',
    isGender: true,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
  {
    userId: '00000000-0000-0000-0000-000000000000',
    classesId: '00000000-0000-0000-0000-000000000000',
    studentCode: 'S006',
    isGender: true,
    email: 'alex@example.com',
    phoneNumber: '555-123-4567',
  },
])

const columns = defineVaDataTableColumns([
  //   { label: 'Name', key: 'name', sortable: true },
  { label: 'StudentID', key: 'studentCode', sortable: true },
  { label: 'Gender', key: 'isGender', sortable: true },
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Phone Number', key: 'phoneNumber', sortable: true },
  { label: ' ', key: 'actions' },
])

const handleSelectionChange = (selectedItems: UserInClass[]) => {
  console.log('selectedItems', selectedItems)
}
</script>

<template>
  <VaDataTable
    hoverable
    clickable
    selectable
    :columns="columns"
    select-mode="multiple"
    :items="sampleData"
    :disable-client-side-sorting="false"
    @selectionChange="handleSelectionChange($event.currentSelectedItems)"
  >
    <template #cell(studentCode)="{ rowData }">
      <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
        <div>{{ rowData.studentCode }}</div>
      </div>
    </template>
    <template #cell(isGender)="{ rowData }">
      <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
        <div>{{ rowData.isGender }}</div>
      </div>
    </template>
    <template #cell(email)="{ rowData }">
      <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
        <div>{{ rowData.email }}</div>
      </div>
    </template>
    <template #cell(phoneNumber)="{ rowData }">
      <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
        <div>{{ rowData.phoneNumber }}</div>
      </div>
    </template>
    <template #cell(actions)="">
      <div class="flex gap-2 justify-end">
        <VaButton preset="primary" size="small" color="primary" icon="mso-edit" aria-label="Edit" />
        <VaButton preset="primary" size="small" icon="mso-delete" color="danger" aria-label="Delete" />
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
