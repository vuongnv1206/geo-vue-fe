<script lang="ts" setup>
import { useStatisticPaperStore } from '@/stores/modules/paperStatistic.module'
import { ref, watch } from 'vue'
import { DataTableColumnSource, useToast } from 'vuestic-ui'
import { ListQuestionStatisticRequest, ListQuestionStatisticResponse, WrongStudentInfo } from '../types'
import { getErrorMessage, notifications } from '@/services/utils'
import { QuestionType } from '@/pages/question/types'
import { QuestionTypeColor, QuestionTypeLabel } from '@services/utils'

const props = defineProps<{
  paperId: string
  classId?: string
}>()

const { init: notify } = useToast()

const statisticPaperStore = useStatisticPaperStore()

const responseData = ref<ListQuestionStatisticResponse>()

const getQuestionStatistic = async (paperId: string, classId?: string) => {
  const request = ref<ListQuestionStatisticRequest>({
    paperId: paperId,
    classId: classId === '' ? undefined : classId,
  })

  try {
    const res = await statisticPaperStore.questionStatistic(request.value)
    responseData.value = res
  } catch (error) {
    notify({
      message: notifications.getFailed('question statistic ') + getErrorMessage(error),
      color: 'danger',
    })
  }
}

watch(
  () => props.classId,
  async (newClassId) => {
    await getQuestionStatistic(props.paperId, newClassId)
  },
  { immediate: true },
)

const columnTable: DataTableColumnSource<string>[] = [
  { key: '', width: '100px' },
  {
    label: 'Raw Index',
    key: 'rawIndex',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Question type',
    key: 'questionType',
    thAlign: 'center',
    tdAlign: 'center',
  },
  {
    label: 'Total number of students taking the exam',
    key: 'totalTest',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Number of students who have done',
    key: 'totalAnswered',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Number of students who have not done',
    key: 'totalNotAnswered',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Number of students doing it right',
    key: 'totalCorrect',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Number of students doing it wrong',
    key: 'totalWrong',
    thAlign: 'center',
    tdAlign: 'center',
    sortable: true,
    width: '150px',
  },
  {
    label: 'List of candidates doing wrong',
    key: 'wrongStudents',
    thAlign: 'center',
    tdAlign: 'center',
  },
]

const indexToLetter = (index: number) => {
  return String.fromCharCode(65 + index)
}

const formatWrongStudents = (wrongStudents: WrongStudentInfo[]) => {
  if (!wrongStudents || !Array.isArray(wrongStudents)) {
    return 'No data'
  }
  return wrongStudents
    .map((student) => `${student.firstName || ''} ${student.lastName || ''}`)
    .filter((name) => name.trim() !== '')
    .join(', ')
}

