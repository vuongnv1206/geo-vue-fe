import { defineStore } from 'pinia'
import { CreateQuestionsRequest, Question } from '@pages/question/types'
import questionService from '@/services/question.service'
import { QuestionTree } from '@pages/question/types'

export const useQuestionEditStore = defineStore('questionEdit', {
  state: () => ({
    listQuestions: [] as Question[],
    folder: {} as QuestionTree,
  }),
  actions: {
    addQuestion(question: Question): void {
      this.listQuestions.push(question)
    },
    setFolder(folder: QuestionTree) {
      this.folder = folder
    },
    clearQuestions(): void {
      this.listQuestions = []
    },

    async createQuestion(data: CreateQuestionsRequest): Promise<void> {
      // fill folderId for all questions
      data.questions.forEach((q) => {
        q.questionFolderId = this.folder.id
      })

      console.log('createQuestion', data)

      return questionService.createQuestion(data)
    },
  },
})
