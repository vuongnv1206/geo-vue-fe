<template>
  <VaLayout>
    <template #top>
      <VaButton icon="va-arrow-left" preset="plainOpacity" @click="goBack" />
    </template>
    <template #content>
      <VaDivider />
      <VaForm ref="form" class="max-w-4xl mx-auto px-4">
        <VaCardTitle>{{ $t('assignments.create_assignment') }}</VaCardTitle>
        <VaCard class="p-2 flex flex-col gap-2">
          <VaInput
            v-model="newAssignment.name"
            :label="$t('assignments.name')"
            :placeholder="$t('assignments.enter_name')"
            :rules="[validators.required2($t('assignments.enter_name')), validators.maxLength(50)]"
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
            :min-time="{
              hours: new Date().getHours(),
              minutes: new Date().getMinutes(),
            }"
          />
          <VaFileUpload
            v-model="filesUploaded"
            dropzone
            :label="$t('assignments.attachments')"
            :upload-button-text="$t('file_upload.upload_button_text')"
            :drop-zone-text="$t('file_upload.drop_zone_text')"
            file-types="jpg,png,jpeg,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,7z,mp4,avi,mkv,
            flv,wmv,mov,webm,mp3,wav,flac,ogg,wma,json,xml,csv,tsv"
            @fileAdded="fileUpload"
          />
          <VaCard>
            <label
              id="input-label-510"
              aria-hidden="true"
              class="va-input-label va-input-wrapper__label va-input-wrapper__label--outer"
              style="color: var(--va-primary)"
            >
              {{ $t('assignments.content') }}
            </label>
            <QuillEditor
              v-model:content="newAssignment.content"
              class="h-25 border rounded"
              :placeholder="$t('assignments.enter_content')"
              content-type="html"
            />
          </VaCard>
          <VaSwitch v-model="newAssignment.canViewResult" size="small" :label="$t('assignments.can_view_result')" />
          <!-- <VaSwitch
            v-model="newAssignment.requireLoginToSubmit"
            size="small"
            :label="$t('assignments.require_login_to_submit')"
          /> -->
          <VaSelect
            v-model="newAssignment.subjectId"
            value-by="value"
            :options="subjects.map((subject) => ({ text: subject.name, value: subject.id }))"
            :label="$t('subjects.subject')"
            :placeholder="$t('subjects.select_subject')"
            clearable
            loading
            :rules="[(v: any) => (Array.isArray(v) && v.length >= 1) || t('subjects.select_subject')]"
          />
          <VaLayout class="border rounded-xl pb-2 px-2">
            <template #left>
              <VaSidebar v-model="showSidebar" class="mt-2 rounded" :class="showSidebar ? 'border mr-1' : ''">
                <VaCard class="mt-1 mx-1">
                  <VaInput placeholder="Search">
                    <template #appendInner>
                      <VaIcon color="secondary" class="material-icons">search</VaIcon>
                    </template>
                  </VaInput>
                </VaCard>
                <VaDivider />
                <VaScrollContainer class="max-h-80" vertical>
                  <div class="mx-1">
                    <VaSidebarItem class="cursor-pointer" @click="showAllClassesForAllDepartments">
                      {{ $t('assignments.all') }} ({{ countAllSelectedClasses }}/{{ countAllClasses }})</VaSidebarItem
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
                        <VaInput placeholder="Search">
                          <template #appendInner>
                            <VaIcon color="secondary" class="material-icons"> search </VaIcon>
                          </template>
                        </VaInput>
                      </VaCard>
                    </template>
                  </VaNavbar>
                </template>
                <template #content>
                  <VaDivider />
                  <VaScrollContainer class="max-h-80 pb-0" vertical>
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
                        <div v-else>
                          {{ $t('classes.no_class') }}
                        </div>
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
        <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
          <VaButton preset="secondary" color="secondary" @click="goBack">{{ $t('settings.cancel') }}</VaButton>
          <VaButton type="submit" @click="handleClickSave()">{{ $t('settings.save') }}</VaButton>
        </div>
      </VaForm>
    </template>
  </VaLayout>
</template>

<script setup lang="ts">
import { EmptyAssignment } from '../types'
import { Subject } from '@pages/subject/types'
import { GroupClass } from '@/pages/classrooms/types'

