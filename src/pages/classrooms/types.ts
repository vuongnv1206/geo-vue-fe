import { Assignment } from '../assignment/types'
import { PermissionInClass } from '../teacher-group/types'
import { UserDetail } from '../user/types'

export type GroupClass = {
  id: string
  name: string
  classes: Classrooms[]
  createdBy?: string
}

export type EmptyGroupClass = {
  name: string
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
  permissions: PermissionInClass[] | null
}

export type ClassroomWithPosts = {
  id: string
  name: string
  schoolYear: string
  ownerId: string
  groupClassId: string
  groupClassName: string
  numberUserOfClass: number
  assignments: Assignment[]
  students: Student[]
  permissions: PermissionInClass[] | null
  posts?: Post[]
}

export type EmptyClassrooms = {
  name: string
  schoolYear: string
  groupClassId: string
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

export type StudentRequest = {
  userId: string
  classesId: string
}

export type Student = {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string
  dateOfBirth: Date
  email: string
  phoneNumber: string
  studentCode: string
  gender: boolean
  classesId: string
}

export type EmptyStudent = {
  firstName: string
  lastName: string
  avatarUrl: string
  dateOfBirth: Date
  email: string
  phoneNumber: string
  studentCode: string
  gender: boolean
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
  createdBy: Date
  postId: string
  content: string
  numberLikeInComment: number
  createdOn: Date
  parentId: string | null
  user: Student
  comments?: Comment[]
}

export type EmptyComment = {
  id: string
  postId: string
  content: string
  parentId?: string
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
  content: string
  numberLikeInThePost: number
  createdOn: Date
  createdBy: Date
  isLockComment: boolean
  classesId: string
  user: Student
  comments: Comment[]
  owner: UserDetail | null
}

export type EmptyPost = {
  id: string
  classesId: string
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

export type EmptyPostLike = {
  userId: string
  postsId: string
}

export type EmptyCommentLike = {
  userId: string
  commentId: string
}

export enum ClassroomQueryType {
  All = 0,
  MyClass = 1,
  SharedClass = 2,
}
