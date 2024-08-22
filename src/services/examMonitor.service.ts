import ApiService from '@services/api.service'

class ExamMonitorService {
  // /api/v1/submitpapers/monitor
  async getExamMonitor(data: any): Promise<any> {
    return ApiService.post('/v1/submitpapers/monitor', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new ExamMonitorService()
