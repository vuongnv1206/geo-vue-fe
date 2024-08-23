import {
  HandleJoinGroupRequest,
  InviteJoinGroupRequest,
  JoinGroupTeacherRequestResponse,
  SearchJoinGroupTeacherRequest,
} from '@/pages/teacher-group/types'
import joinGroupRequestService from '@/services/joinGroupRequest.service'
import { defineStore } from 'pinia'

export const useJoinGroupRequestStore = defineStore('joinGroupRequest', {
  state: () => ({
    isRefresh: false,
  }),
  actions: {
    setRefresh(value: boolean) {
      this.isRefresh = value
    },
    async joinGroupRequest_search(dataFilter: SearchJoinGroupTeacherRequest): Promise<JoinGroupTeacherRequestResponse> {
      return joinGroupRequestService
        .joinGroupRequest_search(dataFilter)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async acceptRequest(request: HandleJoinGroupRequest): Promise<string> {
      return joinGroupRequestService
        .acceptRequest(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async rejectRequest(request: HandleJoinGroupRequest): Promise<string> {
      return joinGroupRequestService
        .rejectRequest(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async cancelRequest(request: HandleJoinGroupRequest): Promise<string> {
      return joinGroupRequestService
        .cancelRequest(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async inviteTeacher(request: InviteJoinGroupRequest): Promise<string> {
      return joinGroupRequestService
        .inviteTeacher(request)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
