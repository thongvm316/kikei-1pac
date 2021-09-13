<template>
  <section class="email-sent">
    <div class="email-sent__box">
      <div class="email-sent__form-wrapper">
        <!-- Form -->
        <div class="email-sent__form">
          <a-typography-title>{{ $t('change_password.sent_title') }}</a-typography-title>
          <p class="email-sent__desc">
            {{ $t('change_password.sent_desc_email') }}
          </p>

          <!-- Action Section Submit & Cancel -->
          <div class="card-footer">
            <a-button key="submit" type="primary" html-type="submit" @click="handleGoLogin">
              {{ $t('change_password.sent_ok') }}
            </a-button>
          </div>
        </div>
      </div>

      <div class="email-sent__language">
        <change-language />
      </div>
    </div>

    <img class="email-sent__img" src="@/assets/images/img-bg-login.png" alt="login image" />
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

    const handleGoLogin = async () => {
      await router.push({ name: 'login' })
    }
    return {
      handleGoLogin
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/mixins';

$form-wrapper-size: 500px;
$form-size: 640px;

.email-sent {
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
