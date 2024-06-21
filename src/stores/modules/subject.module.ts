import { defineStore } from 'pinia'
import { EmptySubject, Subject, SubjectResponse } from '@pages/subject/types'
import subjectService from '@/services/subject.service'

export const useSubjectStore = defineStore('subject', {
  state: () => ({}),
  actions: {
    async getSubjects(data: any): Promise<SubjectResponse> {
      return subjectService
        .getSubjects(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getSubject(id: string): Promise<Subject> {
      return subjectService
        .getSubject(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createSubject(data: EmptySubject): Promise<any> {
      return subjectService
        .createSubject(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateSubject(id: string, data: EmptySubject): Promise<any> {
      return subjectService
        .updateSubject(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    deleteSubject(id: string): Promise<any> {
      return subjectService
        .deleteSubject(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
