<template>
  <a-breadcrumb :routes="routes" class="k-breadscrumb">
    <template #itemRender="{ route, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ route.breadcrumbName }}
      </span>
      <router-link v-else :to="{ path: route.path, query: { ...route.query } }">
        {{ route.breadcrumbName }}
      </router-link>
    </template>
  </a-breadcrumb>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'KBreadcrumb',

  setup() {
    const { t } = useI18n({ useScope: 'global' })
    const routes = ref([])
    const route = useRoute()

    const company = {
      path: '/setting/company',
      breadcrumbName: t('breadcrumb.company')
    }

    const category = {
      path: '/setting/category',
      breadcrumbName: t('breadcrumb.category')
    }

    const subcategory = {
      path: '/setting/category/subcategory',
      breadcrumbName: t('breadcrumb.subcategory')
    }

    // all breadcrumbs
    const routesList = {
      //login
      login: [
        {
          path: '/login'
        }
      ],

      //email sent
      'email-sent': [
        {
          path: '/email-sent'
        }
      ],

      //dashboard
      dashboard: [
        {
          path: '/',
          breadcrumbName: t('breadcrumb.dashboard')
        }
      ],

      // project
      project: [
        {
          path: '/project',
          breadcrumbName: t('breadcrumb.project')
        }
      ],

      'project-new': [
        {
          path: '/project',
          breadcrumbName: t('breadcrumb.project_new_edit')
        },
        {
          path: 'new',
          breadcrumbName: t('breadcrumb.new')
        }
      ],

      'project-edit': [
        {
          path: '/project',
          breadcrumbName: t('breadcrumb.project_new_edit')
        },
        {
          path: ':id/edit',
          breadcrumbName: t('breadcrumb.edit')
        }
      ],

      // deposit
      deposit: [
        {
          path: '/deposit',
          breadcrumbName: t('breadcrumb.deposit')
        }
      ],

      'deposit-new': [
        {
          path: '/deposit',
          breadcrumbName: t('breadcrumb.deposit')
        },
        {
          path: 'new',
          breadcrumbName: t('breadcrumb.new')
        }
      ],

      'deposit-edit': [
        {
          path: '/deposit',
          breadcrumbName: t('breadcrumb.deposit')
        },
        {
          path: ':id/edit',
          breadcrumbName: t('breadcrumb.edit')
        }
      ],

      // financing
      financing: [
        {
          path: '/financing',
          breadcrumbName: t('breadcrumb.financing')
        }
      ],

      // financing chart
      'financing-chart': [
        {
          path: '/financing/chart',
          breadcrumbName: t('breadcrumb.financing')
        }
      ],

      // accounting
      accounting: [
        {
          path: '/accounting',
          breadcrumbName: t('breadcrumb.accounting')
        }
      ],

      // company
      company: [company],

      'company-new': [
        company,
        {
          path: 'new',
          breadcrumbName: t('breadcrumb.new')
        }
      ],

      'company-edit': [
        company,
        {
          path: ':id/edit',
          breadcrumbName: t('breadcrumb.edit')
        }
      ],

      // setting account
      account: [
        {
          path: '/setting/account',
          breadcrumbName: t('breadcrumb.account')
        }
      ],

      'account-new': [
        {
          path: '/setting/account',
          breadcrumbName: t('breadcrumb.account')
        },
        {
          path: 'new',
          breadcrumbName: t('breadcrumb.new')
        }
      ],

      'account-edit': [
        {
          path: '/setting/account',
          breadcrumbName: t('breadcrumb.account')
        },
        {
          path: ':id/edit',
          breadcrumbName: t('breadcrumb.edit')
        }
      ],

      // category
      category: [category],

      'category-new': [
        category,
        {
          path: 'new',
          breadcrumbName: t('breadcrumb.new')
        }
      ],

      'category-edit': [
        category,
        {
          path: ':id/edit',
          breadcrumbName: t('breadcrumb.edit')
        }
      ],

      subcategory: [category, subcategory],

      'subcategory-new': [
        category,
        subcategory,
        {
          path: 'new',
          breadcrumbName: t('breadcrumb.new')
        }
      ],

      'subcategory-edit': [
        category,
        subcategory,
        {
          path: ':id/edit',
          breadcrumbName: t('breadcrumb.edit')
        }
      ],

      // logs
      logs: [
        {
          path: '/setting/logs',
          breadcrumbName: t('breadcrumb.logs')
        }
      ],

      // user
      user: [
        {
          path: '/user',
          breadcrumbName: t('breadcrumb.personal_setting')
        }
      ]
    }

    const getRoutesList = () => {
      const nameRoute = route?.name || ''
      routes.value = routesList[nameRoute] || []
      if (route?.query) {
        routes.value[routes.value.length - 1].query = Object.keys(route.query).length ? { ...route.query } : ''
      }
    }

    onMounted(() => {
      getRoutesList(route)
    })

    watch(
      () => route.query,
      () => {
        getRoutesList(route)
      }
    )

    return {
      routes
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.k-breadscrumb {
  .ant-breadcrumb-link,
  .ant-breadcrumb-separator {
    color: $color-grey-75;
    font-size: 20px;
    line-height: 28px;
    font-weight: 400;
  }

  span:last-child .ant-breadcrumb-link {
    color: $color-grey-15;
    font-weight: 700;
  }
}
</style>
