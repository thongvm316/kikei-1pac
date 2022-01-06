<template>
  <div class="login">
    <div class="login__form-wrapper">
      <div class="login__form">
        <a-typography-title>{{ $t('login.title') }}</a-typography-title>

        <a-form ref="loginFormRef" :model="params" :rules="loginFormRules" layout="vertical" @submit="onSubmitLogin">
          <a-form-item name="username" :label="$t('login.email_label')">
            <a-input
              v-model:value="params.username"
              size="large"
              type="email"
              :placeholder="$t('login.email_placeholder')"
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
      username: [{ type: 'email', required: true, message: t('login.email_require'), trigger: 'change' }],
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
      } catch (_) {}
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

$form-wrapper-size: 500px;
$form-size: 280px;

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

  .ant-form-vertical {
    .ant-form-item {
      margin-top: 24px;
    }
  }

  .ant-btn-primary {
    width: 100%;
  }
}
</style>
