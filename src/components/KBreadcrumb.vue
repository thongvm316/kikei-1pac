<template>
  <nav class="breadcrumb">
    <ol class="breadcrumb__list" v-if="breadcrumbLength !== 0">
      <li v-for="item in breadcrumbLinkList" :key="item.href" class="breadcrumb__list--item">
        <router-link :to="{ name: item.name }" class="breadcrumb__link">
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
import { defineComponent, watch, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'KBreadcrumb',

  setup() {
    const route = useRoute()
    const breadcrumbLength = ref(0)
    const breadcrumbLinkList = ref([])
    const breadcrumbLast = ref([])

    const getBreadcrumbList = (route) => {
      const breadcrumbList = route.matched
        .map((item) => ({
          title: item.meta?.breadcrumbKey,
          name: item.name
        }))
        .filter((item) => !!item.title)

      breadcrumbLength.value = breadcrumbList.length
      breadcrumbLinkList.value = breadcrumbLength.value > 1 ? breadcrumbList.slice(0, breadcrumbLength.value - 1) : []
      breadcrumbLast.value = breadcrumbLength.value > 0 ? breadcrumbList[breadcrumbLength.value - 1] : []
    }

    onMounted(() => {
      getBreadcrumbList(route)
    })

    watch(
      () => route.path,
      () => {
        getBreadcrumbList(route)
      }
    )

    return {
      breadcrumbLength,
      breadcrumbLinkList,
      breadcrumbLast
    }
  }
})
</script>
