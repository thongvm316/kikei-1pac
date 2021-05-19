<template>
  <main class="main">
    <side-bar />
    <div class="main__content">
      <app-header>
        <slot name='header' />
      </app-header>
      <div class="container">
        <router-view />
      </div>
    </div>
  </main>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

// const SideBar = defineAsyncComponent(() =>import('@/layouts/-components/SideBar'))
// const AppHeader = defineAsyncComponent(() =>  import('@/layouts/-components/AppHeader'))

export default defineComponent({
  name: 'MainLayout',

  components: {
    SideBar: defineAsyncComponent(() =>import('@/layouts/-components/SideBar')),
    AppHeader: defineAsyncComponent(() =>  import('@/layouts/-components/AppHeader'))
  },
 })
</script>
