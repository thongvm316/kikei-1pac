<template>
  <a-modal v-model:visible="open" class="modal-check-delete-bank" :closable="false" @cancel="handleLeave">
    <template #footer>
      <div class="box">
        <p>{{ $t('modal.bank_in_use') }}</p>
      </div>
      <a-button type="primary" @click="handleLeave">
        {{ $t('modal.leave') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ModalCheckBankInUse',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:visible'],

  setup(props, context) {
    const { visible } = toRefs(props)
    const open = ref(props.visible)
    const { locale } = useI18n()

    watch(visible, (val) => {
      open.value = val
    })

    const handleLeave = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    return {
      open,
      locale,
      handleLeave
    }
  }
})
</script>

<style scoped lang="scss">
.modal-check-delete-bank {
  .box {
    margin-bottom: 16px;
    margin-top: 6px;

    p {
      margin-bottom: 0;
    }
  }
}
</style>
