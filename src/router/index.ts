import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import QuestionEditLayout from '@/layouts/QuestionEditLayout.vue'

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
          {
            name: 'create-paper',
            path: 'create-paper/:folderId?',
            component: () => import('../pages/examination/CreatePaper.vue'),
          },
          {
            name: 'admin-exam-detail',
            path: 'admin/exam-detail/:id',
            component: () => import('../pages/examination/PaperAdminDetail.vue'),
          },
          {
            name: 'paper-config',
            path: 'admin/paper-config/:id',
            component: () => import('../pages/examination/PaperConfigAction.vue'),
          },
          {
            name: 'paper-config-online',
            path: 'admin/paper-config-online/:id',
            component: () => import('../pages/examination/PaperConfigOnline.vue'),
          },
        ],
      },
      {
        name: 'exam',
        path: 'exam',
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            name: 'exam-start',
            path: 'exam-start/:id',
            component: () => import('../pages/examination/student/PaperStartView.vue'),
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
        name: 'classrooms',
        path: '/classroom',
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            name: 'classroom',
            path: '',
            component: () => import('../pages/classrooms/Class.vue'),
          },
          {
            name: 'class-details',
            path: ':id',
            component: () => import('../pages/classrooms/widgets/ClassDetail.vue'),
          },
          {
            name: 'news',
            path: 'news',
            meta: {
              requiresAuth: true,
            },
            component: () => import('../pages/classrooms/News.vue'),
          },
        ],
      },
      {
        name: 'assignment',
        path: '/assignments',
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            name: 'assignments',
            component: () => import('../pages/assignment/Assignment.vue'),
            path: '',
          },
          {
            name: 'assignment-details',
            path: ':id/:classId',
            component: () => import('../pages/assignment/widgets/AssignmentDetails.vue'),
          },
          {
            name: 'edit-assignment-details',
            path: '/assignments/:id/:classId',
            component: () => import('../pages/assignment/widgets/EditAssignmentDetails.vue'),
          },
        ],
      },
      {
        name: 'subjects',
        path: 'subjects',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/subject/Subject.vue'),
      },
    ],
  },
  {
    name: 'question-edit',
    path: '/question-edit/:id',
    component: QuestionEditLayout,
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
          requiresCaptcha: true,
        },
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        meta: {
          requiresAuth: false,
          requiresCaptcha: true,
        },
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        meta: {
          requiresAuth: false,
          requiresCaptcha: true,
        },
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'confirm-email',
        path: 'confirm-email',
        meta: {
          requiresAuth: false,
        },
        component: () => import('../pages/auth/ConfirmEmail.vue'),
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
        name: 'reset-password',
        path: 'reset-password',
        meta: {
          requiresAuth: false,
          requiresCaptcha: true,
        },
        component: () => import('../pages/auth/ResetPassword.vue'),
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
