import { ActionEnum } from './audit-logs.enum'

export const getSrcAvatar = (row: any) => {
  const img = row.rowData?.author?.imageUrl
  const url = import.meta.env.VITE_APP_BASE_URL as string
  const url_without_api = url.slice(0, -3)
  if (img) return `${url_without_api}${img}`
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
