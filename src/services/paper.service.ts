import { PaperInListDto, SearchPaperRequest } from '@/pages/examination/types'
import apiService from '@services/api.service'

export interface IPapersService {
  papers_SearchPaper(request: SearchPaperRequest): Promise<PaperInListDto[]>
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
}

export default new PapersService()
