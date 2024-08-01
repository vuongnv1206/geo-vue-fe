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
import apiService from './api.service'

export interface IPaperStatisticService {
  basicPaperStatistic(request: BasicStatisticPaperRequest): Promise<BasicStatisticPaperResponse>
  frequencyMarkClassroomStatistic(request: ClassroomFrequencyMarkRequest): Promise<ClassroomFrequencyMarkResponse[]>
  frequencyMarkStatistic(request: ClassroomFrequencyMarkRequest): Promise<ClassroomFrequencyMarkResponse>
  questionStatistic(request: ListQuestionStatisticRequest): Promise<ListQuestionStatisticResponse>
  transcriptStatistic(request: TranscriptStatisticRequest): Promise<TranscriptStatisticResponse>
}

class PaperStatisticService implements IPaperStatisticService {
  async transcriptStatistic(request: TranscriptStatisticRequest): Promise<TranscriptStatisticResponse> {
    const url = '/v1/paperstatistics/List-transcript'

    return apiService
      .post(url, request)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async frequencyMarkClassroomStatistic(
    request: ClassroomFrequencyMarkRequest,
  ): Promise<ClassroomFrequencyMarkResponse[]> {
    const url = `/v1/paperstatistics/classroom-frequency-mark`

    return apiService
      .post(url, request)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async frequencyMarkStatistic(request: ClassroomFrequencyMarkRequest): Promise<ClassroomFrequencyMarkResponse> {
    const url = `/v1/paperstatistics/frequency-mark`

    return apiService
      .post(url, request)
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

  async questionStatistic(request: ListQuestionStatisticRequest): Promise<ListQuestionStatisticResponse> {
    const url = '/v1/paperstatistics/list-question-statistic'

    return apiService
      .post(url, request)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new PaperStatisticService()
