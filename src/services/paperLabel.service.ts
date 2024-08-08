import apiService from '@services/api.service'
import { PaperLabelDto, PaperLabelResponse } from '@/pages/examination/types'

export interface IPaperFoldersService {
  paperLabels_Create(data: any): Promise<string>

  paperLabels_Search(data: any): Promise<PaperLabelResponse>

  paperLabels_Delete(id: string): Promise<string>

  paperLabels_Update(data: any, id: string): Promise<string>

  paperLabels_Get(id: string): Promise<PaperLabelDto>
}

class PaperLabelsService implements IPaperFoldersService {
  paperLabels_Get(id: string): Promise<PaperLabelDto> {
    return apiService
      .post(`/v1/paperLabels/search`, id)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  paperLabels_Create(data: any): Promise<string> {
    return apiService
      .post(`v1/paperLabels`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  paperLabels_Search(data: any): Promise<PaperLabelResponse> {
    return apiService
      .post(`/v1/paperLabels/search`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  paperLabels_Delete(id: string): Promise<string> {
    return apiService
      .delete(`v1/paperLabels/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  paperLabels_Update(data: any, id: string): Promise<string> {
    return apiService
      .put(`v1/paperLabels/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new PaperLabelsService()
