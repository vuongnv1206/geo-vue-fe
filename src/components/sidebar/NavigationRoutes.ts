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
        permission: 'QuestionFolders.View',
      },
    },
    {
      name: 'paper-folder',
      displayName: 'menu.examinations',
      meta: {
        icon: 'menu_book',
        permission: 'QuestionFolders.View',
      },
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
      name: 'teacher-group',
      displayName: 'menu.teacher-group',
      meta: {
        icon: 'group',
        permission: 'GroupTeachers.View',
      },
    },
    {
      name: 'audit logs',
      displayName: 'menu.audit-logs',
      meta: {
        icon: 'list_alt',
        permission: 'AuditLogs.View',
      },
    },
    {
      name: 'orders',
      displayName: 'menu.orders',
      meta: {
        icon: 'shopping_bag',
        permission: 'Orders.View',
      },
    },
  ] as INavigationRoute[],
}
