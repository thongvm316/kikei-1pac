<template>
  <div class="card-common">
    <!-- Form -->
    <form @submit="onSubmit">
      <!-- Company name -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange, errors }" v-model="form.name" name="company_name" rules="input_required">
          <div class="form-content">
            <label class="form-label required">{{ $t('company.company_name') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="company_name" class="errors">
                {{ replaceField(message, 'company_name') }}
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
        <Field v-slot="{ field, handleChange, errors }" v-model="form.code" name="company_code_project">
          <div class="form-content">
            <label class="form-label">{{ $t('company.company_code_project') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="company_code_project" class="errors">
                {{ replaceField(message, 'company_code_project') }}
              </ErrorMessage>

              <p class="form-caption">{{ $t('company.caption') }}</p>
            </div>
          </div>
        </Field>
      </div>

      <!-- Slack code -->
      <div class="form-group">
        <Field v-slot="{ field, handleChange, errors }" v-model="form.slack_code" name="company_slack_code">
          <div class="form-content">
            <label class="form-label">{{ $t('company.company_slack_code') }}</label>
            <div class="form-input">
              <a-input
                :value="field.value"
                :placeholder="$t('common.please_enter')"
                class="w-300"
                :class="errors.length ? 'input_border' : ''"
                @change="handleChange"
              />
              <!-- Error message -->
              <ErrorMessage v-slot="{ message }" as="span" name="company_slack_code" class="errors">
                {{ replaceField(message, 'company_slack_code') }}
              </ErrorMessage>

              <p class="form-caption">{{ $t('company.caption') }}</p>
            </div>
          </div>
        </Field>
      </div>

      <!-- Country -->
      <div class="form-group">
        <Field
          v-slot="{ field, handleChange, errors }"
          v-model="form.country_id"
          name="country"
          rules="select_required"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('company.country') }}</label>
            <div class="form-input">
              <a-select
                v-model:value="field.value"
                :placeholder="$t('common.select_option_empty')"
                style="width: 200px"
                :style="errors.length ? 'border: 1px solid #FF4D4F' : ''"
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
        <Field
          v-slot="{ field, handleChange, errors }"
          v-model="form.currency_id"
          name="trading_currency"
          rules="select_required"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('company.trading_currency') }}</label>
            <div class="form-input">
              <a-select
                v-model:value="field.value"
                :placeholder="$t('common.select_option_empty')"
                style="width: 200px"
                :style="errors.length ? 'border: 1px solid #FF4D4F' : ''"
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
        <Field
          v-slot="{ field, handleChange, errors }"
          v-model="form.payment_term"
          name="payment_site"
          rules="select_required"
        >
          <div class="form-content">
            <label class="form-label required">{{ $t('company.payment_site') }}</label>
            <div class="form-input">
              <a-select
                v-model:value="field.value"
                :placeholder="$t('common.select_option_empty')"
                style="width: 200px"
                :style="errors.length ? 'border: 1px solid #FF4D4F' : ''"
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
        <a-button key="back" class="btn-close" style="width: 105px; margin-right: 16px" @click="handleCancel"
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
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import { DIVISION, COUNTRY, CURRENCY, PAYMENT } from '@/enums/company.enum'

import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'
import useUpdateCompanyService from '@/views/Company/composables/useUpdateCompanyService'
import useCreateCompanyService from '@/views/Company/composables/useCreateCompanyService'
import { useStore } from 'vuex'

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
    const store = useStore()
    const route = useRoute()

    const { handleSubmit, setFieldError } = useForm()
    const { t, locale } = useI18n()

    const companyEnums = ref({
      company_code_project: t('company.error_company_code_project'),
      company_name: t('company.error_company_name'),
      company_slack_code: t('company.error_company_slack_code')
    })
    const tmpErrors = ref()

    onMounted(() => {
      if ('id' in route.params && route.name === 'company-edit') {
        form.value = { ...form.value, ...camelToSnakeCase(route.meta['detail']) }
      }
    })

    watch(
      () => locale.value,
      () => {
        verifyErrors(tmpErrors.value)
      }
    )

    const handleCancel = () => {
      router.push({ name: 'company', params: route.params, query: route.query })
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
        checkErrorsApi(err)
        throw err
      }

      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'successfully',
        duration: 5,
        message: locale.value === 'en' ? 'Update' + form.value.name : form.value.name + 'が更新されました'
      })
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
      tmpErrors.value = camelToSnakeCase(err.response.data.errors)

      verifyErrors(tmpErrors.value)
    }

    const verifyErrors = (errs) => {
      for (let item in errs) {
        if (item === 'company_code') item = 'company_code_project'

        locale.value === 'en'
          ? (errs[item] = `${companyEnums.value[item]} existed`)
          : (errs[item] = `${companyEnums.value[item]}は存在しました`)

        setFieldError(item, errs[item])
      }
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`company.error_${field}`))
    }

    return {
      form,
      onSubmit,
      handleCancel,
      updateCompany,
      createCompany,
      replaceField,
      DIVISION,
      COUNTRY,
      CURRENCY,
      PAYMENT
    }
  }
})
</script>
