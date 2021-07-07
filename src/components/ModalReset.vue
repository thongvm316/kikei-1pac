<template>
  <a-modal v-model:visible="open" :title="$t('modal.reset')" class="modal-delete" @cancel="handleCancel">
    <template #footer>
      <template v-if="locale === 'en'">
        <p>{{ $t('modal.message_reset_password') }} {{ userName }} ?</p>
      </template>
      <template v-if="locale === 'ja'">
        <p>{{ userName + $t('modal.message_reset_password') }}</p>
      </template>
      <a-button key="back" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
      <a-button type="primary" @click="handleReset">
        {{ $t('modal.reset') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ModalReset',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: '',
      required: true
    }
  },

  emits: ['update:visible', 'reset'],

  setup(props, context) {
    const { visible } = toRefs(props)
    const { name } = toRefs(props)
    const open = ref(props.visible)
    const userName = ref(props.name)
    const { locale } = useI18n()

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    watch(visible, (val) => {
      open.value = val
    })

    watch(name, (val) => {
      userName.value = val
    })

    const handleReset = (evt) => {
      context.emit('reset', evt)
    }

    return {
      open,
      userName,
      locale,
      handleCancel,
      handleReset
    }
  }
})
</script>
