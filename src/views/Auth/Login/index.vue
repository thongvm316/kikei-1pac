<template>
  <div class="login">
    <div class="login__form-wrapper">
      <div class="login__form">
        <a-typography-title>{{ $t('login.title') }}</a-typography-title>

        <a-form ref="loginFormRef" :model="params" :rules="loginFormRules" layout="vertical" @submit="onSubmitLogin">
          <a-form-item name="username" :label="$t('login.username_label')">
            <a-input
              v-model:value="params.username"
              size="large"
              :placeholder="$t('login.username_placeholder')"
              autofocus
              @pressEnter="onSubmitLogin"
            />
          </a-form-item>

          <a-form-item name="password" :label="$t('login.password_label')">
            <a-input
              v-model:value="params.password"
              type="password"
              size="large"
              :placeholder="$t('login.password_placeholder')"
              @pressEnter="onSubmitLogin"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" size="large" :loading="loading" @click="onSubmitLogin">
              {{ $t('login.login_submit') }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <img class="login__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useLoginService from './composables/useLoginService'

export default defineComponent({
  name: 'LoginPage',

  setup() {
    const { t } = useI18n()

    const loginFormRef = ref()
    const params = reactive({
      username: '',
      password: ''
    })
    const loading = ref(false)

    // input validator rules
    const loginFormRules = {
      username: [{ required: true, message: t('login.username_require'), trigger: 'change' }],
      password: [{ required: true, message: t('login.password_require'), trigger: 'change' }]
    }

    const router = useRouter()
    const toDashboardScreen = () => {
      router.push({ name: 'dashboard' })
    }

    // handle validator when submit form
    const onSubmitLogin = async () => {
      try {
        const validateRes = await loginFormRef.value.validate()
        if (validateRes) {
          const { login } = useLoginService(validateRes, loading)
          // run login
          await login()
          // to dashboard screen
          toDashboardScreen()
        }
      } catch (e) {
        console.log(e)
        // throw e
      }
    }

    return {
      loginFormRef,
      params,
      loading,
      loginFormRules,
      onSubmitLogin
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/mixins';

$form-wrapper-size: 452px;
$form-size: 220px;

.login {
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
    width: $form-size;
    margin: 0 auto;
  }

  // modified
  .ant-typography {
    margin-bottom: 64px;
  }

  .ant-btn-primary {
    width: 100%;
  }
}
</style>
