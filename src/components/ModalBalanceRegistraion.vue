<template>
  <a-modal v-model:visible="open" :title="$t('modal.title_balance')" @cancel="handleCancel">
    <template #footer>
      <p>{{ $t('modal.desc_balance_input') }}</p>
      <a-button key="submit" @click="handleConfirm">{{ $t('modal.cancel') }}</a-button>
      <a-button key="back" class="btn-close" type="primary" html-type="submit" @click="handleCancel">
        {{ $t('modal.handle_balance') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, toRefs, watch, ref } from 'vue'
export default defineComponent({
  name: 'ModalBalanceRegistration',

  props: {
    showModalUpdateBalance: {
      type: Boolean,
      require: true
    }
  },

  emits: ['update:visible', 'on-handle-confirm', 'cancel-modal'],

  setup(props, context) {
    const { showModalUpdateBalance } = toRefs(props)
    const open = ref(false)

    watch(showModalUpdateBalance, (val) => {
      open.value = val
    })

    const handleCancel = () => {
      context.emit('update:visible', false)
      context.emit('cancel-modal')
      open.value = false
    }

    const handleConfirm = () => {
      context.emit('update:visible', false)
      context.emit('on-handle-confirm')
      open.value = false
    }

    return {
      open,
      handleCancel,
      handleConfirm
    }
  }
})
</script>
