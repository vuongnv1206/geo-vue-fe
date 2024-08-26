<template>
  <VaLayout>
    <VaButton icon="va-arrow-left" preset="plainOpacity" :to="{ name: 'assignments' }" />
  </VaLayout>
  <VaDivider />
  <VaInnerLoading :loading="loading">
    <VaLayout
      :top="{ order: 1 }"
      :left="{ absolute: breakpoints.smDown, order: 2, overlay: breakpoints.smDown && showSidebar }"
      @leftOverlayClick="showSidebar = false"
    >
      <template #top>
        <VaNavbar class="py-1 rounded">
          <template #left>
            <VaButton
              preset="secondary"
              :icon="showSidebar ? 'menu_open' : 'menu'"
              @click="showSidebar = !showSidebar"
            />
          </template>
          <template #right>
            <div class="flex">
              <div class="mr-3 flex-grow">
                <VaInput class="" placeholder="Search">
                  <template #appendInner>
                    <VaIcon color="secondary" class="material-icons"> search </VaIcon>
                  </template>
                </VaInput>
              </div>
            </div>
          </template>
        </VaNavbar>
      </template>
      <template #left>
        <VaCard v-if="showSidebar" class="mr-2 rounded min-w-[500px]">
          <VaCard v-if="assignment" class="min-h-[81vh]">
            <VaCardContent class="font-bold">{{ classById?.name }} - {{ assignment.name }}</VaCardContent>
            <VaCardContent>
              <div class="flex items-center mb-1">
                <VaIcon name="event" class="material-symbols-outlined mr-1" />
                <span class="font-semibold mr-1">{{ $t('assignments.start_time') }} </span>
                {{ format.formatDate(assignment.startTime) }}
              </div>
              <div class="flex items-center">
                <VaIcon name="event" class="material-symbols-outlined mr-1" />
                <span class="font-semibold mr-1">{{ $t('assignments.end_time') }}</span>
                {{ format.formatDate(assignment.endTime) }}
              </div>
            </VaCardContent>
            <div v-if="canAssignmentManage">
              <VaCardContent class="font-bold">{{ $t('assignments.menu') }}</VaCardContent>
              <VaCard outlined class="mx-3">
                <VaCardActions align="stretch" vertical>
                  <VaButton
                    icon="edit"
                    preset="secondary"
                    :to="{ name: 'edit-assignment-details', params: { id: assignmentId, classId: classId } }"
                    class="justify-start"
                  >
                    {{ $t('assignments.settings') }}
                  </VaButton>
                  <VaButton
                    v-if="classById?.ownerId == currentUserId"
                    icon="delete"
                    preset="secondary"
                    class="justify-start"
                    @click="removeAssignmentFromClass(assignmentClass)"
                  >
                    {{ $t('settings.delete') }}
                  </VaButton>
                </VaCardActions>
              </VaCard>
            </div>
            <VaCard>
              <VaCard class="flex flex-row items-center justify-between">
                <div class="flex flex-row items-center">
                  <VaCardContent class="font-bold">{{ $t('assignments.attachments') }}</VaCardContent>
                  <VaPopover :title="$t('file_upload.allowed_file_types')" placement="right">
                    <VaIcon name="error" size="small" />
                    <template #body>
                      <p>{{ $t('file_upload.image') }}</p>
                      <p>{{ $t('file_upload.document') }}</p>
                      <p>{{ $t('file_upload.archive') }}</p>
                      <p>{{ $t('file_upload.video') }}</p>
                      <p>{{ $t('file_upload.audio') }}</p>
                      <p>{{ $t('file_upload.data') }}</p>
                    </template>
                  </VaPopover>
                </div>
                <VaFileUpload
                  v-model="filesUploaded"
                  class="flex flex-row items-center pr-6"
                  hide-file-list
                  file-types="jpg,png,jpeg,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,7z,mp4,avi,mkv,
                flv,wmv,mov,webm,mp3,wav,flac,ogg,wma,json,xml,csv,tsv"
                  @fileAdded="fileUpload"
                >
                  <VaIcon name="upload" />
                  <p class="font-semibold">{{ $t('assignments.upload') }}</p>
                </VaFileUpload>
              </VaCard>
              <VaCardContent>
                <VaCard v-for="(attachmentPath, index) in attachmentPaths" :key="index">
                  <VaButton
                    class="font-medium geo-text"
                    icon="description"
                    size="small"
                    preset="plain"
                    :href="`${url}${rawAttachmentPaths[index]}`"
                  >
                    {{ attachmentPath }}
                  </VaButton>
                </VaCard>
              </VaCardContent>
            </VaCard>
            <VaCard class="flex flex-row justify-between">
              <VaCardContent class="font-bold">{{ $t('assignments.content') }}</VaCardContent>
              <VaButton
                class="pr-6"
                icon="edit"
                size="small"
                preset="plain"
                @click="editAssignmentContent(assignment)"
              />
            </VaCard>
            <VaCardContent>
              <div v-if="!assignment.content" class="flex flex-col justify-center items-center h-full">
                <VaIcon name="description" size="large" class="material-symbols-outlined mb-2" />
                <p>{{ $t('assignments.empty_content') }}</p>
              </div>
              <!-- eslint-disable vue/no-v-html -->
              <div v-html="assignment.content" />
              <!--eslint-enable-->
            </VaCardContent>
          </VaCard>
        </VaCard>
      </template>

      <template #content>
        <VaCard class="mt-2 p-2 min-h-[75vh]">
          <VaList class="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <VaListItem
              v-for="student in sortedStudents"
              :key="student.id"
              class="border rounded p-4"
              :to="{
                name: 'assignment-marking',
                params: { id: assignment?.id, classId: classId, studentId: student.id },
              }"
            >
              <VaListItemSection avatar>
                <GeoAvatar
                  class="mr-2"
                  :size="48"
                  color="warning"
                  :image="student.avatarUrl || undefined"
                  :txt="student.firstName.charAt(0).toUpperCase()"
                />
              </VaListItemSection>
              <VaListItemSection>
                <VaListItemLabel> {{ student.firstName }} {{ student.lastName }} </VaListItemLabel>
                <!-- <VaListItemLabel
                  caption
                  :class="
                    getStatusColorClass(
                      assignmentSubmissions.find((submission) => submission.studentId === student.id)?.status,
                    )
                  "
                >
                  {{
                    getStatusText(assignmentSubmissions.find((submission) => submission.studentId === student.id)?.status)
                  }}
                </VaListItemLabel> -->
                <VaListItemLabel caption>
                  <VaBadge
                    :text="
                      getStatusText(
                        assignmentSubmissions.find((submission) => submission.studentId === student.id)?.status || '',
                      )
                    "
                    :color="
                      getStatusColorClass(
                        assignmentSubmissions.find((submission) => submission.studentId === student.id)?.status || '',
                      )
                    "
                  />
                </VaListItemLabel>
              </VaListItemSection>
            </VaListItem>
          </VaList>
        </VaCard>
      </template>
    </VaLayout>
  </VaInnerLoading>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowFormModal"
    size="large"
    mobile-fullscreen
    close-button
    stateful
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5 mb-4">{{ $t('assignments.edit_content') }}</h1>
    <EditAssignmentContent
      ref="editFormRef"
      :assignment-content="assignmentContent"
      @close="cancel"
      @save="
        (assignmentContent: AssignmentContent) => {
          onAssignmentContent(assignmentContent)
          ok()
        }
      "
    />
  </VaModal>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useFileStore } from '@/stores/modules/file.module'
