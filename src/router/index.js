import { isAuthenticated } from '@/utils/supabase'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashBoardView from '@/views/system/DashBoardView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import SubjectView from '@/views/system/subject/SubjectView.vue'
import AssignmentView from '@/views/system/assignment/AssignmentView.vue'
import ProjectView from '@/views/system/project/ProjectView.vue'
import AccountSettingsView from '@/views/system/AccountSettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/system/dashboard',
      name: 'dashboard',
      component: DashBoardView,
    },
    {
      path: '/subjects',
      name: 'subjects',
      component: SubjectView,
    },
    {
      path: '/assignments',
      name: 'assignments',
      component: AssignmentView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectView,
    },

    {
      path: '/account/settings',
      name: 'account-settings',
      component: AccountSettingsView,
    },
    {
      path: '/:catchAll(.*)',
      component: NotFoundView,
    },
  ],
})

router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated()
  // Redirect to appropriate page if accessing home route
  if (to.name === 'home') {
    return isLoggedIn ? { name: 'dashboard' } : { name: 'login' }
  }

  // If logged in, prevent access to login or register pages
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    // redirect the user to the dashboard page
    return { name: 'dashboard' }
  }
})

export default router
