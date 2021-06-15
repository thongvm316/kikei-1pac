<template>
  <a-modal v-model:visible="visible" centered :title="$t('deposit.confirm_modal.title')" width="380px">
    <template #footer>
      <p v-if="confirmedSelectedPurpose">
        {{ $t('deposit.confirm_modal.message', { purpose: confirmedSelectedPurpose }) }}
      </p>
      <p v-else>
        {{ $t('deposit.confirm_modal.message_multiple', { purpose: confirmedSelectedPurpose }) }}
      </p>
      <a-button @click="handleCancel">{{ $t('deposit.confirm_modal.cancel_btn') }}</a-button>
      <a-button type="primary" @click="$emit('on-confirm-deposit-record')">
        {{ $t('deposit.confirm_modal.confirm_btn') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ConfirmDepositModal',

  props: {
    confirmedSelectedPurpose: Object
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
