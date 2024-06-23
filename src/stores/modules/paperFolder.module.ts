import PaperFoldersService from '@/services/paperFolder.service'
import {
  CreatePaperFolderRequest,
  PaperFolderDto,
  PaperFolderResponse,
  SharePaperFolderRequest,
  UpdatePaperFolderRequest,
} from '@/pages/examination/types'
import { defineStore } from 'pinia'

export const usePaperFolderStore = defineStore('paperFolder', {
  state: () => ({}),
  actions: {
    async createPaperFolder(request: CreatePaperFolderRequest): Promise<string> {
      return await PaperFoldersService.paperFolders_Create(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async searchPaperFolders(dataFilter: any): Promise<PaperFolderResponse> {
      return await PaperFoldersService.paperFolders_Search(dataFilter)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deletePaperFolder(id: string): Promise<string> {
      return await PaperFoldersService.paperFolders_Delete(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updatePaperFolder(request: UpdatePaperFolderRequest, id: string): Promise<string> {
      return await PaperFoldersService.paperFolders_Update(request, id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async sharePaperFolder(id: string, request: SharePaperFolderRequest): Promise<string> {
      return await PaperFoldersService.paperFolders_Share(id, request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getListParents(id: string): Promise<PaperFolderDto[]> {
      return await PaperFoldersService.paperFolders_GetParents(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
