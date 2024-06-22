import { Question } from '../question/types'
import { UserDetail } from '../user/types'

export interface CreatePaperFolderRequest {
  name: string
  parentId?: string | null
  subjectId?: string | null
}

export interface PaperFolderDto {
  id: string
  name: string
  parentId?: string | null
  subjectId?: string | null
  createdBy: string
  creatorName: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string | null
  paperFolderChildrens?: PaperFolderDto[] | null
  parents?: PaperFolderParentDto[]
}

export interface PaperFolderParentDto {
  id: string
  name: string
}

export interface SearchPaperFolderRequest {
  parentId?: string | null
  name?: string | null
}

export interface UpdatePaperFolderRequest {
  id: string
  name?: string
  parentId?: string | null
  subjectId?: string | null
}

export interface SharePaperFolderRequest {
  userIds?: string[]
  folderId?: string
  groupId?: string | null
  canView?: boolean
  canAdd?: boolean
  canUpdate?: boolean
  canDelete?: boolean
}

export interface SearchPaperRequest {
  paperFolderId?: string | null
  name?: string | null
}

export interface PaperInListDto {
  id: string
  examName: string
  paperLabelId?: string | null
  numberOfQuestion?: number
  duration?: number | null
  status?: string | null
  showMarkResult?: boolean
  showQuestionAnswer?: boolean
  password?: string | null
  type?: string
  paperFolderId?: string | null
  isPublish?: boolean
  examCode?: string
  content?: string | null
  description?: string | null
  createdBy: string
  createdOn: string
  creatorName?: string | null
  lastModifiedBy: string | null
  lastModifiedOn: string | null
  paperLable?: PaperLabelDto
  paperFolder?: PaperFolderDto
  parents?: PaperFolderParentDto[]
}

export interface PaperDto {
  id: string
  examName: string
  paperLabelId?: string | null
  numberOfQuestion?: number
  duration?: number | null
  startTime?: string | null
  endTime?: string | null
  status?: string | null
  showMarkResult?: boolean
  showQuestionAnswer?: boolean
  password?: string | null
  type?: string
  paperFolderId?: string | null
  isPublish?: boolean
  examCode?: string
  content?: string | null
  description?: string | null
  createdBy: string
  createdOn: string
  creatorName?: string | null
  lastModifiedBy: string | null
  lastModifiedOn: string | null
  paperLable?: PaperLabelDto
  paperFolder?: PaperFolderDto
  questions?: Question[] | null
  maxPoint?: number | undefined
  paperAccesses?: PaperAccess[]
  shareType?: number
}

export interface PaperLabelDto {
  id?: string
  name?: string
}

export interface CombinedData {
  type: string
  paths: { id: string | null; name: string }[]
  id: string
  name: string
  status?: string | null
  createdBy: string
  createdOn: string
  lastModifiedBy: string | null
  lastModifiedOn: string | null
}

export interface PaperStudentDto {
  id: string
  examName: string
  paperLabelId?: string | null
  numberOfQuestion?: number
  duration?: number | null
  status?: string | null
  showMarkResult?: boolean
  showQuestionAnswer?: boolean
  type?: string
  isPublish?: boolean
  examCode?: string
  description?: string | null
  createdBy: string
  createdOn: string
  creatorName?: string | null
  paperLable?: PaperLabelDto
  NumberOfQuizzes: number
}

export interface UpdatePaperRequest {
  id: string
  examName: string
  status?: number
  startTime?: string
  endTime?: string
  paperLabelId?: string
  duration?: number
  shuffle?: boolean
  showMarkResult?: boolean
  showQUestionAnswer?: boolean
  password?: string
  type: number
  isPublish?: boolean
  description?: string
  shareType?: number
  paperAccesses?: PaperAccess[]
}

export interface PaperAccess {
  classId?: string
  userId?: string
}

export enum AccessType {
  Everyone = 1,
  ByClass = 3,
  ByStudent = 2,
}

export interface GetLastResultExamRequest {
  paperId: string
  userId: string
  submitPaperId: string
}

export interface LastResultExamDto {
  paperId?: string
  status?: SubmitPaperStatus
  startTime?: Date
  endTime?: Date | null
  totalMark?: number
  totalQuestion?: number
  paper: PaperDto
  submitPaperDetails?: SubmitPaperDetailDto[] | null
  student?: UserDetail
}

export interface SubmitPaperDetailDto {
  submitPaperId: string
  questionId: string
  answerRaw: string
  mark?: number | null
  isCorrect: boolean
  createdBy?: string
  createdOn?: Date
  lastModifiedBy?: string
  lastModifiedOn?: Date | null
}

export enum SubmitPaperStatus {
  Start = 0,
  Doing = 1,
  End = 2,
}
export interface SubmitPaperDto {
  id: string
  paperId: string
  status: string
  startTime: string
  endTime?: string | undefined
  totalMark: number
  createdBy: string
  creatorName: string
  createdOn: string
}

export interface SubmitPaperResponse {
  data: SubmitPaperDto[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface AuditableEntity {
  createdBy: string
  createdOn: Date
  lastModifiedBy?: string
  lastModifiedOn?: Date | null
  deletedOn?: Date | null
  deletedBy?: string | null
}

export interface CreatePaperRequest {
  examName: string
  status: number
  password: string | undefined
  type: number
  paperFolderId?: string | undefined
  description?: string | undefined
  questions: QuestionIntoPaperRequest[]
  subjectId: string | undefined
}

export interface QuestionIntoPaperRequest {
  questionId: string | null | undefined
  mark: number | 1
  rawIndex: number | 1
}
