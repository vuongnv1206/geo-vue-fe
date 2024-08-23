import { QuestionLabelRequest, QuestionLabelResponse } from '@/pages/question/types'
import questionLabelsService from '@/services/questionLabels.service'
import { defineStore } from 'pinia'

export const useQuestionLabelStore = defineStore('questionLabel', {
  state: () => ({}),
  actions: {
    async questionLabelSearch(request: QuestionLabelRequest): Promise<QuestionLabelResponse> {
      return questionLabelsService
        .questionLabelSearch(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
