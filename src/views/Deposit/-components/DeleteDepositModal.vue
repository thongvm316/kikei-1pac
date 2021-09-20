<template>
  <a-modal v-model:visible="visible" class="modal-delete-deposit-js" centered title="削除" width="380px">
    <template #footer>
      <p v-if="currentSelectedRecord?.purpose">
        {{ $t('deposit.deposit_list.delete_deposit', { purpose }) }}
      </p>
      <p v-else>{{ $t('deposit.deposit_list.delete_deposit_multiple') }}</p>
      <a-button type="default" @click="handleCancel">キャンセル</a-button>
      <a-button type="danger" @click="handleDeleteDeposit">削除</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'DeleteDepositModal',

  props: {
    currentSelectedRecord: Object
  },

  setup(props, { emit }) {
    const visible = ref()
    const purpose = computed(() => props.currentSelectedRecord?.purpose)

    const handleCancel = () => {
      emit('update:visible', false)
    }

    const handleDeleteDeposit = () => {
      const emitKey = purpose.value ? 'once' : 'multiple'
      emit('on-delete-deposit-record', emitKey)
    }

    return {
      visible,
      purpose,
      handleCancel,
      handleDeleteDeposit
    }
  }
})
</script>
