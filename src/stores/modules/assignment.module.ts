import { defineStore } from 'pinia'
import { AssignmentResponse, EmptyAssignment } from '@pages/assignment/types'
import assignmentService from '@/services/assignment.service'

export const useAssignmentStore = defineStore('assignment', {
  state: () => ({}),
  actions: {
    async getAssignments(data: any): Promise<AssignmentResponse> {
      return assignmentService
        .getAssignments(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async getAssignment(id: string): Promise<any> {
      return assignmentService
        .getAssignment(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async createAssignment(data: EmptyAssignment): Promise<any> {
      return assignmentService
        .createAssignment(data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async updateAssignment(id: string, data: any): Promise<any> {
      return assignmentService
        .updateAssignment(id, data)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    deleteAssignment(id: string): Promise<any> {
      return assignmentService
        .deleteAssignment(id)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
})
