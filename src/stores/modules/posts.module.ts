import { defineStore } from 'pinia'
import { EmptyPost, Post, PostResponse } from '@pages/classrooms/types'
import postsService from '@/services/posts.service'

export const usePostsStore = defineStore('posts', {
  state: () => ({}),
  actions: {
    async getPosts(data: any): Promise<PostResponse> {
      return postsService
        .getPosts(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getPost(id: string): Promise<Post> {
      return postsService
        .getPost(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createPost(data: EmptyPost): Promise<any> {
      return postsService
        .createPost(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updatePost(id: string, data: EmptyPost): Promise<any> {
      return postsService
        .updatePost(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deletePost(id: string): Promise<any> {
      return postsService
        .deletePost(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async likePost(data: any): Promise<any> {
      return postsService
        .likePost(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async dislikePost(data: any): Promise<any> {
      return postsService
        .dislikePost(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
