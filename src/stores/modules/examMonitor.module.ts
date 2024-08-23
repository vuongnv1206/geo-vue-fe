import { defineStore } from 'pinia'
import { StudentMonitorResponse } from '@pages/examination/types'
import ExamMonitorService from '@/services/examMonitor.service'

export const useExamMonitorStore = defineStore('examMonitor', {
  state: () => ({}),
  actions: {
    async getExamMonitor(data: any): Promise<StudentMonitorResponse> {
      return ExamMonitorService.getExamMonitor(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async reassign(data: any): Promise<any> {
      return ExamMonitorService.reassign(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async suspend(data: any): Promise<any> {
      return ExamMonitorService.suspend(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getExamMonitorDetail(data: any): Promise<any> {
      return ExamMonitorService.getExamMonitorDetail(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
