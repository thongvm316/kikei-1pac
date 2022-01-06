<template>
  <a-modal v-model:visible="visible" centered title="確定" width="518px" @cancel="handleCancel">
    <template #footer>
      <p>予測の内容をコピーすると入力されていた内容が上書きされます <br />コピーしてもよろしいですか？</p>
      <a-button type="default" @click="handleCancel">いいえ</a-button>
      <a-button type="primary" @click="$emit('on-confirm')">はい</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ConfirmCloneModal',

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
