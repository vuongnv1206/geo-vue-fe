import { GroupClass } from '@/pages/classrooms/type'
import apiService from '@services/api.service'

class GroupClassService {
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
}

export default new GroupClassService()
