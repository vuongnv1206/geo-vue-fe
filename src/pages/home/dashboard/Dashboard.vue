<template>
  <div class="md:mx-28 relative min-h-[75vh]">
    <div v-if="isTeacher" class="col-span-12 grid grid-cols-12 gap-6 mt-4 items-center">
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'questions' }">
          <div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M140-160q-24 0-42-18.5T80-220v-520q0-23 18-41.5t42-18.5h281l60 60h339q23 0 41.5 18.5T880-680v460q0 23-18.5 41.5T820-160H140Zm0-60h680v-460H456l-60-60H140v520Zm0 0v-520 520Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.questions') }}</div>
          </div>
        </RouterLink>
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'paper-folder' }">
          <div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M560-574v-48q33-14 67.5-21t72.5-7q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-610q-38 0-73 9.5T560-574Zm0 220v-49q33-13.5 67.5-20.25T700-430q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-390q-38 0-73 9t-67 27Zm0-110v-48q33-14 67.5-21t72.5-7q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-500q-38 0-73 9.5T560-464ZM248-300q53.57 0 104.28 12.5Q403-275 452-250v-427q-45-30-97.62-46.5Q301.76-740 248-740q-38 0-74.5 9.5T100-707v434q31-14 70.5-20.5T248-300Zm264 50q50-25 98-37.5T712-300q38 0 78.5 6t69.5 16v-429q-34-17-71.82-25-37.82-8-76.18-8-54 0-104.5 16.5T512-677v427Zm-30 90q-51-38-111-58.5T248-239q-36.54 0-71.77 9T106-208q-23.1 11-44.55-3Q40-225 40-251v-463q0-15 7-27.5T68-761q42-20 87.39-29.5 45.4-9.5 92.61-9.5 63 0 122.5 17T482-731q51-35 109.5-52T712-800q46.87 0 91.93 9.5Q849-781 891-761q14 7 21.5 19.5T920-714v463q0 27.89-22.5 42.45Q875-194 853-208q-34-14-69.23-22.5Q748.54-239 712-239q-63 0-121 21t-109 58ZM276-489Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.examinations') }}</div>
          </div>
        </RouterLink>
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'classroom' }">
          <div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M260-260h560v-560h-60v278l-93-57-93 57v-278H260v560Zm0 60q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm434-740h186-186Zm-314 0h560-560Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.classroom') }}</div>
          </div>
        </RouterLink>
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'assignments' }">
          <div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M319-250h322v-60H319v60Zm0-170h322v-60H319v60ZM220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h361l219 219v521q0 24-18 42t-42 18H220Zm331-554v-186H220v680h520v-494H551ZM220-820v186-186 680-680Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.assignments') }}</div>
          </div>
        </RouterLink>
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'subjects' }">
          <div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M493-139q3 14 11.5 31T522-79H180q-24 0-42-18t-18-42v-681q0-24 18-42t42-18h520q24 0 42 18t18 42v339q-13.5-2-30-2t-30 2v-339H462v278l-96-59-96 59v-278h-90v681h313Zm235 99q-81 0-136.5-55.5T536-232q0-81 55.5-136.5T728-424q81 0 136.5 55.5T920-232q0 81-55.5 136.5T728-40Zm-49-100 143-92-143-92v184ZM270-820h192-192Zm223 0H180h520-223 16Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.subjects') }}</div>
          </div>
        </RouterLink>
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'group-manage' }">
          <div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M38-160v-94q0-35 18-63.5t50-42.5q73-32 131.5-46T358-420q62 0 120 14t131 46q32 14 50.5 42.5T678-254v94H38Zm700 0v-94q0-63-32-103.5T622-423q69 8 130 23.5t99 35.5q33 19 52 47t19 63v94H738ZM358-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42Zm360-150q0 66-42 108t-108 42q-11 0-24.5-1.5T519-488q24-25 36.5-61.5T568-631q0-45-12.5-79.5T519-774q11-3 24.5-5t24.5-2q66 0 108 42t42 108ZM98-220h520v-34q0-16-9.5-31T585-306q-72-32-121-43t-106-11q-57 0-106.5 11T130-306q-14 6-23 21t-9 31v34Zm260-321q39 0 64.5-25.5T448-631q0-39-25.5-64.5T358-721q-39 0-64.5 25.5T268-631q0 39 25.5 64.5T358-541Zm0 321Zm0-411Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.teacher-group') }}</div>
          </div>
        </RouterLink>
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'audit logs' }">
          <div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.audit-logs') }}</div>
          </div>
        </RouterLink>
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'orders' }">
          <div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.orders') }}</div>
          </div>
        </RouterLink>
      </VaCard>
    </div>
    <div v-if="isStudent" class="flex flex-col gap-4 pt-4">
      <VaCardTitle>{{ t('papers.exam_schedule') }}</VaCardTitle>
      <VaCard class="col-span-1 lg:col-span-1 xl:col-span-1 mb-3">
        <VaDataTable hoverable :disable-client-side-sorting="false" :columns="columns" :items="paperStudent">
          <template #cell(completionStatus)="{ rowData }">
            <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
              <div>
                <span>
                  <VaBadge
                    :text="getStatusText(rowData.completionStatus)"
                    :color="getStatusClass(rowData.completionStatus)"
                  />
                </span>
              </div>
            </div>
          </template>
          <template #cell(startTime)="{ rowData }">
            <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
              <div>
                <span>
                  {{ format.formatDate(rowData.startTime) }}
                </span>
              </div>
            </div>
          </template>
          <template #cell(endTime)="{ rowData }">
            <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
              <div>
                <span>
                  {{ rowData.endTime !== null ? format.formatDate(rowData.endTime) : t('papers.unlimited_time') }}
                </span>
              </div>
            </div>
          </template>
          <template #cell(duration)="{ rowData }">
            <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
              <div>
                <span>
                  {{ format.formatDuration(rowData.duration) }}
                </span>
              </div>
            </div>
          </template>
          <!-- <template #cell(description)="{ rowData }">
            <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
              <div>
                <VaTextarea v-model="rowData.description" :readonly="true" />
              </div>
            </div>
          </template> -->
          <template #cell(startedTime)="{ rowData }">
            <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
              <div>
                <span v-if="rowData.startedTime != null"> {{ format.formatDate(rowData.startedTime) }}</span>
              </div>
            </div>
          </template>
          <template #cell(submittedTime)="{ rowData }">
            <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
              <div>
                <span v-if="rowData.submittedTime != null"> {{ format.formatDate(rowData.submittedTime) }}</span>
              </div>
            </div>
          </template>
          <template #cell(score)="{ rowData }">
            <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
              <div>
                <span v-if="rowData.showMarkResult === ShowMarkResult.WhenAllStudentSubmitted">
                  <span v-if="rowData.score !== -1">
                    {{ rowData.score }}
                  </span>
                  <span v-else> {{ t('papers.please_wait_result') }} </span>
                </span>
                <span v-else-if="rowData.showMarkResult === ShowMarkResult.WhenSubmitted">
                  {{ rowData.score }}
                </span>
                <span v-else> {{ t('papers.can_not_view_result') }} </span>
              </div>
            </div>
          </template>
          <template #cell(action)="{ row }">
            <div v-if="row.source.canViewDetailAnswer" class="flex gap-2 justify-center">
              <VaButton
                preset="secondary"
                icon="visibility"
                @click="viewDetailAnswerResult(row.source.id, row.source.paperId)"
              />
            </div>
          </template>
        </VaDataTable>
      </VaCard>
      <VaCardTitle>{{ t('papers.class_list') }}</VaCardTitle>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <VaCard
          v-for="class1 in classes.filter((class1) => class1.assignments.length > 0)"
          :key="class1.id"
          class="p-4 shadow-lg rounded-lg border border-gray-200"
        >
          <div>
            <!-- Header Section -->
            <VaCard class="flex flex-row items-center p-4 bg-white rounded-lg shadow-sm">
              <div>
                <VaAvatar
                  :src="getSrcAvatar(class1.owner?.imageUrl)"
                  class="w-14 h-14 font-bold mr-2"
                  :fallback-text="class1.owner?.firstName.charAt(0)?.toUpperCase()"
                  :color="avatarColor(class1.owner?.firstName)"
                />
              </div>
              <VaCard :to="{ name: 'class-details', params: { id: class1.id } }">
                <VaCardContent class="text-md font-bold text-gray-800">
                  {{ class1.owner?.firstName }} {{ class1.owner?.lastName }}
                </VaCardContent>
                <VaCardContent class="text-sm font-semibold text-gray-600">{{ class1.name }}</VaCardContent>
              </VaCard>
            </VaCard>

            <!-- Assignments Section -->
            <VaCard class="flex flex-col mb-2 px-4 bg-white rounded-lg">
              <div class="flex flex-row items-center mb-2">
                <VaIcon name="event_available" class="text-primary" size="large" />
                <VaCardContent class="text-sm font-semibold text-gray-800 ml-2">
                  {{ $t('assignments.unattemped_ass_exam') }}
                </VaCardContent>
              </div>
              <div v-for="ass in class1.assignments.slice(0, 2)" :key="ass.id" class="bg-blue-100 px-4 rounded-lg mb-2">
                <RouterLink :to="{ name: 'assignment-submission', params: { id: ass.id, classId: class1.id } }">
                  <VaCardContent class="text-md font-semibold text-gray-800">
                    {{ ass.name }} -
                    <VaBadge
                      :text="getMarkAssignmentStatusText(ass.status)"
                      :color="getMarkAssignmentStatusColor(ass.status)"
                    />
                  </VaCardContent>
                  <!-- {{ ass.status === MarkAssignmentStatus.NotSubmitted ? t('assignments.time_out') : ass.status }} -->

                  <VaCardContent class="text-xs font-medium text-gray-600">
                    <div class="flex items-center mb-1">
                      <VaIcon name="event" class="material-symbols-outlined mr-1" />
                      <span class="font-semibold mr-1">{{ $t('assignments.start_time') }} </span>
                      {{ format.formatDate(ass.startTime) }}
                    </div>
                    <div class="flex items-center">
                      <VaIcon name="event" class="material-symbols-outlined mr-1" />
                      <span class="font-semibold mr-1">{{ $t('assignments.end_time') }}</span>
                      {{ format.formatDate(ass.endTime) }}
                    </div>
                  </VaCardContent>
                </RouterLink>
              </div>
              <div v-if="class1.assignments.length > 2" class="flex justify-center items-center">
                <VaButton preset="plain" size="small" :to="{ name: 'class-details', params: { id: class1.id } }">
                  {{ $t('settings.see_more') }}
                </VaButton>
              </div>
            </VaCard>

            <!-- News Section -->
            <VaCard class="flex flex-col px-4 bg-white rounded-lg">
              <div class="flex items-center mb-2">
                <VaIcon name="newspaper" class="text-primary" size="large" />
                <VaCardContent class="text-sm font-semibold text-gray-800 ml-2">
                  {{ $t('posts.news_board') }}
                </VaCardContent>
              </div>
              <div
                v-for="posts1 in class1.posts?.slice(0, 2)"
                :key="posts1.id"
                class="bg-blue-100 px-4 rounded-lg mb-2"
              >
                <VaCardContent class="text-md font-bold text-gray-800">
                  <!-- eslint-disable vue/no-v-html -->
                  <div class="text-base text-gray-700" v-html="posts1.content" />
                  <!-- eslint-enable-->
                </VaCardContent>
              </div>
              <div v-if="(class1.posts?.length || 0) > 2" class="flex justify-center items-center">
                <VaButton preset="plain" size="small" :to="{ name: 'class-details', params: { id: class1.id } }">
                  {{ $t('settings.see_more') }}
                </VaButton>
              </div>
            </VaCard>
          </div>
        </VaCard>
      </div>
    </div>
    <div v-if="isTeacher">
      <RouterLink :to="{ name: 'subscription' }">
        <VaButton color="#ee943a" text-color="#ffffff" class="my-4">{{ t('subscription.btn_subscribe') }}</VaButton>
      </RouterLink>
    </div>
    <div v-if="isStudent">
      <VaButton text-color="#ffffff" class="my-4" @click="downloadApp">Download GEO Desktop</VaButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@modules/auth.module'
