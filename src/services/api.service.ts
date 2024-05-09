import axios from 'axios'
import JwtService from '@services/jwt.service'

JwtService.saveTenant('root')

class ApiService {
  private api_url = 'http://localhost:5000/api'

  private axios = axios.create({
    baseURL: this.api_url,
  })

  async get(path: string) {
    return this.axios.get(path, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
        tenant: JwtService.getTenant(),
      },
    })
  }

  async post(path: string, data: any) {
    return this.axios.post(path, data, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
        tenant: JwtService.getTenant(),
      },
    })
  }

  async put(path: string, data: any) {
    return this.axios.put(path, data, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
        tenant: JwtService.getTenant(),
      },
    })
  }

  async delete(path: string) {
    return this.axios.delete(path, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
        tenant: JwtService.getTenant(),
      },
    })
  }

  async patch(path: string, data: any) {
    return this.axios.patch(path, data, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
        tenant: JwtService.getTenant(),
      },
    })
  }

  async head(path: string) {
    return this.axios.head(path, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
        tenant: JwtService.getTenant(),
      },
    })
  }

  async options(path: string) {
    return this.axios.options(path, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
        tenant: JwtService.getTenant(),
      },
    })
  }

  async request(config: any) {
    return this.axios.request(config)
  }
}

export default new ApiService()
