<template>
  <a-modal v-model:visible="open" :title="$t('modal.title_balance')" @cancel="handleCancel">
    <template #footer>
      <p>{{ $t('modal.desc_balance_input') }}</p>
      <a-button key="back" class="btn-close" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
      <a-button key="submit" type="primary" html-type="submit" @click="handleConfirm">
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
    updateBalanceRequest: {
      type: Object
    }
  },

  setup(props) {
    const { updateBalanceRequest } = toRefs(props)
    const open = ref(false)
    const isPendingTo = ref(true)

    watch(updateBalanceRequest, (val) => {
      open.value = val
    })

    const handleCancel = () => {
      open.value = false
    }

    const handleConfirm = () => {
      open.value = false
    }

    return {
      open,
      isPendingTo,
      handleCancel,
      handleConfirm
    }
  }
})
</script>

<style scoped lang="scss"></style>
