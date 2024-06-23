import { defineStore } from 'pinia'
import questionService from '@/services/question.service'
import { QuestionSearchRes, SearchQuestion } from '@pages/question/types'

export const useQuestionStore = defineStore('question', {
  state: () => ({
    sellectedQuestionFolderId: '',
    needReloadQuestionFolder: false,
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
