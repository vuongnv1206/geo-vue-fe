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
  subjectName: string
}

export type EmptyAssignment = {
  name: string
  startTime: Date | null
  endTime: Date | null
  attachmentPaths: Attachment[]
  content: string | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectName: string
}

export type AssignmentDetails = {
  id: string
  name: string
  startTime: Date | null
  endTime: Date | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectId: string
}
export type EmptyAssignmentDetails = {
  name: string
  startTime: Date | null
  endTime: Date | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectId: string
}

export type Attachment = {
  name: string
  extension: string
  data: string
}

export type AssignmentResponse = {
  data: Assignment[]
}
