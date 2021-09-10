<template>
  <a-modal
    v-model:visible="open"
    class="modal-change-profile"
    :title="$t('modal.title_save_email')"
    @cancel="handleCancel"
  >
    <template #footer>
      <template v-if="isRestPassword">
        <div class="modal-save-email">
          <ul>
            <li>{{ $t('modal.modal_rp_save.note_1') }}</li>
            <li>{{ $t('modal.modal_rp_save.note_2') }}</li>
            <li>{{ $t('modal.modal_rp_save.note_3') }}</li>
            <li>{{ $t('modal.modal_rp_save.note_4') }}</li>
          </ul>

          <!-- Action Section Submit & Cancel -->
          <div class="card-footer">
            <a-button key="back" class="btn-close" @click="handleCancel">
              {{ $t('modal.handle_rp_save_cancel') }}
            </a-button>
            <a-button key="submit" type="primary" html-type="submit" @click.prevent="handleSubmitRP">
              {{ $t('modal.handle_rp_save_ok') }}
            </a-button>
          </div>
        </div>
      </template>
      <template v-else>
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
            <a-button key="submit" type="primary" html-type="submit" @click.prevent="handleSubmit">
              {{ $t('modal.handle_save_email_ok') }}
            </a-button>
          </div>
        </div>
      </template>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, watch, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'

import useSuggestNewEmailService from '@/components/ModalProfile/composables/useSuggestNewEmailService'
import useSuggestNewPasswordService from '@/components/ModalProfile/composables/useSuggestNewPasswordService'
import storageKeys from '@/enums/storage-keys'
import services from '@/services'
import { useStore } from 'vuex'
const StorageService = services.get('StorageService')

export default defineComponent({
  name: 'ModalSavedEmail',

  props: {
    openSaveEamil: {
      type: Boolean,
      default: false,
      require: true
    },
    // eslint-disable-next-line vue/require-default-prop
    form: {
      type: String,
      require: true
    },
    modalResetPassword: {
      type: Boolean,
      default: false,
      require: true
    }
  },

  emits: ['update:visible', 'back-modal'],

  setup(props, context) {
    const router = useRouter()
    const store = useStore()

    const { openSaveEamil } = toRefs(props)
    const { modalResetPassword } = toRefs(props)
    const { form } = toRefs(props)

    const open = ref(false)
    const isRestPassword = ref(false)

    const nameEmail = ref({})

    watch(openSaveEamil, (value) => {
      open.value = value
    })

    watch(modalResetPassword, (value) => {
      open.value = value
      isRestPassword.value = value
      context.emit('back-modal', true)
    })

    watch(form, (value) => {
      nameEmail.value = value
    })

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    const handleSubmit = async () => {
      let dataEmail = {
        new_email: nameEmail.value
      }
      try {
        const { suggestNewEmail } = useSuggestNewEmailService(dataEmail)
        await suggestNewEmail()

        StorageService.remove(storageKeys.authProfile)

        store.commit('auth/CLEAR_AUTH_PROFILE')
        store.commit('accounting/CLEAR_ACCOUNTING_FILTER')
        store.commit('deposit/CLEAR_DEPOSIT_FILTER')
        store.commit('financing/CLEAR_FINANCING_FILTER')
        store.commit('flash/CLEAR_FLASH_MESSAGE')
        store.commit('project/CLEAR_PROJECT_FILTER')

        await router.push({ name: 'email-sent' })
      } catch (err) {
        console.log(err)
      }
    }

    const handleSubmitRP = async () => {
      try {
        const { suggestNewPassword } = useSuggestNewPasswordService()
        await suggestNewPassword()

        StorageService.remove(storageKeys.authProfile)

        store.commit('auth/CLEAR_AUTH_PROFILE')
        store.commit('accounting/CLEAR_ACCOUNTING_FILTER')
        store.commit('deposit/CLEAR_DEPOSIT_FILTER')
        store.commit('financing/CLEAR_FINANCING_FILTER')
        store.commit('flash/CLEAR_FLASH_MESSAGE')
        store.commit('project/CLEAR_PROJECT_FILTER')

        await router.push({ name: 'email-sent' })
      } catch (err) {
        console.log(err)
      }
    }

    return {
      open,
      isRestPassword,
      handleCancel,
      handleSubmit,
      handleSubmitRP
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
