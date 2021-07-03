<template>
  <a-modal v-model:visible="visible" centered :title="$t('deposit.unconfirm_modal.title')" width="380px">
    <template #footer>
      <p>
        {{ $t('deposit.unconfirm_modal.message', { purpose }) }}
      </p>
      <a-button @click="handleCancel">{{ $t('deposit.unconfirm_modal.cancel_btn') }}</a-button>
      <a-button type="danger" :loading="isLoadingUnconfirmRequest" @click="$emit('on-unconfirm-deposit')">
        {{ $t('deposit.unconfirm_modal.unconfirm_btn') }}
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
