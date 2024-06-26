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
    <template #left>
      <VaSidebar v-model="showSidebar" class="mr-2">
        <VaCard v-if="assignment">
          <VaCard>
            <VaCardTitle>{{ assignment.name }}</VaCardTitle>
            <VaCardContent> Start Time: {{ format.formatDate(assignment.startTime) }} </VaCardContent>
            <VaCardContent> End Time: {{ format.formatDate(assignment.endTime) }} </VaCardContent>
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
    </template>
    <template #content>
      <main class="p-4">
        <h3 class="text-xl font-bold">Page content</h3>
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

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { Assignment, AssignmentClass } from '../types'
import { useBreakpoint, useToast } from 'vuestic-ui'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { format, notifications } from '@/services/utils'
import { useClassStore } from '@/stores/modules/class.module'

dayjs.extend(utc)

const router = useRouter()
const stores = useAssignmentStore()
const classStores = useClassStore()
const breakpoints = useBreakpoint()
const { init: notify } = useToast()
const showSidebar = ref(breakpoints.smUp)
const assignment = ref<Assignment | null>(null)
const assignmentId = router.currentRoute.value.params.id.toString()
const classId = router.currentRoute.value.params.classId.toString()
const assignmentClass = ref<AssignmentClass>({
  assignmentId: assignmentId,
  classesdId: classId,
})

console.log('Assignment Class:', assignmentClass.value)
const getAssignment = (id: string) => {
  stores
    .getAssignment(id)
    .then((response) => {
      assignment.value = response
      // console.log('Assignment:', assignment.value)
    })
    .catch((error) => {
      console.log('Error:', error)
      notify({
        message: notifications.getFailed('assignment') + error.message,
        color: 'error',
      })
    })
}

const removeAssignmentFromClass = (assignmentClass: AssignmentClass) => {
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
  getAssignment(assignmentId)
})
</script>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
