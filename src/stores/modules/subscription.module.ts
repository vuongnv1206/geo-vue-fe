import { MyOrderQueryType } from '@/pages/orders/types'
import subscriptionsService from '@/services/subscriptions.service'
import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    isLoadingOrders: false,
  }),
  actions: {
    async getMyOrders(data: MyOrderQueryType): Promise<any> {
      try {
        this.isLoadingOrders = true
        const response = await subscriptionsService.getMyOrders(data)
        this.isLoadingOrders = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoadingOrders = false
        return await Promise.reject(error)
      }
    },
    async cancelOrder(orderId: string): Promise<any> {
      try {
        this.isLoadingOrders = true
        const response = await subscriptionsService.cancelOrder(orderId)
        this.isLoadingOrders = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoadingOrders = false
        return await Promise.reject(error)
      }
    },
  },
})
