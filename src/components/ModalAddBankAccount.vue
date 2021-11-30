<template>
  <a-modal v-model:visible="open" :title="$t('modal.title_add_bank')" class="modal-add-bank" @cancel="handleCancel">
    <template #footer>
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
                    :class="errors.length ? 'input_border' : ''"
                    @change="handleChange"
                  />
                  <!-- Error message -->
                  <ErrorMessage v-slot="{ message }" as="span" name="account_number" class="errors">
                    <template v-if="message === 'account_numberは数字のみ使用できます'">
                      {{ $t('company_infomation.error_empty_number') }}
                    </template>
                    <template v-else>
                      {{ replaceField(message, 'account_number') }}
                    </template>
                  </ErrorMessage>
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
import { last, uniqueId } from 'lodash-es'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ModalAddBankAccount',

  props: {
    currencyList: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      required: true
    },
    isClickSubmit: {
      type: Boolean,
      required: true
    }
  },

  emits: ['update:visible', 'formAddBank'],

  setup(props, context) {
    const store = useStore()
    const { t, locale } = useI18n()
    const { handleSubmit, resetForm } = useForm()

    const currencyID = ref([])
    const listBank = ref([])

    const { currencyList } = toRefs(props)
    const { dataSource } = toRefs(props)
    const { isClickSubmit } = toRefs(props)

    const UNIQUE_ID_PREFIX = '__bank__'

    let form = ref({
      abbreviation: '',
      name: '',
      bank_branch: '',
      account_holder: '',
      number: '',
      currency_id: 1,
      is_deposit_main_bank_account: null
    })

    const clearForm = ref({ ...form.value })

    watch(dataSource, (value) => {
      listBank.value = last(value)
    })

    watch(currencyList, (value) => {
      currencyID.value = value
    })

    watch(isClickSubmit, (value) => {
      if (value) form.value = clearForm.value
    })

    const handleCancel = () => {
      resetForm()
      context.emit('update:visible', false)
    }

    const onSubmit = handleSubmit(() => {
      form.value = {
        ...listBank.value,
        ...form.value,
        id: uniqueId(UNIQUE_ID_PREFIX),
        is_withdrawal_main_bank_account: null
      }
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'successfully',
        duration: 5,
        message:
          locale.value === 'en'
            ? t('company_infomation.create_bank') + form.value.name
            : form.value.name + t('company_infomation.create_bank')
      })
      context.emit('update:visible', false)
      context.emit('formAddBank', form.value)
      resetForm()
    })

    const replaceField = (text, field) => {
      return text.replace(field, t(`company_infomation.error_${field}`))
    }

    return {
      locale,
      form,
      onSubmit,
      currencyID,
      resetForm,
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
