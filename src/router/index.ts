// eslint-disable-next-line prettier/prettier
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'home',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/home/dashboard/Dashboard.vue'),
      },
      {
        name: 'questions',
        path: 'questions',
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            name: 'question-folder',
            path: 'question-folder',
            component: () => import('../pages/question/QuestionFolder.vue'),
          },
          {
            name: 'question-bank',
            path: 'question-bank',
            component: () => import('../pages/question/QuestionBank.vue'),
          },
        ],
      },
      {
        name: 'examinations',
        path: 'examinations',
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            name: 'paper-folder',
            path: 'paper-folder',
            component: () => import('../pages/examination/PaperFolder.vue'),
          },
        ],
      },
      {
        name: 'teacher group',
        path: 'teacher-group',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/teacher-group/TeacherGroup.vue'),
      },
      {
        name: 'classroom',
        path: 'classroom',
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            name: 'group-class',
            path: 'group-class',
            component: () => import('../pages/classrooms/GroupClassPage.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        meta: {
          requiresAuth: false,
        },
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        meta: {
          requiresAuth: false,
        },
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        meta: {
          requiresAuth: false,
        },
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        meta: {
          requiresAuth: false,
        },
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        meta: {
          requiresAuth: false,
        },
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

export default router
