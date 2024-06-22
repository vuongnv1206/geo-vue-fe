<script lang="ts" setup>
import { useBreakpoint, useToast } from 'vuestic-ui'
import AppNavbar from '../components/navbar/AppNavbar.vue'
import { onMounted, ref } from 'vue'
import { Question, QuestionType, CreateQuestionsRequest } from '@/pages/question/types'
import QuestionEditView from '@/pages/question/widgets/QuestionEditView.vue'
import { useQuestionEditStore } from '@/stores/modules/questionEdit.module'
// @ts-expect-error Richer is not defined
import Richer from 'richer-than-rich'
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
import { useRouter } from 'vue-router'
import { getErrorMessage } from '@/services/utils'

const breakpoints = useBreakpoint()
const storesQEdit = useQuestionEditStore()
const isMobile = ref(false)

const onResize = () => {
  isMobile.value = breakpoints.smDown
}

const listQuestions = ref<Question[]>([])

const { init } = useToast()
const router = useRouter()

// check if folder not selected
if (!storesQEdit.folder?.id) {
  init({
    title: 'Error',
    message: 'Please select a folder to add question',
    color: 'danger',
  })
  // go to question bank
  router.push({ name: 'question-bank' })
}

// sync listQuestions with store
listQuestions.value = storesQEdit.listQuestions

const editorContent = ref(``)

// sort listQuestions by questionType
listQuestions.value.sort((a, b) => a.questionType - b.questionType)

