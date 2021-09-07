<template>
  <section>
    <modal-saved-email v-model:visible="openSaveEamil" :open-save-eamil="openSaveEamil" />

    <a-modal v-model:visible="open" :title="$t('modal.title_email')" @cancel="handleCancel">
      <template #footer>
        <div class="modal-profile">
          <!--Form-->
          <form class="modal-profile__form">
            <!--Name -->
            <div class="form-group">
              <div class="form-content">
                <label class="form-label required">{{ $t('modal.email') }}</label>

                <div>
                  <div>
                    <a-input
                      v-model:value="form.email"
                      :placeholder="$t('modal.please_enter_email')"
                      size="large"
                      class="name_profile"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!--Password -->
            <div class="form-group">
              <div class="form-content">
                <label class="form-label required">{{ $t('modal.password_email') }}</label>

                <div>
                  <a-input
                    v-model:value="form.password"
                    :placeholder="$t('modal.please_enter')"
                    size="large"
                    class="password_email"
                  />
                </div>
              </div>
            </div>

            <!-- Action Section Submit & Cancel -->
            <div class="card-footer">
              <a-button key="back" class="btn-close" @click="handleCancel">
                {{ $t('modal.handle_email_cancle') }}
              </a-button>
              <a-button key="submit" type="primary" html-type="submit" @click.prevent="handeleSubmit">
                {{ $t('modal.handle_email_ok') }}
              </a-button>
            </div>
          </form>
        </div>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, watch, toRefs, ref } from 'vue'
import ModalSavedEmail from '@/components/ModalProfile/ModalSavedEmail'

export default defineComponent({
  name: 'ModalChangeEmail',
  components: { ModalSavedEmail },
  props: {
    isShowModal: {
      type: Boolean,
      default: false,
      require: true
    }
  },

  emits: ['update:visible'],

  setup(props, context) {
    const { isShowModal } = toRefs(props)
    const open = ref(false)
    const openSaveEamil = ref(false)
    let form = ref({ email: '', password: '' })

    watch(isShowModal, (value) => {
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
      open.value = false
      openSaveEamil.value = true
      context.emit('update:visible', false)
    }

    return {
      open,
      form,
      openSaveEamil,
      handleCancel,
      handleChangeEmail,
      handeleSubmit
    }
  }
})
</script>
