import { PaperLabelResponse } from '@/pages/examination/types'
import paperLabelService from '@/services/paperLabel.service'
import { defineStore } from 'pinia'

export const usePaperLabelStore = defineStore('paperLabel', {
  state: () => ({}),
  actions: {
    async searchPaperLabels(dataFilter: any): Promise<PaperLabelResponse> {
      return paperLabelService
        .paperLabels_Search(dataFilter)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async createPaperLabel(data: any): Promise<any> {
      return paperLabelService
        .paperLabels_Create(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async deletePaperLabel(id: string): Promise<any> {
      return paperLabelService
        .paperLabels_Delete(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async updatePaperLabel(data: any, id: string): Promise<any> {
      return paperLabelService
        .paperLabels_Update(data, id)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async getPaperLabel(id: string): Promise<any> {
      return paperLabelService
        .paperLabels_Get(id)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
