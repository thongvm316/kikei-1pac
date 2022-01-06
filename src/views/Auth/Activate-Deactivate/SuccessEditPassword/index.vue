<template>
  <section class="activated-edit-password">
    <div class="activated-edit-password__box">
      <div class="activated-edit-password__wrapper">
        <a-typography-title>{{ $t('activate_password.title_edit_password') }}</a-typography-title>
        <p class="activated-edit-password__desc">
          {{ $t('activate_password.desc_edit_password') }}
        </p>

        <form @submit.prevent="onSubmit">
          <a-button key="submit" type="primary" html-type="submit">
            {{ $t('activate_password.handle_dashboard') }}
          </a-button>
        </form>
      </div>

      <div class="activated-edit-password__language">
        <change-language />
      </div>
    </div>

    <img class="activated-edit-password__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </section>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import ChangeLanguage from '@/components/ChangeLanguage'
import { useRoute, useRouter } from 'vue-router'
import storageKeys from '@/enums/storage-keys'
import services from '@/services'
const StorageService = services.get('StorageService')

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
      StorageService.set(storageKeys.authProfile, params.value)
      await router.push({ name: 'dashboard' })
    }

    return {
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/mixins';

$form-wrapper-size: 500px;

.activated-edit-password {
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
