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
  async getFormatFileImportStudent(): Promise<any> {
    return ApiService.getFile('/v1/student/format-import-student-excel', { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'student-import-template.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getFailedFileImportStudent(data: any): Promise<any> {
    return ApiService.postFileData('/v1/student/failed-import-student-excel', data, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'failed-student-import.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async uploadStudentFile(file: File, classId: string): Promise<void> {
    const formData = new FormData()
    formData.append('formFile', file)
    return ApiService.post(`/v1/student/import-student-excel?classId=${classId}`, formData)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new StudentService()
