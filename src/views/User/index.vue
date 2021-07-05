<template>
  <user-form />
</template>

<script>
import { defineComponent } from 'vue'
import UserForm from '@/views/User/-components/UserForm'

export default defineComponent({
  name: 'Index',
  components: {
    UserForm
  },
  setup() {}
})
</script>
