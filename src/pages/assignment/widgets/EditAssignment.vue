<script setup lang="ts">
import { GroupClass } from '@/pages/classrooms/type'
import { notifications, validators } from '@/services/utils'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useSubjectStore } from '@/stores/modules/subject.module'
import { Subject } from '@pages/subject/types'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { computed, onMounted, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useModal, useToast } from 'vuestic-ui/web-components'
import { Attachment, EmptyAssignment } from '../types'

dayjs.extend(utc)
const { init: notify } = useToast()
const { confirm } = useModal()
const router = useRouter()
const showSidebar = ref(false)
const { validate } = useForm('form')
const subjects = ref<Subject[]>([])
const classStore = useGroupClassStore()
const groupClasses = ref<GroupClass[]>([])
const assignmentStore = useAssignmentStore()
const subjectStore = useSubjectStore()
const filesUploaded = ref<File[]>([])
const date = ref<[Date, Date]>([new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 0, 0))])
const selectedClasses = ref<string[]>([])
const selectedDepartment = ref<GroupClass | null>(null)
const authStore = useAuthStore()
const currentUserId = authStore.user?.id

const selectAllClassesState = ref(false)
const selectedClassesByDepartmentState = ref<{ [key: string]: boolean }>({})

const defaultNewAssignment: EmptyAssignment = {
  name: '',
  startTime: null,
  endTime: null,
  content: '',
  canViewResult: false,
  requireLoginToSubmit: false,
  subjectId: '',
  attachmentPaths: [] as Attachment[],
  classIds: [] as string[],
}
const newAssignment = ref({ ...defaultNewAssignment })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newAssignment.value).some((key) => {
    return (
      toRaw(newAssignment.value)[key as keyof EmptyAssignment] !== defaultNewAssignment[key as keyof EmptyAssignment]
    )
  })
})

const goBack = async () => {
  console.log('Unsaved changes: ', isFormHasUnsavedChanges.value)
  if (isFormHasUnsavedChanges.value) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'You have unsaved changes. Are you sure you want to discard them?',
      size: 'small',
    })
    if (agreed) {
      router.push({ name: 'assignments' })
    } else {
      return
    }
  }
  router.push({ name: 'assignments' })
}

defineExpose({
  isFormHasUnsavedChanges,
})

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})

const getGroupClass = async () => {
  try {
    const response = await classStore.getGroupClasses(dataFilter.value)
    groupClasses.value = response.data
    console.log('Group Classes: ', groupClasses.value)
  } catch (error) {
    console.error('Error fetching subjects:', error)
  }
}

// Fetch subjects from the store
const getSubjects = async () => {
  try {
    const response = await subjectStore.getSubjects(dataFilter.value)
    subjects.value = response.data
  } catch (error) {
    console.error('Error fetching subjects:', error)
  }
}

// Computed property to format subjects for select options
const subjectsOptions = computed(() => {
  return subjects.value.map((subject) => ({ text: subject.name, value: subject.id }))
})

const showAllClassesForAllDepartments = () => {
  selectedDepartment.value = null
  // selectedClasses.value = []
}

// Select all classes in a department
const selectAllClasses = (department: GroupClass) => {
  const selectedClassIds = selectedClasses.value

  // Kiểm tra xem tất cả các lớp trong phòng ban đã được chọn chưa
  const allClassesSelected = department.classes.every((cls) => selectedClassIds.includes(cls.id))

  if (allClassesSelected) {
    // Nếu tất cả các lớp đã được chọn, hãy bỏ chọn chúng
    selectedClasses.value = selectedClassIds.filter((id) => !department.classes.some((cls) => cls.id === id))
    selectedClassesByDepartmentState.value[department.id] = false
  } else {
    // Nếu không, hãy thêm tất cả các lớp vào danh sách chọn
    const newClassIds = department.classes.map((cls) => cls.id)
    selectedClasses.value = [...new Set([...selectedClassIds, ...newClassIds])]
    selectedClassesByDepartmentState.value[department.id] = true
  }
}

