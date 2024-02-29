export type ApiActions = 'filter' | 'get_ids' | 'get_items' | 'get_fields'

export type RequestBody = {
  action: ApiActions
  params?: any
}

export type Product = {
  id: string
  brand: string | null
  price: number
  product: string
}
