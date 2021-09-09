<template>
  <section>
    <modal-saved-email v-model:visible="openSaveEmail" :open-save-eamil="openSaveEmail" :form="form.email" />

    <a-modal v-model:visible="open" :title="$t('modal.title_email')" @cancel="handleCancel">
      <template #footer>
        <div class="modal-profile">
          <!--Form-->
          <form class="modal-profile__form" @submit="onSubmit">
            <!--Name -->
            <div class="form-group">
              <Field v-slot="{ field, handleChange }" v-model="form.email" name="email" rules="email|input_required">
                <div class="form-content">
                  <label class="form-label required font-bold">{{ $t('modal.email') }}</label>
                  <div class="form-input">
                    <a-input
                      :value="field.value"
                      :placeholder="$t('modal.please_enter_email')"
                      size="large"
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
              <Field v-slot="{ field, handleChange }" v-model="form.password" name="password" rules="input_required">
                <div class="form-content">
                  <label class="form-label required font-bold">{{ $t('modal.password_email') }}</label>
                  <div class="form-input">
                    <a-input
                      :value="field.value"
                      type="password"
                      :placeholder="$t('modal.please_enter_password')"
                      size="large"
                      class="password_email"
                      @change="handleChange"
                    />
                    <!-- Error message -->
                    <ErrorMessage v-slot="{ message }" as="span" name="password" class="errors">
                      {{ replaceField(message, 'password') }}
                    </ErrorMessage>
                  </div>
                </div>
              </Field>
            </div>

            <!-- Action Section Submit & Cancel -->
            <div class="card-footer">
              <a-button key="back" class="btn-close" @click="handleCancel">
                {{ $t('modal.back') }}
              </a-button>
              <a-button key="submit" type="primary" html-type="submit">
                {{ $t('modal.email_ok') }}
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
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'

import ModalSavedEmail from '@/components/ModalProfile/ModalSavedEmail'
import useCheckPasswordEmailService from '@/components/ModalProfile/composables/useCheckPasswordEmailService'

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
    const { locale } = useI18n()

    const { isShowModal } = toRefs(props)
    const { handleSubmit, setFieldError } = useForm()

    const open = ref(false)
    const openSaveEmail = ref(false)
    let form = ref({ email: '', password: '' })

    const chnageEmailEnums = ref({
      password: t('modal.check_password'),
      email: t('modal.check_email')
    })

    const tmpErrors = ref()

    watch(isShowModal, (value) => {
      open.value = value
    })

    watch(
      () => locale.value,
      () => {
        verifyErrors(tmpErrors.value)
      }
    )

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    const onSubmit = handleSubmit(async () => {
      let dataPassword = {
        password: form.value.password,
        email: form.value.email
      }
      // eslint-disable-next-line no-useless-catch
      try {
        const { checkPasswordEmail } = useCheckPasswordEmailService(dataPassword)
        await checkPasswordEmail()

        openSaveEmail.value = true
        context.emit('update:visible', false)
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
    })

    const checkErrorsApi = (err) => {
      tmpErrors.value = camelToSnakeCase(err.response.data.errors)

      verifyErrors(tmpErrors.value)
    }

    const verifyErrors = (errs) => {
      for (let item in errs) {
        if (item === 'company_code') item = 'company_code_project'

        locale.value === 'en'
          ? (errs[item] = `${chnageEmailEnums.value[item]} existed`)
          : (errs[item] = `${chnageEmailEnums.value[item]}は存在しました`)

        setFieldError(item, errs[item])
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`modal.error_${field}`))
    }

    return {
      open,
      form,
      openSaveEmail,
      onSubmit,
      handleCancel,
      replaceField
    }
  }
})
</script>
