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

  // /api/v1/submitpapers/reassign
  async reassign(data: any): Promise<any> {
    return ApiService.post('/v1/submitpapers/reassign', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  // /api/v1/submitpapers/suspend
  async suspend(data: any): Promise<any> {
    return ApiService.post('/v1/submitpapers/suspend', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  // /api/v1/submitpapers/monitor-detail
  async getExamMonitorDetail(data: any): Promise<any> {
    return ApiService.post('/v1/submitpapers/monitor-detail', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new ExamMonitorService()
