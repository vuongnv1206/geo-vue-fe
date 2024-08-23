import { Classrooms, Student } from '../classrooms/types'
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
  totalAttended?: number
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
  status?: number | null
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
  className?: string
  userId?: string
}

export enum AccessType {
  ByStudent = 1,
  ByClass = 2,
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

export type PaperFolderTree = {
  id: string | undefined
  paperFolderChildrens: PaperFolderDto[]
  paperFolderPermissions: PaperFolderPermission[]
  totalPapers: number
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
export interface SearchPaperFolderRequest {
  parentId?: string | null
  name?: string | null
}

export interface SearchSharedPaperRequest {
  paperFolderId?: string | null | undefined
  name?: string | null | undefined
}

export interface SearchPaperRequest {
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

export type CreateMatrixRequest = {
  name: string
  content: string
  totalPoint: number
}

export type UpdateMatrixRequest = {
  id: string
  name: string
  content: string
  totalPoint: number
}

export type ContentMatrixRequest = {
  questionFolderId: string
  criteriaQuestions: CriteriaQuestion[]
  totalPoint: number
}

export type CriteriaQuestion = {
  questionLabelId: string | null
  questionType?: number
  numberOfQuestion?: number
  rawIndex?: string
}

export type PaperMatrixTemplate = {
  id: string
  name: string
  content: string
  contentItems: ContentMatrixItem[]
  totalPoint: number
}

export type ContentMatrixItem = {
  questionFolderId: string
  questionFolderName?: string
  criteriaQuestions: CriteriaQuestion[]
  totalPoint: number
}

export type BasicStatisticPaperRequest = {
  paperId: string
  classId?: string
}

export type BasicStatisticPaperResponse = {
  id: string
  examName: string
  paperLabelId: string
  paperLabelName: string
  subjectId: string
  subjectName: string
  totalRegister: number
  totalNotComplete: number
  totalDoing: number
  totalAttendee: number
  averageMark: number
  totalPopular: number
  markPopular: number
  totalHighestMark: number
  totalLowestMark: number
  highestMark: number
  lowestMark: number
  classrooms: BasicStatisticPaperInClass[]
}

export type BasicStatisticPaperInClass = {
  id: string
  name: string
  groupClassId: string
  groupClassName: string
  totalRegister: number
  totalTested: number
}

export type ClassroomFrequencyMarkRequest = {
  paperId: string
  classroomId?: string
}

export type ClassroomFrequencyMarkResponse = {
  totalRegister: number
  totalAttendee: number
  frequencyMarks: FrequencyMark[]
  className?: string
}

export type FrequencyMark = {
  fromMark: number
  toMark: number
  total: number
  rate: number
}

export type ListQuestionStatisticRequest = {
  keyword?: string
  pageNumber?: number | 0
  pageSize?: number | 0
  orderBy?: string[]
  paperId: string
  classId?: string
}

export type ListQuestionStatisticResponse = {
  data: QuestionStatistic[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

export type QuestionStatistic = {
  id: string
  paperId: string
  content: string
  image?: string
  audio?: string
  questionFolderId?: string
  questionFolderName?: string
  questionType?: number
  questionLabelId?: string
  questionLabelName?: string
  questionParentId?: string
  questionPassages?: QuestionStatistic
  answers?: AnswerStatistic[]
  rawIndex: number
  totalTest: number
  totalAnswered: number
  totalNotAnswered: number
  totalCorrect: number
  totalWrong: number
  wrongStudents?: WrongStudentInfo[]
}

export type AnswerStatistic = {
  id: string
  content?: string
  questionId: string
  isCorrect: boolean
}

export type WrongStudentInfo = {
  id: string
  studentId?: string
  firstName: string
  lastName: string
  classId?: string
  className?: string
}

export type TranscriptStatisticRequest = {
  keyword?: string
  pageNumber?: number | 0
  pageSize?: number | 0
  orderBy?: string[]
  paperId: string
  classId?: string
}

export type TranscriptStatisticResponse = {
  data: InfoAttendeeTranscript[]
  averageMark: number
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

export type InfoAttendeeTranscript = {
  attendee: Student
  classrooms?: Classrooms[]
  mark: number
  startedTest: Date
  finishedTest?: Date
}

export type PaperStudents = {
  id: string
  examName: string
  startTime: Date
  endTime: Date
  duration: number
  isPublish: boolean
  description: string
  paperLabelId: string
  paperLabelName: string
  subjectId: string
  subjectName: string
  completionStatus: number
}

export type PaperStudentsResponse = {
  data: PaperStudents[]
  // currentPage: number
  // totalPages: number
  // totalCount: number
  // pageSize: number
  // hasPreviousPage: boolean
  // hasNextPage: boolean
}

export type PaperStudentsHistory = {
  id: string
  examName: string
  duration: number
  paperLabelId: string
  paperLabelName: string
  subjectId: string
  subjectName: string
  startedTime: Date
  submittedTime: Date
  score: number
  completionStatus: number
  showMarkResult: boolean
}
export type PaperStudentsHistoryResponse = {
  data: PaperStudentsHistory[]
  // currentPage: number
  // totalPages: number
  // totalCount: number
  // pageSize: number
  // hasPreviousPage: boolean
  // hasNextPage: boolean
}

export enum StatusPaper {
  publish = 1,
  unpublish = 2,
}

export type QuestionGenerateToMatrix = {
  question: Question
  mark: number
  rawIndex: number
}

export interface AddQuestionsInPaperRequest {
  paperId: string
  questions?: QuestionIntoPaperRequest[]
}

export interface UpdateQuestionsInPaperRequest {
  paperId: string
  questions?: QuestionIntoPaperRequest[]
}

export type GroupClassAccessPaper = {
  id: string
  name: string
  classes: ClassAccessPaper[]
}

export type ClassAccessPaper = {
  id: string
  name: string
  userClasses: StudentAccessPaper[]
  groupClassName?: string
}

export type StudentAccessPaper = {
  studentId: string
  student: Student
  groupName?: string
  className?: string
}

export type GetAccessPaperRequest = {
  keyword?: string
  pageNumber?: number
  pageSize?: number
  orderBy?: string[]
  paperId: string
}

export type GetAccessPaperResponse = {
  data: GroupClassAccessPaper[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}
// {
//   "studentId": "8a44732e-b0f9-4531-83d4-9d21a5e8fb8d",
//   "student": {
//     "id": "8a44732e-b0f9-4531-83d4-9d21a5e8fb8d",
//     "userName": "root.student",
//     "firstName": "root",
//     "lastName": "Student",
//     "gender": null,
//     "birthDate": null,
//     "email": "basic@root.com",
//     "isActive": true,
//     "emailConfirmed": true,
//     "phoneNumber": null,
//     "phoneNumberConfirmed": true,
//     "imageUrl": null
//   },
//   "paperId": "a2e664b3-763f-4507-9bbc-1ce365870afb",
//   "paper": null,
//   "submitPaperId": "8733c6ed-0dea-4278-9e77-43e340339604",
//   "submitPaper": null,
//   "completionStatus": 0,
//   "isSuspicious": false,
//   "submitPaperLogs": null,
//   "classId": "5502aa20-2a71-4945-b320-fc6d3ffc7b44"
// },

export interface StudentMonitor {
  studentId: string
  student: Student
  submitPaperId: string
  submitPaper: SubmitPaperDto
  completionStatus: number
  isSuspicious: boolean
  submitPaperLogs: any
  classId: string
}

export type StudentMonitorResponse = {
  data: StudentMonitor[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type ReassignExamRequest = {
  paperId: string
  userId?: string
  studentEmail?: string
  reason: string
}

export type SupendStudentExamRequest = {
  paperId: string
  userId?: string
  studentEmail?: string
  reason: string
}

export type GetGetAssigneesInPaperRequest = {
  keyword?: string
  pageNumber?: number
  pageSize?: number
  orderBy?: string[]
  paperId: string
  groupClassId?: string
  classId?: string
}

export type GetGetAssigneesInPaperResponse = {
  data: ClassAccessPaper[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}