import { useI18n } from 'vue-i18n'
import { defineVaDataTableColumns, useToast, VaCardTitle } from 'vuestic-ui'
import { useClassStore } from '@/stores/modules/class.module'
import { ClassroomWithPosts } from '@/pages/classrooms/types'
import { avatarColor, format, getErrorMessage, notifications } from '@/services/utils'
import { usePostsStore } from '@/stores/modules/posts.module'
import { DoExamStatus, PaperStudents, PaperStudentsHistory, ShowMarkResult } from '@/pages/examination/types'
import { usePaperStudentsStore } from '@/stores/modules/paperStudents.module'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getSrcAvatar } from '@/pages/audit-logs/helper'
import { useRouter } from 'vue-router'
import { useAssignmentStore } from '@/stores/modules/assignment.module'
import { MarkAssignmentStatus } from '@/pages/assignment/types'

dayjs.extend(duration)
dayjs.extend(relativeTime)
const { t } = useI18n()
const loading = ref(true)
const { init: notify } = useToast()
const authStore = useAuthStore()
const classStores = useClassStore()
const postStores = usePostsStore()
const assignmentStores = useAssignmentStore()
const paperStudentsStores = usePaperStudentsStore()
const classes = ref<ClassroomWithPosts[]>([])
const paperStudents = ref<PaperStudents[]>([])
const paperStudentsHistory = ref<PaperStudentsHistory[]>([])

