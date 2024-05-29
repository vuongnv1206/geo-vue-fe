import { GroupTeacher } from '../teacher-group/types'
import { UserDetail } from '../user/types'

export type QuestionTree = {
  id: string
  name: string
  totalQuestions: number | null
  parentId: string | null
  currentShow: boolean
  permission: QuestionFolderPermission[]
  children: QuestionTree[]
  createdBy: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string | null
  owner: UserDetail | null
}

export type QuestionTreeEmpty = {
  id: string | null
  name: string
  parentId: string | null
}

export type QuestionTreeOnlyName = {
  name: string
}

export type QuestionFolderPermission = {
  id: string
  userId: string
  user: UserDetail | null
  groupTeacherId: string
  groupTeacher: GroupTeacher | null
  questionFolderId: string
  canView: boolean
  canAdd: boolean
  canUpdate: boolean
  canDelete: boolean
  createdBy: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string | null
}

export type Permission = {
  userId: string
  user: UserDetail
  groupTeacherId: string
  groupTeacher: null
  questionFolderId: string
  canView: boolean
  canAdd: boolean
  canUpdate: boolean
  canDelete: boolean
  createdBy: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string | null
  id: string
}

export type SharePermission = {
  folderId: string
  userIDs: string[]
  teacherGroupIDs: string[]
  emails: string[]
  phones: string[]
  canView: boolean
  canAdd: boolean
  canUpdate: boolean
  canDelete: boolean
}
