import { Assignment } from '../assignment/types'

export type GroupClass = {
  id: string
  name: string
  classes: Classrooms[]
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

export type EmptyGroupClass = {
  name: string
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
  students: Student[]
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

export type EmptyClassrooms = {
  name: string
  schoolYear: string
  groupClassId: string
}

export type StudentRequest = {
  userId: string
  classesId: string
}

export type Student = {
  id: string
  studentId: string
  studentCode: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: Date
  gender: boolean
  phoneNumber: string
  avatar: string
  classesId: string
}

export type EmptyStudent = {
  studentCode: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: Date
  gender: boolean
  phoneNumber: string
  classesId: string
}

export type StudentResponse = {
  data: Student[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type Comment = {
  id: string
  userId: string
  postId: string
  content: string
  numberLikeInTheComment: number
  createdAt: string
  parentId: string | null
  user: Student
  comments?: Comment[]
}

export type EmptyComment = {
  userId: string
  postId: string
  content: string
  parentId: string
}

export type CommentResponse = {
  data: Comment[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type Post = {
  id: string
  userId: string
  content: string
  numberLikeInTheNews: number
  createdAt: string
  isLockComment: boolean
  user: Student
  comments: Comment[]
  showComments: boolean
}

export type EmptyPost = {
  userId: string
  content: string
  isLockComment: boolean
}

export type PostResponse = {
  data: Post[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}
