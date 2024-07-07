<template>
  <VaLayout>
    <VaButton icon="va-arrow-left" preset="plainOpacity" :to="{ name: 'assignments' }" />
  </VaLayout>
  <VaDivider />
  <VaLayout
    :top="{ order: 1 }"
    :left="{ absolute: breakpoints.smDown, order: 2, overlay: breakpoints.smDown && showSidebar }"
    @leftOverlayClick="showSidebar = false"
  >
    <template #top>
      <VaNavbar class="py-1 rounded">
        <template #left>
          <VaButton preset="secondary" :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar" />
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
          <VaCard>
            <VaCardTitle>{{ assignment.name }}</VaCardTitle>
            <VaCardContent>
              <VaIcon name="event" class="mr-1 material-symbols-outlined" /> Started at:
              {{ format.formatDate(assignment.startTime) }}
            </VaCardContent>
            <VaCardContent>
              <VaIcon name="event" class="mr-1 material-symbols-outlined" /> End Time:
              {{ format.formatDate(assignment.endTime) }}
            </VaCardContent>
          </VaCard>
          <VaCard>
            <VaCardTitle>Menu</VaCardTitle>
            <VaCard outlined class="mx-3">
              <VaCardActions align="stretch" vertical>
                <VaButton
                  icon="edit"
                  preset="secondary"
                  :to="{ name: 'edit-assignment-details', params: { id: assignmentId, classId: classId } }"
                  class="justify-start"
                  >Setting
                </VaButton>
                <VaButton
                  icon="delete"
                  preset="secondary"
                  class="justify-start"
                  @click="removeAssignmentFromClass(assignmentClass)"
                >
                  Delete</VaButton
                >
              </VaCardActions>
            </VaCard>
          </VaCard>
          <VaCard>
            <VaCardTitle>Attachment File</VaCardTitle>
            <VaCardContent>
              {{ attachmentPaths ? attachmentPaths : 'No attachment file' }}
            </VaCardContent>
          </VaCard>
          <VaCard>
            <VaCard class="flex flex-row justify-between">
              <VaCardTitle>Content</VaCardTitle>
              <VaButton
                class="pr-6"
                icon="edit"
                size="small"
                preset="plain"
                @click="editAssignmentContent(assignment)"
              />
            </VaCard>
            <VaCardContent>
              <!-- eslint-disable vue/no-v-html -->
              <div v-html="assignment.content ? assignment.content : 'Content is empty'" />
              <!--eslint-enable-->
            </VaCardContent>
          </VaCard>
        </VaCard>
      </VaCard>
    </template>

    <template #content>
      <VaCard class="mt-2 p-2 min-h-[75vh]">
        <VaList class="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <VaListItem v-for="student in students" :key="student.id" class="border rounded p-4">
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
              <VaListItemLabel caption> đã nộp/chưa nôp </VaListItemLabel>
            </VaListItemSection>
          </VaListItem>
        </VaList>
      </VaCard>
    </template>
  </VaLayout>

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
    <h1 class="va-h5 mb-4">Edit Content</h1>
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
import { onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { Assignment, AssignmentClass, AssignmentContent, EmptyAssignmentContent } from '../types'
import { useBreakpoint, useModal, useToast, VaCard, VaList, VaListItemSection } from 'vuestic-ui'
import { format, getErrorMessage, notifications } from '@/services/utils'
import { useClassStore } from '@/stores/modules/class.module'
import EditAssignmentContent from './EditAssignmentContent.vue'
import { Student } from '@/pages/classrooms/types'
import GeoAvatar from '@/components/avatar/GeoAvatar.vue'

const loading = ref(true)
const router = useRouter()
const stores = useAssignmentStore()
const classStores = useClassStore()
const breakpoints = useBreakpoint()
const { init: notify } = useToast()
const showSidebar = ref(breakpoints.smUp)
const assignment = ref<Assignment | null>(null)
const assignmentContent = ref<AssignmentContent | null>(null)
const students = ref<Student[]>([])
const assignmentId = router.currentRoute.value.params.id.toString()
const classId = router.currentRoute.value.params.classId.toString()
const assignmentClass = ref<AssignmentClass>({
  assignmentId: assignmentId,
  classesdId: classId,
})
const doShowFormModal = ref(false)
const editFormRef = ref()
const { confirm } = useModal()

const url = (import.meta.env.VITE_APP_BASE_URL as string).slice(0, -3)
const attachmentPaths = ref<string[]>([])

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
        for (let i = 0; i < attachmentPaths.value.length; i++) {
          const parts = attachmentPaths.value[i].split('_')
          const newPart = parts.slice(1).join('_')
          attachmentPaths.value[i] = `${url}${newPart}`
        }
      }
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('assignment') + getErrorMessage(error),
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
      students.value = response.students
      // console.log('Students:', students.value)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(`class with id ${classId}`) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const removeAssignmentFromClass = (assignmentClass: AssignmentClass) => {
  confirm({
    title: 'Delete Assignment',
    message: notifications.confirmDelete('assignment'),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    classStores
      .removeAssignmentFromClass(assignmentClass)
      .then(() => {
        router.push({ name: 'assignments' })
        notify({
          message: notifications.deleteSuccessfully('assignment'),
          color: 'success',
        })
      })
      .catch((error) => {
        notify({
          message: notifications.deleteFailed('assignment') + getErrorMessage(error),
          color: 'error',
        })
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
  console.log('Assignment content:', assignment)
  doShowFormModal.value = false
  if (assignment.id != '') {
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
  }
}

const editAssignmentContent = (assContent: AssignmentContent) => {
  assignmentContent.value = assContent
  doShowFormModal.value = true
}

watchEffect(() => {
  showSidebar.value = breakpoints.smUp
})

onMounted(() => {
  getClassById()
  getAssignment(assignmentId)
})
</script>
