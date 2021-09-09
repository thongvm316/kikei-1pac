<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- Password -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.current_password" name="password" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('user.password') }}</label>
            <div class="form-input">
              <a-input
                type="password"
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
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

      <!--New  Password -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.new_password" name="new_password" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('user.new_password') }}</label>
            <div class="form-input">
              <a-input
                type="password"
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="new_password" class="errors">
                {{ replaceField(message, 'new_password') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!--Confirm  Password -->
      <div class="form-group">
        <Field
          v-slot="{ field, handleChange }"
          v-model="form.confirm_password"
          name="confirm_password"
          rules="confirmed:@new_password"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('user.confirm_password') }}</label>
            <div class="form-input">
              <a-input
                type="password"
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="confirm_password" class="errors">
                {{ message }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer">
        <a-button key="back" class="btn-close" style="width: 105px; margin-right: 16px" @click="handleCancel">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button key="submit" type="primary" html-type="submit" style="width: atuo">
          {{ $t('user.handle_ok') }}
        </a-button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import useChangePasswordAccountService from '@/views/User/composables/useChangePassAccountService'
import Services from '@/services'
import storageKeys from '@/enums/storage-keys'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'

const StorageService = Services.get('StorageService')

export default defineComponent({
  name: 'UserForm',

  setup() {
    const router = useRouter()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()
    const store = useStore()

    const userName = ref()
    let form = ref({
      current_password: '',
      new_password: '',
      confirm_password: ''
    })

    const tmpErrors = ref()

    watch(
      () => locale.value,
      () => {
        verifyErrors(tmpErrors.value, t('user.password_wrong'))
      }
    )

    const handleCancel = () => {
      router.go(-1)
    }

    const onSubmit = handleSubmit(() => {
      let data = { ...form.value }
      data = { ...deleteEmptyValue(data) }
      userName.value = StorageService.get(storageKeys.authProfile).fullname
      changePassAccount(data)
    })

    const changePassAccount = async (data) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { changePassAccount } = useChangePasswordAccountService(data)
        await changePassAccount()
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message:
          locale.value === 'en'
            ? userName.value + 'password reset successful'
            : userName.value + 'のアカウントのパスワードが変更されました'
      })
      await router.go(-1)
    }

    const checkErrorsApi = (err) => {
      tmpErrors.value = camelToSnakeCase(err.response.data.errors)

      verifyErrors(tmpErrors.value, t('user.password_wrong'))
    }

    const verifyErrors = (errors, msg) => {
      for (let item in errors) {
        setFieldError(item, msg)
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`user.${field}`))
    }

    return {
      form,
      onSubmit,
      handleCancel,
      replaceField
    }
  }
})
</script>
