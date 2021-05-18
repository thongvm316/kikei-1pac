<template>
  <main-layout>
    <template v-slot:header>
      <div>Content header financing</div>
    </template>
    Financing Page
  </main-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const MainLayout = defineAsyncComponent(() =>  import('@/layouts/MainLayout'))

export default defineComponent({
  name: 'FinancingPage',

  components: {
    MainLayout
  }
})
</script>
