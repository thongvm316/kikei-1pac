import { createRouter, createWebHistory } from 'vue-router'

const APP_NAME = process.env.APP_NAME || 'KAIKEI'

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
        component: lazyLoadRoute('Login'),
        meta: { title: `Login | ${APP_NAME}` }
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
        component: lazyLoadRoute('Base'),
        meta: { title: `Setting | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.setting' },
        children: [
          {
            path: '1',
            name: 'setting-1',
            component: lazyLoadRoute('Setting-1'),
            meta: { title: `Setting - 1 | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.setting' }
          },
          {
            path: '2',
            name: 'setting-2',
            component: lazyLoadRoute('Setting-2'),
            meta: { title: `Setting - 2 | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.setting' }
          },
          {
            path: '3',
            name: 'setting-3',
            component: lazyLoadRoute('Setting-3'),
            meta: { title: `Setting - 3| ${APP_NAME}`, breadcrumbKey: 'breadcrumb.setting' }
          },
          {
            path: '4',
            name: 'setting-4',
            component: lazyLoadRoute('Setting-4'),
            meta: { title: `Setting - 4 | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.setting' }
          }
        ]
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
  linkActiveClass: 'is-active',
  routes
})

router.beforeEach((to, _, next) => {
  document.title = to.meta.title
  next()
})

export default router
