import papersService from '@/services/paper.service'
import {
  PaperDto,
  UpdatePaperRequest,
  PaperStudentDto,
  SubmitPaperResponse,
  CreatePaperRequest,
  PaperResponse,
} from '@/pages/examination/types'

import { defineStore } from 'pinia'

export const usePaperStore = defineStore('paper', {
  state: () => ({}),
  actions: {
    async searchPapers(dataFilter: any): Promise<PaperResponse> {
      return await papersService
        .papers_SearchPaper(dataFilter)

        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deletePaper(id: string): Promise<string> {
      return await papersService
        .papers_Delete(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async paperDetail(id: string): Promise<PaperDto> {
      return await papersService
        .paperDetail(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async paperDetailByStudentRole(id: string): Promise<PaperStudentDto> {
      return await papersService
        .paperDetailByStudentRole(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async paperUpdate(id: string, request: UpdatePaperRequest): Promise<any> {
      return await papersService
        .paperUpdate(id, request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getSubmittedStudentsInPaper(paperId: string, request: any): Promise<SubmitPaperResponse> {
      return await papersService
        .getSubmittedStudentsInPaper(paperId, request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createPaper(request: CreatePaperRequest): Promise<any> {
      return await papersService
        .createPaper(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
