<template>
  <section>
    <modal-saved-email v-model:visible="openSaveEamil" :open-save-eamil="openSaveEamil" :form="form.email" />

    <a-modal v-model:visible="open" :title="$t('modal.title_email')" @cancel="handleCancel">
      <template #footer>
        <div class="modal-profile">
          <!--Form-->
          <form class="modal-profile__form" @submit="onSubmit">
            <!--Name -->
            <div class="form-group">
              <Field v-slot="{ field, handleChange }" v-model="form.email" name="email" rules="email|input_required">
                <div class="form-content">
                  <label class="form-label required">{{ $t('modal.email') }}</label>
                  <div class="form-input">
                    <a-input
                      :value="field.value"
                      :placeholder="$t('modal.please_enter_email')"
                      size="large"
                      autofocus
                      class="name_profile"
                      @change="handleChange"
                    />
                    <!-- Error message -->
                    <ErrorMessage v-slot="{ message }" as="span" name="email" class="errors">
                      {{ replaceField(message, 'email') }}
                    </ErrorMessage>
                  </div>
                </div>
              </Field>
            </div>

            <!--Password -->
            <div class="form-group">
              <Field
                v-slot="{ field, handleChange }"
                v-model="form.password"
                name="password_email"
                rules="input_required"
              >
                <div class="form-content">
                  <label class="form-label required">{{ $t('modal.password_email') }}</label>
                  <div class="form-input">
                    <a-input
                      :value="field.value"
                      type="password"
                      :placeholder="$t('modal.please_enter')"
                      size="large"
                      class="password_email"
                      @change="handleChange"
                    />
                    <!-- Error message -->
                    <ErrorMessage v-slot="{ message }" as="span" name="password_email" class="errors">
                      {{ replaceField(message, 'password_email') }}
                    </ErrorMessage>
                  </div>
                </div>
              </Field>
            </div>

            <!-- Action Section Submit & Cancel -->
            <div class="card-footer">
              <a-button key="back" class="btn-close" @click="handleCancel">
                {{ $t('modal.handle_email_cancle') }}
              </a-button>
              <a-button key="submit" type="primary" html-type="submit">
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
import useCheckPasswordEmailService from '@/components/ModalProfile/composables/useCheckPasswordEmailService'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'

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
    const { t } = useI18n()
    const { isShowModal } = toRefs(props)
    const { handleSubmit } = useForm()

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

    const onSubmit = handleSubmit(async () => {
      let dataPassword = {
        password: form.value.password
      }

      // eslint-disable-next-line no-useless-catch
      try {
        const { checkPasswordEmail } = useCheckPasswordEmailService(dataPassword)
        await checkPasswordEmail()

        openSaveEamil.value = true
        context.emit('update:visible', false)
      } catch (err) {
        throw err
      }
    })

    const replaceField = (text, field) => {
      return text.replace(field, t(`modal.error_${field}`))
    }

    return {
      open,
      form,
      openSaveEamil,
      onSubmit,
      handleCancel,
      replaceField
    }
  }
})
</script>
