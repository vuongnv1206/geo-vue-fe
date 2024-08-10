import { MyOrderQueryType } from '@/pages/orders/types'
import { CreateOrderType } from '@/pages/subscription/types'
import apiService from '@services/api.service'

class subscriptionsService {
  async getSubscriptions(): Promise<any> {
    return apiService
      .get(`/v1/payment/subcriptions`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createOrder(data: CreateOrderType): Promise<any> {
    return apiService
      .post(`/v1/payment/create-order`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getMyOrders(data: MyOrderQueryType): Promise<any> {
    return apiService
      .post(`/v1/payment/get-orders`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async cancelOrder(orderId: string): Promise<any> {
    return apiService
      .put(`/v1/payment/cancel-order/${orderId}`, null)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
export default new subscriptionsService()
