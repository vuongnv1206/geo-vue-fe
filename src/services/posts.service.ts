import { EmptyPost } from '@/pages/classrooms/types'
import ApiService from '@services/api.service'

class PostService {
  async getPosts(data: any): Promise<any> {
    return ApiService.post('/v1/post/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getPost(id: string): Promise<any> {
    return ApiService.get(`/v1/post/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createPost(data: EmptyPost): Promise<any> {
    return ApiService.post('/v1/post', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updatePost(id: string, data: EmptyPost): Promise<any> {
    return ApiService.put(`/v1/post/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deletePost(id: string): Promise<any> {
    return ApiService.delete(`/v1/post/${id}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new PostService()
