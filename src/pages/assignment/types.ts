import { Student } from '../classrooms/types'
import { Subject } from '../subject/types'

export type Assignment = {
  id: string
  name: string
  startTime: Date
  endTime: Date
  content: string
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectId: string
  attachment: string
  createdOn: Date
}

export type AssignmentById = {
  id: string
  name: string
  startTime: Date
  endTime: Date
  content: string
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subject: Subject
  attachment: string
  createdOn: Date
}

export type EmptyAssignment = {
  name: string
  startTime: Date | null
  endTime: Date | null
  content: string
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectId: string
  attachment: string | null
  classesId: string[]
}

export type AssignmentDetails = {
  id: string
  name: string
  startTime: Date | null
  endTime: Date | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  classesId: string[]
}

export type EmptyAssignmentDetails = {
  name: string
  startTime: Date | null
  endTime: Date | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  classesId: string[]
}

export type AssignmentContent = {
  id: string
  content: string
}

export type EmptyAssignmentContent = {
  content: string
}

export type AssignmentAttachment = {
  id: string
  attachment: string
}

export type AssignmentSubmit = {
  assignmentId: string
  answerRaw: string
  attachmentPath: string
}

export type AssignmentResponse = {
  data: Assignment[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type AssignmentClass = {
  assignmentId: string
  classId: string
}

export type AssignmentSubmission = {
  assignmentId: string
  studentId: string
  status: string
  answerRaw: string
  attachmentPath: string
  score: number
  comment: string
  student: Student
}

export type MarkAssignment = {
  assignmentId: string
  studentId: string
  score: number
  comment: string
}

export type SubmissionStats = {
  totalSubmitted: number
  totalMarked: number
  totalStudents: number
}

export type AssignmentStats = {
  id: string
  name: string
  startTime: Date
  endTime: Date
  content: string
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectId: string
  attachment: string
  createdOn: Date
  submissionsStats: SubmissionStats
}

export type AssignmentWithMarkStatus = {
  id: string
  name: string
  startTime: Date
  endTime: Date
  content: string
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectId: string
  attachment: string
  createdOn: Date
  status: string
}

export enum MarkAssignmentStatus {
  Submitted = 'Submitted',
  Doing = 'Doing',
  Marked = 'Marked',
  NotSubmitted = 'NotSubmitted',
}
