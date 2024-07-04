import { QueryAuditLogsType } from '@/pages/audit-logs/types'
import auditLogsService from '@/services/auditLogs.service'
import { defineStore } from 'pinia'

export const useAuditLogsStore = defineStore('auditLogs', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    async getAuditLogs(data: QueryAuditLogsType): Promise<any> {
      try {
        this.isLoading = true
        const response = await auditLogsService.getAuditLogs(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async getResourceType(): Promise<any> {
      try {
        this.isLoading = true
        const response = await auditLogsService.getResourceType()
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
  },
})
