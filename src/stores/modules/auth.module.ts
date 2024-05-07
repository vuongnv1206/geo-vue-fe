import { defineStore } from 'pinia'
import authService from '../../services/auth.service'
import jwtService from '../../services/jwt.service'

export type User = {
  id: string
  fullName: string
  emailaddress: string
  phone: string
  tenant: string
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as User | null,
      isAuthenticated: false,
    }
  },
  actions: {
    checkAuth() {
      if (jwtService.getToken()) {
        this.isAuthenticated = true
        this.user = jwtService.getUser()
      } else {
        this.isAuthenticated = false
        this.user = null
      }
    },
    login(email: string, password: string): Promise<any> {
      return authService
        .login(email, password)
        .then((response) => {
          if (response.data.token) {
            this.isAuthenticated = true
            const userParse = jwtService.parseToken(response.data.token)
            this.user = {
              id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
              fullName: userParse.fullName,
              emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
              phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
              tenant: userParse.tenant,
            }
          } else {
            this.isAuthenticated = false
            this.user = null
          }
          return Promise.resolve(response.data)
        })
        .catch((error) => {
          this.isAuthenticated = false
          this.user = null
          return Promise.reject(error)
        })
    },
  },
})
