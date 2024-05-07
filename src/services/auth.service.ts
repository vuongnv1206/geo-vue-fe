import apiService from './api.service'
import jwtService from './jwt.service'

class AuthService {
  async login(email: string, password: string): Promise<any> {
    return apiService
      .post('/tokens', {
        email,
        password,
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
}

export default new AuthService()
