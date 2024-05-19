export type GroupTeacher = {
  id: string
  name: string
  // createdBy: string
  // createdOn: string
  // lastModifiedBy: string
  // lastModifiedOn: string | null
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
