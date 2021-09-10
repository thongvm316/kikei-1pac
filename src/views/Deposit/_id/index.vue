<template>
  <div class="deposit-edit">
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

<style lang="scss" scoped>
.deposit-edit {
  padding-right: 32px;
  padding-left: 32px;

  @supports (padding: env(safe-area-inset-left)) {
    padding-left: calc(32px + env(safe-area-inset-left));
    padding-right: calc(32px + env(safe-area-inset-right));
  }

  @supports (padding: constant(safe-area-inset-left)) {
    padding-left: calc(32px + constant(safe-area-inset-left));
    padding-right: calc(32px + constant(safe-area-inset-right));
  }
}
</style>
