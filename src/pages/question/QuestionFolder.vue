<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import { QuestionTree, QuestionTreeEmpty, QuestionFolderPermission, SharePermission, Permission } from './types'
import QuestionFolder from './widgets/QuestionFolder.vue'
import EditQuestionTreeForm from './widgets/EditQuestionTreeForm.vue'
import QuestionBank from './QuestionBank.vue'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'
import { useGroupTeacherStore } from '@/stores/modules/groupTeacher.module'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useModal, useToast } from 'vuestic-ui'
import { getErrorMessage } from '@/services/utils'
import { GroupTeacher, TeacherTeam, TeacherTeamTeacherGroupCombine } from '../teacher-group/types'
import { UserDetail } from '../user/types'
import { avatarColor } from '@/services/utils'
import { useQuestionStore } from '@/stores/modules/question.module'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(true)
const currentShowFolderId = ref<string>('')

const stores = useQuestionFolderStore()
const groupTeacherStore = useGroupTeacherStore()
const authStore = useAuthStore()

const questionTreeMain = ref<QuestionTree>()
const questionTrees = ref<QuestionTree[]>([])

const props = defineProps({
  showTitle: {
    type: Boolean,
    default: true,
  },
  mode: {
    type: String,
    default: 'full',
  },
})

const totalQuestions = ref(0)

const getCurrentShowFolder = (questionTree: QuestionTree) => {
  if (questionTree.currentShow) {
    questionTrees.value = questionTree.children
    totalQuestions.value = questionTree.totalQuestions || 0
    return questionTree
  } else {
    questionTree.children.forEach((child) => {
      return getCurrentShowFolder(child)
    })
  }
  return questionTree
}

const QuestionFolderBreadcrumb = computed(() => {
  let questionTree = questionTreeMain.value
  const result: { label: string; to: string }[] = []
  while (questionTree?.currentShow == false) {
    result.push({
      label: questionTree.name,
      to: questionTree.id,
    })
    questionTree = questionTree.children[0]
  }
  if (questionTree?.currentShow) {
    result.push({
      label: questionTree.name,
      to: questionTree.id,
    })
  }
  return result
})

const handleBreadcrumbClick = (item: { label: string; to: string }) => {
  if (item.label == 'Root') {
    currentShowFolderId.value = ''
  } else {
    currentShowFolderId.value = item.to
  }
  getQuestionFolders()
}

const QuestionTreeToEdit = ref<QuestionTree | null>(null)
const doShowQuestionTreeFormModal = ref(false)
const doShowShareQuestionTreeFormModal = ref(false)
const doShowQuestionTreePermisionFormModal = ref(false)
const doShowQuestionTreePermisionFormAddModal = ref(false)

const storesQuestion = useQuestionStore()
const { needReloadQuestionFolder } = storeToRefs(storesQuestion)

const editQuestionTree = (questionTree: QuestionTree) => {
  QuestionTreeToEdit.value = questionTree
  doShowQuestionTreeFormModal.value = true
}

const dataFilter = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 1000,
  orderBy: ['id'],
})

const groupTeachers = ref<GroupTeacher[]>([])
const teacherTeams = ref<TeacherTeam[]>([])

const options = ref<TeacherTeamTeacherGroupCombine[]>([])
const autoCompleteSearchValue = ref('')

const singleSelect = ref<TeacherTeamTeacherGroupCombine | null>(null)

const editPermissionValue = ref<QuestionFolderPermission | null>(null)

const permissionEdit = ref({
  canView: false,
  canAdd: false,
  canUpdate: false,
  canDelete: false,
  canShare: false,
})

const canEdit = ref(false)

const editPermission = (permission: QuestionFolderPermission) => {
  doShowQuestionTreePermisionFormModal.value = true
  editPermissionValue.value = permission
  permissionEdit.value = {
    canView: permission.canView,
    canAdd: permission.canAdd,
    canUpdate: permission.canUpdate,
    canDelete: permission.canDelete,
    canShare: permission.canShare,
  }
  if (permission.canAdd && permission.canUpdate && permission.canDelete) {
    canEdit.value = true
  }
}

