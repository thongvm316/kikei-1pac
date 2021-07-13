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
    name: '',
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
        name: 'financing',
        component: lazyLoadRoute('Financing'),
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
        // TODO: children will modify later
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
