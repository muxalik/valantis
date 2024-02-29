import axios from 'axios'
import createAuthToken from './createAuthToken'
import { Product, RequestBody } from '../types'
import axiosRetry from 'axios-retry'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'X-Auth': createAuthToken(),
    common: {
      Accept: 'application/json',
    },
  },
})

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`)
    return retryCount * 2000
  },
  retryCondition: (error) => {
    return !!error.response!.data 
  },
})

type GetIdsParams = {
  offset?: number
  limit?: number
  filter?: string | null
  filterValue?: number | string | null
}

export const fetchIds = async ({
  offset,
  limit,
  filter,
  filterValue,
}: GetIdsParams): Promise<string[]> => {
  const data: RequestBody = filter
    ? {
        action: 'filter',
        params: {
          [filter]: filterValue,
        },
      }
    : {
        action: 'get_ids',
        params: {
          offset,
          limit,
        },
      }

  return await api.post('/', data).then((res) => res.data.result)
}

type GetItemsParams = {
  ids: string[]
}

export const fetchProducts = async ({
  ids,
}: GetItemsParams): Promise<Product[]> => {
  const data: RequestBody = {
    action: 'get_items',
    params: {
      ids,
    },
  }

  return await api.post('/', data).then((res) => res.data.result)
}

export const fetchFields = async (): Promise<string[]> => {
  const data: RequestBody = {
    action: 'get_fields',
    params: { field: 'brand', offset: 3, limit: 100 },
  }

  return await api.post('/', data).then((res) => res.data.result)
}