const optionsSelect = ref<TeacherTeamTeacherGroupCombine | null>(null)

const AddPermission = (option: TeacherTeamTeacherGroupCombine) => {
  optionsSelect.value = option

  const user = ref<UserDetail | null>(null)
  if (option.teacherTeam) {
    user.value = {
      id: option.teacherTeam.teacherId,
      email: option.teacherTeam.email,
      firstName: option.teacherTeam.teacherName,
      emailConfirmed: false,
      phoneNumberConfirmed: false,
      lastName: '',
      phoneNumber: '',
      imageUrl: '',
      isActive: false,
      userName: '',
      birthDate: '',
      gender: true,
    }
  }

  editPermissionValue.value = {
    user: user.value,
    groupTeacherId: option.groupTeacher?.id || '',
    groupTeacher: option.groupTeacher,
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
    createdBy: '',
    createdOn: '',
    lastModifiedBy: '',
    lastModifiedOn: '',
    id: '',
    questionFolderId: QuestionTreeToEdit.value?.id || '',
    userId: '',
  }
  permissionEdit.value = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
  }
  doShowQuestionTreePermisionFormAddModal.value = true
}

const isLoadingSelect = ref(false)

const getTeacherGroups = () => {
  isLoadingSelect.value = true
  groupTeacherStore.getGroupTeachers(dataFilter).then((res) => {
    groupTeachers.value = res.data
    groupTeacherStore
      .getTeacherTeams(dataFilter)
      .then((res) => {
        teacherTeams.value = res.data
        options.value = []
        groupTeachers.value.forEach((groupTeacher) => {
          options.value.push({
            groupTeacher: groupTeacher,
            teacherTeam: null,
          })
        })
        teacherTeams.value.forEach((teacherTeam) => {
          options.value.push({
            groupTeacher: null,
            teacherTeam: teacherTeam,
          })
        })
      })
      .finally(() => {
        isLoadingSelect.value = false
      })
  })
}

const shareQuestionTree = (questionTree: QuestionTree) => {
  const currentUserId = authStore.user?.id
  console.log(currentUserId)
  // loop through permission to check if current user has permission
  let hasPermission = false
  questionTree.permission.forEach((permission) => {
    console.log(permission)
    if (permission.user?.id == currentUserId) {
      if (permission.canShare) {
        hasPermission = true
      }
    }
    if (permission.groupTeacher?.teacherTeams) {
      permission.groupTeacher.teacherTeams.forEach((teacherTeam) => {
        if (teacherTeam.teacherId == currentUserId) {
          if (permission.canShare) {
            hasPermission = true
          }
        }
      })
    }
  })

  if (!hasPermission) {
    notify({
      message: t('questionFolder.no_permission'),
      color: 'danger',
    })
    return
  }

  QuestionTreeToEdit.value = questionTree
  // sortPermission for owner first
  QuestionTreeToEdit.value.permission.sort((a) => {
    if (a.user?.id == QuestionTreeToEdit.value?.owner?.id) {
      return -1
    }
    return 0
  })
  getTeacherGroups()
  doShowShareQuestionTreeFormModal.value = true
}

const createNewQuestionFolder = () => {
  QuestionTreeToEdit.value = null
  doShowQuestionTreeFormModal.value = true
}

const selectedItemsEmitted = ref<QuestionTree[]>([])
const selectedItemsEmittedDelete = ref<QuestionTree[]>([])

const deleteQuestionTree = (questionTree: QuestionTree) => {
  loading.value = true
  if (!selectedItemsEmittedDelete.value.includes(questionTree)) {
    stores
      .deleteQuestionFolder(questionTree.id)
      .then(() => {
        notify({
          message: t('questionFolder.folder_deleted', { name: questionTree.name }),
          color: 'success',
        })
        getQuestionFolders()
      })
      .catch((err) => {
        const message = getErrorMessage(err)
        notify({
          message: t('questionFolder.delete_failed', { name: questionTree.name }) + '\n' + message,
          color: 'danger',
        })
      })
      .finally(() => {
        loading.value = false
        needReloadQuestionFolder.value = true
      })
  }
}

