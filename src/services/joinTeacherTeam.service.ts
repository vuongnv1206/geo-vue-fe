import { SendRequestJoinTeamRequest } from '@/pages/teacher-group/types'
import apiService from './api.service'

export interface IJoinTeacherTeamService {
  sendRequestJoinTeam(request: SendRequestJoinTeamRequest): Promise<string>
}

export class JoinTeacherTeamService implements IJoinTeacherTeamService {
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
