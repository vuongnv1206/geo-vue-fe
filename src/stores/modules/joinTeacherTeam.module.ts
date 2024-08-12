import {
  AcceptJoinTeamRequest,
  HandleJoinTeamRequest,
  JoinTeacherTeamRequestResponse,
  SearchJoinTeacherTeamRequest,
  SendRequestJoinTeamRequest,
} from '@/pages/teacher-group/types'
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
    async requestJoinTeamList(request: SearchJoinTeacherTeamRequest): Promise<JoinTeacherTeamRequestResponse> {
      return joinTeacherTeamService
        .requestJoinTeamList(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async acceptJoinTeamRequest(request: AcceptJoinTeamRequest): Promise<string> {
      return joinTeacherTeamService
        .acceptJoinTeamRequest(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async rejectJoinTeamRequest(request: HandleJoinTeamRequest): Promise<string> {
      return joinTeacherTeamService
        .rejectJoinTeamRequest(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async cancelJoinTeamRequest(request: HandleJoinTeamRequest): Promise<string> {
      return joinTeacherTeamService
        .cancelJoinTeamRequest(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
