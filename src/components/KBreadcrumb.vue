<template>
  <nav class="breadcrumb">
    <ol class="breadcrumb__list" v-if='breadcrumbLength !== 0'>
      <li v-for="item in breadcrumbLinkList" :key="item.href" class="breadcrumb__list--item">
        <router-link :to="item.href" class="breadcrumb__link">
          {{ $t(item.title) }}
        </router-link>
        <span class="breadcrumb__separator u-mx-8">/</span>
      </li>
      <li class="breadcrumb__list--item">
        <span>{{ $t(breadcrumbLast.title) }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'KBreadcrumb',

  setup() {
    const route = useRoute()

    const breadcrumbList = route.matched
      .map( item => ({
        title: item.meta?.breadcrumbKey,
        href: item.path
      }))
      .filter( item => !!item.title)

    const breadcrumbLength = breadcrumbList.length
    const breadcrumbLinkList = breadcrumbLength > 1 ? breadcrumbList.slice(0, breadcrumbLength - 1) : []
    const breadcrumbLast = breadcrumbLength > 0 ? breadcrumbList[breadcrumbLength - 1] : []

    return {
      breadcrumbLength,
      breadcrumbLinkList,
      breadcrumbLast
    }
  }
})
</script>
