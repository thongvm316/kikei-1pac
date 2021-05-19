<template>
  <div class="login">
    <div class="login__form">
      <h1 class="login__headine">Login Page</h1>
      <form class="w-220" @submit.prevent>
        <div class="u-mb-16">
          <label class="u-mb-4">Login ID</label>
          <k-input size="lg" placeholder="Enter Id" />
        </div>

        <div class="u-mb-24">
          <label class="u-mb-4">Password</label>
          <k-input size="lg" placeholder="Enter password" />
        </div>

        <k-button
          @click="onClickLogin"
          variant="primary" size="md"
          nativeType="submit"
          class="w-220">
          Login
        </k-button>
      </form>
    </div>
    <img class="login__img" src="@/assets/images/img-bg-login.png" alt="">
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
const KInput = defineAsyncComponent(() => import('@/components/KInput'))
const KButton = defineAsyncComponent(() => import('@/components/KButton'))

export default defineComponent ({
  name: 'LoginPage',

  components: {
    KInput,
    KButton
  },

  methods: {
    onClickLogin(e) {
      console.log(e)
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
}

.w-220 {
  width: 220px;
}
</style>
