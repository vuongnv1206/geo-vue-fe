<template>
  <VaLayout
    :top="{ order: 1 }"
    class="gap-2"
    :left="{ absolute: breakpoints.smDown, order: 2, overlay: breakpoints.smDown && isSidebarVisibleChild }"
    @leftOverlayClick="isSidebarVisibleChild = false"
  >
    <template #top>
      <VaNavbar class="py-2 rounded">
        <template #left>
          <VaButton
            size="small"
            :icon="isSidebarVisibleChild ? 'menu_open' : 'menu'"
            @click="isSidebarVisibleChild = !isSidebarVisibleChild"
          />
        </template>
      </VaNavbar>
    </template>
    <template #left>
      <TeacherGroupList
        v-if="isSidebarVisibleChild"
        class="max-h-[calc(100vh-64px)] overflow-y-auto"
        @selectGroup="handleSelectedGroup"
        @selectTeacher="handleSelectedTeacher"
      />
    </template>
    <template #content>
      <TeacherGroupDetail
        class="max-h-[calc(100vh-64px)] overflow-y-auto"
        :group="selectedGroupTeacher"
        :teacher-id="selectedTeacher"
      />
    </template>
  </VaLayout>
</template>

<script lang="ts" setup>
import TeacherGroupList from './TeacherGroupList.vue'
import TeacherGroupDetail from './TeacherGroupDetail.vue'
import { ref, watchEffect } from 'vue'
import { GroupTeacher } from './types'
import { useBreakpoint } from 'vuestic-ui'

const breakpoints = useBreakpoint()

const isSidebarVisibleChild = ref(breakpoints.smUp)

watchEffect(() => {
  isSidebarVisibleChild.value = breakpoints.smUp
})
const selectedGroupTeacher = ref<GroupTeacher | null>(null)
const selectedTeacher = ref<string | null>(null)

function handleSelectedGroup(group: GroupTeacher) {
  selectedGroupTeacher.value = group
  selectedTeacher.value = null
}

function handleSelectedTeacher(teacherId: string) {
  selectedTeacher.value = teacherId
  selectedGroupTeacher.value = null
}
</script>
