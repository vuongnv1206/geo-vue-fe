import axios, { AxiosRequestConfig } from 'axios'
import JwtService from '@services/jwt.service'
import { useToast } from 'vuestic-ui'
import router from '@/router'

JwtService.saveTenant('root')

class ApiService {
  private api_url = import.meta.env.VITE_APP_BASE_URL as string

  private axios = axios.create({
    baseURL: this.api_url,
    headers: {
      'x-from-host': location.host,
    },
  })

  constructor() {
    this.axios.interceptors.request.use(
      function (config) {
        config.headers.Authorization = JwtService.getAuthHeader()
        config.headers.tenant = JwtService.getTenant()
        return config
      },
      function (error) {
        return Promise.reject(error)
      },
    )

    this.axios.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        if (error.response.status === 401) {
          JwtService.destroyToken()
          JwtService.destroyUser()
          const { init } = useToast()
          init({ message: 'Session expired, please login again', color: 'danger' })
          router.push({ name: 'login' })
        }
        return Promise.reject(error)
      },
    )
  }

  async get(path: string) {
    return this.axios.get(path)
  }

  async post(path: string, data: any) {
    return this.axios.post(path, data)
  }

  async put(path: string, data: any) {
    return this.axios.put(path, data)
  }

  async delete(path: string) {
    return this.axios.delete(path)
  }

  async patch(path: string, data: any) {
    return this.axios.patch(path, data)
  }

  async head(path: string) {
    return this.axios.head(path)
  }

  async options(path: string) {
    return this.axios.options(path)
  }

  async request(config: AxiosRequestConfig) {
    return this.axios.request(config)
  }
}

export default new ApiService()
