<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  AccessType,
  ClassAccessPaper,
  GetGetAssigneesInPaperRequest,
  GroupClassAccessPaper,
  PaperDto,
  StudentAccessPaper,
  SubmitPaperDto,
} from '../types'
import { usePaperStore } from '@/stores/modules/paper.module'

const props = defineProps<{
  accessType: AccessType | AccessType.ByClass
  groupAccessPaper: GroupClassAccessPaper[] | []
  paperDetail: PaperDto | null
}>()

const paperStore = usePaperStore()

// const accessTypeDefault = ref<AccessType>(AccessType.ByClass)

// watch(
//   () => props.accessType,
//   (newAccess) => {
//     accessTypeDefault.value = newAccess
//   },
// )

const assigneeInPaperRequest = ref<GetGetAssigneesInPaperRequest>({
  paperId: props.paperDetail?.id || '',
  groupClassId: undefined,
  classId: undefined,
})

const classAccessPaper = ref<ClassAccessPaper[]>([])
const studentAccessPaper = ref<StudentAccessPaper[]>([])

const getAssigneesInPaper = async () => {
  try {
    const res = await paperStore.getAssigneesInPaper(assigneeInPaperRequest.value)
    classAccessPaper.value = res.data
    // Gộp tất cả các StudentAccessPaper từ các lớp và thêm groupClassName và name
    const allStudents = classAccessPaper.value.flatMap((classAccess: ClassAccessPaper) => {
      return classAccess.userClasses.map((studentAccess) => {
        return {
          ...studentAccess,
          groupName: classAccess.groupClassName,
          className: classAccess.name,
        }
      })
    })

    // Sử dụng Map để lọc ra các sinh viên có email duy nhất
    const uniqueStudentsMap = new Map<string, StudentAccessPaper>()

    allStudents.forEach((studentAccess) => {
      const email = studentAccess.student.email
      if (!uniqueStudentsMap.has(email)) {
        uniqueStudentsMap.set(email, studentAccess)
      }
    })

    // Chuyển Map về dạng Array và gán vào studentAccessPaper
    studentAccessPaper.value = Array.from(uniqueStudentsMap.values())
  } catch (error) {
    console.log(error)
  }
}
watch(
  () => props.paperDetail,
  (newValue) => {
    if (newValue) {
      // Chỉ gọi getAssigneesInPaper nếu paperDetail có giá trị hợp lệ
      getAssigneesInPaper()
    }
  },
  { immediate: true }, // Gọi ngay lập tức khi component được mount
)

// const accessPaperGroup: GroupClassAccessPaper[] = props.groupAccessPaper
// const studentsInClass = ref<StudentAccessPaper[]>([])

// watch(
//   accessPaperGroup,
//   (newGroups) => {
//     // Flatten all student data from groups with their groupName and className
//     studentsInClass.value = newGroups.flatMap((group) =>
//       group.classes.flatMap(
//         (classItem) =>
//           classItem.userClasses?.map((student) => ({
//             ...student,
//             groupName: group.name, // Add groupName from the group
//             className: classItem.name, // Add className from the classItem
//           })) ?? [],
//       ),
//     )
//   },
//   { immediate: true },
// )

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

// const groupClassValue = ref('')
// const classValue = ref('')

const groupClassOptions = computed(() =>
  props.groupAccessPaper.map((group) => ({
    label: group.name,
    value: group.id,
  })),
)

const filteredClassOptions = computed(() => {
  if (assigneeInPaperRequest.value.groupClassId === undefined) {
    return props.groupAccessPaper.flatMap((group) =>
      group.classes.map((classItem) => ({
        label: classItem.name,
        value: classItem.id,
      })),
    )
  }

  const selectedGroup = props.groupAccessPaper.find((group) => group.id === assigneeInPaperRequest.value.groupClassId)

  if (!selectedGroup) {
    return []
  }

  return selectedGroup.classes.map((classItem) => ({
    label: classItem.name,
    value: classItem.id,
  }))
})

const onGroupChange = async (newGroupClassId: string | undefined) => {
  assigneeInPaperRequest.value.groupClassId = newGroupClassId === '' ? undefined : newGroupClassId
  assigneeInPaperRequest.value.classId = undefined
  console.log(assigneeInPaperRequest.value.groupClassId)
  await getAssigneesInPaper()
}

const onClassChange = async (newClassId: string | undefined) => {
  assigneeInPaperRequest.value.classId = newClassId === '' ? undefined : newClassId
  await getAssigneesInPaper()
}
</script>

<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <p>List of assignees</p>
      <div class="max-w-xs">
        <VaSelect
          v-model="assigneeInPaperRequest.groupClassId"
          :options="groupClassOptions"
          placeholder="Select group"
          clearable
          :text-by="(op: any) => op.label"
          :value-by="(op: any) => op.value"
          @update:modelValue="onGroupChange"
        />
      </div>

      <div class="max-w-xs">
        <VaSelect
          v-model="assigneeInPaperRequest.classId"
          :options="filteredClassOptions"
          placeholder="Select classroom"
          clearable
          :text-by="(op: any) => op.label"
          :value-by="(op: any) => op.value"
          @update:modelValue="onClassChange"
        />
      </div>
    </VaCardTitle>

    <VaDivider />
    <VaCardContent class="p-0">
      <VaScrollContainer vertical class="max-h-[50vh]">
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
          <!-- <template v-for="(classroom, index) in classAccessPaper" :key="index"> -->
          <VaListItem v-for="(student, index1) in studentAccessPaper" :key="index1">
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
          <!-- </template> -->
        </VaList>
      </VaScrollContainer>
    </VaCardContent>
  </VaCard>
</template>
