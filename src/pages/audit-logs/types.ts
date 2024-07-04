export type AuditLogsTypes = {
  id: string
  author: Author
  action: string
  resource: string
  resourceId: string
  createdAt: Date | string
}

export type Author = {
  id: string
  name: string
  email: string
  imageUrl: string
}

export type PaginationType = {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type QueryAuditLogsType = {
  pageNumber: number
  pageSize: number
  action: string
}

export type optionsActionType = {
  label: string
  value: string
}
