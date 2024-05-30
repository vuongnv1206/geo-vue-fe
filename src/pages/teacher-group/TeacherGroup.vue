<template>
  <div class="flex flex-col md:flex-row">
    <div class="p-3 rounded mr-1 ml-1 mb-2" style="background-color: #fff">
      <TeacherGroupList @selectGroup="handleSelectedGroup" @selectTeacher="handleSelectedTeacher" />
    </div>
    <div style="width: 100%">
      <div class="item">
        <TeacherGroupDetail :group="selectedGroupTeacher" :teacher-id="selectedTeacher" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TeacherGroupList from './TeacherGroupList.vue'
import TeacherGroupDetail from './TeacherGroupDetail.vue'
import { ref } from 'vue'
import { GroupTeacher } from './types'

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
