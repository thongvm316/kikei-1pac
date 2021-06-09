import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Services from '@/services'
import storageKeys from '@/enums/storage-keys'

const StorageService = Services.get('StorageService')
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
        component: lazyLoadRoute('Auth/Login'),
        meta: { title: `Login | ${APP_NAME}` },
        name: 'login'
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
            path: 'new',
            name: 'project-new',
            component: lazyLoadRoute('Project/new'),
            meta: { title: `New Project | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.new' }
          },
          {
            path: ':id/edit',
            name: 'project-edit',
            component: lazyLoadRoute('Project/_id'),
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
            path: 'new',
            name: 'deposit-new',
            component: lazyLoadRoute('Deposit/new'),
            meta: { title: `New Deposit | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.new' }
          },
          {
            path: ':id/edit',
            name: 'deposit-edit',
            component: lazyLoadRoute('Deposit/_id'),
            meta: { title: `Edit Deposit | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.edit' }
          }
        ]
      },

      {
        path: '/financing',
        name: 'financing',
        component: lazyLoadRoute('Financing'),
        meta: { title: `Financing Report | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.financing' }
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
        // TODO: children will modify later
        children: [
          {
            path: 'company',
            component: lazyLoadRoute('Base'),
            meta: { title: `Company | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.company' },
            children: [
              {
                path: '',
                name: 'company',
                component: lazyLoadRoute('Company')
              },
              {
                path: 'new',
                name: 'company-new',
                component: lazyLoadRoute('Company/new'),
                meta: { title: `New Company | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.new' }
              },
              {
                path: ':id/edit',
                name: 'company-edit',
                component: lazyLoadRoute('Company/_id'),
                meta: { title: `Edit Company | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.edit' }
              }
            ]
          },
          {
            path: 'category',
            name: 'category',
            component: lazyLoadRoute('Category'),
            meta: { title: `Category | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.category' }
          },
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
          },
          {
            path: 'logs',
            name: 'logs',
            component: lazyLoadRoute('ActivityLog'),
            meta: { title: `Activity Log | ${APP_NAME}`, breadcrumbKey: 'breadcrumb.logs' }
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

// pager guard
const ROUTING_FREE = ['login']

router.beforeEach((to, _, next) => {
  // set head title
  document.title = to.meta.title

  const isRouteFree = ROUTING_FREE.indexOf(to.name) >= 0
  const authProfile = StorageService.get(storageKeys.authProfile) || store.state.auth.authProfile
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!authProfile) {
    // store data to state if need
    if (!store.state.auth.authProfile) {
      store.commit('auth/STORE_AUTH_PROFILE', authProfile)
    }

    if (isRouteFree) {
      next('/')
    } else {
      next()
    }
  } else {
    if (isRouteFree) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
