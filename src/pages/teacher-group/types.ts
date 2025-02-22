export type GroupTeacher = {
  id: string
  name: string
  teacherTeams: TeacherTeam[]
  groupPermissionInClasses: GroupPermissionInClass[]
  qrCode?: string
  joinLink?: string
  adminGroup?: string
  createdBy?: string
  // createdOn: string
  // lastModifiedBy: string
  // lastModifiedOn: string | null
}

export type GroupPermissionInClass = {
  id: string
  groupTeacherId: string
  classId: string
  className?: string
  permissionType: string
}

export type AssignedClassroomInGroup = {
  id: string
  groupTeacherId: string
  classId: string
  className?: string
  permissionType: string[]
}

export type SetPermissionInClassGroup = {
  groupTeacherId: string
  permissionInClassDtos: PermissionInClass[]
}

export type SetPermissionInClassTeacher = {
  teacherId: string
  permissionInClassDtos: PermissionInClass[]
}

export type PermissionInClass = {
  classId: string
  permissionType: number
}

export type GroupTeacherRequest = {
  name: string
}

export type TeacherTeam = {
  id: string
  teacherId: string
  teacherName: string
  email: string
  phone: string
  teacherPermissionInClassDto: TeacherPermissionInClass[]
}

export type TeacherPermissionInClass = {
  id: string
  classId: string
  permissionType: string
}

export type TeacherTeamRequest = {
  id: string
  teacherName: string
  contact: string
}

export type GroupTeacherResponse = {
  data: GroupTeacher[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type TeacherTeamResponse = {
  data: TeacherTeam[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type TeacherInGroupRequest = {
  groupId: string
  teacherId: string
}

export type TeacherTeamTeacherGroupCombine = {
  teacherTeam: TeacherTeam | null
  groupTeacher: GroupTeacher | null
}

export type SendRequestJoinTeamRequest = {
  adminTeamId: string
  content?: string
  invitationId?: string
}
export type SendRequestJoinGroupRequest = {
  groupId: string
  content?: string
}

export type SearchJoinGroupTeacherRequest = {
  status: RequestStatus
  keyword?: string
  pageNumber?: number | 0
  pageSize?: number | 0
  orderBy?: string[]
}

export type JoinGroupTeacherRequestResponse = {
  data: JoinGroupTeacherRequestDto[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

export type JoinGroupTeacherRequestDto = {
  id: string
  groupId: string
  groupName?: string
  teacherId: string
  email: string
  phone: string
  status: JoinTeacherGroupStatus
  content: string
  createOn: Date
  lastModifiedOn: Date
}

export enum RequestStatus {
  Received = 0,
  Sent = 1,
}

export enum JoinTeacherGroupStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Cancel = 3,
}

export type HandleJoinGroupRequest = {
  requestId: string
}

export type SearchJoinTeacherTeamRequest = {
  status: RequestStatus
  keyword?: string
  pageNumber?: number | 0
  pageSize?: number | 0
  orderBy?: string[]
}

export type JoinTeacherTeamRequestResponse = {
  data: JoinTeacherTeamRequestDto[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

export type JoinTeacherTeamRequestDto = {
  id: string
  adminTeamId: string
  adminTeamEmail?: string
  status: JoinTeacherGroupStatus
  content: string
  createOn: Date
  lastModifiedOn: Date
  createBy: string
  senderEmail?: string
  senderFullName?: string
}

export type AcceptJoinTeamRequest = {
  requestId: string
  nickname: string
}

export type HandleJoinTeamRequest = {
  requestId: string
}

export type InviteTeacherJoinTeamRequest = {
  contact: string
}

export type InviteJoinTeacherTeamDto = {
  id: string
  recipientEmail: string
  senderEmail: string
  isRegistered: boolean
  status: InvitationStatus
}

export enum InvitationStatus {
  NotRequest = 0,
  Requested = 1,
  BeRejected = 2,
  BeAccepted = 3,
}

export type InviteJoinGroupRequest = {
  teacherId: string
  groupId: string
}