const formatContent = (content: string) => {
  const data = JSON.parse(content)

  const Qcontent = (data.Question as string).replace(/\n/g, '<br>')

  const columnA = Object.keys(data.ColumnA)
    .map((key) => `<li class="mt-2">${key}. ${data.ColumnA[key]}</li>`)
    .join('')

  const columnB = Object.keys(data.ColumnB)
    .map((key) => `<li class="mt-2">${key}. ${data.ColumnB[key]}</li>`)
    .join('')

  const html = `
    <div  style="line-height: initial;" >${Qcontent}</div>
    <div class="flex flex-wrap gap-4 mt-2">
      <div class="border border-dashed border-backgroundBorder p-5">
        <h6><b>Column A</b></h6>
        <ul class="mt-2">
          ${columnA}
        </ul>
      </div>
      <div class="border border-dashed border-backgroundBorder p-5">
        <h6><b>Column B</b></h6>
        <ul class="mt-2">
          ${columnB}
        </ul>
      </div>
    </div>
  `
  return html
}
</script>
<template>
  <VaCard>
    <VaCardTitle>Statistical table of the ratio of right and wrong</VaCardTitle>
    <VaCardContent>
      <VaDataTable
        :items="responseData?.data"
        :columns="columnTable"
        sticky-header
        :disable-client-side-sorting="false"
        class="va-data-table-statistic"
      >
        <template #cell(wrongStudents)="{ row }">
          <span>
            {{ formatWrongStudents(row.source.wrongStudents) }}
          </span>
        </template>

        <template #cell(rawIndex)="{ row }">
          <span>
            {{ row.source.rawIndex + 1 }}
          </span>
        </template>

        <template #cell(questionType)="{ row }">
          <span>
            <VaBadge
              :text="QuestionTypeLabel(row.source.questionType as QuestionType)"
              :color="QuestionTypeColor(row.source.questionType as QuestionType)"
              class="mr-2"
            />
          </span>
        </template>

        <template #cell()="{ row, isExpanded }">
          <VaButton
            size="small"
            :icon="isExpanded ? 'va-arrow-up' : 'va-arrow-down'"
            preset="secondary"
            @click="row.toggleRowDetails()"
          >
            {{ isExpanded ? 'Hide' : 'Content' }}
          </VaButton>
        </template>

        <template #expandableRow="{ rowData }">
          <div v-if="(rowData.questionType as QuestionType) === QuestionType.Matching" class="p-4">
            <!-- eslint-disable vue/no-v-html -->
            <div v-html="formatContent(rowData.content || '')"></div>
            <!-- eslint-enable -->

            <div v-if="rowData.answers">
              <p v-for="ans in rowData.answers" :key="ans.id">{{ ans.content }}</p>
            </div>
          </div>
          <div v-else-if="(rowData.questionType as QuestionType) === QuestionType.Reading" class="p-4">
            <VaDataTable
              :items="rowData.questionPassages"
              :columns="columnTable"
              hide-default-header
              sticky-header
              :disable-client-side-sorting="false"
            >
              <template #cell(wrongStudents)="{ row }">
                <span>
                  {{ formatWrongStudents(row.source.wrongStudents) }}
                </span>
              </template>

              <template #cell(rawIndex)="{ row }">
                <span>
                  {{ row.source.rawIndex + 1 }}
                </span>
              </template>
              <template #cell(questionType)="{ row }">
                <span>
                  <VaBadge
                    :text="QuestionTypeLabel(row.source.questionType as QuestionType)"
                    :color="QuestionTypeColor(row.source.questionType as QuestionType)"
                    class="mr-2"
                  />
                </span>
              </template>

              <template #cell()="{ row, isExpanded }">
                <VaButton
                  size="small"
                  :icon="isExpanded ? 'va-arrow-up' : 'va-arrow-down'"
                  preset="secondary"
                  @click="row.toggleRowDetails()"
                >
                  {{ isExpanded ? 'Hide' : 'Content' }}
                </VaButton>
              </template>

              <template #expandableRow="{ rowData }">
                <div class="p-4">
                  <p style="width: 50%; text-wrap: wrap">
                    {{ rowData.content }}
                  </p>
                  <div v-if="rowData.answers">
                    <p v-for="(ans, index) in rowData.answers" :key="index">
                      {{ indexToLetter(index) }}. {{ ans.content }}
                    </p>
                  </div>
                </div>
              </template>
            </VaDataTable>
          </div>
          <div v-else class="p-4">
            <p style="width: 50%; text-wrap: wrap">
              {{ rowData.content }}
            </p>
            <div v-if="rowData.answers">
              <p v-for="(ans, index) in rowData.answers" :key="index">{{ indexToLetter(index) }}. {{ ans.content }}</p>
            </div>
          </div>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
</template>

<style lang="scss">
.va-data-table-statistic th,
.va-data-table-statistic td {
  text-wrap: pretty;
}

.va-data-table-statistic tr,
.va-data-table-statistic td,
.va-data-table-statistic th {
  border: 1px solid rgb(229, 231, 235);
}
</style>
