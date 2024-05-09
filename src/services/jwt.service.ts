class JwtService {
  private USER_TOKEN_KEY = 'user_token'
  private REFRESH_TOKEN = 'refresh_token'
  private REFRESH_TOKEN_EXPIRES = 'refresh_token_expires'
  private USER = 'user'
  private TENANT = 'tenant'

  getToken(): string | null {
    return window.localStorage.getItem(this.USER_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return window.localStorage.getItem(this.REFRESH_TOKEN)
  }

  getRefreshTokenExpiryTime(): string | null {
    return window.localStorage.getItem(this.REFRESH_TOKEN_EXPIRES)
  }

  saveToken(data: any): void {
    window.localStorage.setItem(this.USER_TOKEN_KEY, data.token)
    window.localStorage.setItem(this.REFRESH_TOKEN, data.refreshToken)
    window.localStorage.setItem(this.REFRESH_TOKEN_EXPIRES, data.refreshTokenExpiryTime)
  }

  destroyToken(): void {
    window.localStorage.removeItem(this.USER_TOKEN_KEY)
    window.localStorage.removeItem(this.REFRESH_TOKEN)
    window.localStorage.removeItem(this.REFRESH_TOKEN_EXPIRES)
  }

  saveUser(user: any): void {
    window.localStorage.setItem(this.USER, JSON.stringify(user))
  }

  getUser(): any {
    const user = window.localStorage.getItem(this.USER)
    if (!user) {
      // try to get user from the token
      const token = this.getToken()
      if (token) {
        return this.parseToken(token)
      }
      return null
    }
    return JSON.parse(user)
  }

  saveTenant(tenant: string): void {
    window.localStorage.setItem(this.TENANT, tenant)
  }

  getTenant(): string | null {
    return window.localStorage.getItem(this.TENANT)
  }

  getAuthHeader(): string {
    return `Bearer ${this.getToken()}`
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  parseToken(token: any): any {
    if (!token) {
      return null
    }
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
    return JSON.parse(jsonPayload)
  }

  parseTokenLocal(): any {
    const token = this.getToken()
    if (!token) {
      return null
    }
    return this.parseToken(token)
  }

  constructor() {
    // Add a listener to the window object to listen for storage events
    // This is useful when you have multiple tabs open and you log out from one tab
    // The listener will be triggered and will remove the token from the local storage
    window.addEventListener('storage', (event) => {
      if (event.key === this.USER_TOKEN_KEY && !event.newValue) {
        this.destroyToken()
        window.location.assign('/')
      }
    })
  }
}

export default new JwtService()
