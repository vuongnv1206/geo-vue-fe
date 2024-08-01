import {
  BasicStatisticPaperRequest,
  BasicStatisticPaperResponse,
  ClassroomFrequencyMarkRequest,
  ClassroomFrequencyMarkResponse,
  ListQuestionStatisticRequest,
  ListQuestionStatisticResponse,
  TranscriptStatisticRequest,
  TranscriptStatisticResponse,
} from '@/pages/examination/types'
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
    async frequencyMarkClassroomStatistic(
      request: ClassroomFrequencyMarkRequest,
    ): Promise<ClassroomFrequencyMarkResponse[]> {
      return await paperStatisticService
        .frequencyMarkClassroomStatistic(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async frequencyMarkStatistic(request: ClassroomFrequencyMarkRequest): Promise<ClassroomFrequencyMarkResponse> {
      return await paperStatisticService
        .frequencyMarkStatistic(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async questionStatistic(request: ListQuestionStatisticRequest): Promise<ListQuestionStatisticResponse> {
      return await paperStatisticService
        .questionStatistic(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async transcriptStatistic(request: TranscriptStatisticRequest): Promise<TranscriptStatisticResponse> {
      return await paperStatisticService
        .transcriptStatistic(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