import { useClassStore } from '@/stores/modules/class.module'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { format, getErrorMessage, notifications } from '@/services/utils'
import { useBreakpoint, useModal, useToast, VaCardContent, VaIcon, VaListItemLabel } from 'vuestic-ui'
import GeoAvatar from '@/components/avatar/GeoAvatar.vue'
import EditAssignmentContent from './EditAssignmentContent.vue'
import { ClassPermission, Classrooms } from '@/pages/classrooms/types'
import {
  Assignment,
  AssignmentClass,
  AssignmentContent,
  EmptyAssignmentContent,
  AssignmentAttachment,
  AssignmentSubmission,
  MarkAssignmentStatus,
} from '../types'
import { useAuthStore } from '@/stores/modules/auth.module'

const { t } = useI18n()
const loading = ref(true)
const router = useRouter()

const authStore = useAuthStore()

const currentUserId = authStore.user?.id
const fileStore = useFileStore()
const stores = useAssignmentStore()
const classStores = useClassStore()

const breakpoints = useBreakpoint()
const { init: notify } = useToast()
const showSidebar = ref(breakpoints.smUp)

const assignment = ref<Assignment | null>(null)
const assignmentContent = ref<AssignmentContent | null>(null)
const assignmentAttachment = ref<AssignmentAttachment | null>(null)
const assignmentSubmissions = ref<AssignmentSubmission[]>([])

const assignmentId = router.currentRoute.value.params.id.toString()
const classId = router.currentRoute.value.params.classId.toString()
const filesUploaded = ref<any>()
const classById = ref<Classrooms | null>(null)
const assignmentClass = ref<AssignmentClass>({
  assignmentId: assignmentId,
  classId: classId,
})

const doShowFormModal = ref(false)
const editFormRef = ref()
const { confirm } = useModal()

const url = (import.meta.env.VITE_APP_BASE_URL as string).slice(0, -3)
const attachmentPaths = ref<string[]>([])
const rawAttachmentPaths = ref<string[]>([])

