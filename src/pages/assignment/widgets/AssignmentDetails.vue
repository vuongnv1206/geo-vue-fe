<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { Assignment } from '../types'
import { useBreakpoint, useToast } from 'vuestic-ui'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { format, notifications } from '@/services/utils'

dayjs.extend(utc)

const router = useRouter()
const stores = useAssignmentStore()
const breakpoints = useBreakpoint()
const { init: notify } = useToast()
const showSidebar = ref(breakpoints.smUp)
const assignment = ref<Assignment | null>(null)
const assignmentId = router.currentRoute.value.params.id.toString()

const getAssignment = (id: string) => {
  stores
    .getAssignment(id)
    .then((response) => {
      assignment.value = response
      if (assignment.value) {
        assignment.value.subjectName = response.subject.name
      }
    })
    .catch((error) => {
      console.log('Error:', error)
      notify({
        message: notifications.getFailed('assignment') + error.message,
        color: 'error',
      })
    })
}

const deleteAssignment = (assignmentId: string) => {
  stores
    .deleteAssignment(assignmentId)
    .then(() => {
      router.push({ name: 'assignments' })
    })
    .catch((error) => {
      notify({
        message:
          notifications.deleteFailed(assignment.value?.name ? assignment.value.name : 'assignment') + error.message,
        color: 'error',
      })
    })
}

watchEffect(() => {
  showSidebar.value = breakpoints.smUp
})

onMounted(() => {
  if (assignmentId) {
    getAssignment(assignmentId)
  }
})
</script>

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
      <VaNavbar class="py-1">
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
      <VaDivider />
    </template>
    <template #left>
      <VaSidebar v-model="showSidebar" style="margin-right: 5px">
        <VaCard v-if="assignment">
          <VaCard>
            <VaCardTitle>{{ assignment.name }}</VaCardTitle>
            <VaCardContent>
              Start Time: {{ assignment.startTime ? format.formatDate(assignment.startTime) : '' }}
            </VaCardContent>
            <VaCardContent>
              End Time: {{ assignment.endTime ? format.formatDate(assignment.endTime) : '' }}
            </VaCardContent>
          </VaCard>
          <VaCard>
            <VaCardTitle>Menu</VaCardTitle>
            <VaCard outlined style="margin-left: 15px; margin-right: 10px">
              <VaCardActions align="stretch" vertical>
                <VaButton
                  icon="edit"
                  preset="secondary"
                  :to="{ name: 'edit-assignment-details', params: { id: assignmentId } }"
                  style="justify-content: flex-start"
                  >Setting
                </VaButton>
                <VaButton
                  icon="delete"
                  preset="secondary"
                  style="justify-content: flex-start"
                  @click="deleteAssignment(assignmentId)"
                >
                  Delete</VaButton
                >
              </VaCardActions>
            </VaCard>
          </VaCard>
          <VaCard>
            <VaCardTitle>Attachment File</VaCardTitle>
            <VaCardContent>
              {{ assignment.attachmentPaths ? assignment.attachmentPaths : 'No attachment file' }}
            </VaCardContent>
          </VaCard>
          <VaCard>
            <VaCardTitle>Attachment File</VaCardTitle>
            <VaCardContent>
              {{ assignment.attachmentPaths ? assignment.attachmentPaths : 'No attachment file' }}
            </VaCardContent>
          </VaCard>
          <VaCard>
            <VaCardTitle>Content</VaCardTitle>
            <VaCardContent>
              {{ assignment.content ? assignment.content : 'Content is empty' }}
            </VaCardContent>
          </VaCard>
        </VaCard>
      </VaSidebar>
    </template>
    <template #content>
      <main class="p-4">
        <h3 class="va-h3">Page content</h3>
        <p>
          Page content must be wrapped in main tag. You must do it manually. Here you can place any blocks you need in
          your application.
        </p>

        <p>For example, you can place here your router view, add sidebar with navigation in #left slot.</p>
        <p>If you're using VaSidebar for page navigation don't forget to wrap it in nav tag.</p>
      </main>
    </template>
  </VaLayout>
</template>
