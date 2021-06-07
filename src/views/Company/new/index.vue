<template>
  <company-form />
</template>

<script>
import { defineComponent } from 'vue'
import CompanyForm from '@/views/Company/-components/CompanyForm'

export default defineComponent({
  name: 'CompanyNewPage',

  components: { CompanyForm }
})
</script>

<style></style>
