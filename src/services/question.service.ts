import apiService from '@services/api.service'
import {
  GetQuestionRandomRequest,
  Question,
  QuestionSearchRes,
  RejectApproveQuestion,
  SearchQuestion,
} from '@/pages/question/types'

class QuestionService {
  async deleteMultiQuestion(data: any): Promise<void> {
    return apiService
      .deleteMultiple('/v1/question', {
        data,
      })
      .then(() => {
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async restoreDeletedQuestion(data: RejectApproveQuestion): Promise<any> {
    return apiService
      .put('/v1/question/restore-deleted', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async searchDeletedQuestion(data: SearchQuestion): Promise<QuestionSearchRes> {
    return apiService
      .post('/v1/question/search-my-deleted', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async searchMyQuestion(data: SearchQuestion): Promise<QuestionSearchRes> {
    return apiService
      .post('/v1/question/search-my-requests', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async searchPendingQuestion(data: SearchQuestion): Promise<QuestionSearchRes> {
    return apiService
      .post('/v1/question/search-approval', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async rejectPendingQuestion(data: RejectApproveQuestion): Promise<any> {
    return apiService
      .put('/v1/question/reject', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async approvePendingQuestion(data: RejectApproveQuestion): Promise<any> {
    return apiService
      .put('/v1/question/approve', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
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
  async deleteQuestion(id: string): Promise<void> {
    return apiService
      .delete(`/v1/question/${id}`)
      .then(() => {
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createQuestion(data: any): Promise<void> {
    return apiService
      .post('/v1/question', data)
      .then(() => {
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateQuestion(data: any, id: string): Promise<void> {
    return apiService
      .put('/v1/question/' + id, data)
      .then(() => {
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async readQuestionFromFile(file: any): Promise<string[]> {
    const formData = new FormData()
    formData.append('Files', file)
    return apiService
      .post('/v1/question/read-from-file', formData)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getQuestionRandomMatrix(request: GetQuestionRandomRequest): Promise<Question[]> {
    return apiService
      .post('/v1/question/question-random', request)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new QuestionService()
