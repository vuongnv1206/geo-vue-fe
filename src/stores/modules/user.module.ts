import {
  ChangeEmailFormData,
  ChangePhoneNumberFormData,
  PasswordDetailFormData,
  UserDetail,
  UserDetailsUpdate,
} from '@/pages/user/types'
import { defineStore } from 'pinia'
import userService from '@services/user.service'

export const useUserProfileStore = defineStore('userProfile', {
  state: () => ({
    userDetails: {} as UserDetail,
    isLoading: false as boolean,
  }),
  actions: {
    async getUserProfile(): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.getUserProfile()
        this.isLoading = false
        this.userDetails = { ...response?.data }
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async updateProfile(data: UserDetailsUpdate): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.updateProfile(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async changePassword(data: PasswordDetailFormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.changePassword(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async sendPhoneOTPCode(): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.sendPhoneOTPCode()
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async changeEmail(data: ChangeEmailFormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.changeEmail(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async changePhone(data: ChangePhoneNumberFormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.changePhone(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async uploadAvatar(data: FormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.uploadAvatar(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async removeAvatar(data: FormData): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.removeAvatar(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async getOTPConfirmation(data: string): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.getOTPConfirmation(data)
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
    async sendVerifyEmail(): Promise<any> {
      try {
        this.isLoading = true
        const response = await userService.sendVerifyEmail()
        this.isLoading = false
        return await Promise.resolve(response)
      } catch (error) {
        this.isLoading = false
        return await Promise.reject(error)
      }
    },
  },
})