const isTeacher = computed(() => authStore?.musHaveRole('Teacher')) // just for testing
const isStudent = computed(() => authStore?.musHaveRole('Student')) // just for testing

const columns = defineVaDataTableColumns([
  { label: t('papers.stt'), key: 'stt', sortable: false },
  // { label: t('subjects.subject'), key: 'subjectName', sortable: true },
  { label: t('papers.name'), key: 'examName', sortable: true },
  { label: t('papers.status'), key: 'completionStatus', sortable: true },
  { label: t('papers.start_time'), key: 'startTime', sortable: true },
  { label: t('papers.end_time'), key: 'endTime', sortable: true },
  { label: t('papers.duration'), key: 'duration', sortable: true },
  // { label: t('papers.description'), key: 'description', sortable: true },
  // { label: t('papers.paper_label'), key: 'paperLabelName', sortable: true },
  { label: t('papers.started_time'), key: 'startedTime', sortable: true },
  { label: t('papers.submitted_time'), key: 'submittedTime', sortable: true },
  { label: t('papers.score'), key: 'score', sortable: true },
  { label: ' ', key: 'action' },
])

const paperStudent = ref<any[]>([])

const calculatePaperStudent = () => {
  paperStudent.value = [
    ...paperStudents.value.map((student: any, index: number) => ({
      stt: index + 1,
      ...student,
    })),
    ...paperStudentsHistory.value.map((history: any, index: number) => ({
      stt: paperStudents.value.length + index + 1,
      ...history,
    })),
  ]
}

