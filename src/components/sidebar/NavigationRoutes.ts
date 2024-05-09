export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
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
        icon: 'snippet_folder',
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
  ] as INavigationRoute[],
}
