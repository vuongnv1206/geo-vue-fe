import { CreateMatrixRequest, UpdateMatrixRequest } from '@/pages/examination/types'
import apiService from './api.service'

export interface IPaperMatricesService {
  createMatrixTemplate(request: CreateMatrixRequest): Promise<string>
  deleteMatrixTemplate(id: string): Promise<any>
  updateMatrixTemplate(request: UpdateMatrixRequest): Promise<string>
}

export class PaperMatricesService implements IPaperMatricesService {
  async createMatrixTemplate(request: CreateMatrixRequest): Promise<string> {
    const url = '/v1/papermatrices'
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async deleteMatrixTemplate(id: string): Promise<any> {
    const url = `/v1/papermatrices/${id}`
    return apiService
      .delete(url)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
  async updateMatrixTemplate(request: UpdateMatrixRequest): Promise<string> {
    const url = `/v1/papermatrices/${request.id}`
    return apiService
      .put(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new PaperMatricesService()
