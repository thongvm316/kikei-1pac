<template>
  <user-form />
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import { TYPE, ACTIVE, AUTHORITY } from '@/enums/account.enum'
import UserForm from '@/views/User/-components/UserForm'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import useUpdateAccountService from '@/views/SettingAccount/composables/useUpdateAccountService'
import useCreateAccountService from '@/views/SettingAccount/composables/useCreateAccountService'

export default defineComponent({
  name: 'Index',
  components: {
    UserForm
  },
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
