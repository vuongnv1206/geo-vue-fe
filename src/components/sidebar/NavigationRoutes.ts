export interface INavigationRoute {
  name: string
  displayName: string
  meta: {
    icon: string
    permission?: string
  }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'question-folder',
      displayName: 'menu.questions',
      meta: {
        icon: 'folder',
        permission: 'QuestionFolders.View',
      },
    },
    {
      name: 'examinations',
      displayName: 'menu.examinations',
      meta: {
        icon: 'menu_book',
      },
      children: [
        {
          name: 'paper-folder',
          displayName: 'menu.paper-folder',
          meta: {
            permission: 'QuestionFolders.View',
          },
        },
      ],
    },
    {
      name: 'classroom',
      displayName: 'menu.classroom',
      meta: {
        icon: 'collections_bookmark',
        permission: 'Classes.View',
      },
    },
    {
      name: 'assignments',
      displayName: 'menu.assignments',
      meta: {
        icon: 'description',
        permission: 'Assignments.View',
      },
    },
    {
      name: 'subjects',
      displayName: 'menu.subjects',
      meta: {
        icon: 'play_lesson',
        permission: 'Subjects.View',
      },
    },
    {
      name: 'teacher group',
      displayName: 'menu.teacher-group',
      meta: {
        icon: 'group',
        permission: 'GroupTeachers.View',
      },
    },
  ] as INavigationRoute[],
}
