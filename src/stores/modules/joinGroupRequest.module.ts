import { JoinGroupTeacherRequestResponse, SearchJoinGroupTeacherRequest } from '@/pages/teacher-group/types'
import joinGroupRequestService from '@/services/joinGroupRequest.service'
import { defineStore } from 'pinia'

export const useJoinGroupRequestStore = defineStore('joinGroupRequest', {
  state: () => ({}),
  actions: {
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
  },
})
