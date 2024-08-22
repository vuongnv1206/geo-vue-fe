<script setup lang="ts">
import { computed, ref } from 'vue'
import { StudentMonitor } from '../types'
const props = defineProps<{
  studentMonitor: StudentMonitor | null
  paperId: string
}>()

console.log(props.studentMonitor)

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
            {{ currentTab?.content }}
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