const renderEditorContent = () => {
  // loop QuestionType.SingleChoice and QuestionType.MultipleChoice
  Object.entries(QuestionType).forEach(([, value]) => {
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
  if (question.rawIndex) {
    listQuestions.value[question.rawIndex - 1] = question
    const editor = document.querySelector('.richer__content') as any
    editorContent.value = ''
    renderEditorContent()
    editor.innerHTML = editorContent.value
  }
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
  console.log(listQuestions.value)
}

const uploadFile = ref<any>()

const handleUploadEvent = () => {
  console.log(uploadFile.value.at(-1))

  // if file extension is txt
  if (uploadFile.value.at(-1).name.split('.').pop() == 'txt') {
    // read the file content
    const reader = new FileReader()
    reader.onload = (e) => {
      // /r/n to /n
      const questions: Question[] = GeoMarkdown2Objects(
        replaceMultipleNewLines(e.target?.result as string).replace(/\r\n/g, '\n'),
      )
      // update listQuestions
      listQuestions.value = questions
      const editor = document.querySelector('.richer__content') as any
      editorContent.value = ''
      renderEditorContent()
      editor.innerHTML = editorContent.value
    }
    reader.readAsText(uploadFile.value.at(-1))
  }

  // if file extension is docx
  if (uploadFile.value.at(-1).name.split('.').pop() == 'docx') {
    // read the file content with api
    storesQEdit
      .ReadQuestionFromFile(uploadFile.value.at(-1))
      .then((res) => {
        const questions: Question[] = GeoMarkdown2Objects(res.at(0) as string)
        // update listQuestions
        listQuestions.value = questions
        const editor = document.querySelector('.richer__content') as any
        editorContent.value = ''
        renderEditorContent()
        editor.innerHTML = editorContent.value
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        init({
          title: 'Error',
          message: message,
          color: 'danger',
        })
      })
  }
}

const addTemplateSingleChoice = () => {
  const question: Question = {
    content: 'Which continent is the largest by land area?',
    image: null,
    audio: null,
    questionType: 1,
    questionPassages: [],
    answers: [
      {
        content: 'Africa',
        isCorrect: false,
      },
      {
        content: 'Asia',
        isCorrect: true,
      },
      {
        content: 'North America',
        isCorrect: false,
      },
      {
        content: 'South America',
        isCorrect: false,
      },
    ],
  }

  listQuestions.value.push(question)
  listQuestions.value.sort((a, b) => a.questionType - b.questionType)
  const editor = document.querySelector('.richer__content') as any
  editorContent.value = ''
  renderEditorContent()
  editor.innerHTML = editorContent.value
}

const addTemplateMultipleChoice = () => {
  const question: Question = {
    content: 'Who formulated the theory of relativity?',
    image: null,
    audio: null,
    questionType: 2,
    questionPassages: [],
    answers: [
      {
        content: 'Isaac Newton',
        isCorrect: false,
      },
      {
        content: 'Max Planck',
        isCorrect: true,
      },
      {
        content: 'Albert Einstein',
        isCorrect: true,
      },
      {
        content: 'Niels Bohr',
        isCorrect: false,
      },
    ],
  }

  listQuestions.value.push(question)
  listQuestions.value.sort((a, b) => a.questionType - b.questionType)
  const editor = document.querySelector('.richer__content') as any
  editorContent.value = ''
  renderEditorContent()
  editor.innerHTML = editorContent.value
}

const addTemplateFillBlank = () => {
  const question: Question = {
    content:
      "The $_fillblank[1] Ocean is the largest ocean on Earth, covering about $_fillblank[2] of the Earth's surface.",
    image: null,
    audio: null,
    questionType: 4,
    questionPassages: [],
    answers: [
      {
        content: '$_[2]30%',
        isCorrect: true,
      },
      {
        content: '$_[1]Pacific',
        isCorrect: true,
      },
    ],
  }

  listQuestions.value.push(question)
  listQuestions.value.sort((a, b) => a.questionType - b.questionType)
  const editor = document.querySelector('.richer__content') as any
  editorContent.value = ''
  renderEditorContent()
  editor.innerHTML = editorContent.value
}

const addTemplateMatching = () => {
  const question: Question = {
    content:
      '{ "Question": "Match the scientists with their discoveries:", "ColumnA": { "1": "Isaac Newton", "2": "Albert Einstein", "3": "Marie Curie", "4": "Charles Darwin" }, "ColumnB": { "1": "Theory of Evolution", "2": "Theory of Relativity", "3": "Law of Gravity", "4": "Radioactivity" } }',
    image: null,
    audio: null,
    questionType: 5,
    questionLable: {
      id: 'ff6115b0-c64d-45f4-a8bc-81390811a7d9',
      name: 'Scientist-Discovery Matching',
      color: 'Primary',
    },
    questionPassages: [],
    answers: [
      {
        content: '1_3|2_2|3_4|4_1',
        isCorrect: true,
      },
    ],
  }

  listQuestions.value.push(question)
  listQuestions.value.sort((a, b) => a.questionType - b.questionType)
  const editor = document.querySelector('.richer__content') as any
  editorContent.value = ''
  renderEditorContent()
  editor.innerHTML = editorContent.value
}

const addTemplateReading = () => {
  const question: Question = {
    content: 'This is a reading passage template',
    image: null,
    audio: null,
    questionType: 6,
    questionPassages: [
      {
        content: ' This is a reading question template',
        answers: [
          {
            content: 'Answer 1',
            isCorrect: true,
          },
          {
            content: 'Answer 2',
            isCorrect: false,
          },
          {
            content: 'Answer 3',
            isCorrect: false,
          },
          {
            content: 'Answer 4',
            isCorrect: true,
          },
        ],
      },
      {
        content: ' This is a reading question template 2',
        answers: [
          {
            content: 'Answer 1',
            isCorrect: false,
          },
          {
            content: 'Answer 2',
            isCorrect: false,
          },
          {
            content: 'Answer 3',
            isCorrect: false,
          },
          {
            content: 'Answer 4',
            isCorrect: true,
          },
        ],
      },
    ],
    answers: [],
  }

  listQuestions.value.push(question)
  listQuestions.value.sort((a, b) => a.questionType - b.questionType)
  const editor = document.querySelector('.richer__content') as any
  editorContent.value = ''
  renderEditorContent()
  editor.innerHTML = editorContent.value
}

const addTemplateWriting = () => {
  const question: Question = {
    content: 'This is a writing template',
    image: null,
    audio: null,
    questionType: 8,
    questionPassages: [],
    answers: [],
  }

  listQuestions.value.push(question)
  listQuestions.value.sort((a, b) => a.questionType - b.questionType)
  const editor = document.querySelector('.richer__content') as any
  editorContent.value = ''
  renderEditorContent()
  editor.innerHTML = editorContent.value
}

const handleBack = () => {
  window.history.back()
}

const isLoading = ref(false)

const handleSaveBtn = () => {
  console.log(listQuestions.value)
  const request: CreateQuestionsRequest = {
    questions: listQuestions.value,
  }
  isLoading.value = true
  storesQEdit
    .createQuestion(request)
    .then(() => {
      init({
        title: 'Success',
        message: 'Questions created successfully',
        color: 'success',
      })
      router.push({ name: 'question-bank' })
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      init({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
    .finally(() => {
      isLoading.value = false
    })
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
      <div style="width: 49vw" class="h-full border-r border-slate-200 bg-[#f1f5f9]" aria-label="Question Format">
        <div>
          <VaCard class="min-h-[41px] border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center justify-start">
              <div>
                <button
                  class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200"
                  @click="handleBack"
                >
                  <div class="mx-2"><VaIcon name="mso-undo" /> <span>Back</span></div>
                </button>
              </div>
              <div>
                <button
                  class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200"
                  @click="handleBack"
                >
                  <div class="mx-2">
                    <VaIcon name="mso-folder" /> <span>{{ storesQEdit.folder?.name }}</span>
                  </div>
                </button>
              </div>
            </div>
            <div>
              <button class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200">
                <div class="mx-2"><VaIcon name="mso-info" /> <span>Questions info</span></div>
              </button>
            </div>
          </VaCard>
        </div>
        <div>
          <div class="p-1">
            <VaScrollContainer class="min-h-[600px] max-h-[90vh]" vertical>
              <div v-for="(question, i) in listQuestions" :key="question.id || ''" class="w-full">
                <QuestionEditView :question="question" :index="i + 1" @edit="handleEditEvent" />
              </div>
            </VaScrollContainer>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <VaInnerLoading :loading="isLoading" :size="60">
        <div style="width: 50vw" class="h-full border-r border-slate-200 bg-[#f1f5f9]" aria-label="Question Format">
          <div>
            <VaCard class="max-h-[41px] border-b border-slate-200 flex items-center justify-between">
              <div class="flex items-center justify-start">
                <div>
                  <VaFileUpload v-model="uploadFile" :hide-file-list="true" @fileAdded="handleUploadEvent">
                    <template #default>
                      <button class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200">
                        <div class="mx-2"><VaIcon name="mso-upload" /> <span>Upload file</span></div>
                      </button>
                    </template>
                  </VaFileUpload>
                </div>
                <div>
                  <button
                    class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200"
                    @click="handleEditorBtnFormat"
                  >
                    <div class="mx-2"><VaIcon name="mso-source_notes" /> <span>Format editor</span></div>
                  </button>
                </div>
              </div>
              <div>
                <button
                  class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200"
                  @click="handleSaveBtn"
                >
                  <div class="mx-2"><VaIcon name="mso-save" /> <span>Save</span></div>
                </button>
              </div>
            </VaCard>
          </div>
          <div class="">
            <div class="flex justify-start p-1">
              <div class="w-full">
                <Richer
                  :model-value="editorContent"
                  :buttons="[
                    {
                      name: 'AddSingleChoice',
                      label: 'Add single choice template',
                      icon: 'i-single_choice',
                      action: addTemplateSingleChoice,
                    },
                    {
                      name: 'AddMultipleChoice',
                      label: 'Add multiple choice template',
                      icon: 'i-multiple_choice',
                      action: addTemplateMultipleChoice,
                    },
                    {
                      name: 'AddFillBlank',
                      label: 'Add fill blank template',
                      icon: 'i-fill_blank',
                      action: addTemplateFillBlank,
                    },
                    {
                      name: 'AddMatching',
                      label: 'Add matching template',
                      icon: 'i-matching',
                      action: addTemplateMatching,
                    },
                    {
                      name: 'AddReading',
                      label: 'Add reading template',
                      icon: 'i-reading',
                      action: addTemplateReading,
                    },
                    {
                      name: 'AddWriting',
                      label: 'Add writing template',
                      icon: 'i-writing',
                      action: addTemplateWriting,
                    },
                  ]"
                  class="h-[90vh]"
                  @keyup="handleEditor"
                  @click="handleEditorClick"
                ></Richer>
              </div>
            </div>
          </div>
        </div>
      </VaInnerLoading>
    </template>
  </VaLayout>
</template>

<style>
.i-single_choice::before {
  content: '\2688';
  margin-bottom: 4px;
}

.i-multiple_choice::before {
  content: '\2689';
  margin-bottom: 4px;
}

.i-fill_blank::before {
  content: '\268A';
  margin-bottom: 4px;
}

.i-matching::before {
  content: '\268B';
  margin-bottom: 4px;
}

.i-reading::before {
  content: '\268C';
  margin-bottom: 4px;
}

.i-writing::before {
  content: '\268D';
  margin-bottom: 4px;
}

.richer__content {
  padding: 12px;
  outline: none;
  flex-grow: 1;
  font-size: 14px;
}

.richer__placeholder {
  display: none;
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
