<template>
  <a-modal v-model:visible="visible" centered :title="$t('deposit.unconfirm_modal.title')" width="380px">
    <template #footer>
      <p v-if="purpose">
        {{ $t('deposit.unconfirm_modal.message', { purpose }) }}
      </p>
      <p v-else>{{ $t('deposit.unconfirm_modal.message_multiple') }}</p>

      <a-button @click="handleCancel">キャンセル</a-button>
      <a-button type="danger" :loading="isLoadingUnconfirmRequest" @click="$emit('on-unconfirm-deposit')">
        削除
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DeleteDepositModal',

  props: {
    purpose: String,
    isLoadingUnconfirmRequest: Boolean
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
