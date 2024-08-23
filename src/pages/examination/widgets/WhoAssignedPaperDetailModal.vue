<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { AccessType, GetAccessPaperRequest, GroupClassAccessPaper, PaperDto, SubmitPaperDto } from '../types'
import { usePaperStore } from '@/stores/modules/paper.module'

const props = defineProps<{
  accessType: AccessType | AccessType.ByClass
  paperDetail: PaperDto | null
}>()

const paperStore = usePaperStore()

const accessOptions = [
  { value: AccessType.ByClass, text: 'By Class' },
  { value: AccessType.ByStudent, text: 'By Student' },
]

const accessTypeDefault = ref<AccessType>(AccessType.ByClass)

watch(
  () => props.accessType,
  (newAccess) => {
    accessTypeDefault.value = newAccess
  },
)

const groupAccessPaperRequest = ref<GetAccessPaperRequest>({
  paperId: props.paperDetail?.id || '',
  status: accessTypeDefault.value,
})

const groupClassAccessPaper = ref<GroupClassAccessPaper[]>([])

const getGroupAccessPaper = async () => {
  try {
    const res = await paperStore.getGroupClassesAccessPaper(groupAccessPaperRequest.value)
    groupClassAccessPaper.value = res.data
  } catch (error) {
    console.log(error)
  }
}

watch(
  () => groupAccessPaperRequest.value.status,
  async () => {
    await getGroupAccessPaper()
  },
)

const submittedStudents = ref<SubmitPaperDto[]>([])

const studentStatusMap = computed(() => {
  const map = new Map<string, string>()
  submittedStudents.value.forEach((submit) => {
    map.set(submit.createdBy, 'done')
  })
  return map
})

const currentTime = new Date()

const checkDoExam = (studentId: string) => {
  if (props.paperDetail?.endTime) {
    const endTime = new Date(new Date(props.paperDetail.endTime))
    if (currentTime > endTime) {
      // Paper time has ended
      return studentStatusMap.value.get(studentId) ?? 'miss'
    }
  }
  // Paper time is still valid
  return studentStatusMap.value.get(studentId) ?? 'not yet'
}

onMounted(async () => {
  await getGroupAccessPaper()
})
</script>

<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <p>List of assignees</p>
      <VaRadio
        v-model="groupAccessPaperRequest.status"
        :options="accessOptions"
        class="assign-radio mb-2"
        value-by="value"
      />
    </VaCardTitle>

    <VaDivider />
    <VaCardContent class="p-0">
      <VaScrollContainer v-if="groupAccessPaperRequest.status == AccessType.ByClass" vertical class="max-h-[50vh]">
        <VaAccordion>
          <VaCollapse v-for="(group, index) in groupClassAccessPaper" :key="index" :header="group.name">
            <template #content>
              <div class="grid md:grid-cols-5 xs:grid-cols-4 gap-2">
                <template v-for="classroom in group.classes" :key="classroom.id">
                  <VaButton preset="secondary" border-color="success" color="success">{{ classroom.name }}</VaButton>
                </template>
              </div>
            </template>
          </VaCollapse>
        </VaAccordion>
      </VaScrollContainer>
      <VaScrollContainer v-if="groupAccessPaperRequest.status == AccessType.ByStudent" vertical class="max-h-[50vh]">
        <VaList>
          <VaListItem>
            <VaListItemSection>
              <VaListItemLabel class="va-text-bold"> student </VaListItemLabel>
            </VaListItemSection>
            <VaListItemSection>
              <VaListItemLabel class="va-text-bold"> group class </VaListItemLabel>
            </VaListItemSection>
            <VaListItemSection class="va-text-bold" icon> status </VaListItemSection>
          </VaListItem>
          <template v-for="(group, index) in groupClassAccessPaper" :key="index">
            <template v-for="(classroom, index1) in group.classes" :key="index1">
              <VaListItem v-for="(student, index2) in classroom.userClasses" :key="index2">
                <VaListItemSection>
                  <VaListItemLabel class="flex gap-2">
                    <span>{{ student.student.firstName }}</span>
                    <span>{{ student.student.lastName }}</span>
                  </VaListItemLabel>

                  <VaListItemLabel caption>
                    {{ student.student.email }}
                  </VaListItemLabel>
                </VaListItemSection>
                <VaListItemSection>
                  <VaListItemLabel class="va-text-bold">
                    {{ classroom.groupClassName }}
                  </VaListItemLabel>
                  <VaListItemLabel>
                    {{ classroom.name }}
                  </VaListItemLabel>
                </VaListItemSection>
                <VaListItemSection icon>
                  <VaChip
                    :color="checkDoExam(student.student.stId || '') == 'done' ? 'success' : 'warning'"
                    size="small"
                    >{{ checkDoExam(student.student.stId || '') }}
                  </VaChip>
                </VaListItemSection>
              </VaListItem>
            </template>
          </template>
        </VaList>
      </VaScrollContainer>
    </VaCardContent>
  </VaCard>
</template>
