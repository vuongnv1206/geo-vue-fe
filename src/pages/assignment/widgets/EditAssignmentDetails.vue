<template>
  <VaLayout>
    <template #top>
      <VaButton icon="va-arrow-left" preset="plainOpacity" @click="goBack" />
    </template>
    <template #content>
      <VaDivider />
      <VaForm ref="form" class="max-w-4xl mx-auto px-4">
        <VaCardTitle> {{ $t('assignments.global_settings') }}</VaCardTitle>
        <VaCard class="p-2 flex flex-col gap-2">
          <VaInput
            v-model="newAssignmentDetails.name"
            :label="$t('assignments.name')"
            :placeholder="$t('assignments.enter_name')"
            :rules="[validators.required2($t('assignments.name')), validators.maxLength(50)]"
          />
          <label
            id="input-label-510"
            aria-hidden="true"
            class="va-input-label va-input-wrapper__label va-input-wrapper__label--outer"
            style="color: var(--va-primary)"
          >
            {{ $t('assignments.start_and_end_time') }}
          </label>
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
            :placeholder="$t('assignments.enter_start_and_end_time')"
            :min-date="new Date(new Date().setHours(0, 0, 0, 0))"
          />
          <VaSwitch
            v-model="newAssignmentDetails.canViewResult"
            size="small"
            :label="$t('assignments.can_view_result')"
          />
          <!-- <VaSwitch
            v-model="newAssignmentDetails.requireLoginToSubmit"
            size="small"
            :label="$t('assignments.require_login_to_submit')"
          /> -->
          <VaLayout class="border rounded-xl pb-2 px-2">
            <template #left>
              <VaSidebar v-model="showSidebar" class="mt-2 rounded" :class="showSidebar ? 'border mr-1' : ''">
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
                      {{ $t('assignments.all') }} ({{ countAllSelectedClasses }}/{{ countAllClasses }})
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
                                selectedClassesByDepartmentState[selectedDepartment.id]
                                  ? $t('assignments.deselect_all')
                                  : $t('assignments.select_all')
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
                                {{ $t('assignments.share') }}
                              </VaChip>
                            </div>
                          </VaCard>
                        </div>
                        <div v-else>No Class</div>
                      </div>
                      <div v-else>
                        <VaButton preset="secondary" size="small" @click="selectAllClassesForAllDepartments">
                          {{ selectAllClassesState ? $t('assignments.deselect_all') : $t('assignments.select_all') }}
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
                                {{
                                  selectedClassesByDepartmentState[groupClass.id]
                                    ? $t('assignments.deselect_all')
                                    : $t('assignments.select_all')
                                }}
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
                                  {{ $t('assignments.share') }}
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
          <VaButton preset="secondary" color="secondary" @click="goBack()">{{ $t('settings.cancel') }}</VaButton>
          <VaButton type="submit" @click="handleClickUpdate">{{ $t('settings.save') }}</VaButton>
        </div>
      </VaForm>
    </template>
  </VaLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, onMounted, ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { getErrorMessage, notifications, validators } from '@/services/utils'
import { useForm, useModal, useToast } from 'vuestic-ui'
import { AssignmentDetails, EmptyAssignmentDetails } from '../types'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { GroupClass } from '@/pages/classrooms/types'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('assignments.assignment')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

const getGroupClass = () => {
  classStore
    .getGroupClasses(dataFilter.value)
    .then((response) => {
      groupClasses.value = response.data
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('groupClasses.group_class')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

const showAllClassesForAllDepartments = () => {
  selectedDepartment.value = null
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

  // Cập nhật trạng thái tổng thể nếu tất cả các department đều được chọn
  updateSelectAllClassesState()
}

const updateSelectAllClassesState = () => {
  groupClasses.value.forEach((department) => {
    const allClassesSelected = department.classes.every((cls) => selectedClasses.value.includes(cls.id))
    selectedClassesByDepartmentState.value[department.id] = allClassesSelected
  })

  // Cập nhật trạng thái tổng thể nếu tất cả các department đều được chọn
  selectAllClassesState.value = groupClasses.value.every((department) =>
    department.classes.every((cls) => selectedClasses.value.includes(cls.id)),
  )
}

// Gọi phương thức theo dõi khi chọn tay từng class
watch(selectedClasses, updateSelectAllClassesState, { deep: true })

const showDepartmentClasses = (groupClass: GroupClass) => {
  selectedDepartment.value = groupClass
}

// Select all classes across all departments
const selectAllClassesForAllDepartments = () => {
  if (selectAllClassesState.value) {
    selectedClasses.value = []
    groupClasses.value.forEach((department: GroupClass) => {
      selectedClassesByDepartmentState.value[department.id] = false
    })
  } else {
    selectedClasses.value = groupClasses.value.flatMap((department: GroupClass) =>
      department.classes.map((cls: any) => cls.id),
    )
    groupClasses.value.forEach((department: GroupClass) => {
      selectedClassesByDepartmentState.value[department.id] = true
    })
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
