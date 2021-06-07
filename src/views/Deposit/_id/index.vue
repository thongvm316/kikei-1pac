<template>
  <div class="deposit-edit container">
    <deposit-form />
  </div>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

import DepositForm from '../-components/DepositForm.vue'

// TODO: waiting for api
// import { getDepositDetail } from '../composables/useDepositService'

export default defineComponent({
  name: 'DepositEditPage',

  components: {
    DepositForm
  },

  setup() {
    const route = useRoute()
    const fetchDepositDetail = () => {
      const depositId = route.params.id
      if (!depositId) return

      console.log('depositId', depositId)
    }

    onBeforeMount(() => {
      fetchDepositDetail()
    })
  }
})
</script>

<style></style>
