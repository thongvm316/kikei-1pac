<template>
  <aside :class="['aside', isCollapse && 'is-collapse']">
    <div class="aside__top">
      <div class="aside__top--toggle">
        <k-button @click="toggleSideBar">
          <side-bar-close-icon />
        </k-button>
      </div>
    </div>

    <ul class="aside__menu list-unstyled">
      <li v-for="navItem in navList" :key="navItem.path" class="aside__list">
        <router-link v-slot="{ navigate, isActive, isExactActive }" :to="navItem.path" custom>
          <div
            :class="[
              'aside__link',
              isActive && 'is-active',
              isExactActive && 'router-link-exact-active',
              navItem.path === '/' && 'is-dashboard',
              subNavList.includes(navItem.path) && 'is-sub-nav-open'
            ]"
            @click="!navItem.childrens ? navigate(navItem.path) : toggleSubNav(navItem.path)"
          >
            <component :is="navItem.icon" class="aside__link--nav-icon" />
            <span class="aside__link--text">{{ $t(navItem.label) }}</span>
            <arrow-down-icon v-if="navItem.childrens" class="aside__link--arrow-icon" />
          </div>
        </router-link>

        <div class="aside__sub-nav">
          <k-accordion v-if="navItem.childrens" :open="subNavList.includes(navItem.path)" :is-expand="isCollapse">
            <ul class="list-unstyled">
              <li v-for="subNavItem in navItem.childrens" :key="subNavItem.path" class="aside__list">
                <router-link :to="subNavItem.path" class="aside__link">
                  <i class="aside__link--circle-icon" />
                  <span class="aside__text">{{ $t(subNavItem.label) }}</span>
                </router-link>
              </li>
            </ul>
          </k-accordion>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script>
import { defineComponent, ref } from 'vue'
import KButton from '@/components/KButton'
import KAccordion from '@/components/KAccordion'

import DashboardIcon from '@/assets/icons/ico_dashboard.svg'
import ProjectIcon from '@/assets/icons/ico_project.svg'
import DepositIcon from '@/assets/icons/ico_deposit.svg'
import FinancingIcon from '@/assets/icons/ico_financing.svg'
import SettingIcon from '@/assets/icons/ico_setting.svg'
import SideBarCloseIcon from '@/assets/icons/ico_sidebar_close.svg'
import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'

export default defineComponent({
  name: 'AppSidebar',

  components: {
    KButton,
    KAccordion,
    DashboardIcon,
    DepositIcon,
    ProjectIcon,
    SettingIcon,
    FinancingIcon,
    SideBarCloseIcon,
    ArrowDownIcon
  },

  setup() {
    const isCollapse = ref(false)
    const toggleSideBar = () => {
      isCollapse.value = !isCollapse.value
    }

    const subNavList = ref([])
    const toggleSubNav = (path) => {
      subNavList.value = subNavList.value.includes(path)
        ? subNavList.value.filter((i) => i !== path)
        : [...subNavList.value, path]
    }

    return {
      subNavList,
      isCollapse,
      toggleSideBar,
      toggleSubNav
    }
  },

  data() {
    return {
      navList: [
        {
          path: '/',
          label: 'breadcrumb.dashboard',
          icon: 'DashboardIcon'
        },
        {
          path: '/project',
          label: 'breadcrumb.project',
          icon: 'ProjectIcon'
        },
        {
          path: '/deposit',
          label: 'breadcrumb.deposit',
          icon: 'DepositIcon'
        },
        {
          path: '/financing',
          label: 'breadcrumb.financing',
          icon: 'FinancingIcon'
        },
        {
          path: '/setting',
          label: 'breadcrumb.setting',
          icon: 'SettingIcon',
          childrens: [
            {
              path: '/setting/1',
              label: '登録企業'
            },
            {
              path: '/setting/2',
              label: '登録企業'
            },
            {
              path: '/setting/3',
              label: '登録企業'
            },
            {
              path: '/setting/4',
              label: '登録企業'
            }
          ]
        }
      ]
    }
  }
})
</script>
