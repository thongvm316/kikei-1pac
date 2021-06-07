<template>
  <Form />
</template>

<script>
import { defineComponent } from 'vue'
import Form from '@/views/Company/-components/Form'
import useGetCompanyDetailService from '@/views/Company/composables/useGetCompanyDetailService'

export default defineComponent({
  name: 'CompanyEditPage',

  components: { Form },

  async beforeRouteEnter(to, from, next) {
    const { companyDetail } = useGetCompanyDetailService(to.params.id)
    const resp = await companyDetail()

    to.meta['detail'] = resp.result

    next()
  }
})
</script>
