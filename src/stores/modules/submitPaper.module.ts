import submitPapersService from '@/services/submitPaper.service'
import { GetLastResultExamRequest, LastResultExamDto } from './../../pages/examination/types'

import { defineStore } from 'pinia'
export const useSubmitPaperStore = defineStore('submitPaper', {
  state: () => ({
    error: null as string | null,
  }),
  actions: {
    async getLastResultExam(request: GetLastResultExamRequest): Promise<LastResultExamDto> {
      try {
        const response = await submitPapersService.submitPapers_GetLastResult(request)
        return response
      } catch (error) {
        this.error = error as string
        throw error
      }
    },
  },
})
