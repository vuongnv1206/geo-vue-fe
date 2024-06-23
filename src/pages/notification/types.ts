export type NotificationType = {
  createdOn: Date
  id: string
  isRead: boolean
  label: number
  message: string
  title: string
  url: string
  userId: string
}

export type PagingNotification = {
  pageNumber: number
  pageSize: number
  totalPages: number
  currentPages: number
  hasNextPage: boolean
}

export type QueryGetNotification = {
  pageNumber: number
  pageSize: number
  isRead?: boolean
}

export type RefreshType = {
  status: boolean
  isFromDropDown: boolean | null
}
