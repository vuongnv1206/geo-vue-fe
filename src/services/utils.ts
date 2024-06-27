import { QuestionType } from '@/pages/question/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import i18n from './../i18n'

dayjs.locale('vi')
dayjs.extend(relativeTime)

const { t } = i18n.global

export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  required: (v: any) => !!v || t('validateUtils.required'),
  required2: (fieldName: string) => (v: string) => !!v || t('validateUtils.required2', { fieldName }),

  minLength: (length: number) => (v: string) => (v && v.length >= length) || t('validateUtils.minLength', { length }),
  maxLength: (length: number) => (v: string | null) =>
    v === null || v.length <= length || t('validateUtils.maxLength', { length }),

  minValue: (min: number) => (v: string) => (v && parseFloat(v) >= min) || t('validateUtils.minValue', { min }),
  maxValue: (max: number) => (v: string) => (v && parseFloat(v) <= max) || t('validateUtils.maxValue', { max }),

  isCharacter: (fieldName: string) => (v: string) =>
    /^[\p{L} ]+$/u.test(v) || t('validateUtils.isCharacter', { fieldName }),
  isDecimalNumber: (fieldName: string) => (v: string) =>
    /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v) || t('validateUtils.isDecimalNumber', { fieldName }),
  isNumber: (fieldName: string) => (v: string) => /^\d+$/.test(v) || t('validateUtils.isNumber', { fieldName }),
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t('validateUtils.email'),
  phone: (v: string) => /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(v) || t('validateUtils.phone'),
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
    return t('validateUtils.updatedSuccessfully', { message })
  },
  createSuccessfully: (message: string) => {
    return t('validateUtils.createSuccessfully', { message })
  },
  deleteSuccessfully: (message: string) => {
    return t('validateUtils.deleteSuccessfully', { message })
  },
  getFailed: (message: string) => {
    return t('validateUtils.getFailed', { message })
  },
  updateFailed: (message: string) => {
    return t('validateUtils.updateFailed', { message })
  },
  createFailed: (message: string) => {
    return t('validateUtils.createFailed', { message })
  },
  deleteFailed: (message: string) => {
    return t('validateUtils.deleteFailed', { message })
  },
  unsavedChanges: t('validateUtils.unsavedChanges'),
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
      label: t('validateUtils.singleChoice'),
    },
    {
      type: QuestionType.MultipleChoice,
      label: t('validateUtils.multipleChoice'),
    },
    {
      type: QuestionType.FillBlank,
      label: t('validateUtils.fillBlank'),
    },
    {
      type: QuestionType.Matching,
      label: t('validateUtils.matching'),
    },
    {
      type: QuestionType.Reading,
      label: t('validateUtils.reading'),
    },
    {
      type: QuestionType.ReadingQuestionPassage,
      label: t('validateUtils.readingQuestionPassage'),
    },
    {
      type: QuestionType.Writing,
      label: t('validateUtils.writing'),
    },
    {
      type: QuestionType.Other,
      label: t('validateUtils.other'),
    },
  ]
  const label = labels.find((c) => c.type === type)?.label
  return label || ''
}
