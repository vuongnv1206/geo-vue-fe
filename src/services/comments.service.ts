import { EmptyComment, EmptyCommentLike } from '@/pages/classrooms/types'
import ApiService from '@services/api.service'

class CommentService {
  async getComments(data: any): Promise<any> {
    return ApiService.post('/v1/comment/search', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async getComment(id: string): Promise<any> {
    return ApiService.get(`/v1/comment/${id}`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async createComment(data: any): Promise<any> {
    return ApiService.post('/v1/comment', data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  async updateComment(id: string, data: EmptyComment): Promise<any> {
    return ApiService.put(`/v1/comment/${id}`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async deleteComment(id: string): Promise<any> {
    return ApiService.delete(`/v1/comment/${id}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async likeComment(data: EmptyCommentLike): Promise<any> {
    return ApiService.post(`/v1/comment/like`, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async dislikeComment(data: EmptyCommentLike): Promise<any> {
    return ApiService.post(`/v1/comment/dislike`, data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new CommentService()
