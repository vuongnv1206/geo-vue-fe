import { defineStore } from 'pinia'
import { PaperStudentsResponse, PaperStudentsHistoryResponse } from '@/pages/examination/types'
import paperStudentsService from '@/services/paperStudents.service'

export const usePaperStudentsStore = defineStore('PaperStudents', {
  state: () => ({}),
  actions: {
    async getPaperStudents(data: any): Promise<PaperStudentsResponse> {
      return paperStudentsService
        .getPaperStudents(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getPaperStudentsHistory(data: any): Promise<PaperStudentsHistoryResponse> {
      return paperStudentsService
        .getPaperStudentsHistory(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
