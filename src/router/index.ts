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
        component: () => import('../pages/question/QuestionFolder.vue'),
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
            name: 'shared-paper-folder',
            path: 'shared-paper-folder',
            component: () => import('../pages/examination/SharedPaperFolder.vue'),
          },
          {
            name: 'create-paper',
            path: 'create-paper/:folderId?',
            component: () => import('../pages/examination/CreatePaper.vue'),
          },
          {
            name: 'create-paper-matrix',
            path: 'create-paper/:folderId?/matrix-template',
            component: () => import('../pages/examination/CreateMatrixTemplate.vue'),
          },
          {
            name: 'generate-paper-matrix',
            path: 'create-paper/:folderId?/paper-matrix/:matrixId',
            component: () => import('../pages/examination/CreatePaperMatrix.vue'),
          },
          {
            name: 'create-paper-question-bank',
            path: 'create-paper/:folderId?/question-bank',
            component: () => import('../pages/examination/CreatePaperInQuestionBank.vue'),
          },
          {
            name: 'admin-exam-detail',
            path: 'admin/exam-detail/:id',
            component: () => import('../pages/examination/PaperAdminDetail.vue'),
          },
          {
            name: 'exam-review',
            path: 'admin/exam-review/:paperId/:userId/:submitPaperId',
            component: () => import('../pages/examination/ExamReview.vue'),
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
          {
            name: 'monitor-exam',
            path: 'admin/monitor-exam/:id',
            component: () => import('../pages/examination/MonitorExam.vue'),
          },
          {
            name: 'admin-exam-statistic',
            path: 'admin/exam-statistic/:id',
            component: () => import('../pages/examination/PaperAdminStatistic.vue'),
          },
          {
            path: '/papers/:paperId/manage-questions',
            name: 'manage-questions',
            component: () => import('../pages/examination/widgets/ManageQuestionsInPaper.vue'),
            props: true,
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
        name: 'invite-join-team',
        path: 'invite-join-team/:userId/:invitationId?',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/teacher-group/InviteJoinTeam.vue'),
      },
      {
        name: 'teacher-group',
        path: 'teacher-group',
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            name: 'group-manage',
            path: 'group-manage',
            component: () => import('../pages/teacher-group/TeacherGroup.vue'),
          },
          {
            name: 'join-request',
            path: 'join-request',
            component: () => import('../pages/teacher-group/JoinGroupRequestList.vue'),
          },
        ],
      },
      {
        name: 'join-group',
        path: 'join-group/:id',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/teacher-group/widgets/JoinGroupRequest.vue'),
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
          {
            name: 'create-assignment',
            path: '/assignments/create',
            component: () => import('../pages/assignment/widgets/EditAssignment.vue'),
          },
          {
            name: 'assignment-submission',
            path: '/assignments/submission/:id/:classId',
            component: () => import('../pages/assignment/widgets/SubmitAssignment.vue'),
          },
          {
            name: 'assignment-marking',
            path: '/assignments/marking/:id/:classId/:studentId',
            component: () => import('../pages/assignment/widgets/MarkAssignment.vue'),
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
      {
        name: 'profile',
        path: 'profile',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/user/UserProfile.vue'),
      },
      {
        name: 'notifications',
        path: 'notification',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/notification/Notification.vue'),
      },
      {
        name: 'audit logs',
        path: 'audit-logs',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/audit-logs/AuditLogs.vue'),
      },
      {
        name: 'bin',
        path: 'bin',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/bin/Bin.vue'),
      },
      {
        name: 'subscription',
        path: 'subscription',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/subscription/Subscription.vue'),
      },
      {
        name: 'orders',
        path: 'orders',
        meta: {
          requiresAuth: true,
        },
        component: () => import('../pages/orders/Orders.vue'),
      },
    ],
  },
  {
    name: 'question-edit',
    path: '/question-edit',
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
  {
    name: 'privacy-policy',
    path: '/privacy',
    component: () => import('../pages/privacy-policy.vue'),
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
