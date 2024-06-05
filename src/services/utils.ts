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
  required2: (fieldName: string) => (v: string) => !!v || `Field ${fieldName} is required`,
  minLength: (length: number) => (v: string) =>
    (v && v.length >= length) || `Must be greater than ${length} characters`,
  // maxLength: (length: number) => (v: string) => (v && v.length <= length) || `Must be less than ${length} characters`,
  maxLength: (length: number) => (v: string | null) =>
    v === null || v.length <= length || `Must be less than ${length} characters`,
  numeric: (v: string) => /^\d+$/.test(v) || 'Only numeric characters are allowed',
  minValue: (min: number) => (v: string) =>
    (v && parseFloat(v) >= min) || `Value must be greater than or equal to ${min}`,
  maxValue: (max: number) => (v: string) => (v && parseFloat(v) <= max) || `Value must be less than or equal to ${max}`,
  validDate: (v: string) => !isNaN(Date.parse(v)) || 'Please enter a valid date',
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
