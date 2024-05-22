import apiService from '@services/api.service'
import {
  CreatePaperFolderRequest,
  PaperFolderDto,
  SearchPaperFolderRequest,
  SharePaperFolderRequest,
  UpdatePaperFolderRequest,
} from '@/pages/examination/types'

export interface IPaperFoldersService {
  paperFolders_Create(request: CreatePaperFolderRequest): Promise<string>

  paperFolders_Search(request: SearchPaperFolderRequest): Promise<PaperFolderDto[]>

  paperFolders_Delete(id: string): Promise<string>

  paperFolders_Update(request: UpdatePaperFolderRequest, id: string): Promise<string>

  paperFolders_Share(id: string, request: SharePaperFolderRequest): Promise<string>
}

class PaperFoldersService implements IPaperFoldersService {
  async paperFolders_Create(request: CreatePaperFolderRequest): Promise<string> {
    const url = '/v1/paperfolders'

    return apiService
      .post(url, request)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }

  /**
   * Search paper folder using available filder
   */
  async paperFolders_Search(request: SearchPaperFolderRequest): Promise<PaperFolderDto[]> {
    const url = '/v1/paperfolders/search'

    return apiService
      .post(url, request)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }

  async paperFolders_Delete(id: string): Promise<string> {
    return apiService
      .delete(`/v1/paperfolders/${id}`)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }

  async paperFolders_Update(request: UpdatePaperFolderRequest, id: string): Promise<string> {
    return apiService
      .put(`/v1/paperfolders/${id}`, request)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }

  async paperFolders_Share(id: string, request: SharePaperFolderRequest): Promise<string> {
    return apiService
      .post(`/v1/paperfolders/${id}/share-paper-folder`, request)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
}

export default new PaperFoldersService()