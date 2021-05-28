<template>
  <aside :class="['aside', isCollapse && 'is-collapse']">
    <div class="aside__top">
      <div class="aside__top--toggle">
        <div @click="toggleSideBar">
          <side-bar-close-icon />
        </div>
      </div>
    </div>

    <ul class="aside__menu list-unstyled">
      <li v-for="navItem in navList" :key="navItem.name" class="aside__list">
        <router-link v-slot="{ navigate, isActive, isExactActive }" :to="{ name: navItem.name }" custom>
          <div
            :class="[
              'aside__link',
              isActive && 'is-active',
              isExactActive && 'router-link-exact-active',
              navItem.name === 'dashboard' && 'is-dashboard',
              subNavList.includes(navItem.name) && 'is-sub-nav-open'
            ]"
            @click="!navItem.childrens ? navigate(navItem.name) : toggleSubNav(navItem.name)"
          >
            <component :is="navItem.icon" class="aside__link--nav-icon" />
            <span class="aside__link--text">{{ $t(navItem.label) }}</span>
            <arrow-down-icon v-if="navItem.childrens" class="aside__link--arrow-icon" />
          </div>
        </router-link>

        <div class="aside__sub-nav">
          <k-accordion
            v-if="navItem.childrens"
            :open="subNavList.includes(navItem.name)"
            :is-expand="isCollapse"
            :disable-header="true"
          >
            <ul class="list-unstyled">
              <li v-for="subNavItem in navItem.childrens" :key="subNavItem.name" class="aside__list">
                <router-link :to="{ name: subNavItem.name }" class="aside__link">
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
    const toggleSubNav = (name) => {
      subNavList.value = subNavList.value.includes(name)
        ? subNavList.value.filter((i) => i !== name)
        : [...subNavList.value, name]
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
          name: 'dashboard',
          label: 'breadcrumb.dashboard',
          icon: 'DashboardIcon'
        },
        {
          name: 'project',
          label: 'breadcrumb.project',
          icon: 'ProjectIcon'
        },
        {
          name: 'deposit',
          label: 'breadcrumb.deposit',
          icon: 'DepositIcon'
        },
        {
          name: 'financing',
          label: 'breadcrumb.financing',
          icon: 'FinancingIcon'
        },
        {
          name: 'setting',
          label: 'breadcrumb.setting',
          icon: 'SettingIcon',
          childrens: [
            {
              name: 'setting-1',
              label: 'breadcrumb.setting'
            },
            {
              name: 'setting-2',
              label: 'breadcrumb.setting'
            },
            {
              name: 'setting-3',
              label: 'breadcrumb.setting'
            },
            {
              name: 'setting-4',
              label: 'breadcrumb.setting'
            }
          ]
        }
      ]
    }
  }
})
</script>
