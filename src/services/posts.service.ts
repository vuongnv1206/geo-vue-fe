import { EmptyPost, EmptyPostLike } from '@/pages/classrooms/types'
import ApiService from '@services/api.service'

class PostService {
  async getPosts(data: any): Promise<any> {
    return ApiService.post('/v1/posts/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getPost(id: string): Promise<any> {
    return ApiService.get(`/v1/posts/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createPost(data: EmptyPost): Promise<any> {
    return ApiService.post('/v1/posts', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updatePost(id: string, data: EmptyPost): Promise<any> {
    return ApiService.put(`/v1/posts/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deletePost(id: string): Promise<any> {
    return ApiService.delete(`/v1/posts/${id}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async likePost(data: EmptyPostLike): Promise<any> {
    return ApiService.post(`/v1/posts/like`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async dislikePost(data: EmptyPostLike): Promise<any> {
    return ApiService.post(`/v1/posts/dislike`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new PostService()
