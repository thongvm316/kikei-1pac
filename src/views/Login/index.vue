<template>
  <div class="login">
    <div class="login__form">
      <h1 class="login__headine">Login Page</h1>

      <form class="w-220" @submit.prevent>
        <k-input
          class="u-mb-16"
          style="margin-top: 24px"
          v-model:value="v$.email.$model"
          size="lg"
          native-type="text"
          :error="emailInputErrorText"
          :variant="emailInputVariant"
          label="Login ID">
        </k-input>

        <k-input
          class="u-mb-24"
          style="margin-top: 24px"
          v-model:value="v$.password.$model"
          size="lg"
          native-type="password"
          :error="passwordInputErrorText"
          :variant="passwordInputVariant"
          label="Password">
        </k-input>

        <k-button
          @click="onClickLogin"
          variant="primary"
          size="md"
          native-type="submit">
          Login
        </k-button>
      </form>
    </div>
    <img class="login__img" src="@/assets/images/img-bg-login.png" alt="">
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import validationRules from './composables/validation'

const KInput = defineAsyncComponent(() => import('@/components/KInput'))
const KButton = defineAsyncComponent(() => import('@/components/KButton'))

export default defineComponent ({
  name: 'LoginPage',

  setup () {
    const params = {
      email: '',
      password: ''
    }
    const state = reactive(params)
    const rules = validationRules()

    return {
      params,
      v$: useVuelidate(rules, state)
    }
  },

  computed: {
    emailInputErrorText() {
      return this.v$.email.$errors[0]?.$message || ''
    },

    emailInputVariant() {
      return this.v$.email.$errors[0]?.$message ? 'error' : 'default'
    },

    passwordInputErrorText() {
      return this.v$.password.$errors[0]?.$message || ''
    },

    passwordInputVariant() {
      return this.v$.password.$errors[0]?.$message ? 'error' : 'default'
    }
  },

  components: {
    KInput,
    KButton
  },

  methods: {
    onClickLogin(e) {
      console.log(this.params)
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;

  &__headine {
    font-size: 38px;
    font-weight: 800;
    line-height: 46px;
    margin-bottom: 66px;
  }

  &__form {
    width: 452px;
    margin-top: 80px;
    padding-left: 80px;
  }

  &__img {
    width: calc(100% - 452px);
    height: 100vh;
  }

  ::v-deep .k-button {
    width: 100%;
  }
}

.w-220 {
  width: 220px;
}
</style>
