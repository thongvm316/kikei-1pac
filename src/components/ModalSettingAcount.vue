<template>
  <a-modal
    v-model:visible="open"
    :title="$t('modal.title_account')"
    class="modal-account-confirm"
    @cancel="handleCancel"
  >
    <template #footer>
      <template v-if="isPendingTo">
        <p>{{ $t('modal.desc_account_pending') }}</p>
      </template>
      <template v-else-if="isActivated">
        <span>{{ $t('modal.desc_account_deactivate_step1') }}</span>
        <br />
        <p>{{ $t('modal.desc_account_deactivate_step2') }}</p>
      </template>
      <template v-else>
        <span>{{ $t('modal.desc_account_activate_step1') }}</span>
        <br />
        <p>{{ $t('modal.desc_account_activate_step2') }}</p>
      </template>
      <a-button key="back" class="btn-close" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
      <a-button key="submit" type="primary" html-type="submit" @click="handleConfirm">
        {{ $t('modal.handle_account') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, toRefs, watch, ref } from 'vue'
export default defineComponent({
  name: 'ModalSettingAcount',

  props: {
    showModalActivate: {
      type: Boolean,
      require: true
    },
    isCheckedRadio: {
      type: Boolean,
      require: true
    },
    isActivate: {
      type: Boolean,
      require: true
    },
    isPending: {
      type: Boolean,
      require: true
    }
  },

  emits: ['update:visible', 'is-checked'],

  setup(props, context) {
    const { showModalActivate } = toRefs(props)
    const { isCheckedRadio } = toRefs(props)
    const { isActivate } = toRefs(props)
    const { isPending } = toRefs(props)

    const open = ref(false)
    const isChecked = ref(false)
    const isActivated = ref(false)
    const isPendingTo = ref(false)

    watch(showModalActivate, (val) => {
      open.value = val
    })

    watch(isActivate, (val) => {
      isActivated.value = val
    })

    watch(isPending, (val) => {
      isPendingTo.value = val
    })

    watch(isCheckedRadio, (val) => {
      isChecked.value = val
    })

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
      context.emit('is-checked', !isChecked.value)
    }

    const handleConfirm = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    return {
      open,
      isActivated,
      isPendingTo,
      handleCancel,
      handleConfirm
    }
  }
})
</script>

<style scoped lang="scss"></style>
