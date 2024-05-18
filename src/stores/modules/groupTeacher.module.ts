import { GroupTeacherResponse, TeacherTeamResponse } from '@/pages/teacher-group/types'
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
    async getTeacherTeams(dataFilter: any): Promise<TeacherTeamResponse> {
      return groupTeacherService
        .getTeacherInTeam(dataFilter)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async addGroup(data: any): Promise<any> {
      return groupTeacherService
        .addGroupTeacher(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async addTeacherIntoTeam(data: any): Promise<any> {
      return groupTeacherService
        .addTeacherIntoTeam(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteGroupTeacher(id: string): Promise<any> {
      return groupTeacherService
        .deleteGroupTeacher(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteTeacherInTeam(id: string): Promise<any> {
      return groupTeacherService
        .deleteTeacherInTeam(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
