<script lang="ts" setup>
import { useBreakpoint } from 'vuestic-ui'
import AppNavbar from '../components/navbar/AppNavbar.vue'
import { onMounted, ref } from 'vue'
import { Question, QuestionType } from '@/pages/question/types'
import QuestionEditView from '@/pages/question/widgets/QuestionEditView.vue'
// @ts-expect-error missing type
import richer from 'richer-than-rich' // eslint-disable-line @typescript-eslint/no-unused-vars
import 'richer-than-rich/dist/style.css'
import {
  GeoMarkdown2Objects,
  toGeoMarkdown,
  replaceMultipleNewLines,
  multipleChoiceText2Html,
  singleChoiceText2Html,
  fillBlankText2Html,
  matchingText2Html,
  readingText2Html,
  writingText2Html,
} from '@services/geo-markdown/geo-markdown'

const breakpoints = useBreakpoint()
const isMobile = ref(false)

const onResize = () => {
  isMobile.value = breakpoints.smDown
}

const listQuestions = ref<Question[]>([
  {
    content: 'Who formulated the theory of relativity?',
    image: null,
    audio: null,
    questionFolder: {
      name: 'Science',
      parentId: null,
    },
    questionType: 2,
    questionLable: {
      id: 'e2bc24e8-51b9-4fa6-bacc-88cb58c9e1d1',
      name: 'Scientist',
      color: 'Primary',
    },
    questionPassages: [],
    answers: [
      {
        id: '2dd12924-a608-421c-a17b-72bb1810811f',
        content: 'Isaac Newton',
        questionId: 'd1cb3693-621e-45b6-8f9e-7c86e46e1403',
        isCorrect: false,
      },
      {
        id: '407bb5e0-5006-445f-a78d-1c29fb418f36',
        content: 'Max Planck',
        questionId: 'd1cb3693-621e-45b6-8f9e-7c86e46e1403',
        isCorrect: true,
      },
      {
        id: '832ca96c-94c7-4bb8-bc5a-6bd062b20539',
        content: 'Albert Einstein',
        questionId: 'd1cb3693-621e-45b6-8f9e-7c86e46e1403',
        isCorrect: true,
      },
      {
        id: 'd4c6cd04-f1e9-4e6d-bd7a-fd7ef4c1c93e',
        content: 'Niels Bohr',
        questionId: 'd1cb3693-621e-45b6-8f9e-7c86e46e1403',
        isCorrect: false,
      },
    ],
    createdBy: '00000000-0000-0000-0000-000000000000',
    createdOn: '2024-06-01T15:34:11.979465+07:00',
    lastModifiedBy: '00000000-0000-0000-0000-000000000000',
    lastModifiedOn: '2024-06-01T15:34:11.979465+07:00',
    deletedOn: null,
    deletedBy: null,
    id: 'd1cb3693-621e-45b6-8f9e-7c86e46e1403',
  },
  {
    content: 'Which continent is the largest by land area?',
    image: null,
    audio: null,
    questionFolder: {
      name: 'Geography',
      parentId: null,
    },
    questionType: 1,
    questionLable: {
      id: 'f1d2e705-b45c-4256-a57f-439326b30ef9',
      name: 'Hard',
      color: '#00FF00',
    },
    questionPassages: [],
    answers: [
      {
        id: '07948da7-36ba-4479-925c-8b63d064a742',
        content: 'Africa',
        questionId: 'ecebe811-0b27-4169-8ce2-73b519734740',
        isCorrect: false,
      },
      {
        id: '21f26a03-e987-48c3-9e32-fe7e2f8bec17',
        content: 'Asia',
        questionId: 'ecebe811-0b27-4169-8ce2-73b519734740',
        isCorrect: true,
      },
      {
        id: '45af9e5c-2563-4ac0-908c-453bf3a0ff3a',
        content: 'North America',
        questionId: 'ecebe811-0b27-4169-8ce2-73b519734740',
        isCorrect: false,
      },
      {
        id: '7e2127a1-8941-4287-ae0a-1ec17f27640a',
        content: 'South America',
        questionId: 'ecebe811-0b27-4169-8ce2-73b519734740',
        isCorrect: false,
      },
    ],
    createdBy: '00000000-0000-0000-0000-000000000000',
    createdOn: '2024-06-02T16:57:21.748792+07:00',
    lastModifiedBy: '00000000-0000-0000-0000-000000000000',
    lastModifiedOn: '2024-06-02T16:57:21.748792+07:00',
    deletedOn: null,
    deletedBy: null,
    id: 'ecebe811-0b27-4169-8ce2-73b519734740',
  },
  {
    content:
      "The $_fillblank[1] Ocean is the largest ocean on Earth, covering about $_fillblank[2] of the Earth's surface.\na",
    image: null,
    audio: null,
    questionFolder: {
      name: 'Geography',
      parentId: null,
    },
    questionType: 4,
    questionLable: {
      id: '1c751000-6a24-4b6b-a547-f69df554e1e4',
      name: 'Geography Facts',
      color: 'Primary',
    },
    questionPassages: [],
    answers: [
      {
        id: '41f595dc-4262-42f3-833b-214b4cda1bc8',
        content: '$_[2]30%',
        questionId: '0e20082e-301e-4514-922f-4bdba702bcb8',
        isCorrect: true,
      },
      {
        id: 'ae6a72dc-ab6a-4cfc-beac-f6fb23f61864',
        content: '$_[1]Pacific',
        questionId: '0e20082e-301e-4514-922f-4bdba702bcb8',
        isCorrect: true,
      },
    ],
    createdBy: '00000000-0000-0000-0000-000000000000',
    createdOn: '2024-06-02T16:57:21.749333+07:00',
    lastModifiedBy: '00000000-0000-0000-0000-000000000000',
    lastModifiedOn: '2024-06-02T16:57:21.749333+07:00',
    deletedOn: null,
    deletedBy: null,
    id: '0e20082e-301e-4514-922f-4bdba702bcb8',
  },
  {
    content:
      '{ "Question": "Match the scientists with their discoveries:", "ColumnA": { "1": "Isaac Newton", "2": "Albert Einstein", "3": "Marie Curie", "4": "Charles Darwin" }, "ColumnB": { "1": "Theory of Evolution", "2": "Theory of Relativity", "3": "Law of Gravity", "4": "Radioactivity" } }',
    image: null,
    audio: null,
    questionFolder: {
      name: 'Science',
      parentId: null,
    },
    questionType: 5,
    questionLable: {
      id: 'ff6115b0-c64d-45f4-a8bc-81390811a7d9',
      name: 'Scientist-Discovery Matching',
      color: 'Primary',
    },
    questionPassages: [],
    answers: [
      {
        id: '11c0e62b-62b4-4064-8090-69bbad768278',
        content: '1_3|2_2|3_4|4_1',
        questionId: 'df777b2e-50fa-4905-8bc2-d66b47d38778',
        isCorrect: true,
      },
    ],
    createdBy: '00000000-0000-0000-0000-000000000000',
    createdOn: '2024-06-01T15:34:11.980025+07:00',
    lastModifiedBy: '00000000-0000-0000-0000-000000000000',
    lastModifiedOn: '2024-06-01T15:34:11.980025+07:00',
    deletedOn: null,
    deletedBy: null,
    id: 'df777b2e-50fa-4905-8bc2-d66b47d38778',
  },
  {
    content:
      'The Industrial Revolution was a period of major industrialization and innovation that occurred in the late 18th and early 19th centuries, starting in Great Britain and later spreading throughout the world. It marked a significant shift from agrarian and handicraft-based economies to ones dominated by industry and machine manufacturing. The key developments of the Industrial Revolution included the invention of the steam engine, the expansion of factories, and the mass production of goods. These changes led to urbanization as people moved from rural areas to cities in search of employment opportunities in factories. While the Industrial Revolution brought about many advancements and improvements in living standards for some, it also led to significant social and environmental challenges, including poor working conditions, pollution, and the widening gap between the rich and the poor.',
    image: null,
    audio: null,
    questionFolder: {
      name: 'Science',
      parentId: null,
    },
    questionType: 6,
    questionLable: {
      id: 'e7043234-9650-4b8c-abee-2dc1ea7ecd56',
      name: 'Reading Comprehension',
      color: '#FF0000',
    },
    questionPassages: [
      {
        id: 'bbbabdb4-124e-4857-a3ee-eb1a118553f4',
        content: 'What were some key developments of the Industrial Revolution?',
        answers: [
          {
            id: '45786207-5a32-4f20-a66a-421e998b5c51',
            content:
              'Invention of the printing press, development of the scientific method, and discovery of penicillin.',
            questionId: 'bbbabdb4-124e-4857-a3ee-eb1a118553f4',
            isCorrect: false,
          },
          {
            id: '559ad023-8495-4ecf-89da-088ca2cb0090',
            content: 'Exploration of space, colonization of new lands, and establishment of trade routes.',
            questionId: 'bbbabdb4-124e-4857-a3ee-eb1a118553f4',
            isCorrect: false,
          },
          {
            id: 'a5747274-9e56-4055-85d9-73338fdb0e5d',
            content: 'Discovery of electricity, invention of the telephone, and development of the internet.',
            questionId: 'bbbabdb4-124e-4857-a3ee-eb1a118553f4',
            isCorrect: false,
          },
          {
            id: 'ff737a30-b270-4a05-a7e6-e534ce889319',
            content: 'Invention of the steam engine, expansion of factories, and mass production of goods.',
            questionId: 'bbbabdb4-124e-4857-a3ee-eb1a118553f4',
            isCorrect: true,
          },
        ],
      },
      {
        id: 'f0835619-2161-4180-8dbf-2c89545c0a66',
        content: 'What was the Industrial Revolution?',
        answers: [
          {
            id: '6d3b8488-8aaf-444c-a000-5058be287b75',
            content: 'A period of political revolution in Europe.',
            questionId: 'f0835619-2161-4180-8dbf-2c89545c0a66',
            isCorrect: false,
          },
          {
            id: '97ef51e2-4531-4c55-90a7-2d275c9c9acf',
            content: 'A period of artistic and cultural revival in Italy.',
            questionId: 'f0835619-2161-4180-8dbf-2c89545c0a66',
            isCorrect: false,
          },
          {
            id: '9b2df5c6-94ed-4a35-b35a-b51108d82d13',
            content: 'A period of religious reform in the Middle East.',
            questionId: 'f0835619-2161-4180-8dbf-2c89545c0a66',
            isCorrect: false,
          },
          {
            id: 'c5520f10-0ec2-488f-8028-2dd34225fc8f',
            content:
              'A period of major industrialization and innovation that occurred in the late 18th and early 19th centuries.',
            questionId: 'f0835619-2161-4180-8dbf-2c89545c0a66',
            isCorrect: true,
          },
        ],
      },
    ],
    answers: [],
    createdBy: '00000000-0000-0000-0000-000000000000',
    createdOn: '2024-06-01T15:34:11.980051+07:00',
    lastModifiedBy: '00000000-0000-0000-0000-000000000000',
    lastModifiedOn: '2024-06-01T15:34:11.980052+07:00',
    deletedOn: null,
    deletedBy: null,
    id: '1ca69809-9bad-40c6-af91-068b542696db',
  },
  {
    content: 'Test add',
    image: '/disk/test.png',
    audio: '',
    questionFolder: {
      name: 'Science',
      parentId: null,
    },
    questionType: 1,
    questionLable: null,
    questionPassages: [],
    answers: [
      {
        id: '3b478d94-20d9-43c2-b274-4fcda9b03cb9',
        content: 'answer 2',
        questionId: 'aea88efd-2f2d-402c-bf7e-10bebe8b4a31',
        isCorrect: false,
      },
      {
        id: 'f9ffb027-712a-4f04-aad9-334b0870fc44',
        content: 'answer 1',
        questionId: 'aea88efd-2f2d-402c-bf7e-10bebe8b4a31',
        isCorrect: true,
      },
    ],
    createdBy: 'ab592601-d719-4f96-a0b8-0fba5e4c1c12',
    createdOn: '2024-06-01T19:11:21.308363+07:00',
    lastModifiedBy: 'ab592601-d719-4f96-a0b8-0fba5e4c1c12',
    lastModifiedOn: '2024-06-01T19:11:21.308363+07:00',
    deletedOn: null,
    deletedBy: null,
    id: 'aea88efd-2f2d-402c-bf7e-10bebe8b4a31',
  },
  {
    content: 'Write a short essay on the importance of education in society.',
    image: null,
    audio: null,
    questionFolder: {
      name: 'Education',
      parentId: null,
    },
    questionType: 8,
    questionLable: {
      id: '54b11199-e390-4024-999d-672418619043',
      name: 'Essay',
      color: 'Primary',
    },
    questionPassages: [],
    answers: [],
    createdBy: '00000000-0000-0000-0000-000000000000',
    createdOn: '2024-06-02T16:57:21.749744+07:00',
    lastModifiedBy: '00000000-0000-0000-0000-000000000000',
    lastModifiedOn: '2024-06-02T16:57:21.749744+07:00',
    deletedOn: null,
    deletedBy: null,
    id: '2283e817-c513-4b44-8558-32b31e96485e',
  },
])

