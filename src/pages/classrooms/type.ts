import { Assignment } from '../assignment/types'

export type GroupClass = {
  id: string
  name: string
  classes: Classrooms[]
}

export type Classrooms = {
  id: string
  name: string
  schoolYear: string
  ownerId: string
  groupClassId: string
  groupClassName: string
  numberUserOfClass: number
  assignments: Assignment[]
}

export type GroupClassResponse = {
  data: GroupClass[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type ClassResponse = {
  data: Classrooms[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type EmptyGroupClass = {
  name: string
}

export type EmptyClassrooms = {
  name: string
  schoolYear: string
  groupClassId: string
}

export type UserInClassRequest = {
  userId: string
  classesId: string
}

export type UserInClass = {
  userId: string
  classesId: string
  isGender: true
  studentCode: string
  email: string
  phoneNumber: string
}
