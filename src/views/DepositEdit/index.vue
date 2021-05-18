<template>
  <main-layout>
    Deposit Edit Page
  </main-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { defineAsyncComponent } from 'vue'

const MainLayout = defineAsyncComponent(() =>  import('@/layouts/MainLayout'))

export default defineComponent({
  name: 'DepositEditPage',

  components: {
    MainLayout
  }
})
</script>
