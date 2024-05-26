export type Register = {
  firstName: string
  lastName: string
  email: string
  userName: string
  password: string
  confirmPassword: string
  phoneNumber: string
  role: string
}

export type ResetPassword = {
  email: string
  password: string
  token: string
  captchaToken: string
}
