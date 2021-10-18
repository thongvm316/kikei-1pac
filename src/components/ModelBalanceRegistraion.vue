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
  name: 'ModelBalanceRegistration',

  props: {
    showModelUpdateBalance: {
      type: Boolean,
      require: true
    }
  },

  emits: ['update:visible', 'confirm-cancle-update', 'cancle-model'],

  setup(props, context) {
    const { showModelUpdateBalance } = toRefs(props)
    const open = ref(false)

    watch(showModelUpdateBalance, (val) => {
      open.value = val
    })

    const handleCancel = () => {
      context.emit('update:visible', false)
      context.emit('cancle-model')
      open.value = false
    }

    const handleConfirm = () => {
      context.emit('update:visible', false)
      context.emit('confirm-cancle-update')
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

<style scoped lang="scss"></style>
