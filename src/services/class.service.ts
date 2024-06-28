import { Classrooms, EmptyClassrooms } from '@/pages/classrooms/types'
import apiService from './api.service'
import { AssignmentClass } from '@/pages/assignment/types'

class ClassService {
  async getClasses(data: any): Promise<any> {
    return apiService
      .post('/v1/class/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getClassById(id: string): Promise<any> {
    return apiService
      .get(`/v1/class/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async addClassroom(data: EmptyClassrooms): Promise<any> {
    return apiService
      .post(`v1/class`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateClassroom(id: string, data: Classrooms): Promise<Classrooms> {
    return apiService
      .put(`v1/class/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async deleteClassroom(id: string): Promise<Classrooms> {
    return apiService
      .delete(`v1/class/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async removeAssignmentFromClass(data: AssignmentClass): Promise<any> {
    return apiService
      .post(`v1/class/remove-assignment-from-class`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  //=========================================================================================================
  // xóa bỏ getClassroomByGroupClass
  async getClassroomByGroupClass(): Promise<Classrooms> {
    return apiService
      .get(`/v1/groupclasses/group-class-detail`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getClassroomByGroupClassId(id: string): Promise<Classrooms[]> {
    return apiService
      .get(`/v1/class/get-class-by-group-class?groupClassId=${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getClassroomByUser(): Promise<Classrooms[]> {
    return apiService
      .get(`/v1/class`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getUserInClass(id: string): Promise<any> {
    return apiService
      .get(`/v1/class/getall-user-in-class?classId=${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new ClassService()
