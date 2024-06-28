import { defineStore } from 'pinia'
import groupClassService from '@/services/groupClass.service'
import { GroupClass, GroupClassResponse } from '@/pages/classrooms/types'

export const useGroupClassStore = defineStore('groupClass', {
  state: () => ({}),
  actions: {
    async getGroupClasses(data: any): Promise<GroupClassResponse> {
      return groupClassService
        .getGroupClasses(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getGroupClass(): Promise<GroupClass[]> {
      return groupClassService
        .getGroupClass()
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async updateGroupClass(id: string, payload: GroupClass): Promise<GroupClass> {
      return groupClassService
        .updateGroupClass(id, payload)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async createGroupClass(payload: GroupClass): Promise<GroupClass> {
      return groupClassService
        .createGroupClass(payload)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async deleteGroupClass(id: string): Promise<GroupClass> {
      return groupClassService
        .deleteGroupClass(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async sharedGroupClass(dataFilter: any): Promise<GroupClassResponse> {
      return groupClassService
        .sharedGroupClass(dataFilter)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
