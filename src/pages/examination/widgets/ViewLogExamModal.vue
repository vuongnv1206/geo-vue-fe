<script setup lang="ts">
import { computed, ref } from 'vue'
import { StudentMonitor, MonitorRequest, MonitorDetailResponse } from '../types'
import { useExamMonitorStore } from '@/stores/modules/examMonitor.module'
import ViewLogExamModalInfo from './ViewLogExamModalInfo.vue'
import ViewLogExamModalProcess from './ViewLogExamModalProcess.vue'
import ViewLogExamModalKeyboard from './ViewLogExamModalKeyboard.vue'
import ViewLogExamModalMouse from './ViewLogExamModalMouse.vue'
import ViewLogExamModalNet from './ViewLogExamModalNet.vue'
import ViewLogExamModalCommon from './ViewLogExamModalCommon.vue'
const store = useExamMonitorStore()

const props = defineProps<{
  studentMonitor: StudentMonitor | null
  paperId: string
}>()

const details = ref<MonitorDetailResponse | null>(null)

const getMonitorDetail = () => {
  if (props.studentMonitor) {
    // request
    const request: MonitorRequest = {
      submitPaperId: props.studentMonitor.submitPaperId,
    }
    store
      .getExamMonitorDetail(request)
      .then((response) => {
        details.value = response
        console.log(details.value)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

getMonitorDetail()

// auto refresh every 3s
setInterval(() => {
  getMonitorDetail()
}, 10000)

const emit = defineEmits<{
  (event: 'showReassign', studentMonitor: StudentMonitor): void
  (event: 'showSupend', studentMonitor: StudentMonitor): void
  (event: 'close'): void
}>()

const prepareReassign = () => {
  emit('showReassign', props.studentMonitor!)
}

const prepareSupend = () => {
  emit('showSupend', props.studentMonitor!)
}

const tabs = [
  { icon: 'info', title: 'Information', content: 'Information content' },
  { icon: 'terminal', title: 'Process', content: 'Process content' },
  { icon: 'keyboard', title: 'Keyboard', content: 'Keyboard content' },
  { icon: 'mouse', title: 'Mouse', content: 'Mouse content' },
  { icon: 'wifi', title: 'Network', content: 'Network content' },
  { icon: 'visibility', title: 'Common', content: 'Common content' },
]

const tabValue = ref<string>(tabs[0].title)

const currentTab = computed(() => {
  return tabs.find((tab) => tab.title === tabValue.value)
})
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2 min-h-[80vh]">
    <h3 class="text-lg font-semibold">View log exam: {{ props.studentMonitor?.student?.email }}</h3>
    <div class="flex flex-col justify-between min-h-[80%]">
      <div class="min-h-[80vh] flex flex-row">
        <div>
          <VaTabs v-model="tabValue" vertical grow>
            <template #tabs>
              <VaTab v-for="tab in tabs" :key="tab.title" :name="tab.title">
                <VaIcon class="material-icons mr-2" size="small"> {{ tab.icon }} </VaIcon>
                {{ tab.title }}
              </VaTab>
            </template>
          </VaTabs>
        </div>
        <VaCard square outlined class="flex-grow">
          <VaCardTitle>
            <VaIcon class="material-icons mr-2" size="small" color="background-element">
              {{ currentTab?.icon }}
            </VaIcon>
            {{ currentTab?.title }}
          </VaCardTitle>
          <VaCardContent>
            <ViewLogExamModalInfo v-if="currentTab?.title === 'Information'" :monitor-details="details" />
            <ViewLogExamModalProcess v-if="currentTab?.title === 'Process'" :monitor-details="details" />
            <ViewLogExamModalKeyboard v-if="currentTab?.title === 'Keyboard'" :monitor-details="details" />
            <ViewLogExamModalMouse v-if="currentTab?.title === 'Mouse'" :monitor-details="details" />
            <ViewLogExamModalNet v-if="currentTab?.title === 'Network'" :monitor-details="details" />
            <ViewLogExamModalCommon v-if="currentTab?.title === 'Common'" :monitor-details="details" />
          </VaCardContent>
        </VaCard>
      </div>
      <div>
        <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
          <VaButton @click="validate() && prepareReassign()">Reassign</VaButton>
          <VaButton color="danger" @click="validate() && prepareSupend()">Supend</VaButton>
          <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        </div>
      </div>
    </div>
  </VaForm>
</template>
