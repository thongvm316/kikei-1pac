<template>
  <a-layout class="main">
    <app-sidebar />
    <a-layout class="main__content">
      <app-header>
        <slot name="header" />
      </app-header>

      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { defineComponent } from 'vue'
import AppSidebar from './-components/AppSidebar'
import AppHeader from './-components/AppHeader'

export default defineComponent({
  name: 'MainLayout',

  components: {
    AppSidebar,
    AppHeader
  }
})
</script>

<style lang="scss">
.main {
  height: 100vh;
}
</style>
