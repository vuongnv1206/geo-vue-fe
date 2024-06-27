import { QuestionType } from '@/pages/question/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
dayjs.locale('vi')
dayjs.extend(relativeTime)

export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  required: (v: any) => !!v || 'This field is required',
  required2: (fieldName: string) => (v: string) => !!v || `${fieldName} is required`,

  minLength: (length: number) => (v: string) =>
    (v && v.length >= length) || `Must be greater than ${length} characters`,
  maxLength: (length: number) => (v: string | null) =>
    v === null || v.length <= length || `Must be less than ${length} characters`,

  minValue: (min: number) => (v: string) =>
    (v && parseFloat(v) >= min) || `Value must be greater than or equal to ${min}`,
  maxValue: (max: number) => (v: string) => (v && parseFloat(v) <= max) || `Value must be less than or equal to ${max}`,

  isCharacter: (fieldName: string) => (v: string) => /^[\p{L} ]+$/u.test(v) || `${fieldName} must be valid characters`,
  isDecimalNumber: (fieldName: string) => (v: string) =>
    /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v) || `${fieldName} must be valid decimal number`,
  isNumber: (fieldName: string) => (v: string) => /^\d+$/.test(v) || `${fieldName} must be valid number`,
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address',
  phone: (v: string) => /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(v) || 'Please enter a valid phone number',
}

export const format = {
  formatDate: (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY - HH:mm')
  },
  formatDateFromNow: (date: Date) => {
    return dayjs(date).fromNow()
  },
  getTimeString: (date: string) => {
    return date.split('T')[0] + ' ' + date.split('T')[1].split('.')[0]
  },
}

export const notifications = {
  updatedSuccessfully: (message: string) => {
    return message + ' updated successfully'
  },
  createSuccessfully: (message: string) => {
    return message + ' created successfully'
  },
  deleteSuccessfully: (message: string) => {
    return message + ' deleted successfully'
  },
  getFailed: (message: string) => {
    return 'Failed to get ' + message + '\n'
  },
  updateFailed: (message: string) => {
    return 'Failed to update ' + message + '\n'
  },
  createFailed: (message: string) => {
    return 'Failed to create ' + message + '\n'
  },
  deleteFailed: (message: string) => {
    return 'Failed to delete ' + message + '\n'
  },
  unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
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

export const avatarColor = (userName: string | undefined) => {
  if (!userName) return 'primary'
  const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
  const index = userName.charCodeAt(0) % colors.length
  return colors[index]
}

export const QuestionTypeColor = (type: QuestionType | undefined) => {
  if (!type) return 'primary'
  const colors = [
    {
      type: QuestionType.SingleChoice,
      color: 'primary',
    },
    {
      type: QuestionType.MultipleChoice,
      color: '#FFD43A',
    },
    {
      type: QuestionType.FillBlank,
      color: '#ADFF00',
    },
    {
      type: QuestionType.Matching,
      color: '#262824',
    },
    {
      type: QuestionType.Reading,
      color: 'danger',
    },
    {
      type: QuestionType.ReadingQuestionPassage,
      color: 'warning',
    },
    {
      type: QuestionType.Writing,
      color: 'info',
    },
    {
      type: QuestionType.Other,
      color: 'secondary',
    },
  ]
  const color = colors.find((c) => c.type === type)?.color
  return color || 'primary'
}

export const QuestionTypeLabel = (type: QuestionType | undefined) => {
  if (!type) return ''
  const labels = [
    {
      type: QuestionType.SingleChoice,
      label: 'Single Choice',
    },
    {
      type: QuestionType.MultipleChoice,
      label: 'Multiple Choice',
    },
    {
      type: QuestionType.FillBlank,
      label: 'Fill Blank',
    },
    {
      type: QuestionType.Matching,
      label: 'Matching',
    },
    {
      type: QuestionType.Reading,
      label: 'Reading',
    },
    {
      type: QuestionType.ReadingQuestionPassage,
      label: 'Reading Question Passage',
    },
    {
      type: QuestionType.Writing,
      label: 'Writing',
    },
    {
      type: QuestionType.Other,
      label: 'Other',
    },
  ]
  const label = labels.find((c) => c.type === type)?.label
  return label || ''
}