const dataFilter = ref({
  advancedSearch: {
    fields: [''],
    keyword: '',
  },
  pageNumber: 1,
  totalPages: 1,
  totalCount: 1,
  pageSize: 10,
  orderBy: [''],
})

const downloadApp = () => {
  window.open('https://drive.google.com/file/d/1F8gdoD-1TVNJy5Gy3qDPWRcvbzO8lGmo/view?usp=sharing', '_blank')
}

const getClasses = async () => {
  loading.value = true
  try {
    const response = await classStores.getClasses(dataFilter)
    classes.value = await Promise.all(
      response.data.map(async (item: any) => {
        const posts = (await getPosts(item.id)) || []
        return {
          ...item,
          posts,
        }
      }),
    )
    classes.value.forEach((class1) => {
      class1.assignments.forEach((assignment) => {
        assignmentStores
          .getAssignmentSubmissions({ assignmentId: assignment.id, classId: class1.id })
          .then((response) => {
            assignment.status = response[0].status
          })
      })
    })
  } catch (error) {
    notify({
      message: notifications.getFailed(t('classes.class')) + getErrorMessage(error),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const getPosts = async (classId: any) => {
  loading.value = true
  const request = {
    classId: classId,
  }
  try {
    const response = await postStores.getPosts(request)
    return response.data
  } catch (error) {
    notify({
      message: notifications.getFailed(t('posts.posts')) + getErrorMessage(error),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const getPaperStudents = async () => {
  loading.value = true
  try {
    const response = await paperStudentsStores.getPaperStudents(dataFilter)
    paperStudents.value = response.data
    // console.log('paperStudents', paperStudents.value)
  } catch (error) {
    notify({
      message: notifications.getFailed(t('papers.paper')) + getErrorMessage(error),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const getPaperStudentsHistory = async () => {
  loading.value = true
  try {
    const response = await paperStudentsStores.getPaperStudentsHistory(dataFilter)
    paperStudentsHistory.value = response.data
    // console.log('paperStudentsHistory', paperStudentsHistory.value)
  } catch (error) {
    notify({
      message: notifications.getFailed(t('papers.paper')) + getErrorMessage(error),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const getStatusText = (status: number) => {
  if (status === DoExamStatus.NotStarted) {
    return t('papers.not_started')
  } else if (status === DoExamStatus.InProgress) {
    return t('papers.in_progress')
  } else if (status === DoExamStatus.Completed) {
    return t('papers.completed')
  } else if (status === DoExamStatus.Suspended) {
    return t('papers.suspended')
  } else {
    return ''
  }
}

const getStatusClass = (status: number) => {
  if (status === DoExamStatus.NotStarted) {
    return '#F59E0B' // Not Started - Yellow 500
  } else if (status === DoExamStatus.InProgress) {
    return '#3B82F6' // In Progress - Blue 500
  } else if (status === DoExamStatus.Completed) {
    return '#10B981' // Completed - Green 500
  } else if (status === DoExamStatus.Suspended) {
    return '#EF4444' // Suspended - Red 500
  } else {
    return ''
  }
}

const getMarkAssignmentStatusColor = (status: string) => {
  if (status === MarkAssignmentStatus.Submitted) {
    return '#F59E0B' // Submitted - Green 500
  } else if (status === MarkAssignmentStatus.Doing) {
    return '#3B82F6' // Doing - Blue 500
  } else if (status === MarkAssignmentStatus.Marked) {
    return '#10B981' // Marked - Green 500
  } else if (status === MarkAssignmentStatus.NotSubmitted) {
    return '#EF4444' // Not Submitted - Red 500
  } else {
    return ''
  }
}

const getMarkAssignmentStatusText = (status: string) => {
  if (status === MarkAssignmentStatus.Submitted) {
    return t('assignments.submitted')
  } else if (status === MarkAssignmentStatus.Doing) {
    return t('assignments.doing')
  } else if (status === MarkAssignmentStatus.Marked) {
    return t('assignments.marked')
  } else if (status === MarkAssignmentStatus.NotSubmitted) {
    return t('assignments.not_submitted')
  } else {
    return ''
  }
}

const router = useRouter()
const currentUserId = authStore.user?.id

const viewDetailAnswerResult = (submitId: string, paperId: string) => {
  router.push({
    name: 'exam-student-review',
    params: {
      paperId: paperId,
      userId: currentUserId,
      submitPaperId: submitId,
    },
  })
}

onMounted(() => {
  const loadData = async () => {
    await getClasses()
    if (isStudent.value) {
      await getPaperStudents()
      await getPaperStudentsHistory()
      calculatePaperStudent()
    }
  }

  loadData()
})
</script>

<style>
.hover-scale:hover {
  transform: scale(1.05);
  transition: transform 0.5s ease;
}

.hover-scale {
  cursor: pointer;
  transition-property:
    color,
    background-color,
    border-color,
    text-decoration-color,
    fill,
    stroke,
    box-shadow,
    transform,
    filter,
    -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow, transform,
    filter, backdrop-filter;
  transition-property:
    color,
    background-color,
    border-color,
    text-decoration-color,
    fill,
    stroke,
    box-shadow,
    transform,
    filter,
    backdrop-filter,
    -webkit-backdrop-filter;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
