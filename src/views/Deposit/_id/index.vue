<template>
  <div class="deposit-edit container">
    <deposit-form :is-edit-deposit="true" />
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
