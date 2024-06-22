<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useToast } from 'vuestic-ui'
import { usePaperStore } from '@/stores/modules/paper.module'
import { PaperDto } from '@/pages/examination/types'
import { useRoute } from 'vue-router'
import { Classrooms, GroupClass } from '@/pages/classrooms/type'
import { useClassStore } from '@/stores/modules/class.module'
import { useGroupClassStore } from '@/stores/modules/groupclass.module'
import { UpdatePaperRequest, PaperAccess, AccessType } from './types'
import DatePickerModal from '@/pages/examination/widgets/DatePickerModal.vue'

const paperDetail = ref<PaperDto | null>(null)
const route = useRoute()
const paperStore = usePaperStore()
const classStores = useClassStore()
const { init: notify } = useToast()

const paperId = route.params.id

const getPaperDetail = () => {
  paperStore
    .paperDetail(paperId.toString())
    .then((res) => {
      paperDetail.value = res
    })
    .catch((error) => {
      notify({
        message: `Not Found ${error}`,
        color: 'danger',
      })
    })
}

const formatDateTimeForDisplay = (dateTime: string | undefined): string | undefined => {
  if (!dateTime) return undefined
  const [date, timeWithZone] = dateTime.split('T')
  const [time] = timeWithZone ? timeWithZone.split('+') : ['00:00:00']
  return `${date} ${time}`
}

const formatDateTimeForSave = (dateTime: string | undefined): string | undefined => {
  if (!dateTime) return undefined
  const [date, time] = dateTime.split(' ')
  return `${date}T${time}`
}

const editPaper = ref<UpdatePaperRequest>({
  id: paperId.toString(),
  examName: '',
  status: 0,
  startTime: undefined,
  endTime: undefined,
  paperLabelId: undefined,
  duration: 0,
  shuffle: false,
  showMarkResult: false,
  showQUestionAnswer: false,
  password: undefined,
  type: 0,
  isPublish: false,
  description: '',
  paperAccesses: undefined,
  shareType: 1,
})

const valueOption = ref<AccessType>(AccessType.Everyone)

watch(
  () => paperDetail.value,
  () => {
    if (paperDetail.value !== null) {
      editPaper.value = {
        id: paperDetail.value.id,
        examName: paperDetail.value.examName,
        status: 0,
        startTime: formatDateTimeForDisplay(paperDetail.value.startTime ?? undefined),
        endTime: formatDateTimeForDisplay(paperDetail.value.endTime ?? undefined),
        paperLabelId: paperDetail.value.paperLabelId ?? undefined,
        duration: paperDetail.value.duration ?? 0,
        shuffle: false, // Assuming a default value
        showMarkResult: paperDetail.value.showMarkResult ?? false,
        showQUestionAnswer: paperDetail.value.showQuestionAnswer ?? false,
        password: paperDetail.value.password ?? '',
        type: parseInt(paperDetail.value.type ?? '0'), // Assuming type needs to be converted to a number
        isPublish: paperDetail.value.isPublish ?? false,
        description: paperDetail.value.description ?? '',
        paperAccesses: paperDetail.value.paperAccesses,
        shareType: paperDetail.value.shareType,
      }

      valueOption.value = paperDetail.value.shareType as AccessType
      if (paperDetail.value.paperAccesses !== undefined) {
        paperDetail.value.paperAccesses.forEach((item: PaperAccess) => {
          if (item.classId !== undefined) {
            checkedPermissionsClassAccess.value.push(item.classId)
          }
        })
      }
    }
  },
  { immediate: true },
)

const valueSwitch = ref(true)

const accessOptions = [
  { value: AccessType.Everyone, text: 'Everyone' },
  { value: AccessType.ByClass, text: 'By Class' },
  { value: AccessType.ByStudent, text: 'By Student' },
]

const groupClasses = ref<GroupClass[] | null>(null)
const classRoomsInGroup = ref<Classrooms[]>([])
const selectedGroupClass = ref<string>('')

const getClassByGroupClass = (groupId: string) => {
  classStores
    .getClassroomByGroupClassId(groupId)
    .then((res) => {
      classRoomsInGroup.value = res
      selectedGroupClass.value = groupId
    })
    .catch((error) => {
      notify({
        message: `get classrooms fail \n ${error}`,
        color: 'danger',
      })
    })
}

