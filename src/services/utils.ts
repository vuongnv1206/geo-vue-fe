import { QuestionType } from '@/pages/question/types'

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
