import { GroupClass, GroupClassResponse } from '@/pages/classrooms/types'
import apiService from '@services/api.service'

class GroupClassService {
  async getGroupClasses(data: any): Promise<any> {
    return apiService
      .post('/v1/groupclasses/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getGroupClass(): Promise<GroupClass[]> {
    return apiService
      .get(`/v1/groupclasses`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async updateGroupClass(id: string, data: GroupClass): Promise<GroupClass> {
    return apiService
      .put(`/v1/groupclasses/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async createGroupClass(payload: GroupClass): Promise<GroupClass> {
    return apiService
      .post(`/v1/groupclasses`, payload)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteGroupClass(id: string): Promise<GroupClass> {
    return apiService
      .delete(`/v1/groupclasses/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async sharedGroupClass(dataFilter: any): Promise<GroupClassResponse> {
    return apiService
      .post('/v1/class/shared-classes', dataFilter)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new GroupClassService()
