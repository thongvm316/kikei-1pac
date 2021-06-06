<template>
  <a-modal
    v-model:visible="visible"
    title="削除"
    width="380px">
    <template #footer>
      <p>プロジェクト名 を削除してもよろしですか？</p>
      <a-button @click="handleCancel">キャンセル</a-button>
      <a-button @click="$emit('on-delete-deposit-record')" type="danger">削除</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DeleteDepositModal',

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
