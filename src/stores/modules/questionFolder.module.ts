import { defineStore } from 'pinia'
import questionFolderService from '@/services/questionFolder.service'
import { QuestionTree, QuestionTreeEmpty, SharePermission } from '@pages/question/types'

export const useQuestionFolderStore = defineStore('questionFolder', {
  state: () => ({}),
  actions: {
    async getQuestionFolders(parentId: string): Promise<QuestionTree> {
      return questionFolderService
        .getQuestionFolders(parentId)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createQuestionFolder(data: QuestionTreeEmpty): Promise<any> {
      return questionFolderService
        .createQuestionFolder(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateQuestionFolder(id: string, data: QuestionTreeEmpty): Promise<any> {
      return questionFolderService
        .updateQuestionFolder(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteQuestionFolder(id: string): Promise<any> {
      return questionFolderService
        .deleteQuestionFolder(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async shareQuestionFolder(id: string, data: SharePermission): Promise<any> {
      return questionFolderService
        .shareQuestionFolder(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
