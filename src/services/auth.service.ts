import { Register, ResetPassword } from '@/pages/auth/types'
import apiService from '@services/api.service'
import jwtService from '@services/jwt.service'

class AuthService {
  async login(email: string, password: string, captchaToken: string): Promise<any> {
    return apiService
      .post('/tokens', {
        email,
        password,
        captchaToken,
      })
      .then((response) => {
        if (response.data.token) {
          jwtService.saveToken(response.data)
          jwtService.saveUser(jwtService.parseTokenLocal())
        }
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async register(data: Register): Promise<any> {
    return apiService
      .post('/users/self-register', data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async confirmEmail(tenant: string, userId: string, code: string): Promise<any> {
    return apiService
      .get(`/users/confirm-email?tenant=${tenant}&userId=${userId}&code=${code}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async forgotPassword(email: string): Promise<any> {
    return apiService
      .post('/users/forgot-password', {
        email,
      })
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async resetPassword(data: ResetPassword) {
    return apiService
      .post('/users/reset-password', data)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}

export default new AuthService()
