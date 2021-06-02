<template>
  <a-breadcrumb :routes="routes" class="k-breadscrumb">
    <template #itemRender="{ route, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ route.breadcrumbName }}
      </span>
      <router-link v-else :to="route.path">
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
    font-weight: 800;
  }
}
</style>