const groupClassStores = useGroupClassStore()
const getGroupClasses = async () => {
  try {
    const res = await groupClassStores.getGroupClass()
    groupClasses.value = res
  } catch (error) {
    console.error(error)
  }
}

const showFromDatePickerModal = ref(false)
const showToDatePickerModal = ref(false)
const getDatePickerModal = (date: string, type: string) => {
  if (type === 'fromDate') {
    editPaper.value.startTime = formatDateTimeForDisplay(date)
  } else {
    editPaper.value.endTime = formatDateTimeForDisplay(date)
  }
}

const saveDraffPaper = (isPublish: boolean) => {
  editPaper.value.startTime = formatDateTimeForSave(editPaper.value.startTime)
  editPaper.value.endTime = formatDateTimeForSave(editPaper.value.endTime)
  if (isPublish) {
    editPaper.value.isPublish = true
  }

  const payload = {
    ...editPaper.value,
    startTime: editPaper.value.startTime,
    endTime: editPaper.value.endTime,
    isPublish: editPaper.value.isPublish,
    paperAccess: checkedPermissionsClassAccess.value.map((classId) => ({ classId: classId })),
    shareType: valueOption.value,
  }
  paperStore
    .paperUpdate(paperId.toString(), payload)
    .then(() => {
      notify({
        message: 'Update successfully',
        color: 'success',
      })
      editPaper.value.startTime = formatDateTimeForDisplay(editPaper.value.startTime)
      editPaper.value.endTime = formatDateTimeForDisplay(editPaper.value.endTime)
    })
    .catch((error) => {
      notify({
        message: `Update failing \n ${error}`,
        color: 'danger',
      })
    })
}

const resetAccessTime = () => {
  editPaper.value.startTime = undefined
  editPaper.value.endTime = undefined
}

const checkedPermissionsClassAccess = ref<string[]>([])

