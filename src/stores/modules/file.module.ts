import { defineStore } from 'pinia'
import fileService from '@/services/file.service'

export const useFileStore = defineStore('file', {
  state: () => ({}),
  actions: {
    async uploadFile(files: any): Promise<string[]> {
      return fileService
        .uploadFile(files)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
