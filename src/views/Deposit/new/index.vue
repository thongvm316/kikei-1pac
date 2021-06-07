<template>
  <div class="k-deposit-new container">
    <deposit-form :deposit-state="depositState" />
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
    // eslint-disable-next-line vue/require-default-prop
    depositState: {
      type: Object,
      required: false
    }
  },

  setup(props) {
    console.log('props:::', props)
  }
})
</script>
