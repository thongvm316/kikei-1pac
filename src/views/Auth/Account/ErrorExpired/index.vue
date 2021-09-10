<template>
  <section class="activate-account-error">
    <div class="activate-account-error__box">
      <div class="activate-account-error__wrapper">
        <a-typography-title>{{ $t('user.title_error') }}</a-typography-title>
        <p class="activate-account-error__desc">{{ $t('user.desc_error') }}</p>
      </div>

      <div class="activate-account-error__language">
        <change-language />
      </div>
    </div>

    <img class="activate-account-error__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import ChangeLanguage from '@/components/ChangeLanguage'

export default defineComponent({
  name: 'Index',

  components: { ChangeLanguage }
})
</script>

<style scoped lang="scss">
@import '@/styles/shared/mixins';

$form-wrapper-size: 500px;

.activate-account-error {
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
  }

  &__img {
    width: calc(100% - #{$form-wrapper-size});
  }

  .ant-typography {
    font-size: 38px;
    font-weight: 700;
    margin-bottom: 32px;
  }

  .ant-btn-primary {
    width: 100%;
  }
}
</style>
