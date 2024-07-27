import { BasicStatisticPaperRequest, BasicStatisticPaperResponse } from '@/pages/examination/types'
import apiService from './api.service'

export interface IPaperStatisticService {
  basicPaperStatistic(request: BasicStatisticPaperRequest): Promise<BasicStatisticPaperResponse>
}

class PaperStatisticService implements IPaperStatisticService {
  async basicPaperStatistic(request: BasicStatisticPaperRequest): Promise<BasicStatisticPaperResponse> {
    let url = `/v1/paperstatistics/get-exam-info/${request.paperId}`
    if (request.classId !== undefined) {
      url += `?classId=${request.classId}`
    }

    return apiService
      .get(url)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new PaperStatisticService()
