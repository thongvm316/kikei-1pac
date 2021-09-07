import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Services from '@/services'
import storageKeys from '@/enums/storage-keys'
import { ActivateAccountGuard, RelateActivateAccountGuard, ResolveGuard } from '@/router/guards'

const StorageService = Services.get('StorageService')
const SettingAccountService = Services.get('SettingAccountService')
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
    meta: { title: `Login | ${APP_NAME}` },
    component: lazyLoadLayout('AuthLayout'),
    children: [
      {
        path: '',
        name: 'login',
        component: lazyLoadRoute('Auth/Login'),
        meta: { title: `Login | ${APP_NAME}` }
      }
    ]
  },

  {
    path: '/activate-account',
    name: 'activate-account',
    component: lazyLoadRoute('Auth/ActivateAccount'),
    beforeEnter: ResolveGuard([ActivateAccountGuard]),
    meta: { title: `Activate Account | ${APP_NAME}` }
  },

  {
    path: '/error-expired',
    name: 'error-expired',
    component: lazyLoadRoute('Auth/ErrorExpired'),
    beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Expired Mail | ${APP_NAME}` }
  },

  {
    path: '/congratulations',
    name: 'congratulations',
    component: lazyLoadRoute('Auth/Congratulations'),
    beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Congratulations | ${APP_NAME}` }
  },

  {
    path: '/error-verified',
    name: 'error-verified',
    component: lazyLoadRoute('Auth/ErrorVerified'),
    beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Verified Mail | ${APP_NAME}` }
  },

  {
    path: '/change-password',
    name: 'change-password',
    component: lazyLoadRoute('Auth/ChangePassword'),
    // beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Change Password | ${APP_NAME}` }
  },

  {
    path: '/expired-mail',
    name: 'expired-mail',
    component: lazyLoadRoute('Auth/ExpiredMail'),
    // beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Expired Mail | ${APP_NAME}` }
  },

  {
    path: '/email-sent',
    name: 'email-sent',
    component: lazyLoadRoute('Auth/EmailSent'),
    // beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Email Sent | ${APP_NAME}` }
  },

  {
    path: '/',
    component: lazyLoadLayout('MainLayout'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: lazyLoadRoute('Dashboard'),
        meta: { title: `Dashboard | ${APP_NAME}` }
      },

      {
        path: '/project',
        component: lazyLoadRoute('Base'),
        meta: { title: `Project | ${APP_NAME}` },
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
            meta: { title: `New Project | ${APP_NAME}` }
          },
          {
            path: ':id/edit',
            name: 'project-edit',
            component: lazyLoadRoute('Project/_id'),
            meta: { title: `Edit Project | ${APP_NAME}` }
          }
        ]
      },

      {
        path: '/deposit',
        component: lazyLoadRoute('Base'),
        meta: { title: `Deposit | ${APP_NAME}` },
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
            meta: { title: `New Deposit | ${APP_NAME}` }
          },
          {
            path: ':id/edit',
            name: 'deposit-edit',
            component: lazyLoadRoute('Deposit/_id'),
            meta: { title: `Edit Deposit | ${APP_NAME}` }
          }
        ]
      },

      {
        path: '/financing/table',
        name: 'financing',
        component: lazyLoadRoute('Financing'),
        meta: { title: `Financing Report | ${APP_NAME}` }
      },

      {
        path: '/financing/chart',
        name: 'financing-chart',
        component: lazyLoadRoute('FinancingChart'),
        meta: { title: `Financing Report | ${APP_NAME}` }
      },

      {
        path: '/accounting',
        name: 'accounting',
        component: lazyLoadRoute('Accounting'),
        meta: { title: `Accounting Report | ${APP_NAME}` }
      },

      {
        path: '/setting',
        name: 'setting',
        component: lazyLoadRoute('Base'),
        meta: { title: `Setting | ${APP_NAME}` },
        children: [
          {
            path: 'company',
            component: lazyLoadRoute('Base'),
            meta: { title: `Company | ${APP_NAME}` },
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
                meta: { title: `New Company | ${APP_NAME}` }
              },
              {
                path: ':id/edit',
                name: 'company-edit',
                component: lazyLoadRoute('Company/_id'),
                meta: { title: `Edit Company | ${APP_NAME}` }
              }
            ]
          },
          {
            path: 'category',
            component: lazyLoadRoute('Base'),
            meta: { title: `Category | ${APP_NAME}` },
            children: [
              {
                path: '',
                name: 'category',
                component: lazyLoadRoute('Category')
              },
              {
                path: 'new',
                name: 'category-new',
                component: lazyLoadRoute('Category/new'),
                meta: { title: `New Category | ${APP_NAME}` }
              },
              {
                path: ':id/edit',
                name: 'category-edit',
                component: lazyLoadRoute('Category/_id'),
                meta: { title: `Edit Category | ${APP_NAME}` }
              },
              {
                path: 'subcategory',
                component: lazyLoadRoute('Base'),
                meta: { title: `Subcategory | ${APP_NAME}` },
                children: [
                  {
                    path: '',
                    name: 'subcategory',
                    component: lazyLoadRoute('Subcategory')
                  },
                  {
                    path: 'new',
                    name: 'subcategory-new',
                    component: lazyLoadRoute('Subcategory/new'),
                    meta: { title: `New SubCategory | ${APP_NAME}` }
                  },
                  {
                    path: ':id/edit',
                    name: 'subcategory-edit',
                    component: lazyLoadRoute('Subcategory/_id'),
                    meta: { title: `Edit SubCategory | ${APP_NAME}` }
                  }
                ]
              }
            ]
          },
          {
            path: 'account',
            component: lazyLoadRoute('Base'),
            meta: { title: `Account | ${APP_NAME}` },
            children: [
              {
                path: '',
                name: 'account',
                component: lazyLoadRoute('SettingAccount')
              },
              {
                path: 'new',
                name: 'account-new',
                component: lazyLoadRoute('SettingAccount/new'),
                meta: { title: `New Account | ${APP_NAME}` }
              },
              {
                path: ':id/edit',
                name: 'account-edit',
                component: lazyLoadRoute('SettingAccount/_id'),
                meta: { title: `Edit Account | ${APP_NAME}` }
              }
            ]
          },
          {
            path: 'logs',
            name: 'logs',
            component: lazyLoadRoute('ActivityLog'),
            meta: { title: `Activity Log | ${APP_NAME}` }
          }
        ]
      },

      {
        path: '/user',
        name: 'user',
        component: lazyLoadRoute('User'),
        meta: { title: `Personal Setting | ${APP_NAME}` }
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
const ROUTING_FREE = [
  'login',
  'activate-account',
  'error-expired',
  'congratulations',
  'error-verified',
  'change-password',
  'expired-mail',
  'email-sent'
]

router.beforeEach(async (to, _, next) => {
  // set head title
  document.title = to.meta.title

  const isRouteFree = ROUTING_FREE.indexOf(to.name) >= 0
  const authProfile = StorageService.get(storageKeys.authProfile) || store.state.auth.authProfile
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!authProfile) {
    // store data to state if need
    if (!store.state.auth.authProfile) {
      store.commit('auth/STORE_AUTH_PROFILE', authProfile)

      // get permissions account
      const permissionResponse = await SettingAccountService.getPermissionAccount()
      const permissionData = permissionResponse?.data?.result?.data || []
      store.commit('account/STORE_ACCOUNT_PERMISSIONS', permissionData)
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
