<template>
  <account-form />
</template>

<script>
import { defineComponent } from 'vue'
import AccountForm from '@/views/SettingAccount/-components/AccountForm'

export default defineComponent({
  name: 'AccountNewPage',

  components: { AccountForm }
})
</script>

<style></style>
