import {
  PaperDto,
  UpdatePaperRequest,
  PaperStudentDto,
  CreatePaperRequest,
  PaperResponse,
  SearchSharedPaperRequest,
  PaperInListDto,
} from '@/pages/examination/types'
import apiService from '@services/api.service'

export interface IPapersService {
  papers_SearchPaper(dataFilter: any): Promise<PaperResponse>

  papers_Delete(id: string): Promise<string>

  paperDetail(id: string): Promise<PaperDto>

  paperUpdate(id: string, request: UpdatePaperRequest): Promise<any>

  papers_SearchSharedPaper(request: SearchSharedPaperRequest): Promise<PaperInListDto[]>
}

export class PapersService implements IPapersService {
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

  async papers_SearchPaper(dataFilter: any): Promise<PaperResponse> {
    const url = '/v1/papers/search'

    return apiService
      .post(url, dataFilter)
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
}

export default new PapersService()
