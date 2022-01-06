<template>
  <a-modal v-model:visible="open" :title="$t('modal.title_edit_bank')" class="modal-add-bank" @cancel="handleCancel">
    <template #footer>
      <a-modal v-model:visible="btnDelete" :title="$t('modal.title')" class="modal-delete">
        <template #footer>
          <template v-if="locale === 'en'">
            <p>{{ $t('modal.message_en_delete_bank') }}</p>
          </template>
          <template v-if="locale === 'ja'">
            <p>{{ $t('modal.message_ja_delete_bank') }}</p>
          </template>
          <a-button key="back" class="btn-close" @click="handleCancelDelete">{{ $t('modal.cancel') }}</a-button>
          <a-button type="danger" class="btn-delete" @click="handleDelete">
            {{ $t('modal.delete') }}
          </a-button>
        </template>
      </a-modal>

      <modal-check-bank-in-use v-model:visible="checkDelete" />

      <form @submit.prevent="onSubmit">
        <div class="form-box">
          <!-- Registered name -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange, errors }"
              v-model="form.abbreviation"
              name="registered_name_bank"
              rules="input_required"
            >
              <div class="form-content">
                <label class="form-label required">{{ $t('company_infomation.registered_name_bank') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('company_infomation.please_enter')"
                    class="w-300"
                    :class="errors.length ? 'input_border' : ''"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="registered_name_bank" class="errors">
                    {{ replaceField(message, 'registered_name_bank') }}
                  </ErrorMessage>
                </div>
              </div>
            </Field>
          </div>

          <!-- Display name -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange, errors }"
              v-model="form.name"
              name="display_name_bank"
              rules="input_required"
            >
              <div class="form-content">
                <label class="form-label required">{{ $t('company_infomation.display_name_bank') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('company_infomation.please_enter')"
                    class="w-300"
                    :class="errors.length ? 'input_border' : ''"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="display_name_bank" class="errors">
                    {{ replaceField(message, 'display_name_bank') }}
                  </ErrorMessage>
                </div>
              </div>
            </Field>
          </div>

          <!-- Bank branch -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange, errors }"
              v-model="form.bank_branch"
              name="bank_branch"
              rules="input_required"
            >
              <div class="form-content">
                <label class="form-label required">{{ $t('company_infomation.bank_branch') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('company_infomation.please_enter')"
                    class="w-300"
                    :class="errors.length ? 'input_border' : ''"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="bank_branch" class="errors">
                    {{ replaceField(message, 'bank_branch') }}
                  </ErrorMessage>
                </div>
              </div>
            </Field>
          </div>

          <!--  Account holder -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange, errors }"
              v-model="form.account_holder"
              name="account_holder"
              rules="input_required"
            >
              <div class="form-content">
                <label class="form-label required">{{ $t('company_infomation.account_holder') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('company_infomation.please_enter')"
                    class="w-300"
                    :class="errors.length ? 'input_border' : ''"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="account_holder" class="errors">
                    {{ replaceField(message, 'account_holder') }}
                  </ErrorMessage>
                </div>
              </div>
            </Field>
          </div>

          <!-- Account number -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange, errors }"
              v-model="form.number"
              name="account_number"
              rules="input_required|numeric"
            >
              <div class="form-content">
                <label class="form-label required">{{ $t('company_infomation.account_number') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('company_infomation.please_enter')"
                    class="w-300"
                    :class="errors.length || validateColorBankNumber ? 'input_border' : ''"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="account_number" class="errors">
                    <template v-if="message === 'account_numberは数字のみ使用できます'">
                      {{ $t('company_infomation.error_account_number') }}
                    </template>
                    <template v-else>
                      {{ replaceField(message, 'account_number') }}
                    </template>
                  </ErrorMessage>
                  <template v-if="validateColorBankNumber">
                    <div class="error_bank_account">
                      {{ $t('company_infomation.error_bank_account_number') }}
                    </div>
                  </template>
                </div>
              </div>
            </Field>
          </div>

          <!-- Currency -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange }"
              v-model="form.currency_id"
              name="currency_bank"
              rules="select_required"
            >
              <div class="form-content">
                <label class="form-label">{{ $t('company_infomation.currency_bank') }}</label>
                <div class="form-input">
                  <a-select v-model:value="field.value" style="width: 85px" @change="handleChange">
                    <a-select-option v-for="currency in currencyID" :key="currency.id" :value="currency.id">
                      {{ $t(`company_infomation.${currency.code}`) }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </Field>
          </div>
        </div>

        <a-button class="btn-delete-bank" @click="btnDelete = true">
          {{ $t('modal.delete') }}
        </a-button>
        <a-button key="back" class="btn-close" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
        <a-button key="submit" html-type="submit" type="primary">
          {{ $t('modal.btn_submit_bank') }}
        </a-button>
      </form>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useStore } from 'vuex'

import useCheckBankInUseService from '@/views/CompanyInformation/compasables/useCheckBankInUseService'

import ModalCheckBankInUse from '@/components/ModalCheckBankInUse'
import { find, forEach, includes } from 'lodash-es'
import useCheckBankUsedService from '@/views/CompanyInformation/compasables/useCheckBankUsedSetvice'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'

export default defineComponent({
  name: 'ModalEditBankAccount',
  components: { ModalCheckBankInUse },
  props: {
    currencyList: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      required: true
    },
    propsDataSource: {
      type: Array,
      required: true
    },
    propsDataEdit: {
      type: Object,
      required: true
    }
  },

  emits: ['update:visible', 'cancelFormBank', 'formEditBank', 'deleteBank'],

  setup(props, context) {
    const { t, locale } = useI18n()
    const store = useStore()
    const { handleSubmit, resetForm } = useForm()

    const btnDelete = ref(false)
    const checkDelete = ref(false)
    const validateColorBankNumber = ref(false)

    const currencyID = ref([])
    const listBank = ref([])
    const allListBank = ref([])

    const itemEdit = ref({})

    const { currencyList } = toRefs(props)
    const { dataSource } = toRefs(props)
    const { propsDataEdit } = toRefs(props)
    const { propsDataSource } = toRefs(props)

    let form = ref({
      abbreviation: '',
      name: '',
      bank_branch: '',
      account_holder: '',
      number: '',
      currency_id: 1
    })

    watch(dataSource, (value) => {
      listBank.value = value
    })

    watch(propsDataSource, (value) => {
      allListBank.value = value
    })

    watch(propsDataEdit, (value) => {
      itemEdit.value = value
      validateColorBankNumber.value = false
    })

    watch(currencyList, (value) => {
      currencyID.value = value
    })

    const handleCancel = () => {
      open.value = false
      validateColorBankNumber.value = false
      context.emit('update:visible', false)
    }

    const handleCancelDelete = () => {
      btnDelete.value = false
    }

    const removeBankUnUse = () => {
      listBank.value = listBank.value.filter((item) => item.id !== form.value.id)

      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'successfully',
        duration: 5,
        message:
          locale.value === 'en'
            ? t('company_infomation.delete_bank') + store.state.company.formBankEdit.name
            : store.state.company.formBankEdit.name + t('company_infomation.delete_bank')
      })
      btnDelete.value = false
      context.emit('update:visible', false)
      context.emit('deleteBank', listBank.value)
    }

    const handleDelete = async () => {
      if (itemEdit.value.is_deposit_main_bank_account) {
        checkDelete.value = true
        btnDelete.value = false
      } else {
        if (typeof itemEdit.value.id === 'string') {
          removeBankUnUse()
        } else {
          const { checkBankInUse } = useCheckBankInUseService(itemEdit.value.id)
          const { result } = await checkBankInUse()
          if (result.data.isInUse) {
            checkDelete.value = true
            btnDelete.value = false
          } else {
            removeBankUnUse()
          }
        }
      }
    }

    const onSubmit = handleSubmit(async () => {
      form.value = {
        ...form.value,
        is_withdrawal_main_bank_account: null
      }

      let data = {
        id: form.value.id,
        number: form.value.number
      }

      if (typeof form.value.id !== 'string') {
        forEach(allListBank.value, (value) => {
          if (value.number === form.value.number) {
            validateColorBankNumber.value = true
          } else {
            validateColorBankNumber.value = false
          }
        })

        if (!validateColorBankNumber.value) {
          forEach(form.value, (value) => {
            if (includes(value, '__bank__')) {
              form.value = {
                ...form.value,
                id: null,
                is_withdrawal_main_bank_account: null
              }
            }
          })

          try {
            const { checkBankUsed } = useCheckBankUsedService(data)
            await checkBankUsed()
            store.commit('flash/STORE_FLASH_MESSAGE', {
              variant: 'successfully',
              duration: 5,
              message:
                locale.value === 'en'
                  ? t('company_infomation.create_bank') + form.value.name
                  : form.value.name + t('company_infomation.create_bank')
            })
            context.emit('update:visible', false)
            context.emit('formEditBank', form.value)
            validateColorBankNumber.value = false
          } catch (err) {
            checkErrorsApi(err)
          }
        }
      } else {
        if (find(allListBank.value, ['number', form.value.number])) {
          if (form.value.number === store.state.company.numberBank) {
            store.commit('flash/STORE_FLASH_MESSAGE', {
              variant: 'successfully',
              duration: 5,
              message:
                locale.value === 'en'
                  ? t('company_infomation.create_bank') + form.value.name
                  : form.value.name + t('company_infomation.create_bank')
            })
            context.emit('update:visible', false)
            context.emit('formEditBank', form.value)
          } else {
            validateColorBankNumber.value = true
          }
        } else {
          store.commit('flash/STORE_FLASH_MESSAGE', {
            variant: 'successfully',
            duration: 5,
            message:
              locale.value === 'en'
                ? t('company_infomation.create_bank') + form.value.name
                : form.value.name + t('company_infomation.create_bank')
          })
          context.emit('update:visible', false)
          context.emit('formEditBank', form.value)
        }
      }
    })

    const checkErrorsApi = (err) => {
      forEach(camelToSnakeCase(err.response.data.errors), (value) => {
        if (value === 'exist' || value === 'conflict') {
          validateColorBankNumber.value = true
        }
      })
    }

    const replaceField = (text, field) => {
      return text.replace(field, t(`company_infomation.error_${field}`))
    }

    watch(
      () => store.state.company.formBankEdit,
      () => {
        if (store.state.company.formBankEdit) {
          form.value = { ...store.state.company.formBankEdit }
        }
      }
    )

    return {
      locale,
      form,
      onSubmit,
      btnDelete,
      currencyID,
      resetForm,
      checkDelete,
      validateColorBankNumber,
      handleCancelDelete,
      handleDelete,
      replaceField,
      open,
      handleCancel
    }
  }
})
</script>

<style scoped lang="scss">
.modal-add-bank {
  form {
    margin: 6px 9px;

    .form-box {
      display: grid;
      grid-template-columns: auto auto;
      text-align: left;
      grid-column-gap: 16px;
      margin-bottom: 8px;

      .form-group {
        .form-content {
          margin-bottom: 16px;

          .required {
            &:after {
              content: '*';
              margin-left: 0.25rem;
              color: #cd201f;
            }
          }

          .form-input {
            margin-top: 5px;

            .error_bank_account {
              color: #ff4d4f;
            }
          }
        }
      }
    }

    .btn-delete-bank {
      color: #ff4d4f;
      border-color: #ff4d4f;
      text-shadow: none;
      box-shadow: none;

      &:hover {
        background-color: #ff4d4f;
        color: #ffffff;
      }
    }
  }
}
</style>
