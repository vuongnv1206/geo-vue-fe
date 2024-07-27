import { BasicStatisticPaperRequest, BasicStatisticPaperResponse } from '@/pages/examination/types'
import paperStatisticService from '@/services/paperStatistic.service'
import { defineStore } from 'pinia'

export const useStatisticPaperStore = defineStore('paperStatistic', {
  state: () => ({}),
  actions: {
    async basicPaperStatistic(request: BasicStatisticPaperRequest): Promise<BasicStatisticPaperResponse> {
      return await paperStatisticService
        .basicPaperStatistic(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
