<template>
  Deposit Page
  <Search />
</template>

<script>
import { defineComponent } from 'vue'
import Search from '@/views/Deposit/Search'

export default defineComponent({
  name: 'DepositPage',

  components: {
    Search
  }
})
</script>

<style lang="scss" scoped></style>
