import { defineStore } from 'pinia'
import questionService from '@/services/question.service'
import { Question, QuestionSearchRes, SearchQuestion } from '@pages/question/types'

export const useQuestionStore = defineStore('question', {
  state: () => ({
    sellectedQuestionFolderId: '',
    needReloadQuestionFolder: false,
    editMode: false,
    questionToEdit: {} as Question,
  }),
  actions: {
    async SearchQuestion(data: SearchQuestion): Promise<QuestionSearchRes> {
      return questionService
        .searchQuestion(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateQuestion(data: Question): Promise<void> {
      return questionService
        .updateQuestion(data, data.id || '')
        .then(() => {
          return Promise.resolve()
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async DeleteQuestion(id: string): Promise<void> {
      return questionService
        .deleteQuestion(id)
        .then(() => {
          return Promise.resolve()
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
