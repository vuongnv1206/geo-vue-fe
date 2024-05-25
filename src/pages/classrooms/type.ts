export type GroupClass = {
  id: string
  name: string
  classes: Classrooms[]
}

export type EmptyGroupClass = {
  name: string
}

export type Classrooms = {
  id: string
  name: string
  schoolYear: string
  ownerId: string
  groupClassId: string
}
