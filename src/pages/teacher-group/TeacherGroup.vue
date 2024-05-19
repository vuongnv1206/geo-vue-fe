<template>
  <div class="flex flex-col md:flex-row">
    <div class="p-3 rounded mr-1 ml-1 mb-2" style="background-color: #fff">
      <TeacherGroupList />
    </div>
    <div style="width: 100%">
      <div class="item">
        <TeacherGroupDetail />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TeacherGroupList from './TeacherGroupList.vue'
import TeacherGroupDetail from './TeacherGroupDetail.vue'
</script>
