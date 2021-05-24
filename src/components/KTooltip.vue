<template>
  <span :tooltip="title" :position="position"><slot /></span>
</template>

<script>
import { defineComponent } from 'vue'

const FORM_PROPS = {
  position: ['top', 'left', 'right', 'bottom']
}

Object.freeze(FORM_PROPS)

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
        return FORM_PROPS.position.includes(position)
      }
    }
  }
})
</script>
