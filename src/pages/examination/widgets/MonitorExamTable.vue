<!-- eslint-disable vue/valid-v-slot -->
<template>
  <VaCard class="pb-0">
    <VaCardContent class="pb-0">
      <div>
        <VaDataTable
          :items="studentMonitorsPagination"
          :columns="columns"
          :loading="props.loading"
          hoverable
          clickable
          height="63vh"
          sticky-header
          striped
          :disable-client-side-sorting="false"
          @row:contextmenu="contextmenu($event)"
          @row:dblclick="dblclick($event)"
        >
          <template #cell(student.lastName)="{ rowData }">
            <span class="flex gap-2">
              <VaAvatar
                :src="getSrcAvatar(rowData)"
                class="w-14 h-14 font-bold"
                :fallback-text="rowData?.student?.lastName?.charAt(0)?.toUpperCase()"
                :color="avatarColor(rowData?.student?.lastName)"
              />
              <div>
                <p class="text-sm">{{ rowData?.student?.firstName }} {{ rowData?.student?.lastName }}</p>
                <p class="text-secondary">{{ rowData?.student?.email }}</p>
              </div>
            </span>
          </template>
          <template #cell(submitPaper.startTime)="{ rowData }">
            <VaPopover
              v-if="rowData.submitPaper?.startTime"
              icon="info"
              :message="format.getTimeString(rowData.submitPaper.startTime)"
            >
              <div>{{ format.formatDate(rowData.submitPaper.startTime) }}</div>
            </VaPopover>
            <div v-else>-</div>
          </template>

          <template #cell(endTime)="{ rowData }">
            <VaPopover
              v-if="rowData.submitPaper?.endTime"
              icon="info"
              :message="format.getTimeString(rowData.submitPaper.endTime)"
            >
              <div>{{ format.formatDate(rowData.submitPaper.endTime) }}</div>
            </VaPopover>
            <div v-else>-</div>
          </template>

          <template #cell(submitPaper.endTime)="{ rowData }">
            <div v-if="rowData.submitPaper?.endTime">
              {{ format.formatDurationToSeconds(rowData.submitPaper.startTime, rowData.submitPaper.endTime) }}
            </div>
            <div v-else>-</div>
          </template>

          <template #cell(completionStatus)="{ rowData }">
            <VaBadge v-if="rowData.completionStatus === 2" color="success" text="Completed" />
            <VaBadge v-else-if="rowData.completionStatus === 1" color="warning" text="Doing" />
            <VaBadge v-else-if="rowData.completionStatus === 0" color="secondary" text="Not started" />
            <VaBadge v-else-if="rowData.completionStatus === 3" color="danger" text="Supended" />
          </template>

          <template #cell(submitPaper.totalMark)="{ rowData }">
            <div v-if="rowData.completionStatus === 2">
              {{ (rowData.submitPaper.totalMark / rowData.paper.maxPoint) * 10 }}
            </div>
            <div v-else>-</div>
          </template>

          <template #cell(isSuspicious)="{ rowData }">
            <VaBadge v-if="rowData.isSuspicious" color="danger" text="Suspicious" />
            <div v-else>
              <VaBadge v-if="!rowData.isSuspicious && rowData.completionStatus != 0" color="success" text="Nomal" />
              <VaBadge v-else color="secondary" text="Not started" />
            </div>
          </template>

          <template #cell(actions)="{ rowData }">
            <div class="flex gap-2 justify-end">
              <VaButton
                preset="primary"
                size="small"
                color="primary"
                aria-label="View Logs"
                @click="emit('viewLogs', rowData as StudentMonitor)"
              >
                <VaIconMonitorLogs />
              </VaButton>
              <VaButton
                preset="primary"
                size="small"
                color="#1c5131"
                aria-label="Reassign"
                @click="emit('reassign', rowData as StudentMonitor)"
              >
                <VaIcon class="material-icons"> refresh </VaIcon>
              </VaButton>
              <VaButton
                preset="primary"
                size="small"
                color="#f00"
                aria-label="Suspend"
                @click="emit('suspend', rowData as StudentMonitor)"
              >
                <VaIcon class="material-icons"> block </VaIcon>
              </VaButton>
            </div>
          </template>
        </VaDataTable>
        <VaCardContent>
          <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center pt-0 pb-0">
            <div>
              <b>{{ pagination.total }} {{ t('questionFolderTable.results') }}.</b>
              {{ t('questionFolderTable.results_per_page') }}
              <VaSelect v-model="pagination.perPage" class="!w-20" :options="[20, 50, 100]" />
            </div>

            <div v-if="totalPages > 1" class="flex">
              <VaPagination
                v-model="pagination.page"
                buttons-preset="secondary"
                :pages="totalPages"
                :visible-pages="5"
              />
            </div>
          </div>
        </VaCardContent>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, PropType, ref, watch } from 'vue'
