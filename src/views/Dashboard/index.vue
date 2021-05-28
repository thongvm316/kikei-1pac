<template>
  <div>
    <a-date-picker />
    <a-button type="primary">Button</a-button>
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
