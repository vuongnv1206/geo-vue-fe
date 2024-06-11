import { Assignment } from '../assignment/types'

export type GroupClass = {
  id: string
  name: string
  classes: Classrooms[]
}

export type EmptyGroupClass = {
  name: string
}

export type Classrooms = {
  id: string
  name: string
  schoolYear: string
  ownerId: string
  groupClassId: string
}

export type ClassResponse = {
  id: string
  name: string
  schoolYear: string
  ownerId: string
  groupClassId: string
  groupClassName: string
  numberUserOfClass: number
  assignments: Assignment[]
}
export type EmptyClassrooms = {
  name: string
  schoolYear: string
  groupClassId: string
}

export type AssignmentToClassRequest = {
  assignmentId: string
  classesdId: string
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
