<template>
  <section class="activate-account">
    <div class="activate-account__box">
      <div class="activate-account__form-wrapper">
        <!-- Form -->
        <form class="activate-account__form" @submit.prevent="onSubmit">
          <a-typography-title>{{ $t('user.title') }}</a-typography-title>
          <p class="activate-account__desc">
            {{ $t('user.hello') }} <span class="activate-account__mail">{{ jwtToken.full_name }}</span
            >{{ $t('user.desc') }}
          </p>
          <!--New  Password -->
          <div class="form-group">
            <div class="form-content">
              <label class="form-label required">{{ $t('user.new_password') }}</label>

              <div>
                <a-input
                  v-model:value="form.new_password"
                  :type="checked ? 'text' : 'password'"
                  :placeholder="$t('user.please_enter')"
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
                  :placeholder="$t('user.please_enter')"
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

          <a-checkbox v-model:checked="checked">{{ $t('user.show_pass') }}</a-checkbox>

          <div class="activate-account__must">{{ $t('user.password_must') }}</div>
          <ul class="activate-account__pass-must">
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
              {{ $t('user.handle_ok') }}
            </a-button>
          </div>
        </form>
      </div>

      <div class="activate-account__language">
        <change-language />
      </div>
    </div>

    <img class="activate-account__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </section>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloneDeep, values, every } from 'lodash-es'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import ChangeLanguage from '@/components/ChangeLanguage'

// eslint-disable-next-line no-unused-vars
const VALIDATE = ['min', 'lower', 'upper', 'number', 'special']

export default defineComponent({
  name: 'Index',

  components: { ChangeLanguage },

  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    let form = ref({ new_password: '', confirm_password: '' })
    const checked = ref(true)
    const decoded = ref({})

    const message = ref('')

    const error = ref({
      min: null,
      lower: null,
      upper: null,
      number: null,
      special: null
    })

    const valid = ref(null)

    const jwtToken = computed(() => store.state.token.jwtToken)

    const onSubmit = async () => {
      let data = { ...form.value }
      error.value = cloneDeep(checkError(data.new_password))

      valid.value = every(values(error.value), (item) => item)

      if (valid.value === false) return

      if (data.confirm_password !== data.new_password) {
        message.value = 'pw_not_match'
      } else {
        // call api in here
        message.value = ''
        const params = {
          token: route.query.token,
          password: data.confirm_password
        }
        await router.push({ name: 'congratulations', params: { ...params } })
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
      decoded,
      jwtToken,
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

.activate-account {
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
    width: 392px;
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
        width: 80%;
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
