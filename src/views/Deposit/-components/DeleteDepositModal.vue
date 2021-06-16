<template>
  <a-modal v-model:visible="visible" centered title="削除" width="380px">
    <template #footer>
      <p>{{ $t('deposit.deposit_list.delete_deposit', { purpose: currentSelectedRecord?.purpose || '' }) }}</p>
      <a-button @click="handleCancel">キャンセル</a-button>
      <a-button type="danger" @click="$emit('on-delete-deposit-record')">削除</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DeleteDepositModal',

  props: {
    currentSelectedRecord: Object
  },

  setup(_, { emit }) {
    const visible = ref()

    const handleCancel = () => {
      emit('update:visible', false)
    }

    return {
      visible,
      handleCancel
    }
  }
})
</script>
