<template>
  <main-layout>
    <template v-slot:header>
      <div>Content header accounting</div>
    </template>
    Accounting Management Page
  </main-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const MainLayout = defineAsyncComponent(() =>  import('@/layouts/MainLayout'))

export default defineComponent({
  name: 'AccountingManagementPage',

  components: {
    MainLayout
  }
})
</script>
