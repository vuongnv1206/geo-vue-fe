import { defineStore } from 'pinia'
import classService from '@/services/class.service'
import { ClassResponse } from '@/pages/classrooms/type'

export const useClassStore = defineStore('class', {
  state: () => ({}),
  actions: {
    async getClasses(data: any): Promise<ClassResponse> {
      return classService
        .getClasses(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
