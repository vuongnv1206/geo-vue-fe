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
import { useQuestionStore } from '@/stores/modules/question.module'
import { storeToRefs } from 'pinia'
import { useQuestionFolderStore } from '@/stores/modules/questionFolder.module'

const breakpoints = useBreakpoint()
const storesQEdit = useQuestionEditStore()
const storesQuestionFolder = useQuestionFolderStore()
const isMobile = ref(false)
const storesQuestion = useQuestionStore()
const onResize = () => {
  isMobile.value = breakpoints.smDown
}

const listQuestions = ref<Question[]>([])

const { init } = useToast()
const router = useRouter()

// check if folder not selected of tab questions
if (storesQuestionFolder.currentTab === 0) {
  if (!storesQEdit.folder?.id) {
    init({
      title: 'Error',
      message: 'Please select a folder to add question',
      color: 'danger',
    })
    // go to question bank
    router.push({ name: 'questions' })
  }
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

const handelSelectLable = (question: Question) => {
  console.log(question)
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
    rawIndex: getUniqueRawIndex(),
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
    rawIndex: getUniqueRawIndex(),
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
    rawIndex: getUniqueRawIndex(),
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
    rawIndex: getUniqueRawIndex(),
    content:
      '{ "Question": "Match the scientists with their discoveries:", "ColumnA": { "1": "Isaac Newton", "2": "Albert Einstein", "3": "Marie Curie", "4": "Charles Darwin" }, "ColumnB": { "1": "Theory of Evolution", "2": "Theory of Relativity", "3": "Law of Gravity", "4": "Radioactivity" } }',
    image: null,
    audio: null,
    questionType: 5,
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
    rawIndex: getUniqueRawIndex(),
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
    rawIndex: getUniqueRawIndex(),
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

const getUniqueRawIndex = () => {
  const rawIndex = listQuestions.value.map((question) => question.rawIndex)
  if (rawIndex.length === 0) return 1
  return Math.max(...(rawIndex as number[])) + 1
}

const infoEditQ = () => {
  console.log('info')
}

const { sellectedQuestionFolderId, editMode, questionToEdit } = storeToRefs(storesQuestion)
const handleBack = () => {
  if (storesQuestionFolder.currentTab === 0) sellectedQuestionFolderId.value = storesQEdit.folder?.id
  window.history.back()
}

const isLoading = ref(false)

const handleSaveBtn = () => {
  if (editMode.value) {
    console.log('edit')
    if (listQuestions.value.length === 0) {
      init({
        title: 'Error',
        message: 'Please add questions',
        color: 'danger',
      })
    } else {
      const q = listQuestions.value.at(-1)
      if (storesQuestionFolder.currentTab === 0) questionToEdit.value.questionFolderId = storesQEdit.folder?.id
      questionToEdit.value.content = q?.content || ''
      questionToEdit.value.image = q?.image || null
      questionToEdit.value.audio = q?.audio || null
      questionToEdit.value.questionType = q?.questionType || QuestionType.Other
      questionToEdit.value.answers = q?.answers || []
      questionToEdit.value.questionPassages = q?.questionPassages || null
      questionToEdit.value.questionLable = q?.questionLable || null
      if (q) {
        isLoading.value = true
        storesQuestion
          .updateQuestion(questionToEdit.value)
          .then(() => {
            init({
              title: 'Success',
              message: 'Question updated successfully',
              color: 'success',
            })
            if (storesQuestionFolder.currentTab === 0) {
              sellectedQuestionFolderId.value = storesQEdit.folder?.id
              router.push({ name: 'questions' })
            } else if (storesQuestionFolder.currentTab === 3) {
              router.push({ name: 'questions', query: { tab: 3 } })
            }
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
    }
  } else {
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
        if (storesQuestionFolder.currentTab === 0) {
          sellectedQuestionFolderId.value = storesQEdit.folder?.id
          router.push({ name: 'questions' })
        } else if (storesQuestionFolder.currentTab === 3) {
          router.push({ name: 'questions', query: { tab: 3 } })
        } else {
          router.push({ name: 'questions' })
        }
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
}

const button = [
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
]

const handleDownloadFile = () => {
  const baseUrl = (import.meta.env.VITE_APP_BASE_URL as string).slice(0, -4)
  const fileUrl = `${baseUrl}/files/QuestionImportTemplate.docx`

  window.open(fileUrl, '_blank')
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
      <div
        style="width: 49vw"
        class="h-full border-r border-slate-200 bg-[var(--va-background-border)]"
        aria-label="Question Format"
      >
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
                <QuestionEditView
                  :question="question"
                  :index="i + 1"
                  @edit="handleEditEvent"
                  @selectLable="handelSelectLable"
                />
              </div>
            </VaScrollContainer>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <VaInnerLoading :loading="isLoading" :size="60">
        <div
          style="width: 50vw"
          class="h-full border-r border-slate-200 bg-[var(--va-background-border)]"
          aria-label="Question Format"
        >
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
                    @click="handleDownloadFile"
                  >
                    <div class="mx-2"><VaIcon name="mso-download" /> <span>Download file</span></div>
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
              </div>
              <div>
                <button
                  class="text-primary h-[41px] flex items-center justify-center border-x border-slate-200"
                  @click="handleSaveBtn"
                >
                  <div class="mx-2">
                    <VaIcon name="mso-save" /> <span> {{ editMode ? 'Update' : 'Save' }}</span>
                  </div>
                </button>
              </div>
            </VaCard>
          </div>
          <div class="geo-editor">
            <div class="flex justify-start p-1">
              <div class="w-full">
                <div class="m-2">Select a template to add a question</div>
                <Richer
                  v-if="!editMode"
                  :model-value="editorContent"
                  :buttons="button"
                  class="h-[90vh]"
                  @keyup="handleEditor"
                  @click="handleEditorClick"
                ></Richer>
                <Richer
                  v-else
                  :model-value="editorContent"
                  class="h-[90vh]"
                  :buttons="[
                    {
                      name: 'Info',
                      label: 'Info',
                      icon: 'i-info',
                      action: infoEditQ,
                    },
                  ]"
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

<style scoped>
.border-slate-200 {
  border-color: var(--va-background-element);
}
</style>

<style>
.geo-editor .i-single_choice::before {
  content: '\2688';
  margin-bottom: 4px;
}

.geo-editor .i-multiple_choice::before {
  content: '\2689';
  margin-bottom: 4px;
}

.geo-editor .i-fill_blank::before {
  content: '\268A';
  margin-bottom: 4px;
}

.geo-editor .i-matching::before {
  content: '\268B';
  margin-bottom: 4px;
}

.geo-editor .i-reading::before {
  content: '\268C';
  margin-bottom: 4px;
}

.geo-editor .i-writing::before {
  content: '\268D';
  margin-bottom: 4px;
}

.geo-editor .i-info::before {
  content: '\2690';
  margin-bottom: 4px;
}

.geo-editor .richer__content {
  padding: 12px;
  outline: none;
  flex-grow: 1;
  font-size: 14px;
}

.geo-editor .richer__placeholder {
  display: none;
}

.geo-editor .richer__content strong {
  font-family: Consolas, 'Courier New', monospace;
}

.geo-editor .richer__content p {
  font-family: Consolas, 'Courier New', monospace;
  counter-increment: line;
  position: relative;
}

.geo-editor .richer__content br {
  counter-increment: line;
  position: relative;
}

.geo-editor .richer__content span {
  font-family: Consolas, 'Courier New', monospace;
}

.geo-editor .richer__content {
  counter-reset: line;
  position: relative;
  padding-left: 70px;
  /* Adjust the left padding as needed */
}

.geo-editor .richer__content > * {
  counter-increment: line;
  position: relative;
}

.geo-editor .passage_q {
  margin-left: 25px;
}

.geo-editor .passage_q::before {
  content: counter(line);
  position: absolute;
  left: -75px !important;
  width: 20px;
  text-align: right;
  color: #237893;
}

.geo-editor .richer__content > *::before {
  content: counter(line);
  position: absolute;
  left: -50px;
  width: 20px;
  text-align: right;
  color: #237893;
}
</style>
