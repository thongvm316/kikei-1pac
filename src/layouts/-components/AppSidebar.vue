<template>
  <a-layout-sider width="232" collapsed-width="66" :collapsed="isCollapse" class="aside-wrapper">
    <aside :class="['aside', isCollapse && 'is-collapse']">
      <div class="aside__top">
        <div class="aside__top--toggle">
          <div @click="toggleSideBar">
            <side-bar-close-icon />
          </div>
        </div>
      </div>

      <ul class="aside__menu">
        <li v-for="navItem in navList" :key="navItem.name" class="aside__list">
          <router-link
            v-if="!navItem.childrens"
            v-slot="{ navigate, isActive, isExactActive }"
            :to="{ name: navItem.name }"
            custom
          >
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

          <div v-else class="aside__collapse">
            <a-collapse accordion>
              <a-collapse-panel :key="navItem.name" :show-arrow="false" :is-active="isCollapse">
                <template #extra>
                  <li class="aside__list">
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
                  </li>
                </template>
                <ul class="aside__sub-nav">
                  <li v-for="subNavItem in navItem.childrens" :key="subNavItem.name" class="aside__list">
                    <router-link :to="{ name: subNavItem.name }" class="aside__link">
                      <i class="aside__link--circle-icon" />
                      <span class="aside__text">{{ $t(subNavItem.label) }}</span>
                    </router-link>
                  </li>
                </ul>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </li>
      </ul>
    </aside>
  </a-layout-sider>
</template>

<script>
import { defineComponent, ref } from 'vue'
// import KAccordion from '@/components/KAccordion'

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
    // KAccordion,
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

<style lang="scss">
@import '@/styles/shared/variables';

$width-sidebar: 232px;
$width-sidebar-collapse: 66px;
$width-sub-nav-collapse: 150px;

.aside {
  width: $width-sidebar;
  background-color: $color-primary-10;
  color: $color-grey-100;
  flex-grow: 0;
  transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__top {
    height: 80px;
  }

  &__link,
  &__top--toggle {
    padding: 8px 0 8px 24px;
    position: relative;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      color: $color-primary-3;
    }
  }

  &__link {
    &--arrow-icon {
      position: absolute;
      top: 50%;
      right: 0;
      margin-right: 24px;
      margin-top: -7px;
    }

    &--nav-icon {
      margin-right: 8px;
      margin-bottom: -2px;
    }

    &--circle-icon {
      display: inline-block;
      margin-right: 12px;

      &:before {
        content: '';
        display: block;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        background-color: $color-grey-100;
      }
    }

    &:hover {
      .aside__link--circle-icon:before {
        background-color: $color-primary-3;
      }
    }
  }

  &__list > :not(.is-dashboard),
  &__top--toggle {
    .aside__link--nav-icon {
      background-color: $color-primary-10;
    }
  }

  .is-active.aside__link:not(.is-dashboard),
  .is-active:not(.is-dashboard) .aside__link--nav-icon,
  .router-link-exact-active {
    background-color: $color-primary-9;
    color: $color-primary-3;
  }

  &__link--circle-icon {
    display: inline-block;
    margin-right: 12px;

    &:before {
      content: '';
      display: block;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      background-color: $color-grey-100;
    }

    &:hover:before {
      background-color: $color-primary-3;
    }
  }

  &__sub-nav &__link {
    display: block;
    padding-left: 50px;
    color: $color-grey-100;

    &:hover {
      color: $color-primary-3;
    }
  }

  &__link--arrow-icon {
    transform: rotate(90deg);
    transition: transform 0.5s ease;
  }

  .is-sub-nav-open &__link--arrow-icon {
    transform: none;
  }

  &__top--toggle {
    svg {
      transition: transform 0.3s ease;
    }
  }
}

.aside__collapse {
  .ant-collapse-header {
    padding: 0;
    height: 38px;
    width: 100%;
    background-color: $color-primary-10;
  }

  .ant-collapse-extra {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .aside__link {
      color: $color-grey-100;

      &:hover {
        color: $color-primary-3;
      }
    }
  }

  .ant-collapse,
  .ant-collapse > .ant-collapse-item {
    border: 0;
  }

  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }

  .ant-collapse,
  .ant-collapse-content-box {
    background-color: $color-primary-10;
  }

  .ant-collapse-content {
    border: 0;
  }
}

.aside.is-collapse {
  width: $width-sidebar-collapse;

  .aside__link--text,
  .aside__link--arrow-icon,
  .aside__sub-nav {
    display: none;
  }

  .aside__list {
    position: relative;

    &:hover {
      .aside__link--text,
      .aside__sub-nav {
        display: block !important;
      }
    }
  }

  .aside__link--text,
  .aside__sub-nav {
    position: absolute;
    left: $width-sidebar-collapse;
    width: $width-sub-nav-collapse;
    background-color: $color-primary-10;
  }

  .aside__link--text {
    top: 0;
    padding: 8px 0 8px 12px;
  }

  .aside__sub-nav {
    top: 37px;
  }

  .aside__sub-nav,
  .aside__link--text {
    border-left: 1px solid #fff;
  }

  .aside__sub-nav .aside__link {
    padding-left: 12px;
  }

  .aside__top--toggle {
    svg {
      transform: scaleX(-1);
    }
  }
}

.aside-wrapper,
.aside-wrapper.ant-layout-sider-collapsed {
  transition: all 0.3s ease-in-out;
}
</style>
