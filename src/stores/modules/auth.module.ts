import { defineStore } from 'pinia'
import authService from '@services/auth.service'
import jwtService from '@services/jwt.service'
import { Register, ResetPassword } from '@/pages/auth/types'
import { UserDetail } from '@/pages/user/types'

export type User = {
  id: string
  fullName: string
  avatarUrl?: string
  emailaddress: string
  phone: string
  tenant: string
  roles: string
  permission?: string[]
}

export const Action = {
  View: 'View',
  Search: 'Search',
  Create: 'Create',
  Update: 'Update',
  Delete: 'Delete',
  Export: 'Export',
  Generate: 'Generate',
  Clean: 'Clean',
  UpgradeSubscription: 'UpgradeSubscription',
}

export const Resource = {
  Tenants: 'Tenants',
  Dashboard: 'Dashboard',
  Hangfire: 'Hangfire',
  Users: 'Users',
  UserRoles: 'UserRoles',
  Roles: 'Roles',
  RoleClaims: 'RoleClaims',
  Products: 'Products',
  Brands: 'Brands',
  Classes: 'Classes',
  GroupClasses: 'GroupClasses',
  QuestionFolders: 'QuestionFolders',
  GroupTeachers: 'GroupTeachers',
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as User | null,
      isAuthenticated: false,
      avatarUrl: '',
    }
  },
  actions: {
    checkAuth() {
      if (jwtService.getToken()) {
        this.isAuthenticated = true
        const userParse = jwtService.getUser()
        this.user = {
          id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          fullName: userParse.fullName,
          avatarUrl: userParse.image_url,
          emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
          roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          tenant: userParse.tenant,
          permission: userParse.permission,
        }
        this.avatarUrl = userParse.image_url
      } else {
        this.isAuthenticated = false
        this.user = null
      }
    },
    setUserDetails(userDetail: UserDetail) {
      this.avatarUrl = userDetail.imageUrl || ''
      if (this.user) this.user.fullName = userDetail.firstName + userDetail.lastName
    },
    async login(email: string, password: string, captchaToken: string, keepLogin: boolean): Promise<any> {
      try {
        const response = await authService.login(email, password, captchaToken)
        if (response.data.token) {
          this.isAuthenticated = true
          const userParse = jwtService.parseToken(response.data.token)
          this.user = {
            id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            fullName: userParse.fullName,
            avatarUrl: userParse.image_url,
            emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
            roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            tenant: userParse.tenant,
            permission: userParse.permission,
          }
          this.avatarUrl = userParse.image_url
          if (!keepLogin) {
            jwtService.removeRefreshToken()
          }
        } else {
          this.isAuthenticated = false
          this.user = null
        }
        return await Promise.resolve(response.data)
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
        return await Promise.reject(error)
      }
    },
    async register(data: Register): Promise<any> {
      try {
        const response = await authService.register(data)
        return await Promise.resolve(response)
      } catch (error) {
        return await Promise.reject(error)
      }
    },
    async confirmEmail(tenant: string, userId: string, code: string): Promise<any> {
      try {
        const response = await authService.confirmEmail(tenant, userId, code)
        return await Promise.resolve(response)
      } catch (error) {
        return await Promise.reject(error)
      }
    },
    async forgotPassword(email: string): Promise<any> {
      try {
        const response = await authService.forgotPassword(email)
        return await Promise.resolve(response)
      } catch (error) {
        return await Promise.reject(error)
      }
    },
    async resetPassword(data: ResetPassword): Promise<any> {
      try {
        const response = await authService.resetPassword(data)
        return await Promise.resolve(response)
      } catch (error) {
        return await Promise.reject(error)
      }
    },
    async refreshToken(): Promise<any> {
      return authService
        .refreshToken()
        .then((response) => {
          this.isAuthenticated = true
          const userParse = jwtService.parseToken(response.data.token)
          this.user = {
            id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            fullName: userParse.fullName,
            avatarUrl: userParse.image_url,
            emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
            roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            tenant: userParse.tenant,
            permission: userParse.permission,
          }
          this.avatarUrl = userParse.image_url
          return response.data.token
        })
        .catch(() => {
          this.isAuthenticated = false
          this.user = null
          jwtService.destroyToken()
          jwtService.destroyUser()
          return ''
        })
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
      jwtService.destroyToken()
      jwtService.destroyUser()
    },
    mustHavePermission(action: string, resource: string): boolean {
      if (!this.user) {
        return false
      }
      if (!this.user.permission) {
        return false
      }
      return this.user.permission.some((p) => p === `Permissions.${resource}.${action}`)
    },
    musHaveRole(role: string): boolean {
      if (!this.user) {
        return false
      }
      const roles = this.user.roles.split(',')
      return roles.some((r) => r === role)
    },
    hasAccess(permission: string): boolean {
      const splitPermission = permission.split('.')
      if (splitPermission.length !== 2) {
        return false
      }
      return this.mustHavePermission(splitPermission[1], splitPermission[0])
    },
    updateAvatarUrl(avatarUrl: any): void {
      this.avatarUrl = avatarUrl
    },
  },
})
