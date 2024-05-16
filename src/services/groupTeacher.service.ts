import apiService from './api.service'

class GroupTeacherService {
  async getGroupTeachers(data: any): Promise<any> {
    return apiService
      .post(`/v1/groupteachers/search`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getTeacherInTeam(data: any): Promise<any> {
    return apiService
      .post(`/v1/teacherteams/search`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new GroupTeacherService()
