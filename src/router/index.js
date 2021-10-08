import { createRouter, createWebHistory } from 'vue-router'
import { find } from 'lodash-es'
import store from '@/store'
import Services from '@/services'
import storageKeys from '@/enums/storage-keys'
import { ActivateAccountGuard, RelateActivateAccountGuard } from '@/router/guards/ActivateAccount'
import { ActivateEmailGuard, RelateActivateEmailGuard } from '@/router/guards/ActivateEmail'
import { ActivatePasswordGuard, RelateActivatePasswordGuard } from '@/router/guards/ActivatePassword'
import { ActiveDeactiveGuard, RelateActiveDeactiveGuard } from '@/router/guards/ActiveDeactive'
import { ResolveGuard } from '@/router/guards/ResolveGuard'
import { PAGE_PERMISSIONS } from '@/enums/account.enum'

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
    component: lazyLoadRoute('Auth/Account/ActivateAccount'),
    beforeEnter: ResolveGuard([ActivateAccountGuard]),
    meta: { title: `Activate Account | ${APP_NAME}` }
  },

  {
    path: '/error-expired',
    name: 'error-expired',
    component: lazyLoadRoute('Auth/Account/ErrorExpired'),
    beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Expired Mail | ${APP_NAME}` }
  },

  {
    path: '/congratulations',
    name: 'congratulations',
    component: lazyLoadRoute('Auth/Account/Congratulations'),
    beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Congratulations | ${APP_NAME}` }
  },

  {
    path: '/error-verified',
    name: 'error-verified',
    component: lazyLoadRoute('Auth/Account/ErrorVerified'),
    beforeEnter: ResolveGuard([RelateActivateAccountGuard]),
    meta: { title: `Verified Mail | ${APP_NAME}` }
  },

  {
    path: '/activate-email',
    name: 'activate-email',
    component: lazyLoadRoute('Auth/Email/ActivateEmail'),
    beforeEnter: ResolveGuard([ActivateEmailGuard]),
    meta: { title: `Activate Email | ${APP_NAME}` }
  },

  {
    path: '/expired-mail',
    name: 'expired-mail',
    component: lazyLoadRoute('Auth/Email/ExpiredMail'),
    beforeEnter: ResolveGuard([RelateActivateEmailGuard]),
    meta: { title: `Expired Mail | ${APP_NAME}` }
  },

  {
    path: '/activated-email',
    name: 'activated-email',
    component: lazyLoadRoute('Auth/Email/ActivatedEmail'),
    beforeEnter: ResolveGuard([RelateActivateEmailGuard]),
    meta: { title: `Activated Email | ${APP_NAME}` }
  },

  {
    path: '/email-sent',
    name: 'email-sent',
    component: lazyLoadRoute('Auth/Email/EmailSent'),
    meta: { title: `Email Sent | ${APP_NAME}` }
  },

  {
    path: '/activate-change-password',
    name: 'activate-change-password',
    component: lazyLoadRoute('Auth/Password/ActivateChangePassword'),
    beforeEnter: ResolveGuard([ActivatePasswordGuard]),
    meta: { title: `Activate Change Password | ${APP_NAME}` }
  },

  {
    path: '/congratulations-new-password',
    name: 'congratulations-new-password',
    component: lazyLoadRoute('Auth/Password/CongratulationsNewPassword'),
    beforeEnter: ResolveGuard([RelateActivatePasswordGuard]),
    meta: { title: `Congratulations New Password | ${APP_NAME}` }
  },

  {
    path: '/activated-password',
    name: 'activated-password',
    component: lazyLoadRoute('Auth/Password/ActivatedPassword'),
    beforeEnter: ResolveGuard([RelateActivatePasswordGuard]),
    meta: { title: `Activated Password| ${APP_NAME}` }
  },

  {
    path: '/expired-mail-password',
    name: 'expired-mail-password',
    component: lazyLoadRoute('Auth/Password/ExpiredMailPassword'),
    beforeEnter: ResolveGuard([RelateActivatePasswordGuard]),
    meta: { title: `Expired Mail | ${APP_NAME}` }
  },

  {
    path: '/password-sent',
    name: 'password-sent',
    component: lazyLoadRoute('Auth/Password/EmailSent'),
    meta: { title: `Email Sent | ${APP_NAME}` }
  },

  {
    path: '/update-activate-account',
    name: 'update-activate-account',
    component: lazyLoadRoute('Auth/Activate-Deactivate/ActivateEditPassword'),
    beforeEnter: ResolveGuard([ActiveDeactiveGuard]),
    meta: { title: `Activate Change Password | ${APP_NAME}` }
  },

  {
    path: '/success-edit-password',
    name: 'success-edit-password',
    component: lazyLoadRoute('Auth/Activate-Deactivate/SuccessEditPassword'),
    beforeEnter: ResolveGuard([RelateActiveDeactiveGuard]),
    meta: { title: `Activated Change Password | ${APP_NAME}` }
  },

  {
    path: '/expired-mail-edit',
    name: 'expired-mail-edit',
    component: lazyLoadRoute('Auth/Activate-Deactivate/ExpiredMail'),
    beforeEnter: ResolveGuard([RelateActiveDeactiveGuard]),
    meta: { title: `Expired Mail | ${APP_NAME}` }
  },

  {
    path: '/activated-email-edit-account',
    name: 'activated-email-edit-account',
    component: lazyLoadRoute('Auth/Activate-Deactivate/ActivatedEditEmail'),
    beforeEnter: ResolveGuard([RelateActiveDeactiveGuard]),
    meta: { title: `Activated Mail | ${APP_NAME}` }
  },

  {
    path: '/disabled-email',
    name: 'disabled-email',
    component: lazyLoadRoute('Auth/Activate-Deactivate/DisabledEmail'),
    beforeEnter: ResolveGuard([RelateActiveDeactiveGuard]),
    meta: { title: `Disabled Email | ${APP_NAME}` }
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
        path: '/financing',
        component: lazyLoadRoute('Base'),
        meta: { title: `Financing Report  | ${APP_NAME}` },
        children: [
          {
            path: '',
            name: 'financing',
            component: lazyLoadRoute('Financing')
          },
          {
            path: 'chart',
            name: 'financing-chart',
            component: lazyLoadRoute('FinancingChart'),
            meta: { title: `Financing Report | ${APP_NAME}` }
          }
        ]
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
          },
          {
            path: 'company-information',
            name: 'company-information',
            component: lazyLoadRoute('CompanyInformation'),
            meta: { title: `Company Information | ${APP_NAME}` }
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
    path: '/403',
    name: 'error-403',
    component: lazyLoadRoute('Error403'),
    meta: { title: `403 Forbidden | ${APP_NAME}` }
  },

  {
    path: '/404',
    name: 'error-404',
    component: lazyLoadRoute('Error404'),
    meta: { title: `404 Page not found | ${APP_NAME}` }
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
  'activate-email',
  'expired-mail',
  'activated-email',
  'activate-change-password',
  'congratulations-new-password',
  'activated-password',
  'expired-mail-password',
  'email-sent',
  'password-sent',
  'update-activate-account',
  'success-edit-password',
  'expired-mail-edit',
  'activated-email-edit-account',
  'disabled-email'
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
    }

    // get permission list
    let permissionList = store.state?.account?.permissions
    if (!permissionList) {
      try {
        const permissionResponse = await SettingAccountService.getPermissionAccount()
        permissionList = permissionResponse?.data?.result?.data || []
        store.commit('account/STORE_ACCOUNT_PERMISSIONS', permissionList)
      } catch {
        permissionList = []
      }
    }

    // check access
    let isPageAccess = true
    if (permissionList.length !== 0) {
      let isPageAccessFound = false
      to.matched.forEach((item) => {
        if (isPageAccessFound) return

        const pageFound = find(PAGE_PERMISSIONS, { path: item.path })
        if (!pageFound) return
        isPageAccess = false

        permissionList.forEach((group) => {
          if (isPageAccessFound && isPageAccess) return

          const groupFound = find(group.permissions, { featureKey: pageFound.value })
          if (groupFound) {
            isPageAccess = groupFound.permissionKey !== 3
            isPageAccessFound = true
          }
        })
      })
    }

    if (isRouteFree) {
      next('/')
    } else if (!isPageAccess) {
      next('/403')
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
