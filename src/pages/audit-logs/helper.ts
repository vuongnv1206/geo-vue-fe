import { ActionEnum } from './audit-logs.enum'

export const getSrcAvatar = (row: any) => {
  const img = row.rowData?.author?.imageUrl
  const url = import.meta.env.VITE_APP_BASE_URL as string
  if (img) return `${url.replace('/api', '/')}${img}`
  return ''
}

export const getActionColor = (value: string) => {
  const toLowerCaseValue = value.toLowerCase().trim()
  switch (toLowerCaseValue) {
    case ActionEnum.Create.Action:
      return ActionEnum.Create.Color
    case ActionEnum.Update.Action:
      return ActionEnum.Update.Color
    case ActionEnum.Delete.Action:
      return ActionEnum.Delete.Color
    default:
      return ActionEnum.Default.Color
  }
}

export const getFormatedDate = (value: string) => {
  return formatDate(value)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}
