export type GroupTeacher = {
  id: string
  name: string
  createdBy: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string | null
}

export type GroupTeacherResponse = {
  data: GroupTeacher[]
}
