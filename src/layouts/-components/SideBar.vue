<template>
  <aside class="aside u-px-8">
    <div class="aside__top">
      <div class="aside__top--toggle">
        <k-button>
          <side-bar-close-icon />
        </k-button>
      </div>
    </div>
    <ul class="list-unstyled">
      <li class="aside__list">
        <router-link to="/">
          <div class="aside__link">
            <dashboard-icon />
            <p class="aside__text">{{ $t('header.dashboard') }}</p>
          </div>
        </router-link>
      </li>
      <li class="aside__list">
        <router-link to="/project">
          <div class="aside__link">
            <project-icon />
            <p class="aside__text">{{ $t('header.project') }}</p>
          </div>
        </router-link>
      </li>
      <li class="aside__list">
        <router-link to="/deposit">
          <div class="aside__link">
            <deposit-icon />
            <p class="aside__text">{{ $t('header.deposit') }}</p>
          </div>
        </router-link>
      </li>
      <li class="aside__list">
        <router-link to="/financing">
          <div class="aside__link">
            <financing-icon />
            <p class="aside__text">{{ $t('header.financing') }}</p>
          </div>
        </router-link>
      </li>
      <li class="aside__list">
        <router-link to="/setting">
          <div class="aside__link">
            <setting-icon />
            <p class="aside__text">{{ $t('header.setting') }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const KButton = defineAsyncComponent(() =>  import('@/components/KButton'))

import DashboardIcon from '@/assets/ico_dashboard.svg'
import ProjectIcon from '@/assets/ico_project.svg'
import DepositIcon from '@/assets/ico_deposit.svg'
import FinancingIcon from '@/assets/ico_financing.svg'
import SettingIcon from '@/assets/ico_setting.svg'
import SideBarCloseIcon from '@/assets/ico_sidebar_close.svg'

export default defineComponent({
  components: {
    KButton,
    DashboardIcon,
    DepositIcon,
    ProjectIcon,
    SettingIcon,
    FinancingIcon,
    SideBarCloseIcon
  },
})
</script>
