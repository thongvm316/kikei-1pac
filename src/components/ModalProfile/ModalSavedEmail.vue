<template>
  <a-modal v-model:visible="open" :title="$t('modal.title_save_email')" @cancel="handleCancel">
    <template #footer>
      <div class="modal-save-email">
        <ul>
          <li>{{ $t('modal.modal_save.note_1') }}</li>
          <li>{{ $t('modal.modal_save.note_2') }}</li>
          <li>{{ $t('modal.modal_save.note_3') }}</li>
          <li>{{ $t('modal.modal_save.note_4') }}</li>
        </ul>

        <!-- Action Section Submit & Cancel -->
        <div class="card-footer">
          <a-button key="back" class="btn-close" @click="handleCancel">
            {{ $t('modal.handle_save_email_cancle') }}
          </a-button>
          <a-button key="submit" type="primary" html-type="submit" @click.prevent="handeleSubmit">
            {{ $t('modal.handle_save_email_ok') }}
          </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, watch, toRefs, ref } from 'vue'

export default defineComponent({
  name: 'ModalSavedEmail',

  props: {
    openSaveEamil: {
      type: Boolean,
      default: false,
      require: true
    }
  },

  emits: ['update:visible'],

  setup(props, context) {
    const { openSaveEamil } = toRefs(props)
    const open = ref(false)
    let form = ref({ email: '', password: '' })

    watch(openSaveEamil, (value) => {
      open.value = value
    })

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    const handleChangeEmail = () => {
      console.log('change')
    }

    const handeleSubmit = () => {
      console.log('submit')
    }

    return {
      open,
      form,
      handleCancel,
      handleChangeEmail,
      handeleSubmit
    }
  }
})
</script>

<style scoped lang="scss">
.modal-save-email {
  margin: 32px 160px 74px;

  ul {
    text-align: left;
    list-style: none;
    padding: 0;
    font-size: 14px;
    line-height: 22px;
  }
}
</style>
