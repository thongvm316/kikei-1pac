<template>
  <section class="activated-edit-password">
    <div class="activated-edit-password__box">
      <div class="activated-edit-password__form-wrapper">
        <!-- Form -->
        <div class="activated-edit-password__form">
          <a-typography-title>{{ $t('activate_password.title_edit_password') }}</a-typography-title>
          <p class="activated-edit-password__desc">
            {{ $t('activate_password.desc_edit_password') }}
          </p>

          <!-- Action Section Submit & Cancel -->
          <div class="card-footer">
            <a-button key="submit" type="primary" html-type="submit" @click="$router.push({ name: 'login' })">
              {{ $t('activate_password.handle_dashboard') }}
            </a-button>
          </div>
        </div>
      </div>

      <div class="activated-edit-password__language">
        <change-language />
      </div>
    </div>

    <img class="activated-edit-password__img" src="@/assets/images/img-bg-login.png" alt="login image" />
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

.activated-edit-password {
  @include flexbox();

  &__img {
    height: 100vh;
  }

  &__img {
    width: calc(100% - 500px);
  }

  &__box {
    padding: 80px 33px 0 80px;
    display: flex;
  }

  &__form-wrapper {
    width: 500px;
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
