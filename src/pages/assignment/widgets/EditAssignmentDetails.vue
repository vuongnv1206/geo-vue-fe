<script setup lang="ts">
import { useRouter } from 'vue-router'
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, onMounted, ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { notifications, validators } from '@/services/utils'
import { useForm, useModal, useToast } from 'vuestic-ui/web-components'
import { AssignmentDetails, EmptyAssignmentDetails } from '../types'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { GroupClass } from '@/pages/classrooms/types'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useAuthStore } from '@/stores/modules/auth.module'

const router = useRouter()
const { confirm } = useModal()
const { validate } = useForm('form')
const showSidebar = ref(false)
const { init: notify } = useToast()
const stores = useAssignmentStore()
const assignmentDetails = ref<AssignmentDetails | null>(null)
const assignmentId = router.currentRoute.value.params.id.toString()
const classId = router.currentRoute.value.params.classId.toString()

const date = ref<[Date, Date]>([new Date(), new Date()])
const authStore = useAuthStore()
const currentUserId = authStore.user?.id
const classStore = useGroupClassStore()
const groupClasses = ref<GroupClass[]>([])
const selectedClasses = ref<string[]>([])
const selectedDepartment = ref<GroupClass | null>(null)

const selectAllClassesState = ref(false)
const selectedClassesByDepartmentState = ref<{ [key: string]: boolean }>({})

const defaultNewAssignmentDetails: AssignmentDetails = {
  id: '',
  name: '',
  startTime: new Date(),
  endTime: new Date(),
  canViewResult: false,
  requireLoginToSubmit: false,
  classIds: [],
}

const newAssignmentDetails = ref({ ...defaultNewAssignmentDetails })

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})

const getAssignment = (id: string) => {
  stores
    .getAssignment(id)
    .then((response) => {
      assignmentDetails.value = response
      newAssignmentDetails.value = {
        id: response.id,
        name: response.name,
        startTime: response.startTime,
        endTime: response.endTime,
        canViewResult: response.canViewResult,
        requireLoginToSubmit: response.requireLoginToSubmit,
        classIds: response.classIds,
      }
      // console.log('Assignment Details: ', assignmentDetails.value)
      // console.log('New Assignment Details: ', newAssignmentDetails.value)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('assignments') + error.message,
        color: 'error',
      })
    })
}

const getGroupClass = () => {
  classStore
    .getGroupClasses(dataFilter.value)
    .then((response) => {
      groupClasses.value = response.data
      // console.log('Group Classes: ', groupClasses.value)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('group class') + error.message,
        color: 'error',
      })
    })
}

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

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newAssignmentDetails.value).some((key) => {
    return (
      newAssignmentDetails.value[key as keyof EmptyAssignmentDetails] !==
      assignmentDetails.value?.[key as keyof EmptyAssignmentDetails]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

const goBack = async () => {
  if (isFormHasUnsavedChanges.value) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: notifications.unsavedChanges,
      size: 'small',
    })
    if (!agreed) return
  }
  router.push({ name: 'assignment-details', params: { id: assignmentId, classId: classId } })
}

const dateInputFormat = {
  format: 'MM/dd/yyyy HH:mm',
}

const handleClickUpdate = async () => {
  if (validate()) {
    newAssignmentDetails.value.startTime = date.value[0]
    newAssignmentDetails.value.endTime = date.value[1]
    try {
      newAssignmentDetails.value.classIds = selectedClasses.value
      await stores.updateAssignment(assignmentId, newAssignmentDetails.value as EmptyAssignmentDetails)
      console.log('newAssignmentDetails.value: ', newAssignmentDetails.value)
      notify({ message: notifications.updatedSuccessfully(newAssignmentDetails.value.name), color: 'success' })
      router.push({ name: 'assignment-details', params: { id: assignmentId } })
    } catch (error) {
      notify({ message: notifications.updateFailed(newAssignmentDetails.value.name), color: 'error' })
    }
  }
}

onMounted(() => {
  getGroupClass()
  getAssignment(assignmentId)
})
</script>

<template>
  <VaLayout>
    <template #top>
      <VaButton icon="va-arrow-left" preset="plainOpacity" @click="goBack" />
    </template>
    <template #content>
      <VaDivider />
      <VaForm ref="form" class="gap-2 mx-auto" style="max-width: 900px">
        <VaCardTitle>Global Setting</VaCardTitle>
        <VaCard class="p-2 flex flex-col gap-2">
          <VaInput
            v-model="newAssignmentDetails.name"
            label="Name"
            placeholder="Enter assignment name"
            :rules="[validators.required2('Assignment name'), validators.maxLength(50)]"
          />
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
          />
          <VaSwitch v-model="newAssignmentDetails.canViewResult" size="small" label="Can View Result" />
          <VaSwitch v-model="newAssignmentDetails.requireLoginToSubmit" size="small" label="Require Login to Submit" />
          <VaLayout class="border rounded-xl pb-4 px-2">
            <template #left>
              <VaSidebar v-model="showSidebar" class="mt-2 mr-1 border rounded">
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
                    <VaSidebarItem class="cursor-pointer" @click="showAllClassesForAllDepartments">
                      All ({{ countAllSelectedClasses }}/{{ countAllClasses }})
                    </VaSidebarItem>
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
        </VaCard>
        <div class="flex flex-col-reverse sm:flex-row mt-4 gap-2 justify-end">
          <VaButton preset="secondary" color="secondary" @click="goBack()">Cancel</VaButton>
          <VaButton type="submit" @click="handleClickUpdate">Save</VaButton>
        </div>
      </VaForm>
    </template>
  </VaLayout>
</template>

<style lang="scss" scoped></style>
