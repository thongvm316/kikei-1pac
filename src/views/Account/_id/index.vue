<template>
  <account-form />
</template>

<script>
import { defineComponent } from 'vue'

import AccountForm from '@/views/Account/-components/AccountForm'
import useGetAccountDetailService from '@/views/Account/composables/useGetAccountDetailService'

export default defineComponent({
  name: 'AccountEditPage',

  components: { AccountForm },

  async beforeRouteEnter(to, from, next) {
    const { accountDetail } = useGetAccountDetailService(top.params.id)
    const res = await accountDetail()

    to.meta['detail'] = res.result.data

    next()
  }
})
</script>

<style scoped></style>
