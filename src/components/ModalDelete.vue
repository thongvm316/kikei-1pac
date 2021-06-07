<template>
  <a-modal v-model:visible="open" :title="$t('modal.title')" class="modal-delete" @cancel="handleCancel">
    <template #footer>
      <p>{{ $t('modal.message') }}</p>
      <a-button key="back" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
      <a-button type="danger" @click="handleDelete">
        {{ $t('modal.delete') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from 'vue'

export default defineComponent({
  name: 'ModalDelete',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:visible', 'delete'],

  setup(props, context) {
    const { visible } = toRefs(props)
    const open = ref(props.visible)

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    watch(visible, (val) => {
      open.value = val
    })

    const handleDelete = (evt) => {
      context.emit('delete', evt)
    }

    return {
      open,
      handleCancel,
      handleDelete
    }
  }
})
</script>
