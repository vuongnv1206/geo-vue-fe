import {
  AssignmentToClassRequest,
  Classrooms,
  EmptyClassrooms,
  UserInClass,
  UserInClassRequest,
} from '@/pages/classrooms/type'
import apiService from './api.service'

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

  async getUserInClass(id: string): Promise<Classrooms> {
    return apiService
      .get(`/v1/class/getall-user-in-class/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async addUserInClass(data: UserInClass): Promise<Classrooms> {
    return apiService
      .post(`v1/class/add-user-in-class`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateUserInClass(id: string, data: UserInClass): Promise<Classrooms> {
    return apiService
      .put(`v1/class/update-user-in-class/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async deleteUserInClass(data: UserInClassRequest): Promise<Classrooms> {
    return apiService
      .post(`v1/class/delete-user-in-class`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getClassSearch(data: any): Promise<any> {
    return apiService
      .post(`v1/class/search`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async AssignAssignmentToClass(data: AssignmentToClassRequest): Promise<any> {
    return apiService
      .post(`v1/class/assign-assignment-to-class`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async RemoveAssignmentFromClass(data: AssignmentToClassRequest): Promise<any> {
    return apiService
      .post(`v1/class/remove-assignment-from-class`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new ClassService()
