<template>
  <div class="deposit-edit container">
    <deposit-form :deposit-state="depositState" :edit="true" />
  </div>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import DepositForm from '../-components/DepositForm.vue'

import { getDepositDetail } from '../composables/useDepositService'

export default defineComponent({
  name: 'DepositEditPage',

  components: {
    DepositForm
  },

  setup() {
    const route = useRoute()
    const depositState = ref()

    const fetchDepositDetail = async () => {
      const depositId = route.params.id
      if (!depositId) return

      const { result = {} } = await getDepositDetail(depositId)
      depositState.value = result?.data || []

      console.log('depositId', depositId, result)
    }

    onBeforeMount(() => {
      fetchDepositDetail()
    })

    return {
      depositState
    }
  }
})
</script>

<style></style>
