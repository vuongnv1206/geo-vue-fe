<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { AccessType, GroupClassAccessPaper, PaperDto, StudentAccessPaper, SubmitPaperDto } from '../types'
import { usePaperStore } from '@/stores/modules/paper.module'

const props = defineProps<{
  accessType: AccessType | AccessType.ByClass
  groupAccessPaper: GroupClassAccessPaper[] | []
  paperDetail: PaperDto | null
}>()

const paperStore = usePaperStore()

const accessTypeDefault = ref<AccessType>(AccessType.ByClass)

watch(
  () => props.accessType,
  (newAccess) => {
    accessTypeDefault.value = newAccess
  },
)

const accessOptions = [
  { value: AccessType.ByClass, text: 'By Class' },
  { value: AccessType.ByStudent, text: 'By Student' },
]

const accessPaperGroup: GroupClassAccessPaper[] = props.groupAccessPaper
const studentsInClass = ref<StudentAccessPaper[]>([])

watch(
  accessPaperGroup,
  (newGroups) => {
    // Flatten all student data from groups with their groupName and className
    studentsInClass.value = newGroups.flatMap((group) =>
      group.classes.flatMap(
        (classItem) =>
          classItem.userClasses?.map((student) => ({
            ...student,
            groupName: group.name, // Add groupName from the group
            className: classItem.name, // Add className from the classItem
          })) ?? [],
      ),
    )
  },
  { immediate: true },
)

const submittedStudents = ref<SubmitPaperDto[]>([])
const dataFilterSubmittedStudent = ref({
  keyword: '',
  pageNumber: 0,
  pageSize: 10,
  orderBy: ['id'],
  paperId: '',
  classId: null,
})
// Fetch submitted students when component mounts
onMounted(async () => {
  if (props.paperDetail) {
    dataFilterSubmittedStudent.value.paperId = props.paperDetail.id
    try {
      const res = await paperStore.getSubmittedStudentsInPaper(props.paperDetail.id, dataFilterSubmittedStudent.value)
      submittedStudents.value = res.data
    } catch (error) {
      console.log(error)
    }
  }
})

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
</script>

<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <p>List of assignees</p>
      <VaRadio v-model="accessTypeDefault" :options="accessOptions" class="assign-radio mb-2" value-by="value" />
    </VaCardTitle>

    <VaDivider />
    <VaCardContent class="p-0">
      <VaScrollContainer v-if="accessTypeDefault === AccessType.ByClass" vertical class="max-h-[50vh]">
        <VaAccordion multiple>
          <VaCollapse v-for="(group, index) in groupAccessPaper" :key="index" :header="group.name">
            <template #content>
              <div v-for="classroom in group.classes" :key="classroom.id" class="grid md:grid-cols-5">
                <VaChip square color="success">
                  {{ classroom.name }}
                </VaChip>
              </div>
            </template>
          </VaCollapse>
        </VaAccordion>
      </VaScrollContainer>
      <VaScrollContainer v-if="accessTypeDefault === AccessType.ByStudent" vertical class="max-h-[50vh]">
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

          <VaListItem v-for="(student, index) in studentsInClass" :key="index">
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
              <VaListItemLabel>
                {{ student.groupName }}
              </VaListItemLabel>
              <VaListItemLabel>
                {{ student.className }}
              </VaListItemLabel>
            </VaListItemSection>
            <VaListItemSection icon>
              <VaChip :color="checkDoExam(student.student.stId || '') == 'done' ? 'success' : 'warning'" size="small"
                >{{ checkDoExam(student.student.stId || '') }}
              </VaChip>
            </VaListItemSection>
          </VaListItem>
        </VaList>
      </VaScrollContainer>
    </VaCardContent>
  </VaCard>
</template>
