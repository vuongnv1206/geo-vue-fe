export type Subject = {
  id: string
  description: string
  name: string
}

export type EmptySubject = {
  description: string
  name: string
}

export type SubjectResponse = {
  data: Subject[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}
