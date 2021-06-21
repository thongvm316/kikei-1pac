<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- Company name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.name" name="companyName" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company.companyName') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="companyName" class="errors">
                {{ replaceField(message, 'companyName') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Classification -->
      <div class="form-group">
        <div class="form-content">
          <label class="form-label">{{ $t('company.classification') }}</label>

          <div class="form-input">
            <a-radio-group v-model:value="form.division">
              <a-radio v-for="item in DIVISION" :key="item.id" :value="item.id">{{
                $t(`company.${item.value}`)
              }}</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>

      <!-- Company code -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.code" name="companyCode" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company.companyCode') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="companyCode" class="errors">
                {{ replaceField(message, 'companyCode') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Slack code -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.slack_code" name="companySlackCode" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company.companySlackCode') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="companySlackCode" class="errors">
                {{ replaceField(message, 'companySlackCode') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Country -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.country_id" name="country" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company.country') }}</label>
            <div class="form-input">
              <a-select
                v-model:value="field.value"
                :placeholder="$t('common.please_enter')"
                style="width: 200px"
                @change="handleChange"
              >
                <a-select-option v-for="country in COUNTRY" :key="country.id" :value="country.id">
                  {{ country.value }}
                </a-select-option>
              </a-select>
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="country" class="errors">
                {{ replaceField(message, 'country') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Currency -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.currency_id" name="trading_currency" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company.trading_currency') }}</label>
            <div class="form-input">
              <a-select
                v-model:value="field.value"
                :placeholder="$t('common.please_enter')"
                style="width: 200px"
                @change="handleChange"
              >
                <a-select-option v-for="currency in CURRENCY" :key="currency.id" :value="currency.id">
                  {{ currency.value }}
                </a-select-option>
              </a-select>
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="trading_currency" class="errors">
                {{ replaceField(message, 'trading_currency') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Payment Site -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.payment_term" name="payment_site" rules="required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company.payment_site') }}</label>
            <div class="form-input">
              <a-select
                v-model:value="field.value"
                :placeholder="$t('common.please_enter')"
                style="width: 200px"
                @change="handleChange"
              >
                <a-select-option v-for="payment in PAYMENT" :key="payment.id" :value="payment.id">
                  {{ $t(`company.${payment.value}`) }}
                </a-select-option>
              </a-select>
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="payment_site" class="errors">
                {{ replaceField(message, 'payment_site') }}
              </ErrorMessage>
            </div>
          </div>
        </Field>
      </div>

      <!-- Street Address -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.address" :name="$t('company.street_address')">
          <div class="form-content">
            <label class="form-label">{{ $t('company.street_address') }}</label>
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

      <!-- Contact Phone -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.contact_phone_number" :name="$t('company.contact_phone')">
          <div class="form-content">
            <label class="form-label">{{ $t('company.contact_phone') }}</label>
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

      <!-- description -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange }" v-model="form.description" :name="$t('company.description')">
          <div class="form-content">
            <label class="form-label">{{ $t('company.description') }}</label>
            <div class="form-input">
              <a-textarea
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300 textarea-120"
                @change="handleChange"
              />
            </div>
          </div>
        </Field>
      </div>

      <!-- Action Section Submit & Cancel -->
      <div class="card-footer">
        <a-button key="back" style="width: 105px; margin-right: 16px" @click="handleCancel"
          >{{ $t('common.cancel') }}
        </a-button>
        <a-button key="submit" type="primary" html-type="submit" style="width: 105px">
          {{ $route.name === 'company-edit' ? $t('common.edit') : $t('common.new') }}
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

import { DIVISION, COUNTRY, CURRENCY, PAYMENT } from '@/enums/company.enum'

import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import useUpdateCompanyService from '@/views/Company/composables/useUpdateCompanyService'
import useCreateCompanyService from '@/views/Company/composables/useCreateCompanyService'

export default defineComponent({
  name: 'CompanyForm',

  setup() {
    let form = ref({
      code: '',
      name: '',
      division: 0,
      slack_code: '',
      country_id: undefined,
      currency_id: undefined,
      payment_term: undefined,
      address: '',
      contact_phone_number: '',
      description: ''
    })
    const router = useRouter()
    const route = useRoute()
    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()

    onMounted(() => {
      if ('id' in route.params && route.name === 'company-edit') {
        form.value = { ...form.value, ...camelToSnakeCase(route.meta['detail']) }
      }
    })

    const handleCancel = () => {
      router.push({ name: 'company' })
    }

    const onSubmit = handleSubmit(() => {
      let data = { ...form.value }
      data = { ...deleteEmptyValue(data) }

      if (route.name === 'company-edit') {
        updateCompany(data)
      } else {
        createCompany(data)
      }
    })

    const updateCompany = async (data) => {
      const id = route.params.id
      // eslint-disable-next-line no-useless-catch
      try {
        const { updateCompany } = useUpdateCompanyService(id, data)
        await updateCompany()
        // await this.onSuccess(this.$t('message_success'), this.$t('update_message_successfully'))
        await router.push({ name: 'company' }).catch((err) => err)
      } catch (err) {
        throw err
      }
    }

    const createCompany = async (data) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { createCompany } = useCreateCompanyService(data)
        await createCompany()
        await router.push({ name: 'company' })
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
      return text.replace(field, t(`company.${field}`))
    }

    return {
      form,
      DIVISION,
      COUNTRY,
      CURRENCY,
      PAYMENT,
      handleCancel,
      onSubmit,
      updateCompany,
      createCompany,
      replaceField
    }
  }
})
</script>
