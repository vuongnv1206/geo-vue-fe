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
  id: string
  userId: string
  classesId: string
  studentCode: string
  firstName: string
  lastName: string
  email: string
  dob: Date
  gender: boolean
  phoneNumber: string
}

export type EmptyUserInClass = {
  userId: string
  classesId: string
  studentCode: string
  firstName: string
  lastName: string
  email: string
  dob: Date
  gender: boolean
  phoneNumber: string
}

export type User = {
  id: string
  name: string
  avatar: string
}

export type Comment = {
  id: string
  userId: string
  postId: string
  content: string
  numberLikeInTheComment: number
  createdAt: string
  parentId: string | null
  user: User
  comments?: Comment[]
}

export type Post = {
  id: string
  userId: string
  content: string
  numberLikeInTheNews: number
  createdAt: string
  isLockComment: boolean
  user: User
  comments: Comment[]
  showComments: boolean
}
