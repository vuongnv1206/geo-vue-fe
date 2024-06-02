import { defineStore } from 'pinia'
import classService from '@/services/class.service'
import { Classrooms, EmptyClassrooms, UserInClass, UserInClassRequest } from '@/pages/classrooms/type'

export const useClassStore = defineStore('class', {
  state: () => ({}),
  actions: {
    async getClassroomByGroupClass(): Promise<Classrooms> {
      return classService
        .getClassroomByGroupClass()
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getClassroomByGroupClassId(id: string): Promise<Classrooms> {
      return classService
        .getClassroomByGroupClassId(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    async getClassroomByUser(): Promise<Classrooms[]> {
      return classService
        .getClassroomByUser()
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async addClassroom(data: EmptyClassrooms): Promise<any> {
      return classService
        .addClassroom(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateClassroom(id: string, data: Classrooms): Promise<Classrooms> {
      return classService
        .updateClassroom(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteClassroom(id: string): Promise<Classrooms> {
      return classService
        .deleteClassroom(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getUserInClass(id: string): Promise<Classrooms> {
      return classService
        .getUserInClass(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async addUserToClass(data: UserInClass): Promise<Classrooms> {
      return classService
        .addUserInClass(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateUserInClass(id: string, data: UserInClass): Promise<Classrooms> {
      return classService
        .updateUserInClass(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async deleteUserInClass(data: UserInClassRequest): Promise<Classrooms> {
      return classService
        .deleteUserInClass(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
