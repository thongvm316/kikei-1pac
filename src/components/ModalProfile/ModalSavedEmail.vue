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
            {{ $t('modal.handle_save_email_cancel') }}
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
import useSuggestNewEmailService from '@/components/ModalProfile/composables/useSuggestNewEmailService'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ModalSavedEmail',

  props: {
    openSaveEamil: {
      type: Boolean,
      default: false,
      require: true
    },
    form: {
      type: String,
      required: true
    }
  },

  emits: ['update:visible'],

  setup(props, context) {
    const router = useRouter()
    const { openSaveEamil } = toRefs(props)
    const { form } = toRefs(props)

    const open = ref(false)

    const nameEmail = ref('')

    watch(openSaveEamil, (value) => {
      open.value = value
    })

    watch(form, (value) => {
      nameEmail.value = value
    })

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    const handeleSubmit = async () => {
      console.log('submit')
      let dataEmail = {
        new_email: nameEmail.value
      }
      try {
        const { suggestNewEmail } = useSuggestNewEmailService(dataEmail)
        await suggestNewEmail()

        await router.push({ name: 'email-sent' })
      } catch (err) {
        console.log(err)
      }
    }

    return {
      open,
      handleCancel,
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
