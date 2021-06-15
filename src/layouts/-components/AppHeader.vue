<template>
  <a-layout-header class="header" mode="horizontal">
    <div class="header__content">
      <div class="header__content--left">
        <k-breadcrumb />
      </div>
      <div class="header__content--right">
        <a-button :class="['header__search', isShowSearchBadge && 'is-badge']" @click="openModalSearch">
          <search-icon />
        </a-button>
        <k-profile />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import { defineComponent, computed, watch, onMounted } from 'vue'
import KBreadcrumb from '@/components/KBreadcrumb'
import KProfile from '@/components/KProfile'

import SearchIcon from '@/assets/icons/ico_search.svg'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

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

    const openModalSearch = () => {
      store.commit('setCurrentRoute', route.name)
    }

    const isShowSearchBadge = computed(() => store.getters?.isShowSearchBadge || false)

    watch(
      () => route.name,
      () => {
        store.commit('setIsShowSearchBadge', false)
      }
    )

    onMounted(() => {
      if (['financing'].includes(route.name)) {
        openModalSearch()
      }
    })

    watch(
      () => route.name,
      (routeName) => {
        if (['financing'].includes(routeName)) {
          openModalSearch()
        }
      }
    )

    return { route, isShowSearchBadge, openModalSearch }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.header {
  background-color: $color-grey-100;
  box-shadow: 0 1px 0 #f0f0f0;
  height: 56px;
  line-height: 28px;
  padding: 0 32px;

  &__content {
    @include flexbox(center, center);
    padding: 14px 0;

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
