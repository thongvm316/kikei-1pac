<template>
  <a-popover v-model:visible="visible" trigger="click" placement="bottomRight" overlay-class-name="k-profile">
    <a-button :class="['k-profile__btn-user', visible && 'is-active']"><user-icon /></a-button>

    <template #content>
      <a-menu mode="inline">
        <a-menu-item>
          <user-setting-icon />
          個人設定
        </a-menu-item>

        <a-sub-menu v-if="currencyList.length > 0" key="sub1">
          <template #title>
            <component :is="currencyList[0].icon" />
            <span>{{ currencyList[0].title }}</span>
          </template>
          <template v-for="(item, index) in currencyList" :key="item.currency">
            <a-menu-item v-if="index > 0" @click="changeCurrencyActive(item.currency)">
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>

        <a-menu-item>
          <logout-icon />
          ログアウト
        </a-menu-item>
      </a-menu>
    </template>
  </a-popover>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'

import UserIcon from '@/assets/icons/ico_user.svg'
import UsdCurrencyIcon from '@/assets/icons/ico_currency_usd.svg'
import VndCurrencyIcon from '@/assets/icons/ico_currency_vnd.svg'
import YenCurrencyIcon from '@/assets/icons/ico_currency_yen.svg'
import LogoutIcon from '@/assets/icons/ico_logout.svg'
import UserSettingIcon from '@/assets/icons/ico_user_setting.svg'

export default defineComponent({
  name: 'KProfile',

  components: {
    UserIcon,
    UsdCurrencyIcon,
    VndCurrencyIcon,
    YenCurrencyIcon,
    LogoutIcon,
    UserSettingIcon
  },

  setup() {
    const visible = ref(false)
    const selectedKeys = ref([])
    const openKeys = ref([])

    // currency list
    const currencyActive = ref('jpy')
    const currencyList = ref([
      {
        currency: 'jpy',
        icon: 'YenCurrencyIcon',
        title: '表示通貨 (JPY)'
      },
      {
        currency: 'vnd',
        icon: 'VndCurrencyIcon',
        title: 'ベトナムドン (VND)'
      },
      {
        currency: 'usd',
        icon: 'UsdCurrencyIcon',
        title: 'アメリカドル (USD)'
      }
    ])

    const changeCurrencyActive = (currencyNew) => {
      currencyActive.value = currencyNew
    }

    const swapCurrencyList = () => {
      const newIndex = currencyList.value.findIndex((item) => item.currency === currencyActive.value)

      if (newIndex) {
        ;[currencyList.value[0], currencyList.value[newIndex]] = [currencyList.value[newIndex], currencyList.value[0]]
      }
    }

    onMounted(() => {
      swapCurrencyList()
    })

    watch(currencyActive, () => {
      swapCurrencyList()
    })

    return {
      visible,
      selectedKeys,
      openKeys,
      currencyList,
      currencyActive,
      changeCurrencyActive
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.k-profile {
  svg {
    color: $color-grey-15;
    background-color: $color-grey-100;
    margin-right: 8px;
  }

  &__btn-user {
    @include flexbox(center, center);
    height: 32px;
    width: 32px;
    border-radius: 50%;
    padding: 0;

    &:not(:last-child) {
      margin-right: 16px;
    }

    &:hover {
      background-color: $color-primary-6;
      color: $color-grey-100;
    }
  }

  &__btn-user.is-active {
    background-color: $color-primary-6;
    border-color: $color-primary-6;
    color: $color-grey-100;
  }

  .ant-menu {
    width: 203px;
    border: 0;
  }

  .ant-popover-inner-content {
    padding: 0;
  }

  .ant-menu-root > .ant-menu-item,
  .ant-menu-root > .ant-menu-submenu > .ant-menu-submenu-title {
    @include flexbox(flex-start, center);
    padding: 8px 12px !important;
    font-size: 14px;
    line-height: 22px;
    height: auto;
    margin: 0;

    &:hover {
      background-color: $color-grey-94;
      color: $color-grey-15;
    }
  }

  .ant-menu-sub > .ant-menu-item {
    padding: 8px 12px 8px 24px !important;
    font-size: 14px;
    line-height: 22px;
    height: auto;
  }

  .ant-menu-inline .ant-menu-item {
    margin: 0;

    &:after {
      display: none;
    }
  }

  .ant-menu-item {
    @include flexbox(flex-start, center);

    &:hover {
      background-color: $color-grey-94;
      color: $color-grey-15;
    }
  }

  .ant-menu-submenu-selected,
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: $color-grey-100;
    color: $color-grey-15;

    &:hover {
      background-color: $color-grey-94;
      color: $color-grey-15;
    }
  }

  .ant-menu-submenu-active,
  .ant-menu-item-active {
    background-color: $color-grey-100;
    color: $color-grey-15;
  }

  .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow {
    &:before,
    &:after {
      background: $color-grey-15;
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), top 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }

  .ant-popover-arrow {
    display: none;
  }
}

.k-profile.ant-popover-placement-bottomRight {
  .ant-popover-content {
    margin-top: -5px;
  }
}
</style>
