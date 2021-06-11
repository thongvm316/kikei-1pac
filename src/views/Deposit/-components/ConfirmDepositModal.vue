<template>
  <a-modal v-model:visible="visible" centered title="確定" width="380px">
    <template #footer>
      <p>項目名 を確定してもよろしですか？</p>
      <a-button @click="handleCancel">キャンセル</a-button>
      <a-button type="primary" @click="$emit('on-confirm-deposit-record')">確定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ConfirmDepositModal',

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
