export type Assignment = {
  id: string
  name: string
  startTime: Date | null
  endTime: Date | null
  attachmentPaths: Attachment[]
  content: string | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectId: string
  subjectName: string
}

export type EmptyAssignment = {
  id: string | null
  name: string
  startTime: Date | null
  endTime: Date | null
  attachmentPaths: Attachment[]
  content: string | null
  canViewResult: boolean
  requireLoginToSubmit: boolean
  subjectName: string
}

export type Attachment = {
  name: string
  extension: string
  data: string
}

export type AssignmentResponse = {
  data: Assignment[]
}