const showDepartmentClasses = (groupClass: GroupClass) => {
  selectedDepartment.value = groupClass
  // selectedClasses.value = []
}

// Select all classes across all departments
const selectAllClassesForAllDepartments = () => {
  if (selectAllClassesState.value) {
    selectedClasses.value = []
  } else {
    selectedClasses.value = groupClasses.value.flatMap((department) => department.classes.map((cls) => cls.id))
  }
  selectAllClassesState.value = !selectAllClassesState.value
}

const countAllSelectedClasses = computed(() => {
  return selectedClasses.value.length
})

const countAllClasses = computed(() => {
  return groupClasses.value.reduce((total, department) => total + department.classes.length, 0)
})

const countDepartmentSelectedClasses = (groupClass: GroupClass) => {
  const selectedClassesInDepartment = groupClass.classes.filter((cls) => selectedClasses.value.includes(cls.id))
  return selectedClassesInDepartment.length
}
const dateInputFormat = {
  format: 'MM/dd/yyyy HH:mm',
}
const handleDatePicker = () => {
  newAssignment.value.startTime = dayjs.utc(date.value[0]).utcOffset(0, true).toDate()
  newAssignment.value.endTime = dayjs.utc(date.value[1]).utcOffset(0, true).toDate()
}
const handleAttachment = async () => {
  const files = filesUploaded.value
  newAssignment.value.attachmentPaths = await Promise.all(
    files.map((file) => {
      return new Promise<Attachment>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64Data = reader.result?.toString() ?? ''
          resolve({
            name: file.name,
            extension: file.type.split('/')[1],
            data: base64Data,
          })
        }
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })
    }),
  )
}

const handleClickSave = async () => {
  if (validate()) {
    handleDatePicker()
    handleAttachment()
    try {
      newAssignment.value.classIds = selectedClasses.value
      await assignmentStore.createAssignment(newAssignment.value as EmptyAssignment)
      console.log('New Assignment: ', newAssignment.value)
      notify({ message: notifications.createSuccessfully(newAssignment.value.name), color: 'success' })
      router.push({ name: 'assignments' })
    } catch (error) {
      notify({ message: notifications.createFailed(newAssignment.value.name), color: 'error' })
    }
  }
}

onMounted(() => {
  getSubjects()
  getGroupClass()
})
</script>

