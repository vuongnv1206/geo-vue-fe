import { RefreshType } from '@/pages/notification/types'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    isRefreshData: {
      status: false,
      isFromDropDown: null,
    } as RefreshType,
  }),
  actions: {
    setRefreshData(value: RefreshType) {
      this.isRefreshData = value
    },
  },
})
