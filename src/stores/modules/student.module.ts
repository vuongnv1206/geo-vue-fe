import { defineStore } from 'pinia'
import studentService from '@/services/student.service'
import { EmptyStudent, StudentResponse } from '@/pages/classrooms/types'

export const useStudentStore = defineStore('student', {
  state: () => ({}),
  actions: {
    async getStudents(data: any): Promise<StudentResponse> {
      return studentService
        .getStudents(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getStudent(id: string): Promise<any> {
      return studentService
        .getStudent(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createStudent(data: EmptyStudent): Promise<any> {
      return studentService
        .createStudent(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateStudent(id: string, data: any): Promise<any> {
      return studentService
        .updateStudent(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    deleteStudent(id: string): Promise<any> {
      return studentService
        .deleteStudent(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    getFormatFileImportStudent(): Promise<any> {
      return studentService
        .getFormatFileImportStudent()
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getFailedFileImportStudent(data: any): Promise<any> {
      return studentService
        .getFailedFileImportStudent(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    uploadStudentFile(file: File, classId: string): Promise<any> {
      return studentService
        .uploadStudentFile(file, classId)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
