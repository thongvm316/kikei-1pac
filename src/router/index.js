import { createRouter, createWebHistory } from 'vue-router'

const appName = 'KAIKEI'

const lazyLoadRoute = (pageName) => {
  return () => import(/* webpackChunkName: "[request]" */ `@/views/${pageName}`)
}

const lazyLoadLayout = (pageName) => {
  return () => import(/* webpackChunkName: "[request]" */ `@/layouts/${pageName}`)
}

const routes = [
  {
    path: '/login',
    component: lazyLoadLayout('AuthLayout'),
    children: [
      {
        path: '',
        component: lazyLoadRoute('Login'),
        meta: { title: `Login | ${appName}`, }
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
        meta: { title: `Dashboard | ${appName}`, breadcrumbKey: 'header.dashboard' }
      },
      {
        path: '/project',
        component: lazyLoadRoute('Base'),
        meta: { title: `Project | ${appName}`, breadcrumbKey: 'header.project' },
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
            meta: { title: `Edit Project | ${appName}`, breadcrumbKey: 'header.edit' }
          }
        ]
      },
      {
        path: '/deposit',
        component: lazyLoadRoute('Base'),
        meta: { title: `Deposit | ${appName}`, breadcrumbKey: 'header.deposit' },
        children: [
          {
            path: '',
            name: 'deposit',
            component: lazyLoadRoute('Deposit')
          },
          {
            path: 'edit',
            name: 'depositEdit',
            component: lazyLoadRoute('DepositEdit'),
            meta: { title: `Edit Deposit | ${appName}`, breadcrumbKey: 'header.edit' }
          }
        ]
      },
      {
        path: '/financing',
        name: 'financing',
        component: lazyLoadRoute('Financing'),
        meta: { title: `Financing Report | ${appName}`, breadcrumbKey: 'header.dashboard' }
      },
      {
        path: '/accounting',
        name: 'accounting',
        component: lazyLoadRoute('AccountingManagement'),
        meta: { title: `Accounting Management Report | ${appName}` }
      },
      {
        path: '/setting',
        name: 'setting',
        component: lazyLoadRoute('Base'),
        meta: { title: `Setting | ${appName}`, breadcrumbKey: 'header.setting' },
        children: [
          {
            path: '1',
            name: 'setting-1',
            component: lazyLoadRoute('Setting-1'),
            meta: { title: `Setting - 1 | ${appName}`, breadcrumbKey: 'header.setting' },
          },
          {
            path: '2',
            name: 'setting-2',
            component: lazyLoadRoute('Setting-2'),
            meta: { title: `Setting - 2 | ${appName}`, breadcrumbKey: 'header.setting' },
          },
          {
            path: '3',
            name: 'setting-3',
            component: lazyLoadRoute('Setting-3'),
            meta: { title: `Setting - 3| ${appName}`, breadcrumbKey: 'header.setting' },
          },
          {
            path: '4',
            name: 'setting-4',
            component: lazyLoadRoute('Setting-4'),
            meta: { title: `Setting - 4 | ${appName}`, breadcrumbKey: 'header.setting' },
          },
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
