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
  },

  props: {
    record: {
      type: Object
    }
  },

  setup(props) {
    console.log('record props:::', props.record)
  }
})
</script>

<style lang="scss"></style>
