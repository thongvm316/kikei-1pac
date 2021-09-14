<template>
  <section class="activate-edit-password">
    <div class="activate-edit-password__box">
      <div class="activate-edit-password__form-wrapper">
        <!-- Form -->
        <form class="activate-edit-password__form" @submit.prevent="onSubmit">
          <a-typography-title>{{ $t('activate_password.title') }}</a-typography-title>
          <p class="activate-edit-password__desc">
            {{ $t('activate_password.desc') }}
          </p>
          <!--New  Password -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label required">{{ $t('activate_password.new_password') }}</label>

              <div class="form-input">
                <a-input
                  v-model:value="form.new_password"
                  :type="checked ? 'text' : 'password'"
                  :placeholder="$t('activate_password.please_enter')"
                  :class="message !== '' || checkedEmptyP ? 'border-invalid' : ''"
                  size="large"
                  class="new_password"
                  @change="onChangePassword"
                />
                <!-- Empty message -->
                <span v-if="checkedEmptyP" class="errors">
                  {{ $t('set_password.empty_password') }}
                </span>
              </div>
            </div>
          </div>

          <!--Confirm  Password -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label required">{{ $t('activate_password.confirm_password') }}</label>

              <div class="form-input">
                <a-input
                  v-model:value="form.confirm_password"
                  :type="checked ? 'text' : 'password'"
                  :class="message !== '' || checkedEmptyCP ? 'border-invalid' : ''"
                  :placeholder="$t('activate_password.please_enter')"
                  size="large"
                  class="confirm_password"
                  @change="onChangeCP"
                />
                <!-- Error message -->
                <span v-if="message" class="errors">
                  {{ $t(`set_password.${message}`) }}
                </span>
                <!-- Empty message -->
                <span v-if="checkedEmptyCP" class="errors">
                  {{ $t('set_password.empty_confirm_password') }}
                </span>
                <!-- Error message -->
                <template v-if="checkedEmailInUse">
                  <ErrorMessage v-slot="{ message }" as="span" name="password" class="errors">
                    {{ replaceField(message, 'password') }}
                  </ErrorMessage>
                </template>
              </div>
            </div>
          </div>

          <a-checkbox v-model:checked="checked">{{ $t('activate_password.show_pass') }}</a-checkbox>

          <div class="activate-edit-password__must">{{ $t('activate_password.password_must') }}</div>
          <ul class="activate-edit-password__pass-must">
            <li
              v-for="item in VALIDATE"
              :key="item"
              :class="error && error[item] === true ? 'valid' : error && error[item] === false ? 'invalid' : ''"
            >
              <template v-if="item === 'special'">
                {{ $t(`set_password.${item}`) }}
                <p class="special-word">{{ '~`!@#$%^&*()-_+={}[]|\;:"<>,./?' }}</p>
              </template>
              <template v-else>
                {{ $t(`set_password.${item}`) }}
              </template>
            </li>
          </ul>

          <!-- Action Section Submit & Cancel -->
          <div class="card-footer">
            <a-button key="submit" type="primary" html-type="submit">
              {{ $t('activate_password.handle_ok') }}
            </a-button>
          </div>
        </form>
      </div>

      <div class="activate-edit-password__language">
        <change-language />
      </div>
    </div>

    <img class="activate-edit-password__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </section>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloneDeep, every, values } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import ChangeLanguage from '@/components/ChangeLanguage'
import useGetTokenService from '@/views/Auth/Activate-Deactivate/composables/useGetTokenService'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import { useForm } from 'vee-validate'

// eslint-disable-next-line no-unused-vars
const VALIDATE = ['min', 'lower', 'upper', 'number', 'special']

