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
  canShare: boolean
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
  canShare: boolean
}

export type QuestionSearchRes = {
  data: Question[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type Question = {
  content: string
  image?: string | null
  audio?: string | null
  questionFolderId?: string | null
  questionFolder?: QuestionFolder | null
  questionType: QuestionType
  questionLable?: QuestionLable | null
  questionPassages?: QuestionPassage[] | null
  answers: Answer[]
  createdBy?: string | null
  createdOn?: string | null
  lastModifiedBy?: string | null
  lastModifiedOn?: string | null
  deletedOn?: string | null
  deletedBy?: string | null
  id?: string | undefined
  rawIndex?: number | null | undefined
  isSelected?: boolean
  owner?: UserDetail | null
  mark?: number | null
  questionStatus?: number | null
}

export type QuestionLable = {
  id: string | null
  name: string
  color: string | undefined
}

export type QuestionPassage = {
  id?: string
  content?: string
  answers?: Answer[]
}

export type Answer = {
  id?: string | undefined | null
  content: string
  questionId?: string | null
  isCorrect?: boolean | null
}

export type QuestionFolder = {
  name?: string
  parentId?: string | null
  id?: string | null
}

export type SearchQuestion = {
  pageNumber?: number | null | undefined
  pageSize?: number | null | undefined
  orderBy?: string[] | null | undefined
  folderId?: string | null | undefined
  keyword?: string | null | undefined
  questionType?: number | null | undefined
  questionLableId?: string | null | undefined
  content?: string | null | undefined
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type RejectApproveQuestion = {
  questionIds: string[] | null | undefined
}

export enum QuestionType {
  SingleChoice = 1,
  MultipleChoice = 2,
  FillBlank = 4,
  Matching = 5,
  Reading = 6,
  ReadingQuestionPassage = 7,
  Writing = 8,
  Other = 100,
}

export type CreateQuestionsRequest = {
  questions: Question[]
}

export type SearchMyQuestion = {
  pageNumber?: number | null | undefined
  pageSize?: number | null | undefined
  orderBy?: string[] | null | undefined
  questionType?: number | null | undefined
  content?: string | null | undefined
  questionStatus?: number | null | undefined
}

export type QuestionLabelRequest = {
  keyword?: string
  pageNumber?: number | 0
  pageSize?: number | 0
  orderBy?: string[]
}

export type QuestionLabelResponse = {
  data: QuestionLable[]
}
