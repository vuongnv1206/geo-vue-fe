import axios, { AxiosRequestConfig } from 'axios'
import JwtService from '@services/jwt.service'
import { useToast } from 'vuestic-ui'
import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth.module'

JwtService.saveTenant('root')

class ApiService {
  private api_url = import.meta.env.VITE_APP_BASE_URL as string

  private axios_instance = axios.create({
    baseURL: this.api_url,
    headers: {
      'x-from-host': location.host,
    },
  })

  constructor() {
    this.axios_instance.interceptors.request.use(
      async function (config) {
        config.headers.Authorization = JwtService.getAuthHeader()
        config.headers.tenant = JwtService.getTenant()

        // if the request url is not /tokens/refresh or /tokens
        // check if the token is expired
        if (config.url !== '/tokens/refresh' && config.url !== '/tokens') {
          const tokenExpiryTime = JwtService.getTokenExpiryTime()
          const token = JwtService.getToken()

          if (tokenExpiryTime && token) {
            // convert milliseconds to seconds
            const currentTime = Date.now() / 1000
            const expiryTime = new Date(tokenExpiryTime).getTime()
            if (currentTime > expiryTime) {
              const refreshTokenExpiryTime = JwtService.getRefreshTokenExpiryTime()
              const refreshToken = JwtService.getRefreshToken()
              if (refreshTokenExpiryTime && refreshToken) {
                const currentTime = Date.now()
                const expiryTime = new Date(refreshTokenExpiryTime).getTime()
                if (currentTime < expiryTime) {
                  const store = useAuthStore()
                  const token = await store.refreshToken()
                  config.headers.Authorization = `Bearer ${token}`
                }
              }
            }
          }
        }

        return config
      },
      function (error) {
        return Promise.reject(error)
      },
    )

    this.axios_instance.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        if (
          error.response.status === 401 &&
          error.response.data.exception != 'Authentication Failed, Invalid Email or Password.'
        ) {
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

  getAxiosInstance() {
    return this.axios_instance
  }

  async get(path: string) {
    return this.axios_instance.get(path)
  }

  async post(path: string, data: any) {
    return this.axios_instance.post(path, data)
  }

  async put(path: string, data: any) {
    return this.axios_instance.put(path, data)
  }

  async delete(path: string) {
    return this.axios_instance.delete(path)
  }

  async patch(path: string, data: any) {
    return this.axios_instance.patch(path, data)
  }

  async head(path: string) {
    return this.axios_instance.head(path)
  }

  async options(path: string) {
    return this.axios_instance.options(path)
  }

  async request(config: AxiosRequestConfig) {
    return this.axios_instance.request(config)
  }
}

export default new ApiService()
