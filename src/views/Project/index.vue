<template>
  <main-layout>
    <template v-slot:header>
      <div>Content header project</div>
    </template>
    <p>Project Page</p>
    <router-link to="/project/edit">Go to edit page</router-link>
  </main-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const MainLayout = defineAsyncComponent(() =>  import('@/layouts/MainLayout'))

export default defineComponent({
  name: 'ProjectPage',

  components: {
    MainLayout
  }
})
</script>
