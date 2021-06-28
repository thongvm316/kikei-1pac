<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- ID username-->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.username" name="login_id" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.login_id') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                :maxlength="20"
                class="w-300"
                :disabled="isDisableEditField"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="login_id" class="errors">
                {{ replaceField(message, 'login_id') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>
      <!-- Password -->
      <div v-if="isHiddenField" class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.password" name="password" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.password') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                :disabled="isDisableEditField"
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

      <!-- Full name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.fullname" name="full_name" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.full_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="full_name" class="errors">
                {{ replaceField(message, 'full_name') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Email -->
      <!--<div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.email" name="email" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('account.email') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <ErrorMessage v-slot="{ message }" as="span" name="email" class="errors">
                {{ replaceField(message, 'email') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>-->
      <!-- Sales -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('account.sales') }}</label>

          <div class="form-input">
            <a-checkbox-group v-model:value="form.types">
              <a-checkbox v-for="item in TYPE" :key="item.id" :value="item.id">
                {{ $t(`account.${item.value}`) }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </div>
      <!-- Memo -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.memo" :name="$t('account.memo')">
          <div class="form-content">
            <label class="form-label">{{ $t('account.memo') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
            </div>
          </div>
        </Field>
      </div>
      <!-- Status -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('account.status') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.active">
              <a-radio v-for="item in ACTIVE" :key="item.id" :value="item.id">{{
                $t(`account.${item.value}`)
              }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
      <!-- Authority-->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('account.authority') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.is_admin">
              <a-radio v-for="item in AUTHORITY" :key="item.id" :value="item.id"
                >{{ $t(`account.${item.value}`) }}
              </a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer">
        <a-button key="back" style="width: 105px; margin-right: 16px" @click="handleCancel"
          >{{ $t('common.cancel') }}
        </a-button>
        <a-button key="submit" type="primary" html-type="submit" style="width: 105px">
          {{ $route.name === 'account-edit' ? $t('common.edit') : $t('common.new') }}
        </a-button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import { TYPE, ACTIVE, AUTHORITY } from '@/enums/account.enum'

import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import useUpdateAccountService from '@/views/SettingAccount/composables/useUpdateAccountService'
import useCreateAccountService from '@/views/SettingAccount/composables/useCreateAccountService'

export default defineComponent({
  name: 'AccountForm',

  setup() {
    let form = ref({
      account_group_id: 1,
      username: '',
      password: '',
      email: '',
      fullname: '',
      types: [],
      memo: '',
      active: true,
      is_admin: false
    })
    const router = useRouter()
    const route = useRoute()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()

    const isHiddenField = ref(false)
    const isDisableEditField = ref(false)

    onMounted(() => {
      if ('id' in route.params && route.name === 'account-edit') {
        isDisableEditField.value = true
        form.value = { ...form.value, ...camelToSnakeCase(route.meta['detail']) }
      } else {
        isHiddenField.value = true
      }
    })

    const handleCancel = () => {
      router.push({ name: 'account' })
    }

    const onSubmit = handleSubmit(() => {
      let data = { ...form.value }
      data = { ...deleteEmptyValue(data) }

      if (route.name === 'account-edit') {
        updateAccount(data)
      } else {
        createAccount(data)
      }
    })

    const updateAccount = async (data) => {
      const id = route.params.id
      // eslint-disable-next-line no-useless-catch
      try {
        const { updateAccount } = useUpdateAccountService(id, data)
        await updateAccount()
        // await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))
        await router.push({ name: 'account' }).catch((err) => err)
      } catch (err) {
        throw err
      }
    }

    const createAccount = async (data) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { createAccount } = useCreateAccountService(data)
        await createAccount()
        await router.push({ name: 'account' })
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
    }

    const checkErrorsApi = (err) => {
      for (let item in err.response.data.errors) {
        locale.value === 'en'
          ? (err.response.data.errors[item] = 'The content existed')
          : (err.response.data.errors[item] = '内容は存在しました。')
        setFieldError(item, err.response.data.errors[item])
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`account.${field}`))
    }

    return {
      form,
      TYPE,
      ACTIVE,
      AUTHORITY,
      isHiddenField,
      isDisableEditField,
      onSubmit,
      handleCancel,
      updateAccount,
      createAccount,
      replaceField
    }
  }
})
</script>
