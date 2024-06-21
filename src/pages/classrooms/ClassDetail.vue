<script lang="ts" setup>
import { ref } from 'vue'
import { UserInClass } from './type'
import UserInClassTable from './widgets/UserInClassTable.vue'
import News from './News.vue'

const activeElement = ref('List Students')
const listUserInClass = ref<UserInClass[]>([])
const loading = ref(true)

const addStudent = () => {}

const exportStudentList = () => {}
</script>

<template>
  <div class="main-container">
    <div class="sidebar-container">
      <VaSidebar class="sidebar">
        <VaAccordion>
          <VaSidebarItem
            :active="activeElement === 'List Students'"
            class="sidebar-item"
            @click="activeElement = 'List Students'"
          >
            <VaSidebarItemContent>
              <VaIcon name="groups" />
              <VaSidebarItemTitle>List Students</VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>

          <VaSidebarItem
            :active="activeElement === 'Assignments/Tests'"
            class="sidebar-item"
            @click="activeElement = 'Assignments/Tests'"
          >
            <VaSidebarItemContent>
              <VaIcon name="assignment_add" />
              <VaSidebarItemTitle>Assignments/Tests</VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>

          <VaSidebarItem :active="activeElement === 'News'" class="sidebar-item" @click="activeElement = 'News'">
            <VaSidebarItemContent>
              <VaIcon name="receipt_long" />
              <VaSidebarItemTitle>News</VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </VaAccordion>

        <VaSpacer />
      </VaSidebar>
    </div>

    <div class="content-container">
      <div v-if="activeElement === 'List Students'">
        <div class="header">
          <h1>HE1630</h1>
          <h3>(2024-2025)</h3>
        </div>

        <div class="actions">
          <VaInput placeholder="Search..." class="search-bar" />
          <div class="button-group">
            <VaButton color="primary" class="action-button" @click="addStudent">
              <VaIcon name="person_add" />
              <span>Add Student</span>
            </VaButton>
            <VaButton color="primary" class="action-button" @click="exportStudentList">
              <VaIcon name="system_update_alt" />
              <span>Export Student List</span>
            </VaButton>
          </div>
        </div>
        <div class="student-list">
          <UserInClassTable
            :user-in-class="listUserInClass"
            :loading="loading"
            @edit="addStudent"
            @delete="addStudent"
          />
        </div>
      </div>
      <div v-else-if="activeElement === 'Assignments/Tests'">
        <div class="header">
          <h1>Assignments/Tests</h1>
        </div>
      </div>
      <div v-else-if="activeElement === 'News'">
        <News />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  height: 80vh;
}

.sidebar-container {
  width: 250px;
}

.sidebar {
  background-color: #ffffff; /* White background for the sidebar */
  padding: 16px; /* Add some padding for spacing */
  border-right: 1px solid #e0e0e0; /* Subtle border to separate the sidebar */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add some shadow for depth */
}

.sidebar-item {
  border-radius: 8px; /* Rounded corners for sidebar items */
  transition: background-color 0.3s; /* Smooth transition for hover effect */
}

.sidebar-item:hover {
  background-color: #f1f1f1; /* Light grey hover effect */
}

.sidebar-item[aria-selected='true'] {
  background-color: #007bff; /* Blue background for the active item */
  color: white; /* White text for the active item */
}

.sidebar-item[aria-selected='true'] .va-icon,
.sidebar-item[aria-selected='true'] .va-sidebar-item-title {
  color: white; /* Ensure the icon and title are white for the active item */
}

.content-container {
  flex-grow: 1;
  padding: 0px 16px 16px 16px;
}

.header {
  display: flex;
  margin-bottom: 16px;
}

.header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  padding-right: 8px;
}
.header h3 {
  margin: 0;
  font-size: 15px;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px; /* Add some space below the actions container */
}

.search-bar {
  max-width: 300px;
  border-radius: 4px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto; /* Push the button group to the right */
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-button span {
  padding-left: 8px;
}
.student-list {
  margin-top: 16px; /* Add space above the student list */
  max-height: 60vh; /* Limit the height */
  overflow-y: auto; /* Add vertical scrollbar when content overflows */
}
</style>
