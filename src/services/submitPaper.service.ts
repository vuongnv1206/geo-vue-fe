import { GetLastResultExamRequest, LastResultExamDto } from '@/pages/examination/types'
import apiService from './api.service'

export interface ISubmitPapersService {
  submitPapers_GetLastResult(request: GetLastResultExamRequest): Promise<LastResultExamDto>
}

export class SubmitPapersService implements ISubmitPapersService {
  async submitPapers_GetLastResult(request: GetLastResultExamRequest): Promise<LastResultExamDto> {
    return apiService
      .post(`/v1/submitpapers/last-result`, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new SubmitPapersService()
