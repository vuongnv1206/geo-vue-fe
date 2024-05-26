import papersService from '@/services/paper.service'
import { PaperInListDto, SearchPaperRequest } from '@/pages/examination/types'

import { defineStore } from 'pinia'

export const usePaperStore = defineStore('paper', {
  state: () => ({
    error: null as string | null,
    papers: [] as PaperInListDto[],
  }),
  actions: {
    async searchPapers(request: SearchPaperRequest): Promise<PaperInListDto[]> {
      try {
        const response = await papersService.papers_SearchPaper(request)
        this.papers = response
        return response
      } catch (error) {
        this.error = error as string
        throw error
      }
    },
  },
})
