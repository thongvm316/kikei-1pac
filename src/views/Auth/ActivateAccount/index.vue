<template>
  <section class="activate-account">
    <div class="activate-account__form-wrapper">
      <!-- Form -->
      <form class="activate-account__form" @submit.prevent="onSubmit">
        <a-typography-title>{{ $t('user.title') }}</a-typography-title>
        <p class="activate-account__desc">
          Hi <span class="activate-account__mail">abc@xyz.com</span>, your account has been successfully created. Please
          create a password to continue.
        </p>
        <!--New  Password -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label required">{{ $t('user.new_password') }}</label>

            <div>
              <a-input
                v-model:value="form.new_password"
                type="text"
                :placeholder="$t('common.please_enter')"
                :class="valid === false ? 'border-invalid' : ''"
                size="large"
                class="new_password"
                @change="onChangePassword"
              />
            </div>
          </div>
        </div>

        <!--Confirm  Password -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label required">{{ $t('user.confirm_password') }}</label>

            <div>
              <a-input
                v-model:value="form.confirm_password"
                :type="checked ? 'text' : 'password'"
                :class="message !== '' ? 'border-invalid' : ''"
                :placeholder="$t('common.please_enter')"
                size="large"
                class="confirm_password"
              />
              <!-- Error message -->
              <span v-if="message" class="errors">
                {{ $t(`set_password.${message}`) }}
              </span>
            </div>
          </div>
        </div>

        <a-checkbox v-model:checked="checked">Show password</a-checkbox>

        <div>Password must:</div>
        <ul class="activate-account__pass-must">
          <li
            v-for="item in VALIDATE"
            :key="item"
            :class="error && error[item] === true ? 'valid' : error && error[item] === false ? 'invalid' : ''"
          >
            <template v-if="item === 'special'">
              {{ $t(`set_password.${item}`) + '~`!@#$%^&*()-_+={}[]|\;:"<>,./?' }}
            </template>
            <template v-else>
              {{ $t(`set_password.${item}`) }}
            </template>
          </li>
        </ul>

        <!-- Action Section Submit & Cancel -->
        <div class="card-footer">
          <a-button key="submit" type="primary" html-type="submit" style="width: 105px">
            {{ $t('user.handle_ok') }}
          </a-button>
        </div>
      </form>
    </div>

    <img class="activate-account__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </section>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloneDeep, values, every } from 'lodash-es'

// eslint-disable-next-line no-unused-vars
const VALIDATE = ['min', 'lower', 'upper', 'number', 'special']

export default defineComponent({
  name: 'Index',

  setup() {
    const { t } = useI18n()
    let form = ref({ new_password: '', confirm_password: '' })
    const checked = ref(false)

    const message = ref('')

    const error = ref({
      min: null,
      lower: null,
      upper: null,
      number: null,
      special: null
    })

    const valid = ref(null)

    const onSubmit = () => {
      let data = { ...form.value }
      error.value = cloneDeep(checkError(data.new_password))

      valid.value = every(values(error.value), (item) => item)

      if (valid.value === false) return

      if (data.confirm_password !== data.new_password) {
        message.value = 'pw_not_match'
      } else {
        // call api in here
        message.value = ''
        console.log('submit')
      }
    }

    const onChangePassword = (evt) => {
      error.value = cloneDeep(checkError(evt.target.value))

      for (let i in error.value) {
        if (!error.value[i]) {
          delete error.value[i]
        }
      }
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
      return text.replace(field, t(`user.${field}`))
    }

    return {
      form,
      message,
      error,
      valid,
      checked,
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

$form-wrapper-size: 600px;
$form-size: 640px;

ul {
  .valid {
    color: #389e0d;
  }

  .invalid {
    color: #cf1322;
  }
}

.border-invalid {
  border-color: #cf1322;
}

.activate-account {
  @include flexbox();

  &__form-wrapper,
  &__img {
    height: 100vh;
  }

  &__form-wrapper {
    width: $form-wrapper-size;
    padding-top: 80px;
  }

  &__img {
    width: calc(100% - #{$form-wrapper-size});
  }

  &__form {
    width: 392px;
    margin: 0 auto;

    .form-group {
      .form-content {
        margin-bottom: 16px;

        .new_password {
          width: 320px;
        }

        .confirm_password {
          width: 320px;
        }
      }
    }
  }

  &__desc {
    margin-bottom: 48px;
  }

  &__mail {
    color: #1890ff;
  }

  &__pass-must {
    padding: 0 0 0 17px;
    width: 350px;
  }

  .ant-checkbox-wrapper {
    margin-bottom: 16px;
  }

  // modified
  .ant-typography {
    font-size: 38px;
    font-weight: 700;
  }

  .ant-btn-primary {
    width: 100%;
  }
}
</style>
