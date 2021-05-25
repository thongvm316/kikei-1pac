<template>
  <span :tooltip="title" :position="position"><slot /></span>
</template>

<script>
import { defineComponent } from 'vue'
import { TOOLTIP_POSITIONS } from './constants'

export default defineComponent({
  name: 'KTooltip',

  props: {
    title: {
      type: String,
      default: ''
    },

    position: {
      type: String,
      default: 'top',
      validator: (position) => {
        return Object.values(TOOLTIP_POSITIONS).includes(position)
      }
    }
  }
})
</script>
