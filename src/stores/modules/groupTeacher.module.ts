import {
  GroupTeacherResponse,
  SendRequestJoinGroupRequest,
  SetPermissionInClassGroup,
  TeacherTeamResponse,
} from '@/pages/teacher-group/types'
import groupTeacherService from '@/services/groupTeacher.service'
import { defineStore } from 'pinia'
import { SetPermissionInClassTeacher } from '../../pages/teacher-group/types'

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
    async updateGroupTeacher(id: string, data: any): Promise<any> {
      return groupTeacherService
        .updateGroupTeacher(id, data)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateTeacherInTeam(id: string, data: any): Promise<any> {
      return groupTeacherService
        .updateTeacherInTeam(id, data)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async addTeacherIntoGroup(data: any): Promise<any> {
      return groupTeacherService
        .addTeacherIntoGroup(data)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async removeTeacherInGroup(data: any): Promise<any> {
      return groupTeacherService
        .removeTeacherInGroup(data)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getGroupDetail(id: string): Promise<any> {
      return groupTeacherService
        .getGroupDetail(id)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getGuestGroupDetail(id: string): Promise<any> {
      return groupTeacherService
        .getGuestGroupDetail(id)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async setPermissionGroupInClass(data: SetPermissionInClassGroup): Promise<any> {
      return groupTeacherService
        .setPermissionGroupInClass(data)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getTeacherPermissionDetail(teacherId: string): Promise<any> {
      return groupTeacherService
        .getTeacherPermissionDetail(teacherId)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async setPermissionTeacherInClass(data: SetPermissionInClassTeacher): Promise<any> {
      return groupTeacherService
        .setPermissionTeacherInClass(data)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async sendRequestJoinGroup(data: SendRequestJoinGroupRequest): Promise<any> {
      return groupTeacherService
        .sendRequestJoinGroup(data)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async shareTeacherGroups(data: any): Promise<GroupTeacherResponse> {
      return groupTeacherService
        .shareTeacherGroups(data)
        .then((res) => {
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