const deleteQuestionTreeOne = (questionTree: QuestionTree) => {
  confirm(t('questionFolder.delete_confirmation', { name: questionTree.name })).then((agreed) => {
    if (agreed) {
      deleteQuestionTree(questionTree)
    }
  })
}

const deleteSelectedFolder = () => {
  confirm(t('questionFolder.delete_selected_confirmation')).then((agreed) => {
    if (agreed) {
      selectedItemsEmitted.value.forEach((questionTree) => {
        deleteQuestionTree(questionTree)
        selectedItemsEmittedDelete.value.push(questionTree)
      })
    }
  })
}

const getQuestionFolders = () => {
  loading.value = true
  stores
    .getQuestionFolders(currentShowFolderId.value)
    .then((res) => {
      questionTreeMain.value = res
      getCurrentShowFolder(res)
      loading.value = false
    })
    .catch(() => {
      loading.value = false
      notify({
        message: t('questionFolder.get_failed'),
        color: 'danger',
      })
    })
    .finally(() => {
      selectedItemsEmitted.value = []
    })
}

const selectedFolder = (questionTree: QuestionTree) => {
  currentShowFolderId.value = questionTree.id
  getQuestionFolders()
}

const editFormRef = ref()
const { confirm } = useModal()
const { init: notify } = useToast()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: t('questionFolder.unsaved_changes'),
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

