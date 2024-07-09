import { defineStore } from 'pinia'
import questionService from '@/services/question.service'
import { Question, QuestionSearchRes, SearchQuestion } from '@pages/question/types'

export const useQuestionStore = defineStore('question', {
  state: () => ({
    sellectedQuestionFolderId: '',
    needReloadQuestionFolder: false,
    editMode: false,
    questionToEdit: {} as Question,
    refresh: false,
  }),
  actions: {
    setRefresh(value: boolean) {
      this.refresh = value
    },
    async SearchMyQuestion(data: SearchQuestion): Promise<QuestionSearchRes> {
      return questionService
        .searchMyQuestion(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async SearchPendingQuestion(data: SearchQuestion): Promise<QuestionSearchRes> {
      return questionService
        .searchPendingQuestion(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async RejectPendingQuestion(data: any): Promise<any> {
      return questionService
        .rejectPendingQuestion(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async ApprovePendingQuestion(data: any): Promise<any> {
      return questionService
        .approvePendingQuestion(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
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
