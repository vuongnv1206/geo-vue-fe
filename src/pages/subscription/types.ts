export type SubscriptionType = {
  id: string
  duration: number
  description: string
  name: string
  price: number
  image: string
}
export type CreateOrderType = {
  subscriptionId: string
}
