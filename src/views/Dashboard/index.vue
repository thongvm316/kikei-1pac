<template>
  <div>
    <a-date-picker />
    <a-button type="primary">Button</a-button>
    <a-button type="primary" shape="circle" size="large" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Dashboard',

  setup() {
    const onChange = () => {
      console.log('button click')
    }

    return {
      onChange
    }
  }
})
</script>
