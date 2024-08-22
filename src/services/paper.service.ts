import { dataPaperIds } from '@/pages/bin/types'
import {
  PaperDto,
  UpdatePaperRequest,
  PaperStudentDto,
  CreatePaperRequest,
  SearchSharedPaperRequest,
  PaperInListDto,
  PaperDeletedResponse,
  QuestionGenerateToMatrix,
  AddQuestionsInPaperRequest,
  UpdateQuestionsInPaperRequest,
  SearchPaperRequest,
  GetAccessPaperRequest,
  GetAccessPaperResponse,
} from '@/pages/examination/types'
import apiService from '@services/api.service'

export interface IPapersService {
  papers_SearchPaper(request: SearchPaperRequest): Promise<PaperInListDto[]>

  papers_Delete(id: string): Promise<string>

  paperDetail(id: string): Promise<PaperDto>

  paperUpdate(id: string, request: UpdatePaperRequest): Promise<any>

  papers_SearchSharedPaper(request: SearchSharedPaperRequest): Promise<PaperInListDto[]>

  getQuestionFromMatrix(matrixId: string): Promise<QuestionGenerateToMatrix[]>

  deleteQuestionInPaper(paperId: string, questionId: string): Promise<any>

  addQuestionsInPaper(paperId: string, request: AddQuestionsInPaperRequest): Promise<any>

  updateQuestionsInPaper(paperId: string, request: UpdateQuestionsInPaperRequest): Promise<any>

  getGroupClassesAccessPaper(request: GetAccessPaperRequest): Promise<GetAccessPaperResponse>
}

export class PapersService implements IPapersService {
  getGroupClassesAccessPaper(request: GetAccessPaperRequest): Promise<GetAccessPaperResponse> {
    const url = '/v1/papers/get-access-paper'
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  getQuestionFromMatrix(matrixId: string): Promise<QuestionGenerateToMatrix[]> {
    const url = '/v1/papers/get-questions-from-matrix'
    const request = {
      matrixId: matrixId,
    }
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async paperUpdate(id: string, request: UpdatePaperRequest): Promise<any> {
    return apiService
      .put(`/v1/papers/${id}`, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async papers_RestoreDeletedPaper(dataFilter: any): Promise<any> {
    const url = '/v1/papers/restore-deleted'
    return apiService
      .put(url, dataFilter)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }

  async papers_DeletedMultiPaper(data: dataPaperIds): Promise<any> {
    const url = '/v1/papers'
    return apiService
      .deleteMultiple(url, {
        data,
      })
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }

  async papers_SearchDeletedPaper(dataFilter: any): Promise<PaperDeletedResponse> {
    const url = '/v1/papers/search-deleted'
    return apiService
      .post(url, dataFilter)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
  async papers_SearchPaper(request: SearchPaperRequest): Promise<PaperInListDto[]> {
    const url = '/v1/papers/search'

    return apiService
      .post(url, request)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
  async papers_Delete(id: string): Promise<string> {
    return apiService
      .delete(`/v1/papers/${id}`)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
  async paperDetail(id: string): Promise<PaperDto> {
    return apiService
      .get(`/v1/papers/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async paperDetailByStudentRole(id: string): Promise<PaperStudentDto> {
    return apiService
      .get(`/v1/submitpapers/paper/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getSubmittedStudentsInPaper(paperId: string, request: any): Promise<any> {
    return apiService
      .post(`/v1/submitpapers/paper/${paperId}/students-submitted`, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createPaper(request: CreatePaperRequest): Promise<any> {
    return apiService
      .post('/v1/papers', request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async papers_SearchSharedPaper(request: SearchSharedPaperRequest): Promise<PaperInListDto[]> {
    const url = '/v1/papers/shared'

    return apiService
      .post(url, request)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }

  async deleteQuestionInPaper(paperId: string, questionId: string): Promise<any> {
    const url = `/v1/papers/${paperId}/questions/${questionId}`
    return apiService
      .delete(url)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async addQuestionsInPaper(paperId: string, request: AddQuestionsInPaperRequest): Promise<any> {
    const url = `/v1/papers/${paperId}/questions`
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async updateQuestionsInPaper(id: string, request: UpdateQuestionsInPaperRequest): Promise<any> {
    const url = `/v1/papers/${id}/questions`
    return apiService
      .put(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new PapersService()
