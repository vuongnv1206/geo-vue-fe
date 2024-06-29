import { EmptyStudent } from '@pages/classrooms/types'
import ApiService from '@services/api.service'

class StudentService {
  async getStudents(data: any): Promise<any> {
    return ApiService.post('/v1/userstudent/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getStudent(id: string): Promise<any> {
    return ApiService.get(`/v1/userstudent/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createStudent(data: EmptyStudent): Promise<any> {
    return ApiService.post('/v1/userstudent', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateStudent(id: string, data: EmptyStudent): Promise<any> {
    return ApiService.put(`/v1/userstudent/student-in-class/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateStudentInClass(id: string, data: EmptyStudent): Promise<any> {
    return ApiService.put(`/v1/userstudent/student-in-class/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteStudent(id: string): Promise<any> {
    return ApiService.delete(`/v1/userstudent/remove-user-student/?id=${id}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new StudentService()
