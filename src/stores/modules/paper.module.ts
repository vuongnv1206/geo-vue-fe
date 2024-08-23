import {
  AddQuestionsInPaperRequest,
  GetAccessPaperRequest,
  GetAccessPaperResponse,
  GetGetAssigneesInPaperRequest,
  GetGetAssigneesInPaperResponse,
  PaperDeletedResponse,
  PaperInListDto,
  QuestionGenerateToMatrix,
  SearchPaperRequest,
  SearchSharedPaperRequest,
  SharePaperRequest,
  UpdateQuestionsInPaperRequest,
} from './../../pages/examination/types'
import papersService from '@/services/paper.service'
import {
  PaperDto,
  UpdatePaperRequest,
  PaperStudentDto,
  SubmitPaperResponse,
  CreatePaperRequest,
} from '@/pages/examination/types'

import { defineStore } from 'pinia'
import { dataPaperIds } from '@/pages/bin/types'

export const usePaperStore = defineStore('paper', {
  state: () => ({
    isRefresh: false,
  }),
  actions: {
    setRefresh(value: boolean) {
      this.isRefresh = value
    },
    async restoreDeletedPapers(dataFilter: any): Promise<any> {
      return await papersService
        .papers_RestoreDeletedPaper(dataFilter)

        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deletedMultiPapers(dataFilter: dataPaperIds): Promise<any> {
      return await papersService
        .papers_DeletedMultiPaper(dataFilter)

        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async searchDeletedPapers(dataFilter: any): Promise<PaperDeletedResponse> {
      return await papersService
        .papers_SearchDeletedPaper(dataFilter)

        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async searchPapers(request: SearchPaperRequest): Promise<PaperInListDto[]> {
      return await papersService
        .papers_SearchPaper(request)

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
    async searchSharedPapers(request: SearchSharedPaperRequest): Promise<PaperInListDto[]> {
      return await papersService
        .papers_SearchSharedPaper(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getQuestionFromMatrix(matrixId: string): Promise<QuestionGenerateToMatrix[]> {
      return await papersService
        .getQuestionFromMatrix(matrixId)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteQuestionInPaper(paperId: string, questionId: string): Promise<any> {
      return await papersService
        .deleteQuestionInPaper(paperId, questionId)
        .then((res) => {
          return Promise.resolve(res.data)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async addQuestionsInPaper(paperId: string, request: AddQuestionsInPaperRequest): Promise<any> {
      return await papersService
        .addQuestionsInPaper(paperId, request)
        .then((res) => {
          return Promise.resolve(res.data)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateQuestionsInPaper(id: string, request: UpdateQuestionsInPaperRequest): Promise<any> {
      return await papersService
        .updateQuestionsInPaper(id, request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getGroupClassesAccessPaper(request: GetAccessPaperRequest): Promise<GetAccessPaperResponse> {
      return await papersService
        .getGroupClassesAccessPaper(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getAssigneesInPaper(request: GetGetAssigneesInPaperRequest): Promise<GetGetAssigneesInPaperResponse> {
      return await papersService
        .getAssigneesInPaper(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async sharePaper(id: string, request: SharePaperRequest): Promise<string> {
      return await papersService
        .papers_Share(id, request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
