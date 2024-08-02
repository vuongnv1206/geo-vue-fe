import { Question } from '../question/types'
import { GroupTeacher } from '../teacher-group/types'
import { UserDetail } from '../user/types'

export interface CreatePaperFolderRequest {
  name: string
  parentId?: string | null
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
  paperFolderPermissions?: PaperFolderPermission[]
}

export interface PaperFolderParentDto {
  id: string
  name: string
}
export interface UpdatePaperFolderRequest {
  id: string
  name?: string
  parentId?: string | null
  subjectId?: string | null
}

export interface SharePaperFolderRequest {
  userId?: string | null
  folderId: string
  groupId?: string | null
  canView: boolean
  canAdd: boolean
  canUpdate: boolean
  canDelete: boolean
  canShare: boolean
}
export interface PaperInListDto {
  id: string
  examName: string
  paperLabelId?: string | null
  numberOfQuestion?: number
  duration?: number | null
  status?: string | null
  showMarkResult?: ShowResult
  showQuestionAnswer?: ShowQuestionAnswer
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
  showMarkResult?: ShowResult
  showQuestionAnswer?: ShowQuestionAnswer
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
  subjectId?: string | null
  publicIpAllowed?: string
  localIpAllowed?: string
  numberAttempt?: number
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
  creatorName?: string | null
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
  showMarkResult?: ShowResult
  showQuestionAnswer?: ShowQuestionAnswer
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
  showMarkResult?: ShowResult
  showQuestionAnswer?: ShowQuestionAnswer
  password?: string
  type: number
  isPublish?: boolean
  description?: string
  shareType?: number
  paperAccesses?: PaperAccess[] | null
  subjectId?: string | null
  paperFolderId?: string | null
  publicIpAllowed?: string
  localIpAllowed?: string
  numberAttempt?: number
}

export enum ShowResult {
  No = 0,
  WhenSubmitted = 1,
  WhenAllStudentSubmitted = 2,
}

export enum ShowQuestionAnswer {
  No = 0,
  WhenSubmitted = 1,
  WhenAllStudentSubmitted = 2,
}

export interface PaperAccess {
  classId?: string
  userId?: string
}

export enum AccessType {
  Everyone = 0,
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

export type PaperFolderResponse = {
  data: PaperFolderDto[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type PaperResponse = {
  data: PaperInListDto[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type DataFilterFolder = {
  keyword: string
  pageNumber: number
  pageSize: number
  orderBy: string[]
  parentId: string | null | undefined
}

export type DataFilterPaper = {
  keyword: string
  pageNumber: number
  pageSize: number
  orderBy: string[]
  paperFolderId: string | null | undefined
}

export type PaperFolderPermission = {
  id: string
  userId: string
  user: UserDetail | null
  groupTeacherId: string
  groupTeacher: GroupTeacher | null
  folderId: string
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

export type SharePermission = {
  folderId: string
  userIds: string[]
  groupId: string
  canView: boolean
  canAdd: boolean
  canUpdate: boolean
  canDelete: boolean
  canShare: boolean
}

export interface SearchSharedPaperFolderRequest {
  parentId?: string | null
  name?: string | null
}

export interface SearchSharedPaperRequest {
  paperFolderId?: string | null | undefined
  name?: string | null | undefined
}

export type SubjectPaperDeleted = {
  id: string | null | undefined
  name: string | null | undefined
  description: string | null | undefined
}

export type PaperDeleted = {
  id: string
  examName: string | null | undefined
  subject: SubjectPaperDeleted | null | undefined
  duration: number | null | undefined
  createdOn: string | null | undefined
  deletedOn: string | null | undefined
}

export type PaperDeletedResponse = {
  data: PaperDeleted[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type MarkAnswerRequest = {
  submitPaperId?: string
  questionId?: string
  mark?: number
}