<template>
  <VaLayout>
    <template #top>
      <VaButton icon="va-arrow-left" preset="plainOpacity" @click="goBack" />
    </template>
    <template #content>
      <VaDivider />
      <VaForm ref="form" class="flex flex-col gap-4 mx-auto" style="max-width: 900px">
        <VaCardTitle>Create Assignment</VaCardTitle>
        <VaInput v-model="newAssignment.name" label="Name" :rules="[validators.required, validators.maxLength(50)]" />
        <VueDatePicker
          v-model="date"
          label="Time To Do"
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
        />
        <VaFileUpload v-model="filesUploaded" dropzone file-types="jpg,png,pdf" label="Attachment Path" />
        <VaInput v-model="newAssignment.content" label="Content" />
        <VaSwitch v-model="newAssignment.canViewResult" size="small" label="Can View Result" />
        <VaSwitch v-model="newAssignment.requireLoginToSubmit" size="small" label="Require Login to Submit" />
        <VaSelect
          v-model="newAssignment.subjectId"
          value-by="value"
          :options="subjectsOptions"
          label="Subject"
          clearable
          :rules="[(v) => (v ? true : 'Please select a subject.')]"
        />
        <VaLayout>
          <template #left>
            <VaSidebar v-model="showSidebar">
              <VaCard class="mt-1 mx-1">
                <VaInput placeholder="Search">
                  <template #appendInner>
                    <VaIcon color="secondary" class="material-icons"> search </VaIcon>
                  </template>
                </VaInput>
              </VaCard>
              <VaDivider />
              <VaScrollContainer class="max-h-80" vertical>
                <div class="mx-1">
                  <VaSidebarItem class="cursor-pointer" @click="showAllClassesForAllDepartments"
                    >All ({{ countAllSelectedClasses }}/{{ countAllClasses }})</VaSidebarItem
                  >
                  <div v-for="(groupClass, index) in groupClasses" :key="index">
                    <VaSidebarItem class="cursor-pointer" @click="showDepartmentClasses(groupClass)"
                      >{{ groupClass.name }} ({{ countDepartmentSelectedClasses(groupClass) }}/{{
                        groupClass.classes.length
                      }})
                    </VaSidebarItem>
                  </div>
                </div>
              </VaScrollContainer>
            </VaSidebar>
          </template>
          <template #content>
            <VaLayout>
              <template #top>
                <VaNavbar class="py-1">
                  <template #left>
                    <VaButton
                      preset="secondary"
                      :icon="showSidebar ? 'menu_open' : 'menu'"
                      @click="showSidebar = !showSidebar"
                    />
                  </template>
                  <template #right>
                    <div class="flex">
                      <VaInput placeholder="Search">
                        <template #appendInner>
                          <VaIcon color="secondary" class="material-icons"> search </VaIcon>
                        </template>
                      </VaInput>
                    </div>
                  </template>
                </VaNavbar>
              </template>
              <template #content>
                <VaDivider />
                <VaScrollContainer class="max-h-80" vertical>
                  <VaCard class="pb-2 pl-2">
                    <div v-if="selectedDepartment">
                      <div v-if="selectedDepartment.classes.length > 0">
                        <VaCard class="flex flex-row">
                          <VaCard class="mr-1">{{ selectedDepartment.name }}</VaCard>
                          <VaButton preset="secondary" size="small" @click="selectAllClasses(selectedDepartment)">
                            {{
                              selectedClassesByDepartmentState[selectedDepartment.id] ? 'Deselect All' : 'Select All'
                            }}
                          </VaButton>
                        </VaCard>
                        <VaCard class="grid grid-cols-2 lg:grid-cols-2 gap-1">
                          <div v-for="(classItem, classIndex) in selectedDepartment.classes" :key="classIndex">
                            <input
                              :id="classItem.id"
                              v-model="selectedClasses"
                              type="checkbox"
                              :value="classItem.id"
                              class="mr-1"
                            />
                            <label :for="classItem.id">{{ classItem.name }}</label>
                            <VaChip v-if="currentUserId != classItem.ownerId" outline class="ml-2" size="small">
                              Share
                            </VaChip>
                          </div>
                        </VaCard>
                      </div>
                      <div v-else>No Class</div>
                    </div>
                    <div v-else>
                      <VaButton preset="secondary" size="small" @click="selectAllClassesForAllDepartments">
                        {{ selectAllClassesState ? 'Deselect All' : 'Select All' }}
                      </VaButton>
                      <div v-for="groupClass in groupClasses" :key="groupClass.id">
                        <VaCard v-if="groupClass.classes.length > 0">
                          <VaCard class="flex flex-row">
                            <VaCard class="cursor-pointer" @click="showDepartmentClasses(groupClass)"
                              >{{ groupClass.name }} ({{ countDepartmentSelectedClasses(groupClass) }}/{{
                                groupClass.classes.length
                              }})
                            </VaCard>
                            <VaButton preset="secondary" size="small" @click="selectAllClasses(groupClass)">
                              {{ selectedClassesByDepartmentState[groupClass.id] ? 'Deselect All' : 'Select All' }}
                            </VaButton>
                          </VaCard>
                          <VaCard class="grid grid-cols-2 lg:grid-cols-2 gap-1">
                            <div v-for="classItem in groupClass.classes" :key="classItem.id">
                              <input
                                :id="classItem.id"
                                v-model="selectedClasses"
                                type="checkbox"
                                :value="classItem.id"
                                class="mr-1"
                              />
                              <label :for="classItem.id">{{ classItem.name }}</label>
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
        <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
          <VaButton preset="secondary" color="secondary" @click="goBack">Cancel</VaButton>
          <VaButton type="submit" @click="handleClickSave()">Save</VaButton>
        </div>
      </VaForm>
    </template>
  </VaLayout>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
