import { CreateMatrixRequest, UpdateMatrixRequest } from '@/pages/examination/types'
import paperMatricesService from '@/services/paperMatrices.service'
import { defineStore } from 'pinia'

export const usePaperMatrixStore = defineStore('paperMatrix', {
  state: () => ({}),
  actions: {
    async createMatrixTemplate(request: CreateMatrixRequest): Promise<string> {
      return paperMatricesService
        .createMatrixTemplate(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteMatrixTemplate(id: string): Promise<any> {
      return paperMatricesService
        .deleteMatrixTemplate(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateMatrixTemplate(request: UpdateMatrixRequest): Promise<string> {
      return paperMatricesService
        .updateMatrixTemplate(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
