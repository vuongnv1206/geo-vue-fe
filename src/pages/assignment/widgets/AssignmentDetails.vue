<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { Assignment } from '../types'
import { useBreakpoint, useToast } from 'vuestic-ui'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const router = useRouter()
const stores = useAssignmentStore()
const breakpoints = useBreakpoint()
const { init: notify } = useToast()
const showSidebar = ref(breakpoints.smUp)
const assignment = ref<Assignment | null>(null)
const assignmentId = router.currentRoute.value.params.id

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
        message: 'Failed to get assignment',
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
      console.log('Error:', error)
      notify({
        message: 'Failed to delete assignment',
        color: 'error',
      })
    })
}

const goToEdit = () => {
  router.push({ name: 'edit-assignment-details', params: { id: assignmentId } })
}

watchEffect(() => {
  showSidebar.value = breakpoints.smUp
})

function formatDate(dateString: Date) {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}
// const goBack = () => {
//   router.push({ name: 'assignments' })
// }

const handleDelete = () => {
  if (assignmentId) {
    deleteAssignment(assignmentId.toString())
  }
}
onMounted(() => {
  if (assignmentId) {
    getAssignment(assignmentId.toString())
  }
})
</script>

<template>
  <VaLayout
    :top="{ order: 1 }"
    :left="{ absolute: breakpoints.smDown, order: 2, overlay: breakpoints.smDown && showSidebar }"
    @leftOverlayClick="showSidebar = false"
  >
    <template #top>
      <VaNavbar>
        <template #left>
          <VaButton preset="secondary" :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar" />
        </template>
        <template #right>
          <div class="flex mt-2">
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
      <VaDivider style="margin: 0" />
    </template>
    <template #left>
      <VaSidebar v-model="showSidebar" width="300px">
        <VaCard v-if="assignment">
          <VaCardContent>
            <div>
              <strong>{{ assignment.name }}</strong>
            </div>
            <div>
              <p>Start Time: {{ assignment.startTime ? formatDate(assignment.startTime) : '' }}</p>
              <p>End Time: {{ assignment.endTime ? formatDate(assignment.endTime) : '' }}</p>
            </div>
            <div>
              <strong>Menu</strong>
            </div>
            <div>
              <VaButton @click="goToEdit">Setting</VaButton>
            </div>
            <div>
              <VaButton @click="handleDelete">Delete</VaButton>
            </div>
            <div>
              <strong>Attachment File</strong>
            </div>
            <div>
              {{ assignment.attachmentPaths ? assignment.attachmentPaths : 'No attachment file' }}
            </div>
            <div>
              <strong>Content</strong>
            </div>
            <div>
              {{ assignment.content ? assignment.content : 'Content is empty' }}
            </div>
          </VaCardContent>
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
