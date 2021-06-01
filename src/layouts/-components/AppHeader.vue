<template>
  <a-layout-header class="header" mode="horizontal">
    <div class="header__content">
      <a-breadcrumb :routes="routes" class="header__left">
        <template #itemRender="{ route, routes }">
          <span v-if="routes.indexOf(route) === routes.length - 1">
            {{ route.breadcrumbName }}
          </span>
          <router-link v-else :to="route.path">
            {{ route.breadcrumbName }}
          </router-link>
        </template>
      </a-breadcrumb>
      <div class="header__right">
        <a-button key="3">Search</a-button>
        <a-button key="2">Account</a-button>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AppHeader',

  setup() {
    const { t } = useI18n({ useScope: 'global' })
    const routes = ref([])
    const route = useRoute()

    const getRoutesList = () => {
      routes.value = route.matched
        .filter((item) => !!item.meta?.breadcrumbKey)
        .map((item) => ({
          breadcrumbName: t(item.meta?.breadcrumbKey),
          path: item.path
        }))
    }

    onMounted(() => {
      getRoutesList(route)
    })

    watch(
      () => route.path,
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

.header {
  background-color: $color-grey-100;
  box-shadow: 0 1px 0 #f0f0f0;
  height: 56px;
  line-height: 28px;
  padding: 0 32px;

  &__content {
    @include flexbox(center, center);
    padding: 14px 0;
  }

  .ant-breadcrumb {
    flex-grow: 1;
  }

  .ant-breadcrumb-link,
  .ant-breadcrumb-separator {
    color: $color-grey-75;
    font-size: 20px;
    line-height: 28px;
    font-weight: 400;
  }

  .ant-breadcrumb > span:last-child .ant-breadcrumb-link {
    color: $color-grey-15;
    font-weight: 800;
  }
}
</style>
