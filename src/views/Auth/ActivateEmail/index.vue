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
            <Field
              v-slot="{ field, handleChange }"
              v-model="form.new_password"
              name="new_password"
              rules="input_required"
            >
              <div class="form-content">
                <label class="form-label required">{{ $t('change_password.new_password') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    type="password"
                    :placeholder="$t('change_password.please_enter')"
                    size="large"
                    class="new_password"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="new_password" class="errors">
                    {{ replaceField(message, 'new_password') }}
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
import { defineComponent, ref, onMounted } from 'vue'
import ChangeLanguage from '@/components/ChangeLanguage'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import jwt_decode from 'jwt-decode'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Index',

  components: { ChangeLanguage },

  setup() {
    const { t } = useI18n()
    const route = useRoute()

    const { handleSubmit } = useForm()

    const decoded = ref({})

    let form = ref({ new_password: '' })

    onMounted(() => {
      let dataToken = jwt_decode(route.query.token)
      decoded.value = dataToken
      console.log(decoded.value)
    })

    const onSubmit = handleSubmit(async () => {
      let data = { ...form.value }
      console.log(data)
    })

    const replaceField = (text, field) => {
      return text.replace(field, t(`change_password.${field}`))
    }

    return {
      form,
      onSubmit,
      decoded,
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

        .new_password {
          width: 320px;
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
