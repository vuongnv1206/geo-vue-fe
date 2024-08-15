import apiService from '@services/api.service'
import {
  CreatePaperFolderRequest,
  PaperFolderDto,
  PaperFolderTree,
  SearchPaperFolderRequest,
  SearchSharedPaperFolderRequest,
  SharePaperFolderRequest,
  UpdatePaperFolderRequest,
} from '@/pages/examination/types'

export interface IPaperFoldersService {
  paperFolders_Create(request: CreatePaperFolderRequest): Promise<string>

  paperFolders_Search(request: SearchPaperFolderRequest): Promise<PaperFolderTree>

  paperFolders_Delete(id: string): Promise<string>

  paperFolders_Update(request: UpdatePaperFolderRequest, id: string): Promise<string>

  paperFolders_Share(id: string, request: SharePaperFolderRequest): Promise<string>

  paperFolders_GetParents(id: string): Promise<PaperFolderDto[]>

  paperFolders_SearchShared(request: SearchSharedPaperFolderRequest): Promise<PaperFolderTree>
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
  async paperFolders_Search(request: SearchPaperFolderRequest): Promise<PaperFolderTree> {
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

  async paperFolders_GetParents(id: string): Promise<PaperFolderDto[]> {
    return apiService
      .get(`/v1/paperfolders/${id}/parents`)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }

  async paperFolders_SearchShared(request: SearchSharedPaperFolderRequest): Promise<PaperFolderTree> {
    const url = '/v1/paperfolders/shared'

    return apiService
      .post(url, request)
      .catch((error: any) => {
        return Promise.reject(error)
      })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
}

export default new PaperFoldersService()
