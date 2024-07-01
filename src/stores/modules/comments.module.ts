import { defineStore } from 'pinia'
import { EmptyComment, Comment, CommentResponse, EmptyCommentLike } from '@pages/classrooms/types'
import subjectService from '@/services/comments.service'

export const useCommentStore = defineStore('subject', {
  state: () => ({}),
  actions: {
    async getComments(data: any): Promise<CommentResponse> {
      return subjectService
        .getComments(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getComment(id: string): Promise<Comment> {
      return subjectService
        .getComment(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createComment(data: any): Promise<any> {
      return subjectService
        .createComment(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateComment(id: string, data: EmptyComment): Promise<any> {
      return subjectService
        .updateComment(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteComment(id: string): Promise<any> {
      return subjectService
        .deleteComment(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async likeComment(data: EmptyCommentLike): Promise<any> {
      return subjectService
        .likeComment(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async dislikeComment(data: EmptyCommentLike): Promise<any> {
      return subjectService
        .dislikeComment(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
