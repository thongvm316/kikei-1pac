<template>
  <section class="activate-account-congratulations">
    <div class="activate-account-congratulations__box">
      <div class="activate-account-congratulations__wrapper">
        <a-typography-title>{{ $t('user.title_congratulations') }}</a-typography-title>
        <p class="activate-account-congratulations__desc">{{ $t('user.desc_congratulations') }}</p>

        <form @submit.prevent="onSubmit">
          <a-button key="submit" type="primary" html-type="submit">
            {{ $t('user.handle_dashboard') }}
          </a-button>
        </form>
      </div>

      <div class="activate-account-congratulations__language">
        <change-language />
      </div>
    </div>

    <img class="activate-account-congratulations__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </section>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ChangeLanguage from '@/components/ChangeLanguage'
import useGetTokenService from '@/views/Auth/Account/composables/useGetTokenService'

export default defineComponent({
  name: 'Index',

  components: { ChangeLanguage },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const params = ref({})

    onMounted(() => {
      params.value = route.params
    })

    const onSubmit = async () => {
      const { getToken } = useGetTokenService({ ...params.value })
      await getToken()
      await router.push({ name: 'dashboard' })
    }

    return {
      onSubmit
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/styles/shared/mixins';

$form-wrapper-size: 500px;

.activate-account-congratulations {
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
