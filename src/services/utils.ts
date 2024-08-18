import { QuestionType } from '@/pages/question/types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import 'dayjs/locale/en'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
import i18n from './../i18n'
import { InvitationStatus, JoinTeacherGroupStatus } from '@/pages/teacher-group/types'
const { t } = i18n.global
const local = i18n.global.locale.value === 'vi' ? 'vi' : 'en'

dayjs.locale(local)

const currentTimezone = dayjs.tz.guess()

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
  phone: (v: string) =>
    /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/.test(v) ||
    t('validateUtils.phone'),
}

export const format = {
  formatDateNoTime: (date: Date) => {
    return dayjs(date).tz(currentTimezone).format('DD/MM/YYYY')
  },
  formatDate: (date: Date) => {
    return dayjs(date).tz(currentTimezone).format('DD/MM/YYYY - HH:mm')
  },
  formatDateStr: (date: string) => {
    return dayjs(date).tz(currentTimezone).format('DD/MM/YYYY - HH:mm')
  },
  formatDateFromNow: (date: Date) => {
    return dayjs(date).tz(currentTimezone).fromNow()
  },
  formatTimeToX: (date1: Date, date2: Date) => {
    const start = dayjs(date1).tz(currentTimezone)
    const end = dayjs(date2).tz(currentTimezone)
    return end.from(start, true)
  },
  getTimeString: (date: string) => {
    const dateTime = dayjs(date).tz(currentTimezone)
    const now = dayjs().tz(currentTimezone)
    if (now.diff(dateTime, 'day') >= 365) {
      return dateTime.format('DD/MM/YYYY - HH:mm')
    } else {
      return dateTime.fromNow()
    }
  },
  formatDuration: (minutes: number) => {
    const totalMilliseconds = minutes * 60 * 1000
    const durationObj = dayjs.duration(totalMilliseconds)
    const minutesPart = durationObj.minutes()
      ? `${durationObj.minutes()} minute${durationObj.minutes() > 1 ? 's' : ''}`
      : ''
    const secondsPart = durationObj.seconds()
      ? `${durationObj.seconds()} second${durationObj.seconds() > 1 ? 's' : ''}`
      : ''
    return [minutesPart, secondsPart].filter(Boolean).join(' ')
  },
}

export const notifications = {
  updatedSuccessfully: (message: string) => {
    return t('validateUtils.updatedSuccessfully', { message }) + '\n'
  },
  createSuccessfully: (message: string) => {
    return t('validateUtils.createSuccessfully', { message }) + '\n'
  },
  deleteSuccessfully: (message: string) => {
    return t('validateUtils.deleteSuccessfully', { message }) + '\n'
  },
  getFailed: (message: string) => {
    return t('validateUtils.getFailed', { message }) + '\n'
  },
  updateFailed: (message: string) => {
    return t('validateUtils.updateFailed', { message }) + '\n'
  },
  createFailed: (message: string) => {
    return t('validateUtils.createFailed', { message }) + '\n'
  },
  deleteFailed: (message: string) => {
    return t('validateUtils.deleteFailed', { message }) + '\n'
  },
  unsavedChanges: t('validateUtils.unsavedChanges'),
  confirmDelete: (message: string) => {
    return t('validateUtils.confirmDelete', { message }) + '\n'
  },
  inviteSuccess: (message: string) => {
    return t('validateUtils.inviteSuccess', { message }) + '\n'
  },
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

export const JoinGroupStatusColor = (type: JoinTeacherGroupStatus | undefined) => {
  const colors = [
    {
      type: JoinTeacherGroupStatus.Pending,
      color: 'info',
    },
    {
      type: JoinTeacherGroupStatus.Accepted,
      color: 'success',
    },
    {
      type: JoinTeacherGroupStatus.Rejected,
      color: 'danger',
    },
    {
      type: JoinTeacherGroupStatus.Cancel,
      color: 'secondary',
    },
  ]
  const color = colors.find((c) => c.type === type)?.color
  return color || 'primary'
}

export const JoinGroupStatusLabel = (type: JoinTeacherGroupStatus) => {
  const labels = [
    {
      type: JoinTeacherGroupStatus.Pending,
      label: t('validateUtils.Pending'),
    },
    {
      type: JoinTeacherGroupStatus.Accepted,
      label: t('validateUtils.Accepted'),
    },
    {
      type: JoinTeacherGroupStatus.Rejected,
      label: t('validateUtils.Rejected'),
    },
    {
      type: JoinTeacherGroupStatus.Cancel,
      label: t('validateUtils.Cancel'),
    },
  ]
  const label = labels.find((c) => c.type === type)?.label
  return label || ''
}

export const InvitationStatusColor = (type: InvitationStatus | undefined) => {
  const colors = [
    {
      type: InvitationStatus.NotRequest,
      color: 'warning',
    },
    {
      type: InvitationStatus.Requested,
      color: 'info',
    },
    {
      type: InvitationStatus.BeRejected,
      color: 'danger',
    },
    {
      type: InvitationStatus.BeAccepted,
      color: 'success',
    },
  ]
  const color = colors.find((c) => c.type === type)?.color
  return color || 'primary'
}

export const InvitationStatusLabel = (type: InvitationStatus) => {
  const labels = [
    {
      type: InvitationStatus.NotRequest,
      label: t('validateUtils.NotRequest'),
    },
    {
      type: InvitationStatus.Requested,
      label: t('validateUtils.Pending'),
    },
    {
      type: InvitationStatus.BeRejected,
      label: t('validateUtils.Rejected'),
    },
    {
      type: InvitationStatus.BeAccepted,
      label: t('validateUtils.Accepted'),
    },
  ]
  const label = labels.find((c) => c.type === type)?.label
  return label || ''
}
