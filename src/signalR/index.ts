import jwtService from '@/services/jwt.service'
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions } from '@microsoft/signalr'

class SignalRService {
  private connection: HubConnection | null = null
  private token: string | null = jwtService.getToken()

  private getAccessToken = (): string | Promise<string> => {
    if (this.token === null) {
      throw new Error('Token is not available')
    }
    return this.token
  }

  async connect(url: string) {
    if (this.token) {
      const option: IHttpConnectionOptions = {
        accessTokenFactory: () => this.getAccessToken(),
      }
      this.connection = new HubConnectionBuilder().withUrl(url, option).build()

      try {
        await this.connection.start()
      } catch (error) {
        console.error('Error connecting to SignalR:', error)
      }
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop()
    }
  }

  on(eventName: any, callback: any) {
    if (this.connection) {
      this.connection.on(eventName, callback)
    }
  }

  off(eventName: any) {
    if (this.connection) {
      this.connection.off(eventName)
    }
  }

  async invoke(methodName: any, ...args: any) {
    if (this.connection) {
      try {
        return await this.connection.invoke(methodName, ...args)
      } catch (err) {
        console.error(`Error invoking method ${methodName}:`, err)
      }
    }
  }
}
const signalRService = new SignalRService()
export default signalRService