import { useFileStore } from '@/stores/modules/file.module'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useSubjectStore } from '@/stores/modules/subject.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { getErrorMessage, notifications, validators } from '@/services/utils'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import { computed, onMounted, ref, toRaw, watch } from 'vue'
import { useForm, useModal, useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const { confirm } = useModal()
const { init: notify } = useToast()
const { validate } = useForm('form')

const showSidebar = ref(false)
const filesUploaded = ref<any>()

const authStore = useAuthStore()
const fileStore = useFileStore()
const classStore = useGroupClassStore()
const subjectStore = useSubjectStore()
const assignmentStore = useAssignmentStore()

const subjects = ref<Subject[]>([])
const groupClasses = ref<GroupClass[]>([])

const selectedClasses = ref<string[]>([])
const selectedDepartment = ref<GroupClass | null>(null)
const selectAllClassesState = ref(false)
const selectedClassesByDepartmentState = ref<{ [key: string]: boolean }>({})

const currentUserId = authStore.user?.id
const date = ref<[Date, Date]>([new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 0, 0))])

const defaultNewAssignment: EmptyAssignment = {
  name: '',
  startTime: null,
  endTime: null,
  content: '',
  canViewResult: false,
  requireLoginToSubmit: false,
  subjectId: '',
  attachment: '',
  classesId: [] as string[],
}
const newAssignment = ref({ ...defaultNewAssignment })

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 0,
  pageSize: 100,
  orderBy: ['id'],
})

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

const getSubjects = () => {
  subjectStore
    .getSubjects(dataFilter.value)
    .then((response) => {
      subjects.value = response.data
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('subjects.subject')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

const fileUpload = async () => {
  fileStore
    .uploadFile(filesUploaded.value)
    .then((response) => {
      newAssignment.value.attachment = JSON.stringify(response)
      notify({
        message: notifications.uploadSuccess(),
        color: 'success',
      })
    })
    .catch((error) => {
      notify({
        message: notifications.uploadFailed() + getErrorMessage(error),
        color: 'error',
      })
    })
}

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newAssignment.value).some((key) => {
    return (
      toRaw(newAssignment.value)[key as keyof EmptyAssignment] !== defaultNewAssignment[key as keyof EmptyAssignment]
    )
  })
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
  router.push({ name: 'assignments' })
}

const showAllClassesForAllDepartments = () => {
  selectedDepartment.value = null
}

const selectAllClasses = (department: GroupClass) => {
  const selectedClassIds = selectedClasses.value

  const allClassesSelected = department.classes.every((cls) => selectedClassIds.includes(cls.id))

  if (allClassesSelected) {
    selectedClasses.value = selectedClassIds.filter((id) => !department.classes.some((cls) => cls.id === id))
    selectedClassesByDepartmentState.value[department.id] = false
  } else {
    const newClassIds = department.classes.map((cls) => cls.id)
    selectedClasses.value = [...new Set([...selectedClassIds, ...newClassIds])]
    selectedClassesByDepartmentState.value[department.id] = true
  }

  updateSelectAllClassesState()
}

const updateSelectAllClassesState = () => {
  groupClasses.value.forEach((department) => {
    const allClassesSelected = department.classes.every((cls) => selectedClasses.value.includes(cls.id))
    selectedClassesByDepartmentState.value[department.id] = allClassesSelected
  })

  selectAllClassesState.value = groupClasses.value.every((department) =>
    department.classes.every((cls) => selectedClasses.value.includes(cls.id)),
  )
}

watch(selectedClasses, updateSelectAllClassesState, { deep: true })

const showDepartmentClasses = (groupClass: GroupClass) => {
  selectedDepartment.value = groupClass
}

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
const dateInputFormat = {
  format: 'MM/dd/yyyy HH:mm',
}

const handleDatePicker = () => {
  newAssignment.value.startTime = date.value[0]
  newAssignment.value.endTime = date.value[1]
}

const handleClickSave = async () => {
  if (validate()) {
    handleDatePicker()
    try {
      newAssignment.value.classesId = selectedClasses.value
      await assignmentStore.createAssignment(newAssignment.value as EmptyAssignment)
      notify({ message: notifications.createSuccessfully(newAssignment.value.name), color: 'success' })
      router.push({ name: 'assignments' })
    } catch (error) {
      notify({ message: notifications.createFailed(newAssignment.value.name), color: 'error' })
    }
  }
}

defineExpose({ isFormHasUnsavedChanges })

onMounted(() => {
  getSubjects()
  getGroupClass()
})
</script>
