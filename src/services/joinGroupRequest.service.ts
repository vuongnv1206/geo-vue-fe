import {
  HandleJoinGroupRequest,
  JoinGroupTeacherRequestResponse,
  SearchJoinGroupTeacherRequest,
} from '@/pages/teacher-group/types'
import apiService from './api.service'

export interface IJoinGroupRequestService {
  joinGroupRequest_search(dataFilter: SearchJoinGroupTeacherRequest): Promise<JoinGroupTeacherRequestResponse>
  acceptRequest(request: HandleJoinGroupRequest): Promise<string>
  rejectRequest(request: HandleJoinGroupRequest): Promise<string>
  cancelRequest(request: HandleJoinGroupRequest): Promise<string>
}

export class JoinGroupRequestService implements IJoinGroupRequestService {
  rejectRequest(request: HandleJoinGroupRequest): Promise<string> {
    const url = '/v1/joingroupteacherrequests/reject-request'

    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  cancelRequest(request: HandleJoinGroupRequest): Promise<string> {
    const url = '/v1/joingroupteacherrequests/cancel-request'

    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  acceptRequest(request: HandleJoinGroupRequest): Promise<string> {
    const url = '/v1/joingroupteacherrequests/accept-request'

    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  joinGroupRequest_search(dataFilter: SearchJoinGroupTeacherRequest): Promise<JoinGroupTeacherRequestResponse> {
    const url = '/v1/joingroupteacherrequests/search'

    return apiService
      .post(url, dataFilter)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new JoinGroupRequestService()
