import { JoinGroupTeacherRequestResponse, SearchJoinGroupTeacherRequest } from '@/pages/teacher-group/types'
import apiService from './api.service'

export interface IJoinGroupRequestService {
  joinGroupRequest_search(dataFilter: SearchJoinGroupTeacherRequest): Promise<JoinGroupTeacherRequestResponse>
}

export class JoinGroupRequestService implements IJoinGroupRequestService {
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
