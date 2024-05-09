import { defineStore } from 'pinia'
import authService from '../../services/auth.service'
import jwtService from '../../services/jwt.service'

export type User = {
  id: string
  fullName: string
  emailaddress: string
  phone: string
  tenant: string
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
              permission: userParse.permission,
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
    logout() {
      this.isAuthenticated = false
      this.user = null
      jwtService.destroyToken()
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
    hasAccess(permission: string): boolean {
      const splitPermission = permission.split('.')
      if (splitPermission.length !== 2) {
        return false
      }
      return this.mustHavePermission(splitPermission[1], splitPermission[0])
    },
  },
})