const onQuestionnFolderSaved = async (qFolder: QuestionTree) => {
  doShowQuestionTreeFormModal.value = false
  if (qFolder.id != '') {
    loading.value = true
    stores
      .updateQuestionFolder(qFolder.id, qFolder as QuestionTreeEmpty)
      .then(() => {
        notify({
          message: t('questionFolder.folder_updated'),
          color: 'success',
        })
        getQuestionFolders()
      })
      .catch((err) => {
        const message = getErrorMessage(err)
        notify({
          message: t('questionFolder.update_failed', { name: qFolder.name }) + '\n' + message,
          color: 'danger',
        })
      })
      .finally(() => {
        loading.value = false
        needReloadQuestionFolder.value = true
      })
  } else {
    if (currentShowFolderId.value != '') {
      qFolder.parentId = currentShowFolderId.value
    } else {
      qFolder.parentId = ''
    }
    loading.value = true
    stores
      .createQuestionFolder(qFolder as QuestionTreeEmpty)
      .then(() => {
        notify({
          message: t('questionFolder.folder_created', { name: qFolder.name }),
          color: 'success',
        })
        getQuestionFolders()
      })
      .catch((err) => {
        const message = getErrorMessage(err)
        notify({
          message: t('questionFolder.create_failed', { name: qFolder.name }) + '\n' + message,
          color: 'danger',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const getOptionName = (option: TeacherTeamTeacherGroupCombine) => {
  if (option.groupTeacher) {
    const optionData = { data: option.groupTeacher.name, isUser: false }
    return optionData
  } else {
    const optionData = { data: option.teacherTeam?.teacherName, isUser: true }
    return optionData
  }
}

const getNameUserGroup = (option: QuestionFolderPermission | null) => {
  if (option?.user) {
    return option.user.firstName + ' ' + option.user.lastName
  } else {
    return option?.groupTeacher?.name
  }
}

const onShareQuestionFolderPermission = () => {
  const sharePermission = ref<SharePermission>({
    canView: permissionEdit.value.canView,
    canAdd: permissionEdit.value.canAdd,
    canUpdate: permissionEdit.value.canUpdate,
    canDelete: permissionEdit.value.canDelete,
    canShare: permissionEdit.value.canShare,
    emails: [],
    folderId: editPermissionValue.value?.questionFolderId || '',
    phones: [],
    teacherGroupIDs: [],
    userIDs: [],
  })
  if (editPermissionValue.value?.user) {
    sharePermission.value.userIDs.push(editPermissionValue.value.user.id)
  }
  if (editPermissionValue.value?.groupTeacherId) {
    sharePermission.value.teacherGroupIDs.push(editPermissionValue.value.groupTeacherId)
  }
  stores
    .shareQuestionFolder(editPermissionValue.value?.questionFolderId || '', sharePermission.value)
    .then(() => {
      notify({
        message: t('questionFolder.permission_updated'),
        color: 'success',
      })
      doShowShareQuestionTreeFormModal.value = false
      getQuestionFolders()
    })
    .catch((err) => {
      const message = getErrorMessage(err)
      notify({
        message: message,
        color: 'danger',
      })
    })
    .finally(() => {
      doShowQuestionTreePermisionFormModal.value = false
    })
}

const handleDeletePermission = () => {
  permissionEdit.value = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    canShare: false,
  }
  onShareQuestionFolderPermission()
}

const tabValue = ref(0)

const { sellectedQuestionFolderId } = storeToRefs(storesQuestion)
const showQuestions = () => {
  tabValue.value = 0
  sellectedQuestionFolderId.value = currentShowFolderId.value
}

const getTotalQuestions = () => {
  if (currentShowFolderId.value === '') {
    let total = 0
    questionTrees.value.forEach((folder) => {
      total += folder.totalQuestions || 0
    })
    return total
  } else {
    return totalQuestions.value
  }
}

const searchTerm = ref('')

const handleSearch = () => {}

const folderPermissionType = ref(0) // 0: all, 1: my documents, 2: shared documents

const questionTreesFiltered = computed(() => {
  const search = questionTrees.value.filter((questionTree) => {
    const name = questionTree.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    return name
  })
  const filtered = search.filter((questionTree) => {
    const permission = questionTree.permission.some((permission) => {
      if (folderPermissionType.value == 0) {
        return true
      }
      if (folderPermissionType.value == 2) {
        const share = permission.canView && permission.user?.id == authStore.user?.id
        const owner = questionTree?.owner?.id == authStore.user?.id
        return share && !owner
      }
      if (folderPermissionType.value == 1) {
        return questionTree?.owner?.id == authStore.user?.id
      }
    })
    return permission
  })
  return filtered
})

const allPermissionFalse = (permission: Permission) => {
  return !permission.canView && !permission.canAdd && !permission.canUpdate && !permission.canDelete
}

watch(
  () => permissionEdit.value,
  (value) => {
    if (!value.canView) {
      canEdit.value = false
    }
  },
  { deep: true },
)

watch(
  () => canEdit.value,
  (value) => {
    if (!value) {
      permissionEdit.value = {
        canView: false,
        canAdd: false,
        canUpdate: false,
        canDelete: false,
        canShare: false,
      }
    } else {
      permissionEdit.value.canView = true
      permissionEdit.value.canAdd = true
      permissionEdit.value.canUpdate = true
      permissionEdit.value.canDelete = true
    }
  },
)

watch(
  () => permissionEdit.value.canShare,
  (value) => {
    if (value) {
      canEdit.value = true
    }
  },
  { deep: true },
)

onMounted(() => {
  getQuestionFolders()
})
</script>

<template>
  <VaTabs v-model="tabValue">
    <template #tabs>
      <VaTab v-for="tab in [t('questionFolder.questions'), t('questionFolder.folders')]" :key="tab">
        {{ tab }}
      </VaTab>
    </template>
  </VaTabs>
  <VaCard v-if="tabValue == 1" class="pb-0">
    <VaCard class="flex flex-col sm:flex-row gap-2 p-2 mb-2">
      <VaInput v-model="searchTerm" :placeholder="t('questionFolder.search')" class="flex-grow">
        <template #appendInner>
          <VaIcon color="secondary" class="material-icons" @click="handleSearch">search</VaIcon>
        </template>
      </VaInput>
      <VaCard class="flex justify-end items-center">
        <VaCard class="flex gap-2">
          <div class="flex flex-row gap-2 justify-end">
            <VaButton
              v-if="selectedItemsEmitted.length != 0 && props.mode == 'full'"
              icon="delete"
              color="danger"
              @click="deleteSelectedFolder()"
            >
              {{ t('questionFolder.delete') }}</VaButton
            >
            <VaButton v-if="props.mode == 'full'" class="w-[170px]" icon="add" @click="createNewQuestionFolder()">{{
              t('questionFolder.add_folder')
            }}</VaButton>
          </div>
          <VaDropdown placement="bottom-end">
            <template #anchor>
              <VaButton icon="filter_alt" />
            </template>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="folderPermissionType == 0 ? 'check' : ''"
                @click="folderPermissionType = 0"
                >{{ t('questionFolder.all') }}</VaButton
              >
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="folderPermissionType == 1 ? 'check' : ''"
                @click="folderPermissionType = 1"
                >{{ t('questionFolder.my_documents') }}</VaButton
              >
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="folderPermissionType == 2 ? 'check' : ''"
                @click="folderPermissionType = 2"
                >{{ t('questionFolder.shared_documents') }}</VaButton
              >
            </VaDropdownContent>
          </VaDropdown>
        </VaCard>
      </VaCard>
    </VaCard>
    <VaCardTitle class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <VaBreadcrumbs>
        <VaBreadcrumbsItem
          v-for="item in QuestionFolderBreadcrumb"
          :key="item.label"
          :label="item.label"
          @click="handleBreadcrumbClick(item)"
        >
          <a href="#" class="text-blue-500">{{ item.label }}</a>
        </VaBreadcrumbsItem>
      </VaBreadcrumbs>
      <VaCard class="flex justify-end w-[180px]">
        <VaButton preset="primary" size="small" color="primary" @click="showQuestions">
          {{ t('questionFolder.view_questions', { count: getTotalQuestions() }) }}
        </VaButton>
      </VaCard>
    </VaCardTitle>
    <VaCardContent class="pb-0">
      <QuestionFolder
        v-model:selectedItemsEmitted="selectedItemsEmitted"
        :question-trees="questionTreesFiltered"
        :loading="loading"
        :total-questions="totalQuestions"
        :current-show-folder-id="currentShowFolderId"
        :mode="props.mode"
        @edit="editQuestionTree"
        @delete="deleteQuestionTreeOne"
        @selectedFolder="selectedFolder"
        @share="shareQuestionTree"
        @viewQuestions="showQuestions"
      />
    </VaCardContent>
  </VaCard>
  <QuestionBank v-else @edit="editQuestionTree" @delete="deleteQuestionTreeOne" @share="shareQuestionTree" />
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowQuestionTreeFormModal"
    size="small"
    mobile-fullscreen
    close-button
    stateful
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 v-if="QuestionTreeToEdit === null" class="va-h5 mb-4">{{ t('questionFolder.add_folder') }}</h1>
    <h1 v-else class="va-h5 mb-4">{{ t('questionFolder.edit_folder') }}</h1>
    <EditQuestionTreeForm
      ref="editFormRef"
      :question-tree="QuestionTreeToEdit"
      :save-button-label="QuestionTreeToEdit === null ? t('questionFolder.add') : t('questionFolder.save')"
      @close="cancel"
      @save="
        (questionTree: QuestionTree) => {
          onQuestionnFolderSaved(questionTree)
          ok()
        }
      "
    />
  </VaModal>

  <VaModal
    v-model="doShowShareQuestionTreeFormModal"
    mobile-fullscreen
    size="small"
    close-button
    stateful
    hide-default-actions
  >
    <h1 class="va-h5 mb-4">{{ t('questionFolder.share_folder', { name: QuestionTreeToEdit?.name }) }}</h1>

    <VaSelect
      v-model="singleSelect"
      v-model:search="autoCompleteSearchValue"
      class="col-span-1"
      :loading="isLoadingSelect"
      :label="t('questionFolder.select_user_or_group')"
      :options="options"
      searchable
      :text-by="
        (option: TeacherTeamTeacherGroupCombine) => getOptionName(option as TeacherTeamTeacherGroupCombine).data
      "
      :placeholder="t('questionFolder.search_user_or_group')"
      track-by="id"
    >
      <template #appendInner>
        <VaIcon name="fas-search" />
      </template>
      <template #option="{ option }">
        <div class="flex justify-between items-center p-2">
          <div class="flex items-center gap-2">
            <VaAvatar
              v-if="getOptionName(option as TeacherTeamTeacherGroupCombine).isUser"
              :size="48"
              :color="avatarColor(getOptionName(option as TeacherTeamTeacherGroupCombine).data)"
              >{{
                getOptionName(option as TeacherTeamTeacherGroupCombine)
                  .data?.charAt(0)
                  .toUpperCase()
              }}
            </VaAvatar>
            <VaAvatar v-else :size="48" color="warning" icon="group"> </VaAvatar>
            <div>
              <div>{{ getOptionName(option as TeacherTeamTeacherGroupCombine).data }}</div>
              <div class="text-sm text-gray-500">
                {{ getOptionName(option as TeacherTeamTeacherGroupCombine).data }}
              </div>
            </div>
          </div>
          <div>
            <VaPopover
              v-if="
                (option as TeacherTeamTeacherGroupCombine).teacherTeam?.teacherId ===
                '00000000-0000-0000-0000-000000000000'
              "
              class="mr-2 mb-2"
              :message="t('questionFolder.not_registered')"
            >
              <VaIcon class="mr-2" name="no_accounts" />
            </VaPopover>
            <VaButton
              :disabled="
                (option as TeacherTeamTeacherGroupCombine).teacherTeam?.teacherId ===
                '00000000-0000-0000-0000-000000000000'
              "
              size="small"
              preset="secondary"
              border-color="primary"
              @click="AddPermission(option as TeacherTeamTeacherGroupCombine)"
            >
              {{ t('questionFolder.select') }}
            </VaButton>
          </div>
        </div>
      </template>
    </VaSelect>
    <div class="mt-5">
      <VaScrollContainer class="h-80" vertical>
        <VaList>
          <VaListLabel> {{ t('questionFolder.permissions') }} </VaListLabel>
          <VaListItem
            v-for="(permission, index) in QuestionTreeToEdit?.permission"
            :key="index"
            class="list__item ml-5"
          >
            <VaListItemSection v-if="!allPermissionFalse(permission as Permission)" avatar>
              <VaAvatar
                v-if="permission.user ? true : false"
                :size="42"
                :color="avatarColor(getNameUserGroup(permission))"
              >
                {{ getNameUserGroup(permission)?.charAt(0) }}
              </VaAvatar>
              <VaAvatar v-else :size="42" color="warning" icon="group"> </VaAvatar>
            </VaListItemSection>
            <VaListItemSection v-if="!allPermissionFalse(permission as Permission)">
              <VaListItemLabel>
                {{ getNameUserGroup(permission) }}
              </VaListItemLabel>

              <VaListItemLabel caption>
                {{ permission.user?.email }}
              </VaListItemLabel>
            </VaListItemSection>
            <VaListItemSection v-if="!allPermissionFalse(permission as Permission)" icon>
              <VaButton
                v-if="QuestionTreeToEdit?.owner && QuestionTreeToEdit.owner.id == permission.user?.id"
                size="small"
                disabled
                preset="secondary"
                border-color="primary"
                class="mr-6 mb-2"
              >
                {{ t('questionFolder.owner') }}
              </VaButton>
              <VaButton
                v-else
                size="small"
                preset="secondary"
                border-color="primary"
                class="mr-6 mb-2"
                @click="editPermission(permission)"
              >
                {{ t('questionFolder.edit_permissions') }}
              </VaButton>
            </VaListItemSection>
          </VaListItem>
        </VaList>
      </VaScrollContainer>
    </div>
  </VaModal>

  <VaModal
    v-model="doShowQuestionTreePermisionFormModal"
    :ok-text="t('questionFolder.save')"
    size="small"
    @ok="onShareQuestionFolderPermission"
  >
    <span class="va-h5 mb-5">{{
      t('questionFolder.edit_permissions_for', { name: getNameUserGroup(editPermissionValue) })
    }}</span>
    <VaForm>
      <div class="gap-4 ml-10 mt-10">
        <VaListItem>
          <VaListItemSection avatar>
            <VaAvatar :size="48" :color="avatarColor(getNameUserGroup(editPermissionValue))">{{
              getNameUserGroup(editPermissionValue)?.charAt(0)
            }}</VaAvatar>
          </VaListItemSection>
          <VaListItemSection>
            <VaListItemLabel>
              {{ getNameUserGroup(editPermissionValue) }}
            </VaListItemLabel>

            <VaListItemLabel caption>
              {{ editPermissionValue?.user?.email }}
            </VaListItemLabel>
          </VaListItemSection>
          <VaListItemSection icon>
            <VaPopover :message="t('questionFolder.delete_permission')" position="top">
              <VaButton
                round
                icon="mso-delete"
                color="danger"
                @click="
                  () => {
                    handleDeletePermission()
                  }
                "
              >
                {{ t('questionFolder.delete') }}
              </VaButton>
            </VaPopover>
          </VaListItemSection>
        </VaListItem>
      </div>
      <div class="flex flex-col gap-4 p-10">
        <VaCheckbox v-model="permissionEdit.canView" :label="t('questionFolder.view')" />
        <VaCheckbox v-model="canEdit" :label="t('questionFolder.edit')" />
        <VaCheckbox v-model="permissionEdit.canShare" :label="t('questionFolder.share')" />
      </div>
    </VaForm>
  </VaModal>

  <VaModal
    v-model="doShowQuestionTreePermisionFormAddModal"
    :ok-text="t('questionFolder.save')"
    size="small"
    @ok="onShareQuestionFolderPermission"
  >
    <span class="va-h5 mb-5">{{
      t('questionFolder.grant_permissions_for', { name: getNameUserGroup(editPermissionValue) })
    }}</span>
    <VaForm>
      <div class="gap-4 ml-10 mt-10">
        <VaListItem>
          <VaListItemSection avatar>
            <VaAvatar :size="48" :color="avatarColor(getNameUserGroup(editPermissionValue))">{{
              getNameUserGroup(editPermissionValue)?.charAt(0)
            }}</VaAvatar>
          </VaListItemSection>
          <VaListItemSection>
            <VaListItemLabel>
              {{ getNameUserGroup(editPermissionValue) }}
            </VaListItemLabel>

            <VaListItemLabel caption>
              {{ editPermissionValue?.user?.email }}
            </VaListItemLabel>
          </VaListItemSection>
          <VaListItemSection icon>
            <VaPopover :message="t('questionFolder.delete_permission')" position="top">
              <VaButton
                round
                icon="mso-delete"
                color="danger"
                @click="
                  () => {
                    console.log('delete')
                  }
                "
              >
                {{ t('questionFolder.delete') }}
              </VaButton>
            </VaPopover>
          </VaListItemSection>
        </VaListItem>
      </div>
      <div class="flex flex-col gap-4 p-10">
        <VaCheckbox v-model="permissionEdit.canView" :label="t('questionFolder.view')" />
        <VaCheckbox v-model="canEdit" :label="t('questionFolder.edit')" />
        <VaCheckbox v-model="permissionEdit.canShare" :label="t('questionFolder.share')" />
      </div>
    </VaForm>
  </VaModal>
</template>
