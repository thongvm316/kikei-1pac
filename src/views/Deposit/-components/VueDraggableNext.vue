<template>
  <draggable :key="key" v-model="dataDeposit" tag="tbody" v-bind="dragOptions" :move="checkMove" @change="log">
    <slot></slot>
  </draggable>
</template>
<script>
import { computed, defineComponent, inject, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useStore } from 'vuex'
import { setIndexDeposit } from '../composables/useDeposit'

export default defineComponent({
  name: 'VueDraggableNext',

  components: {
    draggable: VueDraggableNext
  },

  setup() {
    const store = useStore()
    const dataDeposit = inject('dataDeposit')
    const key = ref(0)
    const isDragging = ref()
    const dragOptions = computed(() => ({
      animation: 200,
      disabled: !isAdmin || isDragging.value,
      ghostClass: 'ghost'
    }))
    const isAdmin = store.state.auth?.authProfile?.isAdmin || false

    const checkMove = (evt) => {
      if (evt.draggedContext.element.date !== evt.relatedContext.element.date) return false
      return true
    }

    const log = async (e) => {
      const ids = dataDeposit.value.filter((item) => item.date === e.moved.element.date).map((item) => item.id)
      isDragging.value = true
      key.value++
      await setIndexDeposit({ ids })
      isDragging.value = false
    }

    return {
      dataDeposit,
      key,
      dragOptions,

      log,
      checkMove
    }
  }
})
</script>
