import { QuestionLabelRequest, QuestionLabelResponse } from '@/pages/question/types'
import apiService from '@services/api.service'

export interface IQuestionLabelService {
  questionLabelSearch(request: QuestionLabelRequest): Promise<QuestionLabelResponse>
}

export class QuestionLabelService implements IQuestionLabelService {
  async questionLabelSearch(request: QuestionLabelRequest): Promise<QuestionLabelResponse> {
    const url = '/v1/questionlabel/search'
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

export default new QuestionLabelService()
