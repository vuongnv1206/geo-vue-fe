<template>
  <VaLayout class="bg-gray-100 min-h-screen">
    <template #top>
      <VaButton icon="va-arrow-left" preset="plainOpacity" class="m-4" @click="goBack" />
    </template>
    <template #content>
      <VaDivider />
      <VaForm ref="form" class="max-w-4xl mx-auto px-4 py-8">
        <VaCardTitle class="text-3xl font-bold mb-6">Create Assignment</VaCardTitle>
        <VaCard class="bg-white shadow-md rounded-lg p-6 space-y-6">
          <VaInput
            v-model="newAssignment.name"
            label="Name"
            placeholder="Enter assignment name"
            :rules="[validators.required2('Assignment name'), validators.maxLength(50)]"
            class="w-full"
          />

          <div>
            <VaCardTitle class="text-lg font-semibold text-gray-700 mb-2">Start and End Time</VaCardTitle>
            <VueDatePicker
              v-model="date"
              range
              model-auto
              :action-row="{ showNow: true }"
              :is-24="true"
              enable-seconds
              :clearable="true"
              :text-input="dateInputFormat"
              :month-change-on-scroll="true"
              :month-change-on-arrows="true"
              placeholder="Start choosing or typing date and time"
              class="w-full"
            />
          </div>

          <VaFileUpload
            v-model="filesUploaded"
            dropzone
            file-types="jpg,png,pdf"
            label="Attachment Path"
            class="w-full"
          />

          <div>
            <VaCardTitle class="text-lg font-semibold text-gray-700 mb-2">Content</VaCardTitle>
            <QuillEditor
              v-model:content="newAssignment.content"
              class="h-64 border rounded"
              theme="bubble"
              content-type="html"
            />
          </div>

          <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <VaSwitch v-model="newAssignment.canViewResult" size="small" label="Can View Result" />
            <VaSwitch v-model="newAssignment.requireLoginToSubmit" size="small" label="Require Login to Submit" />
          </div>

          <VaSelect
            v-model="newAssignment.subjectId"
            value-by="value"
            :options="subjects.map((subject) => ({ text: subject.name, value: subject.id }))"
            label="Subject"
            placeholder="Select a subject"
            clearable
            class="w-full"
          />

          <VaLayout class="border rounded-xl p-4">
            <template #left>
              <VaSidebar v-model="showSidebar" class="mt-2 rounded" :class="showSidebar ? 'border mr-4' : ''">
                <VaCard class="mb-4">
                  <VaInput placeholder="Search" class="w-full">
                    <template #appendInner>
                      <VaIcon color="secondary" class="material-icons">search</VaIcon>
                    </template>
                  </VaInput>
                </VaCard>
                <VaDivider />
                <VaScrollContainer class="max-h-80" vertical>
                  <div class="space-y-2">
                    <VaSidebarItem
                      class="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      @click="showAllClassesForAllDepartments"
                    >
                      All ({{ countAllSelectedClasses }}/{{ countAllClasses }})
                    </VaSidebarItem>
                    <div v-for="(groupClass, index) in groupClasses" :key="index">
                      <VaSidebarItem
                        class="cursor-pointer hover:bg-gray-100 p-2 rounded"
                        @click="showDepartmentClasses(groupClass)"
                      >
                        {{ groupClass.name }} ({{ countDepartmentSelectedClasses(groupClass) }}/{{
                          groupClass.classes.length
                        }})
                      </VaSidebarItem>
                    </div>
                  </div>
                </VaScrollContainer>
              </VaSidebar>
            </template>
            <template #content>
              <VaLayout class="mt-2 border rounded">
                <template #top>
                  <VaNavbar class="pt-1 pb-0 rounded">
                    <template #left>
                      <VaButton
                        preset="secondary"
                        :icon="showSidebar ? 'menu_open' : 'menu'"
                        @click="showSidebar = !showSidebar"
                      />
                    </template>
                    <template #right>
                      <VaCard class="flex">
                        <VaInput placeholder="Search" class="w-full">
                          <template #appendInner>
                            <VaIcon color="secondary" class="material-icons">search</VaIcon>
                          </template>
                        </VaInput>
                      </VaCard>
                    </template>
                  </VaNavbar>
                </template>
                <template #content>
                  <VaDivider />
                  <VaScrollContainer class="max-h-80 pb-0" vertical>
                    <VaCard class="p-4">
                      <div v-if="selectedDepartment">
                        <div v-if="selectedDepartment.classes.length > 0">
                          <VaCard class="flex flex-row items-center mb-4">
                            <VaCard class="mr-4 font-semibold">{{ selectedDepartment.name }}</VaCard>
                            <VaButton preset="secondary" size="small" @click="selectAllClasses(selectedDepartment)">
                              {{
                                selectedClassesByDepartmentState[selectedDepartment.id] ? 'Deselect All' : 'Select All'
                              }}
                            </VaButton>
                          </VaCard>
                          <VaCard class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                              v-for="(classItem, classIndex) in selectedDepartment.classes"
                              :key="classIndex"
                              class="flex items-center"
                            >
                              <input
                                :id="classItem.id"
                                v-model="selectedClasses"
                                type="checkbox"
                                :value="classItem.id"
                                class="mr-2"
                              />
                              <label :for="classItem.id" class="flex-grow">{{ classItem.name }}</label>
                              <VaChip v-if="currentUserId != classItem.ownerId" outline class="ml-2" size="small">
                                Share
                              </VaChip>
                            </div>
                          </VaCard>
                        </div>
                        <div v-else class="text-gray-500">No Class</div>
                      </div>
                      <div v-else>
                        <VaButton
                          preset="secondary"
                          size="small"
                          class="mb-4"
                          @click="selectAllClassesForAllDepartments"
                        >
                          {{ selectAllClassesState ? 'Deselect All' : 'Select All' }}
                        </VaButton>
                        <div v-for="groupClass in groupClasses" :key="groupClass.id" class="mb-6">
                          <VaCard v-if="groupClass.classes.length > 0" class="p-4">
                            <VaCard class="flex flex-row items-center mb-4">
                              <VaCard
                                class="cursor-pointer mr-4 font-semibold"
                                @click="showDepartmentClasses(groupClass)"
                              >
                                {{ groupClass.name }} ({{ countDepartmentSelectedClasses(groupClass) }}/{{
                                  groupClass.classes.length
                                }})
                              </VaCard>
                              <VaButton preset="secondary" size="small" @click="selectAllClasses(groupClass)">
                                {{ selectedClassesByDepartmentState[groupClass.id] ? 'Deselect All' : 'Select All' }}
                              </VaButton>
                            </VaCard>
                            <VaCard class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div
                                v-for="classItem in groupClass.classes"
                                :key="classItem.id"
                                class="flex items-center"
                              >
                                <input
                                  :id="classItem.id"
                                  v-model="selectedClasses"
                                  type="checkbox"
                                  :value="classItem.id"
                                  class="mr-2"
                                />
                                <label :for="classItem.id" class="flex-grow">{{ classItem.name }}</label>
                                <VaChip v-if="currentUserId != classItem.ownerId" outline class="ml-2" size="small">
                                  Share
                                </VaChip>
                              </div>
                            </VaCard>
                          </VaCard>
                        </div>
                      </div>
                    </VaCard>
                  </VaScrollContainer>
                </template>
              </VaLayout>
            </template>
          </VaLayout>
        </VaCard>
        <div class="flex justify-end flex-col-reverse sm:flex-row mt-6 gap-4">
          <VaButton preset="secondary" color="secondary" class="w-full sm:w-auto" @click="goBack">Cancel</VaButton>
          <VaButton type="submit" class="w-full sm:w-auto" @click="handleClickSave()">Save</VaButton>
        </div>
      </VaForm>
    </template>
  </VaLayout>
</template>
