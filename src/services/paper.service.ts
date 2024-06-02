import { PaperDto, PaperInListDto, SearchPaperRequest } from '@/pages/examination/types'
import apiService from '@services/api.service'

export interface IPapersService {
  papers_SearchPaper(request: SearchPaperRequest): Promise<PaperInListDto[]>

  papers_Delete(id: string): Promise<string>

  paperDetail(id: string): Promise<PaperDto>
}

export class PapersService implements IPapersService {
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
}

export default new PapersService()
