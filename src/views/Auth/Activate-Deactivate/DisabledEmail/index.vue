<template>
  <section class="disabled-email">
    <div class="disabled-email__box">
      <div class="disabled-email__form-wrapper">
        <!-- Form -->
        <div class="disabled-email__form">
          <a-typography-title>{{ $t('change_password.disabled_title') }}</a-typography-title>
          <p class="disabled-email__desc">
            {{ $t('change_password.disabled_desc') }}
          </p>
        </div>
      </div>

      <div class="disabled-email__language">
        <change-language />
      </div>
    </div>

    <img class="disabled-email__img" src="@/assets/images/img-bg-login.png" alt="login image" />
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

<style lang="scss" scoped>
@import '@/styles/shared/mixins';

$form-wrapper-size: 500px;
$form-size: 640px;

.disabled-email {
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
    width: 454px;
    margin-right: 37px;

    .form-group {
      .form-content {
        margin-bottom: 24px;

        .new_password {
          width: 320px;
        }
      }
    }

    .card-footer {
      .ant-btn {
        width: 400px;
        height: 40px;
      }
    }
  }

  &__desc {
    margin-bottom: 48px;
    width: 400px;
    text-align: justify;
    line-height: 22px;
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
