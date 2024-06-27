<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { UserInClass } from '../types'
import { notifications } from '@/services/utils'
import axios from 'axios'
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

// const loading = ref(true)
// const { init: notify } = useToast()
const { confirm } = useModal()
const selectedItemsEmitted = ref<UserInClass[]>([])
const UserInClassToEdit = ref<UserInClass | null>(null)
const doShowUserInClassFormModal = ref(false)
const usersInClass = ref<UserInClass[]>([])
const editFormRef = ref()

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'id', sortable: true },
  { label: 'User ID', key: 'userId', sortable: true },
  { label: 'Classes ID', key: 'classesId', sortable: true },
  { label: 'Student Code', key: 'studentCode', sortable: true },
  { label: 'First Name', key: 'firstName', sortable: true },
  { label: 'Last Name', key: 'lastName', sortable: true },
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Date of Birth', key: 'dob', sortable: true },
  { label: 'Gender', key: 'gender', sortable: true },
  { label: 'Phone Number', key: 'phoneNumber', sortable: true },
  { label: ' ', key: 'actions' },
])

const fetchUserInClass = async () => {
  try {
    const response = await axios.get('https://f9743239-e77a-45e2-8c25-955a3cd39562.mock.pstmn.io/user/search')
    usersInClass.value = response.data
    console.log('Post Value:\n', usersInClass.value)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchUserInClass()
})

// const dataFilter = ref({
//   advancedSearch: {
//     fields: [''],
//     keyword: '',
//   },
//   pageNumber: 0,
//   pageSize: 10,
//   orderBy: ['id'],
// })

const handleSelectionChange = (selectedItems: UserInClass[]) => {
  console.log('selectedItems', selectedItems)
}

const deleteUserInClass = (userInClass: UserInClass) => {
  console.log('deleteSelectedUserInClass', userInClass)
  // stores
  //   .deleteUserInClass(userInClass.userId)
  //   .then(() => {
  //     notify({
  //       message: notifications.deleteSuccessfully('user in class'),
  //       color: 'success',
  //     })
  //     fetchUserInClass()
  //   })
  //   .catch((error) => {
  //     notify({
  //       message: notifications.deleteFailed('user in class') + error.message,
  //       color: 'error',
  //     })
  //   })
}

const deleteSelectedUserInClass = () => {
  confirm({
    title: 'Delete Student',
    message: `Do you want to delete ${selectedItemsEmitted.value.length} selected student(s)?`,
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    selectedItemsEmitted.value.forEach((userInClass) => {
      deleteUserInClass(userInClass)
    })
  })
}

const createNewUserInClass = () => {
  UserInClassToEdit.value = null
  doShowUserInClassFormModal.value = true
}

// const editUserInClass = (userInClass: UserInClass) => {
//   UserInClassToEdit.value = userInClass
//   doShowUserInClassFormModal.value = true
// }
// const deleteUserInClassWithConfirm = (userInClass: UserInClass) => {
//   confirm({
//     title: 'Delete UserInClass',
//     message: `Do you want to delete this student ?`,
//   }).then((agreed) => {
//     if (!agreed) {
//       return
//     }
//     deleteUserInClass(userInClass)
//   })
// }

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: notifications.unsavedChanges,
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

// const onUserInClassSaved = async (userInClass: UserInClass) => {
//   doShowUserInClassFormModal.value = false
// if (userInClass.id != '') {
//   stores
//     .updateUserInClass(userInClass.id, userInClass as EmptyUserInClass)
//     .then(() => {
//       notify({
//         message: notifications.updatedSuccessfully('user in class'),
//         color: 'success',
//       })
//       fetchUserInClass()
//     })
//     .catch((error) => {
//       notify({
//         message: notifications.updatedSuccessfully('user in class') + error.message,
//         color: 'error',
//       })
//     })
// } else {
//   stores
//     .createUserInClass(userInClass as EmptyUserInClass)
//     .then(() => {
//       notify({
//         message: notifications.createSuccessfully('user in class'),
//         color: 'success',
//       })
//       fetchUserInClass()
//     })
//     .catch((error) => {
//       notify({
//         message: notifications.createFailed('user in class') + error.message,
//         color: 'error',
//       })
//     })
// }
// }
</script>

<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaButton
          v-if="selectedItemsEmitted.length != 0"
          icon="delete"
          color="danger"
          @click="deleteSelectedUserInClass()"
        >
          Delete</VaButton
        >
        <VaButton icon="add" @click="createNewUserInClass()">UserInClass</VaButton>
      </div>
      <VaDataTable
        hoverable
        clickable
        selectable
        :columns="columns"
        select-mode="multiple"
        :items="usersInClass"
        :disable-client-side-sorting="false"
        @selectionChange="handleSelectionChange($event.currentSelectedItems)"
      >
        <template #cell(actions)="">
          <div class="flex gap-2 justify-end">
            <VaButton preset="primary" size="small" color="primary" icon="mso-edit" aria-label="Edit" />
            <VaButton preset="primary" size="small" icon="mso-delete" color="danger" aria-label="Delete" />
          </div>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowUserInClassFormModal"
    size="small"
    stateful
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowUserInClassFormModal = false"
  >
    <VaModalHeader>
      <h3 class="text-lg font-bold">{{ UserInClassToEdit ? 'Edit' : 'Create' }} UserInClass</h3>
    </VaModalHeader>
    <EditUserInClass
      ref="editFormRef"
      :user-in-class="UserInClassToEdit"
      :save-button-label="UserInClassToEdit === null ? 'Add' : 'Save'"
      @close="cancel"
      @save="
        (userInClass: UserInClass) => {
          // onUserInClassSaved(userInClass)
          {
            {
              userInClass
            }
          }
          ok()
        }
      "
    />
  </VaModal>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
