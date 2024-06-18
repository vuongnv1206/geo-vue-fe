import { defineStore } from 'pinia'
import groupClassService from '@/services/groupClass.service'
import { GroupClass, GroupClassResponse } from '@/pages/classrooms/type'

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

    async update(id: string, payload: GroupClass): Promise<GroupClass> {
      return groupClassService
        .updateGroupClass(id, payload)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async add(payload: GroupClass): Promise<GroupClass> {
      return groupClassService
        .createGroupClass(payload)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async remove(id: string): Promise<GroupClass> {
      return groupClassService
        .deleteGroupClass(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
