import { SendRequestJoinTeamRequest } from '@/pages/teacher-group/types'
import joinTeacherTeamService from '@/services/joinTeacherTeam.service'
import { defineStore } from 'pinia'

export const useJoinTeacherTeamStore = defineStore('joinTeacherTeam', {
  state: () => ({}),
  actions: {
    async sendRequestJoinTeam(request: SendRequestJoinTeamRequest): Promise<string> {
      return joinTeacherTeamService
        .sendRequestJoinTeam(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
