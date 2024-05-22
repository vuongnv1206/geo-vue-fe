import PaperFoldersService from '@/services/paperFolder.service'
import {
  CreatePaperFolderRequest,
  PaperFolderDto,
  SearchPaperFolderRequest,
  SharePaperFolderRequest,
  UpdatePaperFolderRequest,
} from '@/pages/examination/types'
import { defineStore } from 'pinia'

export const usePaperFolderStore = defineStore('paperFolder', {
  state: () => ({
    error: null as string | null,
    paperFolders: [] as PaperFolderDto[],
  }),
  actions: {
    async createPaperFolder(request: CreatePaperFolderRequest): Promise<string> {
      try {
        const response = await PaperFoldersService.paperFolders_Create(request)
        return response
      } catch (error) {
        this.error = error as string
        throw error
      }
    },
    async searchPaperFolders(request: SearchPaperFolderRequest): Promise<PaperFolderDto[]> {
      try {
        const response = await PaperFoldersService.paperFolders_Search(request)
        this.paperFolders = response
        return response
      } catch (error) {
        this.error = error as string
        throw error
      }
    },
    async deletePaperFolder(id: string): Promise<string> {
      try {
        const response = await PaperFoldersService.paperFolders_Delete(id)
        return response
      } catch (error) {
        this.error = error as string
        throw error
      }
    },
    async updatePaperFolder(request: UpdatePaperFolderRequest, id: string): Promise<string> {
      try {
        const response = await PaperFoldersService.paperFolders_Update(request, id)
        return response
      } catch (error) {
        this.error = error as string
        throw error
      }
    },
    async sharePaperFolder(id: string, request: SharePaperFolderRequest): Promise<string> {
      try {
        const response = await PaperFoldersService.paperFolders_Share(id, request)
        return response
      } catch (error) {
        this.error = error as string
        throw error
      }
    },
  },
})
