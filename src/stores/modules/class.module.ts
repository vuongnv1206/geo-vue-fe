import { defineStore } from 'pinia'
import classService from '@/services/class.service'
import { ClassResponse, Classrooms, EmptyClassrooms } from '@/pages/classrooms/types'

export const useClassStore = defineStore('class', {
  state: () => ({}),
  actions: {
    async getClasses(data: any): Promise<ClassResponse> {
      return classService
        .getClasses(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getClassById(id: string): Promise<Classrooms> {
      return classService
        .getClassById(id)
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
    async removeAssignmentFromClass(data: any): Promise<any> {
      return classService
        .removeAssignmentFromClass(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    // xóa bỏ
    //===========================================
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
    async getClassroomByGroupClassId(id: string): Promise<Classrooms[]> {
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

    async getUserInClass(id: string): Promise<any> {
      return classService
        .getUserInClass(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
