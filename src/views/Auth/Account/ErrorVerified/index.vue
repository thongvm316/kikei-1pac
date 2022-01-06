<template>
  <section class="activate-account-verified">
    <div class="activate-account-verified__box">
      <div class="activate-account-verified__wrapper">
        <a-typography-title>{{ $t('user.title_verified') }}</a-typography-title>
        <p class="activate-account-verified__desc">{{ $t('user.desc_verified') }}</p>

        <form @submit.prevent="onSubmit">
          <a-button key="submit" type="primary" html-type="submit">
            {{ $t('user.handle_login') }}
          </a-button>
        </form>
      </div>

      <div class="activate-account-verified__language">
        <change-language />
      </div>
    </div>

    <img class="activate-account-verified__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import ChangeLanguage from '@/components/ChangeLanguage'

export default defineComponent({
  name: 'Index',

  components: { ChangeLanguage },

  setup() {
    const router = useRouter()
    // const route = useRoute()

    const onSubmit = () => {
      router.push({ name: 'login' })
    }

    return {
      onSubmit
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/styles/shared/mixins';

$form-wrapper-size: 450px;

.activate-account-verified {
  @include flexbox();

  &__box {
    padding: 150px 33px 0 80px;
    display: flex;
  }

  &__img {
    height: 100vh;
  }

  &__wrapper {
    width: $form-wrapper-size;
    margin-right: 37px;

    form {
      .ant-btn {
        width: 80%;
        height: 40px;
      }
    }
  }

  &__img {
    width: calc(100% - #{$form-wrapper-size});
  }

  &__desc {
    margin-bottom: 48px;
  }

  .ant-typography {
    font-size: 38px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .ant-btn-primary {
    width: 100%;
  }
}
</style>
