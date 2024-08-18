import ApiService from '@services/api.service'

class PaperStudentsService {
  async getPaperStudents(data: any): Promise<any> {
    return ApiService.post('/v1/paperstudents/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async getPaperStudentsHistory(data: any): Promise<any> {
    return ApiService.post('/v1/paperstudents/history/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new PaperStudentsService()