const editorContent = ref(``)

// sort listQuestions by questionType
listQuestions.value.sort((a, b) => a.questionType - b.questionType)

const renderEditorContent = () => {
  // loop QuestionType.SingleChoice and QuestionType.MultipleChoice
  Object.entries(QuestionType).forEach(([key, value]) => {
    console.log(key)
    if (
      value === QuestionType.SingleChoice &&
      listQuestions.value.some((question) => question.questionType === value)
    ) {
      editorContent.value += '<strong style="font-weight: bold;">[SINGLE CHOICE]</strong>'
      for (let i = 0; i < listQuestions.value.length; i++) {
        if (listQuestions.value[i].questionType === QuestionType.SingleChoice) {
          editorContent.value += singleChoiceText2Html(toGeoMarkdown(listQuestions.value[i], i))
          editorContent.value += '<p><br></p>'
        }
      }
    }

    if (
      value === QuestionType.MultipleChoice &&
      listQuestions.value.some((question) => question.questionType === value)
    ) {
      editorContent.value += '<strong style="font-weight: bold;">[MULTIPLE CHOICE]</strong>'
      for (let i = 0; i < listQuestions.value.length; i++) {
        if (listQuestions.value[i].questionType === QuestionType.MultipleChoice) {
          editorContent.value += multipleChoiceText2Html(toGeoMarkdown(listQuestions.value[i], i))
          editorContent.value += '<p><br></p>'
        }
      }
    }

    if (value === QuestionType.FillBlank && listQuestions.value.some((question) => question.questionType === value)) {
      editorContent.value += '<strong style="font-weight: bold;">[FILL BLANK]</strong>'
      for (let i = 0; i < listQuestions.value.length; i++) {
        if (listQuestions.value[i].questionType === QuestionType.FillBlank) {
          editorContent.value += fillBlankText2Html(toGeoMarkdown(listQuestions.value[i], i))
          editorContent.value += '<p><br></p>'
        }
      }
    }

    if (value === QuestionType.Matching && listQuestions.value.some((question) => question.questionType === value)) {
      editorContent.value += '<strong style="font-weight: bold;">[MATCHING]</strong>'
      for (let i = 0; i < listQuestions.value.length; i++) {
        if (listQuestions.value[i].questionType === QuestionType.Matching) {
          editorContent.value += matchingText2Html(toGeoMarkdown(listQuestions.value[i], i))
          editorContent.value += '<p><br></p>'
        }
      }
    }

    if (value === QuestionType.Reading && listQuestions.value.some((question) => question.questionType === value)) {
      editorContent.value += '<strong style="font-weight: bold;">[READING]</strong>'
      for (let i = 0; i < listQuestions.value.length; i++) {
        if (listQuestions.value[i].questionType === QuestionType.Reading) {
          editorContent.value += readingText2Html(toGeoMarkdown(listQuestions.value[i], i))
          editorContent.value += '<p><br></p>'
        }
      }
    }

    if (value === QuestionType.Writing && listQuestions.value.some((question) => question.questionType === value)) {
      editorContent.value += '<strong style="font-weight: bold;">[WRITING]</strong>'
      for (let i = 0; i < listQuestions.value.length; i++) {
        if (listQuestions.value[i].questionType === QuestionType.Writing) {
          editorContent.value += writingText2Html(toGeoMarkdown(listQuestions.value[i], i))
          editorContent.value += '<p><br></p>'
        }
      }
    }
  })
}

