import {
  AcceptJoinTeamRequest,
  HandleJoinTeamRequest,
  JoinTeacherTeamRequestResponse,
  SearchJoinTeacherTeamRequest,
  SendRequestJoinTeamRequest,
} from '@/pages/teacher-group/types'
import apiService from './api.service'

export interface IJoinTeacherTeamService {
  sendRequestJoinTeam(request: SendRequestJoinTeamRequest): Promise<string>
  requestJoinTeamList(request: SearchJoinTeacherTeamRequest): Promise<JoinTeacherTeamRequestResponse>
  acceptJoinTeamRequest(request: AcceptJoinTeamRequest): Promise<string>
  rejectJoinTeamRequest(request: HandleJoinTeamRequest): Promise<string>
  cancelJoinTeamRequest(request: HandleJoinTeamRequest): Promise<string>
}

export class JoinTeacherTeamService implements IJoinTeacherTeamService {
  acceptJoinTeamRequest(request: AcceptJoinTeamRequest): Promise<string> {
    const url = '/v1/jointeacherteamrequests/accept-request'
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  rejectJoinTeamRequest(request: HandleJoinTeamRequest): Promise<string> {
    const url = '/v1/jointeacherteamrequests/reject-request'
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  cancelJoinTeamRequest(request: HandleJoinTeamRequest): Promise<string> {
    const url = '/v1/jointeacherteamrequests/cancel-request'
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  requestJoinTeamList(request: SearchJoinTeacherTeamRequest): Promise<JoinTeacherTeamRequestResponse> {
    const url = '/v1/jointeacherteamrequests/search'
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  sendRequestJoinTeam(request: SendRequestJoinTeamRequest): Promise<string> {
    const url = '/v1/jointeacherteamrequests/send-request'
    return apiService
      .post(url, request)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new JoinTeacherTeamService()
