import { SubscriptionType } from '../subscription/types'

export type MyOrderTypes = {
  orderNo: number
  total: number
  startDate: string | null | undefined
  endDate: string | null | undefined
  status: number
  isExpired: boolean | null | undefined
  subscription: SubscriptionType[]
  createdOn: string
}
export type MyOrderQueryType = {
  pageNumber: number
  pageSize: number
  orderBy: string[]
  status?: boolean | null | undefined
}

export type OrdersStatusType = {
  label: string
  value: number | null
}