renderEditorContent()

const handleEditEvent = (question: Question) => {
  if (question.index) {
    listQuestions.value[question.index - 1] = question
    const editor = document.querySelector('.richer__content') as any
    editorContent.value = ''
    renderEditorContent()
    editor.innerHTML = editorContent.value
  }
  console.log(listQuestions.value)
}

const handleEditor = (data: any) => {
  const editor = document.querySelector('.richer__content') as any
  const questions: Question[] = GeoMarkdown2Objects(replaceMultipleNewLines(editor?.innerText))
  // update listQuestions
  listQuestions.value = questions
  console.log(data)
}

const handleEditorClick = (data: any) => {
  console.log(data)
}

const handleEditorBtnFormat = (data: any) => {
  const editor = document.querySelector('.richer__content') as any
  editorContent.value = ''
  renderEditorContent()
  editor.innerHTML = editorContent.value
  console.log(data)
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()

  const editor = document.querySelector('.richer__content') as any
  const questions: Question[] = GeoMarkdown2Objects(replaceMultipleNewLines(editor?.innerText))
  listQuestions.value = questions
})
</script>

<template>
  <VaLayout class="h-screen bg-[var(--va-background-secondary)]">
    <template #top>
      <AppNavbar :is-mobile="isMobile" class="border-b border-slate-200" />
    </template>

    <template #left>
      <div style="width: 50vw" class="h-full border-r border-slate-200 bg-[#f1f5f9]" aria-label="Question Format">
        <div>
          <VaCard class="min-h-[41px] border-b border-slate-200 flex items-center justify-end">
            <div>
              <button class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200">
                <div class="mx-2"><VaIcon name="mso-info" /> <span>Questions info</span></div>
              </button>
            </div>
          </VaCard>
        </div>
        <div>
          <div class="p-1">
            <VaScrollContainer class="min-h-[600px] max-h-[790px]" vertical>
              <div v-for="(question, i) in listQuestions" :key="question.id || ''" class="w-full">
                <QuestionEditView :question="question" :index="i + 1" @edit="handleEditEvent" />
              </div>
            </VaScrollContainer>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div style="width: 50vw" class="h-full border-r border-slate-200 bg-[#f1f5f9]" aria-label="Question Format">
        <div>
          <VaCard class="min-h-[41px] border-b border-slate-200 flex items-center justify-start">
            <div>
              <button class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200">
                <div class="mx-2"><VaIcon name="mso-upload" /> <span>Upload file</span></div>
              </button>
            </div>
            <div>
              <button
                class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200"
                @click="handleEditorBtnFormat"
              >
                <div class="mx-2"><VaIcon name="mso-source_notes" /> <span>Format editor</span></div>
              </button>
            </div>
          </VaCard>
        </div>
        <div class="">
          <div class="flex justify-start p-1">
            <div class="w-full">
              <Richer
                :model-value="editorContent"
                :buttons="[{ name: 'format', label: 'Format', icon: 'i-moon', action: handleEditorBtnFormat }]"
                class="h-[785px]"
                @keyup="handleEditor"
                @click="handleEditorClick"
              ></Richer>
            </div>
          </div>
        </div>
      </div>
    </template>
  </VaLayout>
</template>

<style>
.richer__content {
  padding: 12px;
  outline: none;
  flex-grow: 1;
  font-size: 14px;
}

.richer__content strong {
  font-family: Consolas, 'Courier New', monospace;
}

.richer__content p {
  font-family: Consolas, 'Courier New', monospace;
  counter-increment: line;
  position: relative;
}

.richer__content br {
  counter-increment: line;
  position: relative;
}

.richer__content span {
  font-family: Consolas, 'Courier New', monospace;
}

.richer__content {
  counter-reset: line;
  position: relative;
  padding-left: 70px;
  /* Adjust the left padding as needed */
}

.richer__content > * {
  counter-increment: line;
  position: relative;
}

.passage_q {
  margin-left: 25px;
}

.passage_q::before {
  content: counter(line);
  position: absolute;
  left: -75px !important;
  width: 20px;
  text-align: right;
  color: #237893;
}

.richer__content > *::before {
  content: counter(line);
  position: absolute;
  left: -50px;
  width: 20px;
  text-align: right;
  color: #237893;
}
</style>
