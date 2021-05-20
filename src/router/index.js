import { createRouter, createWebHistory } from 'vue-router'

const APP_NAME = process.env.VUE_APP_APP_NAME || 'KAIKEI'

const lazyLoadRoute = (pageName) => {
  return () => import(/* webpackChunkName: "[request]" */ `@/views/${pageName}`)
}

const lazyLoadLayout = (pageName) => {
  return () => import(/* webpackChunkName: "[request]" */ `@/layouts/${pageName}`)
}

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { title: `Login | ${APP_NAME}` },
    component: lazyLoadLayout('AuthLayout'),
    children: [
      {
        path: '',
        component: lazyLoadRoute('Login')
      }
    ]
  },

  {
    path: '/',
    component: lazyLoadLayout('MainLayout'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: lazyLoadRoute('Dashboard'),
        meta: { title: `Dashboard | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.dashboard' }
      },
      {
        path: '/project',
        component: lazyLoadRoute('Base'),
        meta: { title: `Project | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.project' },
        children: [
          {
            path: '',
            name: 'project',
            component: lazyLoadRoute('Project')
          },
          {
            path: 'edit',
            name: 'project-edit',
            component: lazyLoadRoute('ProjectEdit'),
            meta: { title: `Edit Project | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.edit' }
          }
        ]
      },
      {
        path: '/deposit',
        component: lazyLoadRoute('Base'),
        meta: { title: `Deposit | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.deposit' },
        children: [
          {
            path: '',
            name: 'deposit',
            component: lazyLoadRoute('Deposit')
          },
          {
            path: 'edit',
            name: 'deposit-edit',
            component: lazyLoadRoute('DepositEdit'),
            meta: { title: `Edit Deposit | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.edit' }
          }
        ]
      },
      {
        path: '/financing',
        name: 'financing',
        component: lazyLoadRoute('Financing'),
        meta: { title: `Financing Report | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.dashboard' }
      },
      {
        path: '/accounting',
        name: 'accounting',
        component: lazyLoadRoute('AccountingManagement'),
        meta: { title: `Accounting Management Report | ${APP_NAME}` }
      },
      {
        path: '/setting',
        name: 'setting',
        component: lazyLoadRoute('Setting'),
        meta: { title: `Setting | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.setting' }
      }
    ]
  },

  {
    path: '/404',
    name: 'error-404',
    component: lazyLoadRoute('Error404'),
    meta: { title: '404 Page not found' }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  linkExactActiveClass: 'is-active',
  routes
})

router.beforeEach((to, _, next) => {
  document.title = to.meta.title
  next()
})

export default router
