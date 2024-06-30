import { defineStore } from 'pinia'
import { EmptyPost, Post, PostResponse } from '@pages/classrooms/types'
import subjectService from '@/services/posts.service'

export const usePostStore = defineStore('subject', {
  state: () => ({}),
  actions: {
    async getPosts(data: any): Promise<PostResponse> {
      return subjectService
        .getPosts(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getPost(id: string): Promise<Post> {
      return subjectService
        .getPost(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createPost(data: EmptyPost): Promise<any> {
      return subjectService
        .createPost(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updatePost(id: string, data: EmptyPost): Promise<any> {
      return subjectService
        .updatePost(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deletePost(id: string): Promise<any> {
      return subjectService
        .deletePost(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
