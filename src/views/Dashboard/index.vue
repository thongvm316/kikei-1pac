<template>
  <div>
    <date-picker />
    <a-button type="primary">Button</a-button>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'

import { DatePicker } from 'ant-design-vue'

export default defineComponent({
  name: 'Dashboard',

  components: {
    DatePicker
  },

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