const getAssignment = (id: string) => {
  loading.value = true
  stores
    .getAssignment(id)
    .then((response) => {
      assignment.value = response
      if (assignment.value?.content == '<p><br></p>') {
        assignment.value.content = ''
      }
      if (assignment.value?.attachment) {
        attachmentPaths.value = JSON.parse(assignment.value.attachment)
        rawAttachmentPaths.value = JSON.parse(assignment.value.attachment)
        for (let i = 0; i < attachmentPaths.value.length; i++) {
          const parts = attachmentPaths.value[i].split('_')
          const newPart = parts.slice(1).join('_')
          // attachmentPaths.value[i] = `${url}${newPart}`
          attachmentPaths.value[i] = `${newPart}`
        }
      }
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('assignments.assignment')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const getClassById = async () => {
  loading.value = true
  classStores
    .getClassById(classId)
    .then((response) => {
      classById.value = response
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('classes.class')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const getAssignmentSubmissions = () => {
  loading.value = true
  stores
    .getAssignmentSubmissions({ assignmentId: assignmentId, classId: classId })
    .then((response) => {
      assignmentSubmissions.value = response
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('assignments.assignment')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const removeAssignmentFromClass = (assignmentClass: AssignmentClass) => {
  confirm({
    title: t('assignments.delete_assignment'),
    message: notifications.confirmDelete(t('assignments.assignment')),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    loading.value = true
    classStores
      .removeAssignmentFromClass(assignmentClass)
      .then(() => {
        router.push({ name: 'assignments' })
        notify({
          message: notifications.deleteSuccessfully(t('assignments.assignment')),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed(t('assignments.assignment')) + getErrorMessage(error),
          color: 'error',
        })
      })
      .finally(() => {
        loading.value = false
      })
  })
}

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

const onAssignmentContent = async (assignment: AssignmentContent) => {
  doShowFormModal.value = false
  if (assignment.id != '') {
    loading.value = true
    stores
      .updateAssignment(assignment.id, assignment as EmptyAssignmentContent)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(assignment.content),
          color: 'success',
        })
        getAssignment(assignment.id)
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed(assignment.content) + getErrorMessage(error),
          color: 'error',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const onAssignmentAttachment = async () => {
  if (assignmentId != '') {
    loading.value = true
    stores
      .updateAssignment(assignmentId, assignmentAttachment.value as AssignmentAttachment)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully(t('assignments.assignment')),
          color: 'success',
        })
        getAssignment(assignmentId)
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed(t('assignments.assignment')) + getErrorMessage(error),
          color: 'error',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const editAssignmentContent = (assContent: AssignmentContent) => {
  assignmentContent.value = assContent
  doShowFormModal.value = true
}

const fileUpload = async () => {
  fileStore
    .uploadFile(filesUploaded.value)
    .then((response) => {
      assignmentAttachment.value = {
        id: assignmentId,
        attachment: JSON.stringify(response),
      }
      // console.log('Assignment Attachment:', assignmentAttachment.value)
      onAssignmentAttachment()
      notify({
        message: notifications.uploadSuccess(),
        color: 'success',
      })
    })
    .catch((error) => {
      notify({
        message: notifications.uploadFailed() + getErrorMessage(error),
        color: 'error',
      })
    })
}

// Function to get the color class based on status
const getStatusColorClass = (status: string) => {
  if (status === MarkAssignmentStatus.Submitted) {
    return '#F59E0B' // Submitted - Green 500
  } else if (status === MarkAssignmentStatus.Doing) {
    return '#3B82F6' // Doing - Blue 500
  } else if (status === MarkAssignmentStatus.Marked) {
    return '#10B981' // Marked - Green 500
  } else if (status === MarkAssignmentStatus.NotSubmitted) {
    return '#EF4444' // Not Submitted - Red 500
  } else {
    return ''
  }
}

// Function to get the display text based on status
const getStatusText = (status: string) => {
  if (status === MarkAssignmentStatus.Marked) {
    return t('assignments.marked')
  } else if (status === MarkAssignmentStatus.NotSubmitted) {
    return t('assignments.not_submitted')
  } else if (status === MarkAssignmentStatus.Submitted) {
    return t('assignments.submitted')
  } else if (status === MarkAssignmentStatus.Doing) {
    return t('assignments.doing')
  } else {
    return ''
  }
}

const statusOrder = {
  Submitted: 1,
  Doing: 2,
  Marked: 3,
  NotSubmitted: 4,
}

const sortedStudents = computed(() => {
  return classById.value?.students.slice().sort((a, b) => {
    const statusA =
      (assignmentSubmissions.value.find((submission) => submission.studentId === a.id)
        ?.status as keyof typeof statusOrder) || MarkAssignmentStatus.NotSubmitted
    const statusB =
      (assignmentSubmissions.value.find((submission) => submission.studentId === b.id)
        ?.status as keyof typeof statusOrder) || MarkAssignmentStatus.NotSubmitted

    return statusOrder[statusA] - statusOrder[statusB]
  })
})

const canAssignmentManage = computed(() => {
  if (classById.value?.permissions === null || classById.value?.permissions === undefined) {
    return true
  }
  return classById.value?.permissions.some(
    (permission) => permission.permissionType === ClassPermission.AssignAssignment,
  )
})

watchEffect(() => {
  showSidebar.value = breakpoints.smUp
})

onMounted(() => {
  getClassById()
  getAssignment(assignmentId)
  getAssignmentSubmissions()
})
</script>
