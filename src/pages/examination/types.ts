import { Question } from '../question/types'
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
  questions?: Question[]
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
}

export interface GetLastResultExamRequest {
  paperId: string
  userId: string
  paperSubmitId: string
}

export interface LastResultExamDto {
  paperId?: string
  status?: SubmitPaperStatus
  startTime?: Date
  endTime?: Date | null
  totalMark?: number
  rightAnswer?: number
  totalQuestion?: number
  paper?: PaperDto
  submitPaperDetails?: SubmitPaperDetailDto[]
  student?: UserDetailsDto
}

export interface UserDetailsDto {
  id: string
  userName: string
  firstName?: string | null
  lastName?: string | null
  email: string | null
  isActive: boolean
  emailConfirmed?: boolean
  phoneNumber?: string | null
  imageUrl?: string | null
}

export interface SubmitPaperDetailDto {
  submitPaperId: string
  questionId: string
  answerRaw: string
  mark?: number | null
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
