import apiService from '@services/api.service'
import { QuestionSearchRes, SearchQuestion } from '@/pages/question/types'

class QuestionService {
  async searchQuestion(data: SearchQuestion): Promise<QuestionSearchRes> {
    return apiService
      .post('/v1/question/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new QuestionService()
