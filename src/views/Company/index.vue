<template>
  <div>
    <Search />
    Company Page
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import Search from '@/views/Company/Search'

export default defineComponent({
  name: 'CompanyPage',
  components: {
    Search
  }
})
</script>