import { defineVaDataTableColumns, useMenu } from 'vuestic-ui'
import { StudentMonitor } from '../types'
import { avatarColor } from '@/services/utils'
import { format } from '@/services/utils'
import VaIconMonitorLogs from '@/components/icons/VaIconMonitorLogs.vue'
import { Pagination } from '@/pages/question/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const getSrcAvatar = (rowData: any) => {
  const img = rowData?.student?.imageUrl
  const url = import.meta.env.VITE_APP_BASE_URL as string
  const url_without_api = url.slice(0, -3)
  if (img) return `${url_without_api}${img}`
  return ''
}

const { show } = useMenu()

const pagination = ref<Pagination>({
  page: 1,
  perPage: 20,
  total: 0,
})

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.perPage))

const columns = defineVaDataTableColumns([
  { label: 'Student Email', key: 'student.email', sortable: true },
  { label: 'Student Name', key: 'student.lastName', sortable: true },
  { label: 'Class', key: 'class.name', sortable: true },
  { label: 'Start Time', key: 'submitPaper.startTime', sortable: true },
  { label: 'End Time', key: 'endTime', sortable: true },
  { label: 'Duration', key: 'submitPaper.endTime', sortable: true },
  { label: 'Completion Status', key: 'completionStatus', sortable: true },
  { label: 'Total Mark', key: 'submitPaper.totalMark', sortable: true },
  { label: 'Is Suspicious', key: 'isSuspicious', sortable: true },
  { label: 'Actions', key: 'actions' },
])

const props = defineProps({
  studentMonitors: {
    type: Array as PropType<StudentMonitor[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const studentMonitorsPagination = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.perPage
  const end = start + pagination.value.perPage
  return props.studentMonitors.slice(start, end)
})

watch(
  () => props.studentMonitors,
  () => {
    pagination.value.total = props.studentMonitors.length
  },
  { immediate: true },
)

onBeforeMount(() => {
  pagination.value.total = props.studentMonitors.length
})

const emit = defineEmits<{
  (event: 'dblclick', studentMonitor: StudentMonitor): void
  (event: 'viewLogs', studentMonitor: StudentMonitor): void
  (event: 'reassign', studentMonitor: StudentMonitor): void
  (event: 'suspend', studentMonitor: StudentMonitor): void
}>()

const dblclick = (event: any) => {
  emit('dblclick', event.item)
}

const contextmenu = (event: any) => {
  event.event.preventDefault()
  show({
    event: event.event,
    options: [
      { text: 'View Logs', icon: 'edit' },
      { text: 'Reassign', icon: 'share' },
      { text: 'Suspend', icon: 'delete' },
    ],
    onSelected(option) {
      if (option.text === 'View Logs') {
        emit('viewLogs', event.item)
      } else if (option.text === 'Reassign') {
        emit('reassign', event.item)
      } else if (option.text === 'Suspend') {
        emit('suspend', event.item)
      }
    },
  })
}
</script>
