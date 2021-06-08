<template>
  <div class="k-deposit-new container">
    <deposit-form />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import DepositForm from '../-components/DepositForm.vue'

export default defineComponent({
  name: 'DepositNewPage',

  components: {
    DepositForm
  }
})
</script>
