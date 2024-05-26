export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  email: (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Please enter a valid email address'
  },
  required: (v: any) => !!v || 'This field is required',
}

export const getErrorMessage = (error: any) => {
  console.log(error)
  if (error.response) {
    if (error.response.data.messages.length > 0) {
      return error.response.data.messages.join(', ')
    } else {
      return error.response.data.exception
    }
  } else {
    return error.message
  }
}
