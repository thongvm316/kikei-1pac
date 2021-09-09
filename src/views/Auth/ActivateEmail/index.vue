<template>
  <section class="change-password">
    <div class="change-password__box">
      <div class="change-password__form-wrapper">
        <a-typography-title>{{ $t('change_password.title') }}</a-typography-title>
        <p class="change-password__desc">
          {{ $t('change_password.changed_login') }} <span class="change-password__mail">{{ decoded.new_email }}</span
          >{{ $t('change_password.desc') }}
        </p>
        <!-- Form -->
        <form class="change-password__form" @submit.prevent="onSubmit">
          <!--New  Password -->
          <div class="form-group">
            <Field v-slot="{ field, handleChange }" v-model="form.new_password" name="password" rules="input_required">
              <div class="form-content">
                <label class="form-label required">{{ $t('change_password.password') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    type="password"
                    :placeholder="$t('change_password.please_enter')"
                    size="large"
                    class="password"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="password" class="errors">
                    {{ replaceField(message, 'password') }}
                  </ErrorMessage>
                </div>
              </div>
            </Field>
          </div>

          <!-- Action Section Submit & Cancel -->
          <div class="card-footer">
            <a-button key="submit" type="primary" html-type="submit">
              {{ $t('change_password.handle_ok') }}
            </a-button>
          </div>
        </form>
      </div>

      <div class="change-password__language">
        <change-language />
      </div>
    </div>

    <img class="change-password__img" src="@/assets/images/img-bg-login.png" alt="login image" />
  </section>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import ChangeLanguage from '@/components/ChangeLanguage'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import jwt_decode from 'jwt-decode'
import { useRoute, useRouter } from 'vue-router'
import useUpdateNewEmailService from '@/views/Auth/ActivateEmail/composables/useUpdateNewEmailService'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import storageKeys from '@/enums/storage-keys'
import services from '@/services'

const StorageService = services.get('StorageService')

export default defineComponent({
  name: 'Index',

  components: { ChangeLanguage },

  setup() {
    const { t, locale } = useI18n()
    const { setFieldError } = useForm()

    const route = useRoute()
    const router = useRouter()
    const decoded = ref({})
    const tmpErrors = ref()

    let form = ref({ new_password: '' })

    onMounted(() => {
      decoded.value = jwt_decode(route.query.token)
    })

    watch(
      () => locale.value,
      () => {
        verifyErrors(tmpErrors.value, t('change_password.password_wrong'))
      }
    )

    const onSubmit = async () => {
      const params = {
        token: route.query.token,
        password: form.value.new_password
      }
      try {
        const { updateNewEmail } = useUpdateNewEmailService({ ...params })
        const { result } = await updateNewEmail()
        StorageService.set(storageKeys.authProfile, result.data)
        await router.push({ name: 'dashboard' })
      } catch (err) {
        checkErrorsApi(err)
      }
    }

    const checkErrorsApi = (err) => {
      tmpErrors.value = camelToSnakeCase(err.response.data.errors)

      verifyErrors(tmpErrors.value, t('change_password.password_wrong'))
    }

    const verifyErrors = (errors, msg) => {
      for (let item in errors) {
        setFieldError(item, msg)
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`change_password.${field}`))
    }

    return {
      form,
      decoded,
      onSubmit,
      replaceField
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/mixins';

$form-wrapper-size: 500px;
$form-size: 640px;

.change-password {
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

        .password {
          width: 320px;
        }

        .form-input {
          margin-top: 4px;
        }
      }
    }

    .card-footer {
      .ant-btn {
        width: 320px;
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

  &__mail {
    color: #1890ff;
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
