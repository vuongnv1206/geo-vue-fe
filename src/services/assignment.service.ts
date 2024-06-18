import { EmptyAssignment } from '@pages/assignment/types'
import ApiService from '@services/api.service'

class AssignmentService {
  async getAssignments(): Promise<any> {
    return ApiService.post('/v1/assignments/search', { request: {} })
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getAssignment(id: string): Promise<any> {
    return ApiService.get(`/v1/assignments/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createAssignment(data: EmptyAssignment): Promise<any> {
    return ApiService.post('/v1/assignments', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateAssignment(id: string, data: EmptyAssignment): Promise<any> {
    return ApiService.put(`/v1/assignments/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteAssignment(id: string): Promise<any> {
    return ApiService.delete(`/v1/assignments/${id}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new AssignmentService()