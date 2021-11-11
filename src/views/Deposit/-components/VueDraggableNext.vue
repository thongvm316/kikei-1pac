<template>
  <draggable v-model="dataDeposit" tag="tbody" @change="log">
    <slot></slot>
  </draggable>
</template>
<script>
import { defineComponent, inject, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  name: 'VueDraggableNext',

  components: {
    draggable: VueDraggableNext
  },

  setup() {
    const dataDeposit = inject('dataDeposit')
    const dragging = ref()
    const enabled = ref(true)

    const log = (e) => {
      console.log(e)
    }

    return {
      dataDeposit,
      dragging,
      enabled,

      log
    }
  }
})
</script>
