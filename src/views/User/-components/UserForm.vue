<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- Password -->
      <div class="form-group">
        <Field
          v-slot="{ field, handleChange }"
          v-model="form.current_password"
          name="current_password"
          rules="required"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('user.current_password') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="current_password" class="errors">
                {{ replaceField(message, 'current_password') }}
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

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer">
        <a-button key="back" style="width: 105px; margin-right: 16px" @click="handleCancel">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button key="submit" type="primary" html-type="submit" style="width: 105px">
          {{ $t('user.handle_ok') }}
        </a-button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import useChangePasswordAccountService from '@/views/User/composables/useChangePassAccountService'

export default defineComponent({
  name: 'UserForm',

  setup() {
    let form = ref({
      current_password: '',
      new_password: ''
    })
    const router = useRouter()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()

    const handleCancel = () => {
      router.go(-1)
    }

    const onSubmit = handleSubmit(() => {
      let data = { ...form.value }
      data = { ...deleteEmptyValue(data) }
      changePassAccount(data)
    })

    const changePassAccount = async (data) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { changePassAccount } = useChangePasswordAccountService(data)
        await changePassAccount()
        await router.go(-1)
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
    }

    const checkErrorsApi = (err) => {
      for (let item in err.response.data.errors) {
        locale.value === 'en'
          ? (err.response.data.errors[item] = 'The content existed')
          : (err.response.data.errors[item] = '内容は存在しました。')
        setFieldError(item, err.response.data.errors[item])
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
