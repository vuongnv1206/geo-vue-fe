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
  image: string | null
  audio: string | null
  questionFolder: QuestionFolder | null
  questionType: QuestionType
  questionLable: any
  questionPassages: Question[]
  answers: Answer[]
  createdBy: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string
  deletedOn: string | null
  deletedBy: string | null
  id: string
}

export type Answer = {
  id: string
  content: string
  questionId: string
  isCorrect: boolean
}

export type QuestionFolder = {
  name: string
  parentId: string | null
}

export type SearchQuestion = {
  pageNumber: number
  pageSize: number
  sortBy: string
  sortingOrder: 'asc' | 'desc' | null
  folderId: string
  content: string
  questionType: number
  questionLableId: string
}

export type Pagination = {
  page: number
  perPage: number
  total: number
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
