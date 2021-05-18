<template>
  <main-layout>
    Setting Page
  </main-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const MainLayout = defineAsyncComponent(() =>  import('@/layouts/MainLayout'))

export default defineComponent({
  name: 'SettingPage',

  components: {
    MainLayout
  }
})
</script>