onMounted(() => {
  getPaperDetail()
  getGroupClasses()
})
</script>
<template>
  <div class="flex justify-center">
    <div class="md:max-w-[60%] md:min-w-[60%] sm:max-w-[90%] sm:min-w-[90%]">
      <div class="flex justify-center" style="align-items: center">
        <VaCardTitle>Exam name: {{ paperDetail?.examName }}- Code: {{ paperDetail?.examCode }}</VaCardTitle>
      </div>
      <VaCard class="mb-3">
        <VaCardTitle class="justify-between align-center">
          <p>Configuration type</p>
          <VaSwitch v-model="valueSwitch" true-inner-label="Exam" false-inner-label="Practice" />
        </VaCardTitle>
        <VaCardContent class="va-text-secondary text-xs">
          Usually use to serious test, security the answer until the exam finished
        </VaCardContent>
      </VaCard>
      <VaCard class="mb-3">
        <VaCardTitle> General configuration </VaCardTitle>
        <VaDivider class="m-0" />
        <VaCardContent>
          <div class="grid grid-cols-2">
            <VaInput
              v-model="editPaper.examName"
              :rules="[(value) => (value && value.length > 0) || 'Exam name is required']"
              label="Exam name"
              class="mb-2 col-span-2"
            />
            <VaSelect :rules="[(v) => v || 'Field is required']" label="Grade" class="mb-2 pr-1" />
            <VaSelect :rules="[(v) => v || 'Field is required']" label="Subject" class="mb-2 pl-1" />
            <VaSelect :rules="[(v) => v || 'Field is required']" label="Purpose of create exam" class="mb-2 pr-1" />
            <VaCounter
              v-model="editPaper.duration"
              label="Test duration (minutes)"
              :rules="[(v) => v >= 0 || 'Field is required']"
              manual-input
              class="mb-2 w-full pl-1"
            />
            <div class="mb-2 pr-1">
              <VaInput
                v-model="editPaper.startTime"
                label="Access time"
                placeholder="From"
                readonly
                @focus="showFromDatePickerModal = !showFromDatePickerModal"
              >
                <template #appendInner>
                  <VaIcon name="calendar_today" color="secondary" />
                </template>
              </VaInput>
              <VaModal v-slot="{ cancel, ok }" v-model="showFromDatePickerModal" size="auto" hide-default-actions>
                <DatePickerModal
                  @close="cancel"
                  @save="
                    (data: string) => {
                      getDatePickerModal(data, 'fromDate')
                      ok()
                    }
                  "
                />
              </VaModal>
            </div>
            <div class="mb-2 pr-1">
              <VaInput
                v-model="editPaper.endTime"
                class="mb-2 pl-1"
                label=" "
                placeholder="To"
                readonly
                @focus="showToDatePickerModal = !showToDatePickerModal"
              >
                <template #appendInner>
                  <VaIcon name="calendar_today" color="secondary" />
                </template>
              </VaInput>
              <VaModal v-slot="{ cancel, ok }" v-model="showToDatePickerModal" size="auto" hide-default-actions>
                <DatePickerModal
                  @close="cancel"
                  @save="
                    (data: string) => {
                      getDatePickerModal(data, 'toDate')
                      ok()
                    }
                  "
                />
              </VaModal>
            </div>
            <div class="col-span-2 justify-end flex">
              <VaButton size="small" preset="secondary" border-color="primary" @click="resetAccessTime"
                >Reset time</VaButton
              >
            </div>
            <p class="mt-2 text-xs va-text-bold">Who is allowed to take the exam?</p>
            <VaRadio v-model="valueOption" :options="accessOptions" class="assign-radio mb-2" value-by="value" />
            <div
              v-if="valueOption === AccessType.ByClass && groupClasses !== null"
              class="grid grid-cols-3 gap-2 items-start col-span-2"
            >
              <VaCard outlined class="border-style col-span-1">
                <div class="p-2">
                  <VaInput placeholder="Search group class" />
                </div>
                <VaDivider class="m-0" />
                <VaCardContent class="p-1">
                  <VaScrollContainer vertical class="max-h-[40vh]">
                    <VaSidebarItem
                      v-for="groupClass in groupClasses"
                      :key="groupClass.id"
                      :active="selectedGroupClass === groupClass.id"
                    >
                      <VaSidebarItemContent class="p-1 min-h-[30px]" @click="getClassByGroupClass(groupClass.id)">
                        {{ groupClass.name }}
                      </VaSidebarItemContent>
                    </VaSidebarItem>
                  </VaScrollContainer>
                </VaCardContent>
              </VaCard>

              <VaCard outlined class="border-style col-span-2">
                <div class="p-2 flex justify-between">
                  <VaButton preset="secondary"> <VaIcon name="menu_open" /></VaButton>
                  <div>
                    <VaInput placeholder="Search class in group" class="p-0" />
                  </div>
                </div>
                <VaDivider class="m-0" />
                <VaCardContent>
                  <VaOptionList
                    v-model="checkedPermissionsClassAccess"
                    :options="classRoomsInGroup"
                    :text-by="(op: Classrooms) => op.name"
                    value-by="id"
                  />
                </VaCardContent>
              </VaCard>
            </div>
          </div>
        </VaCardContent>
      </VaCard>
      <VaCard class="mb-3">
        <VaCardTitle>Security</VaCardTitle>
        <VaDivider class="m-0" />
        <VaCardContent>
          <div class="grid grid-cols-2">
            <VaInput
              v-model="editPaper.password"
              class="mb-2 pr-1"
              label="Exam password"
              placeholder="Enter password..."
            />
            <VaCounter label="Submitted" manual-input class="mb-2 w-full pl-1" />
          </div>
        </VaCardContent>
      </VaCard>

      <VaCard class="mb-3">
        <VaCardTitle> point an answers review </VaCardTitle>
        <VaDivider class="m-0" />
        <VaCardContent>
          <div class="mb-2">
            <span class="va-title">Show result</span>
            <VaRadio
              :options="['No', 'When submitted', 'When all students submitted']"
              type="radio"
              class="assign-radio"
            />
          </div>
          <div>
            <span class="va-title">Show the exam and answers</span>
            <VaRadio
              :options="[
                'No',
                'When submitted',
                'When all students submitted',
                'When a certain number of points is reached',
              ]"
              type="radio"
              class="assign-radio flex justify-between"
            />
          </div>
        </VaCardContent>
      </VaCard>

      <div class="flex justify-end">
        <VaButton color="warning" size="small" class="p-1 pr-2 pl-2 mr-1" @click="saveDraffPaper(false)"
          >Save draft</VaButton
        >
        <VaButton size="small" class="p-1 pr-2 pl-2 ml-1" @click="saveDraffPaper(true)">Publish</VaButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-style {
  --va-card-outlined-border: 1px solid var(--va-background-element);
}

.assign-radio {
  font-size: 0.7rem;
  --va-radio-icon-width: 1rem;
  --va-radio-icon-height: 1rem;
}
</style>
