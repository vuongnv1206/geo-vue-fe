import {
  GroupTeacherResponse,
  SendRequestJoinGroupRequest,
  SetPermissionInClassGroup,
  SetPermissionInClassTeacher,
  TeacherInGroupRequest,
} from '@/pages/teacher-group/types'
import apiService from './api.service'

class GroupTeacherService {
  async getGroupTeachers(data: any): Promise<any> {
    return apiService
      .post(`/v1/groupteachers/search`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getTeacherInTeam(data: any): Promise<any> {
    return apiService
      .post(`/v1/teacherteams/search`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async addGroupTeacher(data: any): Promise<any> {
    return apiService
      .post(`v1/groupteachers`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async addTeacherIntoTeam(data: any): Promise<any> {
    return apiService
      .post(`v1/teacherteams/teacher-in-team`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteGroupTeacher(id: string): Promise<any> {
    return apiService
      .delete(`v1/groupteachers/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteTeacherInTeam(id: string): Promise<any> {
    return apiService
      .delete(`v1/teacherteams/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async updateGroupTeacher(id: string, data: any): Promise<any> {
    return apiService
      .put(`v1/groupteachers/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async updateTeacherInTeam(id: string, data: any): Promise<any> {
    return apiService
      .put(`v1/teacherteams/teacher-in-team/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async addTeacherIntoGroup(data: TeacherInGroupRequest): Promise<any> {
    return apiService
      .post(`v1/groupteachers/add-teacher-into-group`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async removeTeacherInGroup(data: any): Promise<any> {
    return apiService
      .post(`v1/groupteachers/remove-teacher-into-group`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getGroupDetail(id: string): Promise<any> {
    return apiService
      .get(`v1/groupteachers/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async setPermissionGroupInClass(data: SetPermissionInClassGroup): Promise<any> {
    return apiService
      .post('v1/permissionclasses/group-permission-in-class', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getTeacherPermissionDetail(teacherId: string): Promise<any> {
    return apiService
      .get(`v1/permissionclasses/teacher-permission-in-class/${teacherId}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async setPermissionTeacherInClass(data: SetPermissionInClassTeacher): Promise<any> {
    return apiService
      .post('v1/permissionclasses/teacher-permission-in-class', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async sendRequestJoinGroup(data: SendRequestJoinGroupRequest): Promise<any> {
    return apiService
      .post('v1/groupteachers/request-join-group', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async shareTeacherGroups(data: any): Promise<GroupTeacherResponse> {
    return apiService
      .post('v1/groupteachers/shared-group', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new GroupTeacherService()