export default defineComponent({
  name: 'Index',

  components: { ChangeLanguage },

  setup() {
    const { t, locale } = useI18n()
    const { setFieldError } = useForm()

    const router = useRouter()
    const route = useRoute()

    const checked = ref(true)
    const checkedEmptyP = ref(false)
    const checkedEmptyCP = ref(false)
    const checkedEmailInUse = ref(false)
    const message = ref('')
    const tmpErrors = ref()

    let form = ref({ new_password: '', confirm_password: '' })

    const error = ref({
      min: null,
      lower: null,
      upper: null,
      number: null,
      special: null
    })

    const valid = ref(null)

    watch(
      () => locale.value,
      () => {
        verifyErrors(tmpErrors.value, t('activate_password.conflict_password'))
      }
    )

    const onSubmit = async () => {
      let data = { ...form.value }
      error.value = cloneDeep(checkError(data.new_password))

      valid.value = every(values(error.value), (item) => item)

      if (valid.value === false) {
        checkedEmptyP.value = true
        checkedEmptyCP.value = true
        return
      }

      if (data.confirm_password !== data.new_password) {
        message.value = 'pw_not_match'
        checkedEmailInUse.value = false
      } else {
        // call api in here
        message.value = ''
        const params = {
          token: route.query.token,
          password: data.confirm_password
        }
        try {
          const { getToken } = useGetTokenService({ ...params })
          const { result } = await getToken()
          await router.push({ name: 'success-edit-password', params: result.data })
        } catch (err) {
          checkErrorsApi(err)
        }
      }
    }

    const checkErrorsApi = (err) => {
      checkedEmailInUse.value = true
      tmpErrors.value = camelToSnakeCase(err.response.data.errors)

      verifyErrors(tmpErrors.value, t('activate_password.conflict_password'))
    }

    const verifyErrors = (errors, msg) => {
      for (let item in errors) {
        setFieldError(item, msg)
      }
    }

    const onChangePassword = (evt) => {
      error.value = cloneDeep(checkError(evt.target.value))

      error.value.lower ? (checkedEmptyP.value = false) : (checkedEmptyP.value = true)

      for (let i in error.value) {
        if (!error.value[i]) {
          delete error.value[i]
        }
      }
    }

    const onChangeCP = (evt) => {
      error.value = cloneDeep(checkError(evt.target.value))

      error.value.lower ? (checkedEmptyCP.value = false) : (checkedEmptyCP.value = true)
    }

    const minChar = (value, length) => {
      return String(value).length >= Number(length)
    }

    const minLowerCase = (value) => {
      return /^(?=.*?[a-z]).+$/.test(value)
    }

    const minUpperCase = (value) => {
      return /^(?=.*?[A-Z]).+$/.test(value)
    }

    const minNumber = (value) => {
      return /^(?=.*?[0-9]).+$/.test(value)
    }

    const minSpecial = (value) => {
      return /^(?=.*?[~`!@#$%^&*()\-_+={}[]|;:"<>,.\/\?]).+$/.test(value)
    }

    const checkError = (value) => {
      return {
        min: minChar(value, 8),
        lower: minLowerCase(value),
        upper: minUpperCase(value),
        number: minNumber(value),
        special: minSpecial(value)
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`activate_password.${field}`))
    }

    return {
      form,
      message,
      error,
      valid,
      checked,
      checkedEmptyP,
      checkedEmptyCP,
      checkedEmailInUse,
      onChangeCP,
      onSubmit,
      onChangePassword,
      replaceField,
      VALIDATE
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/mixins';

$form-wrapper-size: 450px;
$form-size: 640px;

ul {
  position: relative;

  .valid {
    color: #389e0d;

    &:before {
      content: '✓';
      border-radius: 50%;
      background-color: #389e0d;
      font-size: 15px;
      font-weight: bold;
      line-height: 19px;
      width: 21px;
      height: 21px;
      text-align: center;
      color: #ffffff;
      position: absolute;
      left: 0;
    }

    &::marker {
      content: '';
      position: absolute;
    }
  }

  .invalid {
    color: #cf1322;

    &:before {
      content: '✕';
      border-radius: 50%;
      background-color: #cf1322;
      font-size: 12px;
      font-weight: bold;
      line-height: 19px;
      width: 21px;
      height: 21px;
      text-align: center;
      color: #ffffff;
      position: absolute;
      left: 0;
    }

    &::marker {
      content: '';
      position: absolute;
    }
  }
}

.border-invalid {
  border-color: #cf1322;
}

.activate-edit-password {
  @include flexbox();

  &__img {
    height: 100vh;
  }

  &__img {
    width: calc(100% - #{$form-wrapper-size});
  }

  &__box {
    padding: 80px 33px 0 80px;
    display: flex;
  }

  &__form-wrapper {
    width: $form-wrapper-size;
  }

  &__form {
    width: 425px;
    margin-right: 37px;

    .form-group {
      .form-content {
        margin-bottom: 16px;

        .ant-input {
          margin-top: 5px;
        }

        .new_password {
          width: 320px;
        }

        .confirm_password {
          width: 320px;
        }
      }
    }

    .card-footer {
      .ant-btn {
        width: 320px;
        height: 40px;
      }
    }
  }

  &__desc {
    margin-bottom: 48px;
  }

  &__mail {
    color: #1890ff;
  }

  &__must {
    margin-bottom: 10px;
  }

  &__pass-must {
    padding: 0 0 0 17px;
    width: 350px;

    li {
      margin-bottom: 10px;
      margin-left: 10px;
    }

    .special-word {
      margin-bottom: 24px;
    }
  }

  .ant-checkbox-wrapper {
    margin-bottom: 16px;
  }

  // modified
  .ant-typography {
    font-size: 38px;
    font-weight: 700;
    margin-bottom: 24px;
  }

  .ant-btn-primary {
    width: 100%;
  }
}
</style>
