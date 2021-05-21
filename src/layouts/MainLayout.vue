<template>
  <main class="main">
    <app-sidebar />
    <div class="main__content">
      <app-header>
        <slot name="header" />
      </app-header>

      <div class="container">
        <router-view />
      </div>
    </div>
  </main>
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
