<template>
  <main-layout>
    Project Edit Page
  </main-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const MainLayout = defineAsyncComponent(() =>  import('@/layouts/MainLayout'))

export default defineComponent({
  name: 'ProjectEditPage',

  components: {
    MainLayout
  }
})
</script>
