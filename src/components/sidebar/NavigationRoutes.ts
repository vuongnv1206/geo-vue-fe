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
      name: 'questions',
      displayName: 'menu.questions',
      meta: {
        icon: 'folder',
      },
      children: [
        {
          name: 'question-folder',
          displayName: 'menu.question-folder',
          meta: {
            permission: 'QuestionFolders.View',
          },
        },
        {
          name: 'question-bank',
          displayName: 'menu.question-bank',
          meta: {
            permission: 'QuestionFolders.View',
          },
        },
      ],
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
      },
      children: [
        {
          name: 'group-class',
          displayName: 'menu.group-class',
          meta: {
            permission: 'GroupClasses.View',
          },
        },
        {
          name: 'class',
          displayName: 'menu.class',
          meta: {
            permission: 'Classes.View',
          },
        },
      ],
    },
    {
      name: 'assignments',
      displayName: 'menu.assignments',
      meta: {
        icon: 'description',
      },
    },
    {
      name: 'subjects',
      displayName: 'menu.subjects',
      meta: {
        icon: 'play_lesson',
      },
    },
    {
      name: 'teacher group',
      displayName: 'menu.teacher-group',
      meta: {
        icon: 'group',
      },
    },
  ] as INavigationRoute[],
}
