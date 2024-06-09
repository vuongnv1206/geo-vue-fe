import { EmptySubject } from '@/pages/subject/types'
import ApiService from '@services/api.service'

class SubjectService {
  async getSubjects(): Promise<any> {
    return ApiService.post('/v1/subjects/search', { request: {} })
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getSubject(id: string): Promise<any> {
    return ApiService.get(`/v1/subjects/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createSubject(data: EmptySubject): Promise<any> {
    return ApiService.post('/v1/subjects', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateSubject(id: string, data: EmptySubject): Promise<any> {
    return ApiService.put(`/v1/subjects/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteSubject(id: string): Promise<any> {
    return ApiService.delete(`/v1/subjects/${id}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new SubjectService()
