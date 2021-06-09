<template>
  <company-form />
</template>

<script>
import { defineComponent } from 'vue'
import CompanyForm from '@/views/Company/-components/CompanyForm'
import useGetCompanyDetailService from '@/views/Company/composables/useGetCompanyDetailService'

export default defineComponent({
  name: 'CompanyEditPage',

  components: { CompanyForm },

  async beforeRouteEnter(to, from, next) {
    const { companyDetail } = useGetCompanyDetailService(to.params.id)
    const resp = await companyDetail()

    to.meta['detail'] = resp.result.data

    next()
  }
})
</script>
