<template>
  <main-layout>
    <template v-slot:header>
      <div>Content header deposit</div>
    </template>
    <p>Deposit Page</p>
    <router-link to="/deposit/edit">Go to edit page</router-link>
  </main-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const MainLayout = defineAsyncComponent(() =>  import('@/layouts/MainLayout'))

export default defineComponent({
  name: 'DepositPage',

  components: {
    MainLayout
  },
})
</script>
