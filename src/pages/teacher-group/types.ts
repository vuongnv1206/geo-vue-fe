export type GroupTeacher = {
  id: string
  name: string
  createdBy: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string | null
}

export type TeacherTeam = {
  id: string
  teacherId: string
  teacherName: string
  email: string
  phone: string
}

export type GroupTeacherResponse = {
  data: GroupTeacher[]
}

export type TeacherTeamResponse = {
  data: TeacherTeam[]
}
