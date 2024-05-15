import { defineStore } from 'pinia'
import questionFolderService from '@/services/questionFolder.service'
import { QuestionTree } from '@pages/question/types'

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
  },
})
