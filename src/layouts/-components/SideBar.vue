<template>
  <aside :class="`aside${isCollapse ? ' is-collapse' : ''}`">
    <div class="aside__top">
      <div class="aside__top--toggle">
        <k-button @click="toggleSideBar">
          <side-bar-close-icon />
        </k-button>
      </div>
    </div>

    <ul class="list-unstyled">
      <li v-for="navItem in navList" :key="navItem.href" class="aside__list">
        <router-link :to="navItem.href" custom v-slot="{ navigate, isActive, isExactActive }">
          <div
            @click="!navItem.childrens ? navigate(ctalink) : null"
            :class="[
              'aside__link',
              isActive && 'is-active',
              isExactActive && 'router-link-exact-active',
              !navItem.childrens && 'is-dashboard'
            ]"
          >
            <component :is="navItem.icon" class="aside__link--nav-icon" />
            <span class="aside__link--text">{{ $t(navItem.label) }}</span>
            <arrow-down-icon v-if="navItem.childrens" class="aside__link--arrow-icon" />
          </div>
        </router-link>

        <ul v-if="navItem.childrens" class="aside__sub-nav list-unstyled">
          <li v-for="subNavItem in navItem.childrens" :key="`${navItem.href}${subNavItem.href}`" class="aside__list">
            <router-link :to="navItem.href + subNavItem.href" class="aside__link">
              <p class="aside__text">{{ $t(subNavItem.label) }}</p>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'

const KButton = defineAsyncComponent(() => import('@/components/KButton'))

import DashboardIcon from '@/assets/ico_dashboard.svg'
import ProjectIcon from '@/assets/ico_project.svg'
import DepositIcon from '@/assets/ico_deposit.svg'
import FinancingIcon from '@/assets/ico_financing.svg'
import SettingIcon from '@/assets/ico_setting.svg'
import SideBarCloseIcon from '@/assets/ico_sidebar_close.svg'
import ArrowDownIcon from '@/assets/ico_arrow_down.svg'

export default defineComponent({
  components: {
    KButton,
    DashboardIcon,
    DepositIcon,
    ProjectIcon,
    SettingIcon,
    FinancingIcon,
    SideBarCloseIcon,
    ArrowDownIcon,
  },

  setup() {
    const navList = [
      {
        href: '/',
        label: 'header.dashboard',
        icon: 'DashboardIcon'
      },
      {
        href: '/project',
        label: 'header.project',
        icon: 'ProjectIcon'
      },
      {
        href: '/deposit',
        label: 'header.deposit',
        icon: 'DepositIcon'
      },
      {
        href: '/financing',
        label: 'header.financing',
        icon: 'FinancingIcon'
      },
      {
        href: '/setting',
        label: 'header.setting',
        icon: 'SettingIcon',
        childrens: [
          {
            href: '/1',
            label: 'Setting 1'
          },
          {
            href: '/2',
            label: 'Setting 2'
          },
          {
            href: '/3',
            label: 'Setting 3'
          },
          {
            href: '/4',
            label: 'Setting 4'
          }
        ]
      }
    ]

    const isCollapse = ref(false)
    const toggleSideBar = () => isCollapse.value = !isCollapse.value

    return {
      navList,
      isCollapse,
      toggleSideBar,
    }
  }
})
</script>
