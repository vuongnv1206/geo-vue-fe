import { GroupTeacherResponse } from '@/pages/teacher-group/types'
import groupTeacherService from '@/services/groupTeacher.service'
import { defineStore } from 'pinia'

export const useGroupTeacherStore = defineStore('groupTeacher', {
  state: () => ({}),
  actions: {
    async getGroupTeachers(dataFilter: any): Promise<GroupTeacherResponse> {
      return groupTeacherService
        .getGroupTeachers(dataFilter)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
