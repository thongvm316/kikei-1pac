<template>
  <a-modal v-model:visible="visible" centered title="確定" width="436px" @cancel="handleCancel">
    <template #footer>
      <p>入力中ですが入力をキャンセルしてもよろしいですか？</p>
      <a-button type="default" @click="handleCancel">キャンセル</a-button>
      <a-button type="primary" @click="$emit('on-confirm')">確定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ConfirmSubmitModal',

  emits: ['update:visible', 'on-confirm'],

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
