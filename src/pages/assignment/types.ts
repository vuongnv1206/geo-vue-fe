export type Assignment = {
  id: string
  name: string
  startTime: Date
  endTime: Date
  attachmentPaths: Attachment[]
  content: string
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectId: string
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
  attachmentPaths: Attachment[] | null
  classIds: string[]
}

export type AssignmentDetails = {
  id: string
  name: string
  startTime: Date | null
  endTime: Date | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  classIds: string[]
}

export type EmptyAssignmentDetails = {
  name: string
  startTime: Date | null
  endTime: Date | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  classIds: string[]
}

export type Attachment = {
  name: string
  extension: string
  data: string
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
  classesdId: string
}
