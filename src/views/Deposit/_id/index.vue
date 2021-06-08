<template>
  <div class="deposit-edit container">
    <deposit-form :edit="true" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import DepositForm from '../-components/DepositForm.vue'

export default defineComponent({
  name: 'DepositEditPage',

  components: {
    DepositForm
  }
})
</script>

<style></style>
