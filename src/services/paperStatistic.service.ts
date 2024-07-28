import {
  BasicStatisticPaperRequest,
  BasicStatisticPaperResponse,
  ClassroomFrequencyMarkRequest,
  ClassroomFrequencyMarkResponse,
} from '@/pages/examination/types'
import apiService from './api.service'

export interface IPaperStatisticService {
  basicPaperStatistic(request: BasicStatisticPaperRequest): Promise<BasicStatisticPaperResponse>
  frequencyMarkStatistic(request: ClassroomFrequencyMarkRequest): Promise<ClassroomFrequencyMarkResponse>
}

class PaperStatisticService implements IPaperStatisticService {
  async frequencyMarkStatistic(request: ClassroomFrequencyMarkRequest): Promise<ClassroomFrequencyMarkResponse> {
    let url = `/v1/paperstatistics/classroom-frequency-mark?PaperId=${request.paperId}`
    if (request.classroomId !== undefined) {
      url += `?classroomId=${request.classroomId}`
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
