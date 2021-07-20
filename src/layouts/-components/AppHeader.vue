<template>
  <a-layout-header class="header" mode="horizontal">
    <div class="header__content">
      <div class="header__content--left">
        <k-breadcrumb />
      </div>
      <div class="header__content--right">
        <a-button
          v-if="isVisibleSearch"
          :class="['header__search', isShowSearchBadge && 'is-badge']"
          @click="openModalSearch"
        >
          <search-icon />
        </a-button>
        <k-profile />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import { defineComponent, computed, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { isEmpty } from 'lodash-es'

import KBreadcrumb from '@/components/KBreadcrumb'
import KProfile from '@/components/KProfile'

import SearchIcon from '@/assets/icons/ico_search.svg'

export default defineComponent({
  name: 'AppHeader',

  components: {
    KBreadcrumb,
    SearchIcon,
    KProfile
  },

  setup() {
    const store = useStore()
    const route = useRoute()

    // route name list to visible search button
    // eslint-disable-next-line prettier/prettier
    const visibleSearchList = [
      'dashboard',
      'deposit',
      'project',
      'company',
      'category',
      'account',
      'subcategory',
      'logs'
    ]

    const openModalSearch = () => {
      store.commit('search/STORE_SEARCH_CURRENT_ROUTE', route.name)
    }

    const isShowSearchBadge = computed(() => store.state?.search?.isShowBadge || false)
    const isVisibleSearch = computed(() => store.state?.search?.isVisible || false)
    onBeforeMount(() => {
      // check visible search button before mount
      store.commit('search/STORE_SEARCH_VISIBLE', visibleSearchList.includes(route.name))
    })

    watch(
      () => route.name,
      (routeName) => {
        // default search badge
        store.commit('search/STORE_SEARCH_SHOW_BADGE', false)

        // visible search button
        store.commit('search/STORE_SEARCH_VISIBLE', visibleSearchList.includes(routeName))

        // clear filters search deposit page
        if (!['deposit', 'deposit-edit', 'deposit-new'].includes(routeName)) {
          const filters = store.state.deposit?.filters || {}
          !isEmpty(filters) && store.commit('deposit/CLEAR_DEPOSIT_FILTER')
        }

        // clear filters search project page
        if (!['project', 'project-edit'].includes(routeName)) {
          const filters = store.state.project?.filters || {}
          !isEmpty(filters) && store.commit('project/CLEAR_PROJECT_FILTER')
        }
      }
    )

    return { route, isShowSearchBadge, isVisibleSearch, openModalSearch }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.header {
  position: fixed;
  left: 232px;
  right: 0;
  top: 0;
  z-index: 200;
  background-color: $color-grey-100;
  box-shadow: 0 1px 0 #f0f0f0;
  height: 56px;
  line-height: 28px;
  padding: 0 32px;
  transition: transform 0.3s ease-in-out, left 0.3s ease-in-out;

  &__content {
    @include flexbox(center, center);
    padding: 12px 0;

    &--left {
      flex-grow: 1;
    }

    &--right {
      @include flexbox(center, center);
    }
  }

  &__search {
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

  .header__search.is-badge {
    &:after {
      position: absolute;
      top: 0;
      right: -30%;
      height: 16px;
      width: 16px;
      background-color: $color-additional-red-6;
      content: ' ';
      border-radius: 50%;
    }
  }
}
</style>
