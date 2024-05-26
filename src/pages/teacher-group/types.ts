export type GroupTeacher = {
  id: string
  name: string
  teacherTeams: TeacherTeam[]
  groupPermissionInClasses: GroupPermissionInClass[]
  // createdBy: string
  // createdOn: string
  // lastModifiedBy: string
  // lastModifiedOn: string | null
}

export type GroupPermissionInClass = {
  id: string
  groupTeacherId: string
  classId: string
  permissionType: string
}

export type SetPermissionInClassGroup = {
  groupTeacherId: string
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
}

export type TeacherTeamRequest = {
  id: string
  teacherName: string
  contact: string
}

export type GroupTeacherResponse = {
  data: GroupTeacher[]
}

export type TeacherTeamResponse = {
  data: TeacherTeam[]
}

export type TeacherInGroupRequest = {
  groupId: string
  teacherId: string
}
