import { News } from '@/pages/classrooms/type'
import apiService from './api.service'

class NewsService {
  async getNews(): Promise<News> {
    return apiService
      .get(`/v1/groupclasses/group-class-detail`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new NewsService()
