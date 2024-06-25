import { useNotificationStore } from '@/stores/modules/notification.module'
import apiService from '@services/api.service'

class NotificationService {
  async getNotification(data: any): Promise<any> {
    return apiService
      .post(`/v1/notifications/get-notifications`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async sendToAll(data: any): Promise<any> {
    return apiService
      .post(`/v1/notifications/send-to-all`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getUnread(): Promise<any> {
    return apiService
      .get(`/v1/notifications/count-unread`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateReadStatus(id: string, data: any, isFromDropDown: boolean): Promise<any> {
    return apiService
      .put(`/v1/notifications/update-read-status/${id}`, data)
      .then((response) => {
        useNotificationStore().setRefreshData({
          status: true,
          isFromDropDown,
        })
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateReadAll(data: any, isFromDropDown: boolean): Promise<any> {
    return apiService
      .put(`/v1/notifications/read-all`, data)
      .then((response) => {
        useNotificationStore().setRefreshData({
          status: true,
          isFromDropDown,
        })
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
export default new NotificationService()
