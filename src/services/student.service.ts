import { EmptyStudent } from '@pages/classrooms/types'
import ApiService from '@services/api.service'

class StudentService {
  async getStudents(data: any): Promise<any> {
    return ApiService.post('/v1/student/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getStudent(id: string): Promise<any> {
    return ApiService.get(`/v1/student/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createStudent(data: EmptyStudent): Promise<any> {
    return ApiService.post('/v1/student', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateStudent(id: string, data: EmptyStudent): Promise<any> {
    return ApiService.put(`/v1/student/student-in-class/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateStudentInClass(id: string, data: EmptyStudent): Promise<any> {
    return ApiService.put(`/v1/student/student-in-class/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteStudent(id: string): Promise<any> {
    return ApiService.delete(`/v1/student/${id}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new StudentService()
