<template>
  <main-layout>
    <router-view />
  </main-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const MainLayout = defineAsyncComponent(() =>  import('@/layouts/MainLayout'))

export default defineComponent({
  name: 'App',

  components: {
    MainLayout
  }
})
</script>
