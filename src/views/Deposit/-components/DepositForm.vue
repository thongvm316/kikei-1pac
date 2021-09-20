<template>
  <a-form
    ref="depositNewRef"
    :model="params"
    :rules="depositFormRules"
    layout="vertical"
    class="deposit-form"
    @submit="onSubmitForm"
  >
    <a-form-item name="date" :label="$t('deposit.new.date')">
      <a-date-picker v-model:value="params.date" placeholder="YYYY/MM/DD" />
    </a-form-item>

    <a-form-item name="type" :label="$t('deposit.new.type')">
      <a-radio-group v-model:value="params.type">
        <a-radio :value="10">{{ $t('deposit.new.type_deposit') }}</a-radio>
        <a-radio :value="20" :disabled="params.adProject !== null && isEditDeposit">
          {{ $t('deposit.new.type_withdrawal') }}
        </a-radio>
        <a-radio :value="30" :disabled="params.adProject !== null && isEditDeposit">
          {{ $t('deposit.new.type_transfer') }}
        </a-radio>
        <a-radio :value="40" :disabled="params.adProject !== null && isEditDeposit">
          {{ $t('deposit.new.type_unclear') }}
        </a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item name="categoryId" :label="$t('deposit.new.category')">
      <a-select
        v-model:value="params.categoryId"
        :placeholder="$t('deposit.new.category_place_holder')"
        :disabled="isCategoryDisabled"
        class="has-max-width"
      >
        <template v-for="category in categoryList" :key="category.id">
          <a-select-option :value="category.id">{{ category.name }}</a-select-option>
        </template>
      </a-select>
    </a-form-item>

    <a-form-item name="subcategoryId" :label="$t('deposit.new.sub_category')">
      <a-select
        v-if="!isCompanySelection"
        v-model:value="params.subcategoryId"
        :placeholder="$t('deposit.new.sub_category_place_holder')"
        :disabled="isSubCategoryDisabled"
        class="has-max-width"
      >
        <template v-if="[30].indexOf(currentCategory.subcategoryKind) < 0">
          <a-select-option v-for="subCategory in subCategoryList" :key="subCategory.id" :value="subCategory.id">{{
            subCategory.name
          }}</a-select-option>
        </template>

        <template v-else>
          <a-select-option v-for="subCategory in groupList" :key="subCategory.id" :value="subCategory.id">{{
            subCategory.name
          }}</a-select-option>
        </template>
      </a-select>

      <div v-else class="deposit-form__company-selection">
        <span v-if="companyNameSelected" class="deposit-form__company-selection--content">
          {{ companyNameSelected }}
        </span>
        <a-button
          class="deposit-form__company-selection--btn"
          :disabled="isCategoryDisabled"
          @click="handleOpenModalCompany"
        >
          {{ $t('deposit.new.company_selection') }}
        </a-button>
      </div>
    </a-form-item>

    <a-form-item name="purpose" :label="$t('deposit.new.purpose')">
      <a-input
        v-model:value="params.purpose"
        :placeholder="$t('deposit.new.purpose_place_holder')"
        class="has-max-width"
      />
    </a-form-item>

    <a-form-item name="statisticsMonth" :label="$t('deposit.new.statistics_month')">
      <a-month-picker v-model:value="params.statisticsMonth" placeholder="YYYY/MM" />
    </a-form-item>

    <a-form-item name="groupId" :label="$t('deposit.new.group')">
      <a-select
        v-model:value="params.groupId"
        :placeholder="$t('deposit.new.group_place_holder')"
        class="has-max-width"
        :disabled="isDisableEditField && params.adProject === null"
      >
        <template v-for="group in groupList" :key="group.id">
          <a-select-option :value="group.id">{{ group.name }}</a-select-option>
        </template>
      </a-select>
    </a-form-item>

    <a-form-item name="withdrawalBankAccountId" :label="$t('deposit.new.withdrawal_bank_account')">
      <a-select
        v-model:value="params.withdrawalBankAccountId"
        :placeholder="$t('deposit.new.withdrawal_bank_account_place_holder')"
        class="has-max-width"
      >
        <template v-for="bankAccount in bankAccountList" :key="bankAccount.id">
          <a-select-option :value="bankAccount.id" @click="onSelectWithdrawalMoney(bankAccount.currencyCode)">
            {{ bankAccount.name }}
          </a-select-option>
        </template>
      </a-select>
    </a-form-item>

    <a-form-item name="withdrawalMoney" :label="$t('deposit.new.withdrawal_money')">
      <a-input-number
        v-model:value="params.withdrawalMoney"
        :placeholder="$t('deposit.new.withdrawal_money_place_holder')"
        class="has-max-width"
        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
        :precision="0"
        :min="isAllowNegativeMoney ? undefined : 0"
      />
      <span v-if="withdrawalMoneyCurrency" class="deposit-form__currency-unit">
        {{ `(${withdrawalMoneyCurrency})` }}
      </span>
      <p v-if="isShowCaptionCurrency" class="deposit-form__field-cation">
        {{ $t('deposit.new.withdrawal_money_cation') }}
      </p>
    </a-form-item>

    <div v-if="isAdvandceCurrency" class="u-pl-20">
      <a-form-item name="depositBankAccountId" :label="$t('deposit.new.deposit_bank_account')">
        <a-select
          v-model:value="params.depositBankAccountId"
          :placeholder="$t('deposit.new.deposit_bank_account_place_holder')"
          class="has-max-width"
        >
          <template v-for="bankAccount in bankAccountList" :key="bankAccount.id">
            <a-select-option :value="bankAccount.id" @click="onSelectDepositMoney(bankAccount.currencyCode)">
              {{ bankAccount.name }}
            </a-select-option>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item name="depositMoney" :label="$t('deposit.new.deposit_money')">
        <a-input-number
          v-model:value="params.depositMoney"
          :placeholder="$t('deposit.new.deposit_money_place_holder')"
          class="has-max-width"
          :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
          :precision="0"
          :min="isAllowNegativeMoney ? undefined : 0"
        />
        <span v-if="depositMoneyCurrency" class="deposit-form__currency-unit">{{ `(${depositMoneyCurrency})` }}</span>
      </a-form-item>
    </div>

    <a-form-item name="tags" :label="$t('deposit.new.tag')">
      <div class="deposit-form__tags has-max-width">
        <a-input
          v-model:value="inputTagVal"
          :placeholder="$t('deposit.new.tag_place_holder')"
          class="deposit-form__tags--input"
          @blur="handleInputTagConfirm"
          @keyup.enter="handleInputTagConfirm"
        />
        <div v-if="isShowTagList" class="deposit-form__tags--list">
          <a-tooltip
            v-for="tag in params.tags"
            :key="tag"
            :title="tag"
            overlay-class-name="deposit-form__tags--tooltip"
          >
            <a-tag closable @close="handleCloseTag(tag)">{{ tag }}</a-tag>
          </a-tooltip>
        </div>
      </div>
      <p class="deposit-form__field-cation">
        {{ $t('deposit.new.tag_caption') }}
      </p>
    </a-form-item>

    <a-form-item name="memo" :label="$t('deposit.new.memo')">
      <a-input v-model:value="params.memo" :placeholder="$t('deposit.new.memo_place_holder')" class="has-max-width" />
    </a-form-item>

    <a-form-item name="repeated" :label="$t('deposit.new.repeat')">
      <a-radio-group v-model:value="params.repeated" :disabled="isDisableEditField">
        <a-radio :value="1">{{ $t('deposit.new.daily') }}</a-radio>
        <a-radio :value="2">{{ $t('deposit.new.weekly') }}</a-radio>
        <a-radio :value="3">{{ $t('deposit.new.monthly') }}</a-radio>
        <a-radio :value="4">{{ $t('deposit.new.yearly') }}</a-radio>
        <a-radio :value="0">{{ $t('deposit.new.no_repetition') }}</a-radio>
      </a-radio-group>
    </a-form-item>

    <div class="u-pl-20">
      <a-form-item v-if="params.repeated === 3" name="repeated_end_month">
        <a-checkbox v-model:checked="isRepeatedEndMonth" :disabled="isDisableEditField">
          {{ $t('deposit.new.repeated_end_month') }}</a-checkbox
        >
      </a-form-item>

      <a-form-item
        v-if="params.repeated !== 0 && params.repeated !== null"
        name="repeatedExpiredDate"
        :label="$t('deposit.new.repeated_expired_date')"
        :class="{ 'has-error': !isRepeatedExpiredDateCorrect }"
      >
        <a-date-picker
          v-model:value="params.repeatedExpiredDate"
          :disabled="isDisableEditField"
          placeholder="YYYY/MM/DD"
        />

        <p v-if="!isRepeatedExpiredDateCorrect" class="ant-form-explain">
          {{ $t(`deposit.error_message.repeated_expired_date`) }}
        </p>
      </a-form-item>
    </div>

    <a-form-item name="confirmed" :label="$t('deposit.new.confirmed')">
      <a-checkbox v-model:checked="params.confirmed" :disabled="isDisabledSubmit">
        {{ $t('deposit.new.confirmed') }}
      </a-checkbox>
      <button
        v-if="isAdmin && isDisabledSubmit"
        type="danger"
        ghost
        class="deposit-form__unconfirm-btn"
        @click="handleOpenUnconfirmModal"
      >
        {{ $t('deposit.new.unconfirmed') }}
      </button>
    </a-form-item>

    <a-form-item>
      <a-button type="default" class="deposit-form__submit-btn" @click="onCancelForm">
        {{ $t('deposit.new.cancel') }}
      </a-button>
      <a-button
        type="primary"
        class="deposit-form__submit-btn u-ml-16"
        :loading="isLoading"
        :disabled="isDisabledSubmit"
        @click="onSubmitForm"
      >
        {{ $t('deposit.new.registration') }}
      </a-button>
    </a-form-item>
  </a-form>

  <modal-select-company v-model:visible="isOpenModalCompany" @select-company="handleSelectCompanyModal" />

  <modal-unconfirm
    v-model:visible="isVisibleUnconfirmModal"
    :purpose="params.purpose"
    :is-loading-unconfirm-request="isLoadingUnconfirmRequest"
    @on-unconfirm-deposit="onUnconfirmDeposit"
  />
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, watch, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import {
  getGroups,
  getBankAccounts,
  getCategory,
  getSubCategory,
  createDeposit,
  getDepositDetail,
  updateDeposit,
  unconfirmDeposit
} from '../composables/useDeposit'
import { deepCopy } from '@/helpers/json-parser'
import { fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'

const ModalSelectCompany = defineAsyncComponent(() => import('@/containers/ModalSelectCompany'))
const ModalUnconfirm = defineAsyncComponent(() => import('./UnconfirmDepositModal'))

export default defineComponent({
  name: 'DepositForm',

  components: {
    ModalSelectCompany,
    ModalUnconfirm
  },

  props: {
    isEditDeposit: Boolean
  },

  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { t } = useI18n()

    const isAdmin = store.state.auth?.authProfile?.isAdmin || false
    const isEditRoot = route.params?.isEditRoot || false

    // form
    const depositNewRef = ref()
    const isLoading = ref(false)
    const localErrors = ref({})
    const isAllowNegativeMoney = ref(false)
    const isCloneDeposit = ref(false)
    const isRepeatedEndMonth = ref(false)
    const isRepeatedExpiredDateCorrect = ref(true)

    // list data
    const categoryList = ref([])
    const subCategoryList = ref([])
    const bankAccountList = ref([])
    const groupList = ref([])
    const currentCategory = ref({})

    // modal select company name
    const isCompanySelection = ref(false)
    const isOpenModalCompany = ref(false)
    const isVisibleUnconfirmModal = ref(false)
    const companyNameSelected = ref('')

    // disabled fields
    const isCategoryDisabled = ref(false)
    const isSubCategoryDisabled = ref(false)
    const isAdvandceCurrency = ref(false)
    const isShowCaptionCurrency = ref(false)
    const isDisabledSubmit = ref(false)
    const isDisableEditField = ref(false)
    const isLoadingUnconfirmRequest = ref(false)

    // tags
    const inputTagVal = ref('')
    const isShowTagList = computed(() => params.value.tags?.length !== 0)

    // check currency unit
    const withdrawalMoneyCurrency = ref('')
    const depositMoneyCurrency = ref('')

    // params deposit form
    const params = ref({
      date: moment(),
      type: '',
      categoryId: undefined,
      subcategoryId: undefined,
      purpose: '',
      statisticsMonth: null,
      groupId: undefined,
      withdrawalBankAccountId: undefined,
      withdrawalMoney: 0,
      depositBankAccountId: undefined,
      depositMoney: 0,
      tags: [],
      memo: '',
      numberOfDividedMonth: 0,
      repeated: '',
      repeatedExpiredDate: null,
      repeatedOption: '',
      repeatedInterval: 1,
      confirmed: false
    })

    // form validator rules
    const rules = {
      date: [{ required: true, message: t('deposit.error_message.date'), trigger: ['blur', 'change'], type: 'object' }],
      type: [{ required: true, message: t('deposit.error_message.type'), trigger: 'change', type: 'number' }],
      categoryId: [{ required: true, message: t('deposit.error_message.category'), trigger: 'change', type: 'number' }],
      subcategoryId: [
        {
          required: true,
          message: t('deposit.error_message.sub_category'),
          trigger: 'change',
          type: 'number'
        }
      ],
      purpose: [{ required: true, message: t('deposit.error_message.purpose'), trigger: 'change' }],
      statisticsMonth: [
        { required: true, message: t('deposit.error_message.statistics_month'), trigger: 'change', type: 'object' }
      ],
      groupId: [{ required: true, message: t('deposit.error_message.group'), trigger: 'change', type: 'number' }],
      withdrawalBankAccountId: [
        {
          required: true,
          message: t('deposit.error_message.bank_account'),
          trigger: 'change',
          type: 'number'
        }
      ],
      withdrawalMoney: [
        {
          required: true,
          message: t('deposit.error_message.money'),
          trigger: 'change',
          type: 'number',
          validator: async (_, value) => (value === 0 ? Promise.reject('') : Promise.resolve())
        }
      ],
      depositBankAccountId: [
        {
          required: true,
          message: t('deposit.error_message.bank_account'),
          trigger: 'change',
          type: 'number'
        }
      ],
      depositMoney: [
        {
          required: true,
          message: t('deposit.error_message.money'),
          trigger: 'change',
          type: 'number',
          validator: async (_, value) => (value === 0 ? Promise.reject('') : Promise.resolve())
        }
      ],
      repeated: [{ required: true, message: t('deposit.error_message.repeated'), trigger: 'change', type: 'number' }]
    }
    const depositFormRules = ref(deepCopy(rules))

    /* --------------------- methods ------------------- */
    const onSelectWithdrawalMoney = (currency) => {
      withdrawalMoneyCurrency.value = currency
    }

    const onSelectDepositMoney = (currency) => {
      depositMoneyCurrency.value = currency
    }

    const handleInputTagConfirm = () => {
      if (!inputTagVal.value) return
      params.value.tags = [...params.value.tags, inputTagVal.value]
      inputTagVal.value = ''
    }

    const handleCloseTag = (removedTag) => {
      params.value.tags = params.value.tags.filter((tag) => tag !== removedTag)
    }

    const handleOpenModalCompany = () => {
      isOpenModalCompany.value = true
    }

    const handleSelectCompanyModal = (companyRecord) => {
      companyNameSelected.value = companyRecord?.name || ''
      params.value.subcategoryId = companyRecord?.id || ''
      handleValidateSubCategory()
    }

    const handleOpenUnconfirmModal = () => {
      isVisibleUnconfirmModal.value = true
    }

    const handleValidateSubCategory = () => {
      depositNewRef.value.validateField('subcategoryId')
    }

    const checkSubCategory = () => {
      const indexCurrentCategory = categoryList.value?.findIndex((item) => item.id === params.value.categoryId)

      if (indexCurrentCategory !== -1) {
        currentCategory.value = categoryList.value[indexCurrentCategory]
        isSubCategoryDisabled.value = [0].indexOf(currentCategory.value.subcategoryKind) !== -1 // select options
        isCompanySelection.value = [20].indexOf(currentCategory.value.subcategoryKind) !== -1 // open modal company
      }
    }

    const checkRepeatedExpriedDate = () => {
      if (params.value.repeatedExpiredDate) {
        const _repeatedExpiredDate = new Date(params.value.repeatedExpiredDate)
        const _date = new Date(params.value.date)

        const repeatedExpiredDate = new Date(
          _repeatedExpiredDate.getFullYear(),
          _repeatedExpiredDate.getMonth(),
          _repeatedExpiredDate.getDate()
        )
        const date = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate())

        return repeatedExpiredDate > date
      }

      return true
    }

    const convertDataToForm = (data = {}) => {
      const {
        type,
        category,
        subcategory,
        date,
        statisticsMonth,
        repeatedExpiredDate,
        tags,
        withdrawalBankAccountId,
        withdrawalMoney,
        depositBankAccountId,
        depositMoney,
        confirmed,
        repeatedOption,
        ...restData
      } = data
      const subcategoryId = subcategory?.id

      // check disable or show modal company
      const subcategoryKind = category?.subcategoryKind
      if (type === 10 || type === 20) {
        switch (subcategoryKind) {
          // disable select subcategory
          case 0:
            isSubCategoryDisabled.value = true
            break

          // enable select sub category
          case 10:
            isSubCategoryDisabled.value = false
            break

          // open modal company
          case 20:
            isCompanySelection.value = true
            companyNameSelected.value = subcategory?.name || ''
            break
        }
      }

      // set banks params
      let _withdrawalBankAccountId = undefined
      let _withdrawalMoney = 0
      let _depositBankAccountId = undefined
      let _depositMoney = 0

      switch (type) {
        case 10:
          _withdrawalBankAccountId = depositBankAccountId
          _withdrawalMoney = depositMoney
          _depositBankAccountId = undefined
          _depositMoney = 0
          break
        case 20:
          _withdrawalBankAccountId = withdrawalBankAccountId
          _withdrawalMoney = withdrawalMoney
          _depositBankAccountId = undefined
          _depositMoney = 0
          break
        case 30:
          _withdrawalBankAccountId = withdrawalBankAccountId
          _withdrawalMoney = withdrawalMoney
          _depositBankAccountId = depositBankAccountId
          _depositMoney = depositMoney
          break
        case 40:
          _withdrawalBankAccountId = withdrawalBankAccountId ? withdrawalBankAccountId : depositBankAccountId
          _withdrawalMoney = withdrawalBankAccountId ? withdrawalMoney : -depositMoney
          _depositBankAccountId = undefined
          _depositMoney = 0
          break
      }

      isDisabledSubmit.value = props.isEditDeposit && confirmed
      isDisableEditField.value = isCloneDeposit.value ? false : !isDisabledSubmit.value
      isRepeatedEndMonth.value = repeatedOption === '31'

      return {
        ...restData,
        type,
        categoryId: type === 40 ? undefined : category?.id,
        subcategoryId,
        date: fromStringToDateTimeFormatPicker(date, 'YYYY/MM/DD'),
        statisticsMonth: fromStringToDateTimeFormatPicker(statisticsMonth, 'YYYY/MM/DD'),
        repeatedExpiredDate: fromStringToDateTimeFormatPicker(repeatedExpiredDate, 'YYYY/MM/DD'),
        tags: tags.filter(Boolean),
        withdrawalBankAccountId: _withdrawalBankAccountId,
        withdrawalMoney: _withdrawalMoney,
        depositBankAccountId: _depositBankAccountId,
        depositMoney: _depositMoney,
        confirmed,
        repeatedOption
      }
    }

    const convertFormToDataRequest = (data = {}) => {
      const categoryId = data.categoryId ? data.categoryId : null
      const subcategoryId = data.subcategoryId ? data.subcategoryId : null
      const date = data.date ? moment(data.date).format('YYYY-MM-DD') : null
      const statisticsMonth = data.statisticsMonth ? moment(data.statisticsMonth).format('YYYY-MM-DD') : null
      const repeatedExpiredDate = data.repeatedExpiredDate
        ? moment(data.repeatedExpiredDate).format('YYYY-MM-DD')
        : null
      const repeatedInterval = data.repeatedInterval ? data.repeatedInterval : 1 // default

      // deposit type
      let withdrawalBankAccountId = undefined
      let withdrawalMoney = 0
      let depositBankAccountId = undefined
      let depositMoney = 0

      switch (data.type) {
        case 10:
          withdrawalBankAccountId = undefined
          withdrawalMoney = 0
          depositBankAccountId = data.withdrawalBankAccountId
          depositMoney = data.withdrawalMoney
          break
        case 20:
          withdrawalBankAccountId = data.withdrawalBankAccountId
          withdrawalMoney = data.withdrawalMoney
          depositBankAccountId = undefined
          depositMoney = 0
          break
        case 30:
          withdrawalBankAccountId = data.withdrawalBankAccountId
          withdrawalMoney = data.withdrawalMoney
          depositBankAccountId = data.depositBankAccountId
          depositMoney = data.depositMoney
          break
        case 40:
          withdrawalBankAccountId = data.withdrawalMoney >= 0 ? data.withdrawalBankAccountId : undefined
          withdrawalMoney = data.withdrawalMoney >= 0 ? data.withdrawalMoney : 0
          depositBankAccountId = data.withdrawalMoney < 0 ? data.withdrawalBankAccountId : undefined
          depositMoney = data.withdrawalMoney < 0 ? Math.abs(data.withdrawalMoney) : 0
          break
      }

      const dataRequest = {
        ...data,
        date,
        categoryId,
        subcategoryId,
        statisticsMonth,
        repeatedExpiredDate,
        withdrawalBankAccountId,
        withdrawalMoney,
        depositBankAccountId,
        depositMoney,
        repeatedInterval
      }

      // remove some field unnecessary
      delete dataRequest.id
      delete dataRequest.rootDepositId

      return dataRequest
    }

    /* --------------------- submit form ------------------- */

    // handle cancel form
    const onCancelForm = () => {
      router.push({ name: 'deposit' })
    }

    // handle validator when submit form
    const onSubmitForm = async () => {
      isLoading.value = true
      try {
        const validateRes = await depositNewRef.value.validate()
        isRepeatedExpiredDateCorrect.value = checkRepeatedExpriedDate()

        if (validateRes && isRepeatedExpiredDateCorrect.value) {
          const depositDataRequest = convertFormToDataRequest(params.value)

          props.isEditDeposit ? callEditDeposit(depositDataRequest) : callAddDeposit(depositDataRequest)
        }
      } finally {
        isLoading.value = false
      }
    }

    const callAddDeposit = async (depositDataRequest) => {
      const response = await createDeposit(depositDataRequest)
      if (response.status === 200) {
        const purpose = depositDataRequest.purpose

        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          message: t('deposit.new.create_success', { purpose })
        })
        router.push({ name: 'deposit' })
        return
      }
      if (response.data?.errors) {
        localErrors.value = response.data.errors
      }
    }

    const callEditDeposit = async (depositDataRequest) => {
      const depositId = route.params.id
      const response = await updateDeposit(depositId, depositDataRequest, {
        isUpdateRoot: isEditRoot
      })

      if (response.status === 200) {
        const purpose = depositDataRequest.purpose

        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          message: t('deposit.new.update_success', { purpose })
        })
        router.push({ name: 'deposit' })
        return
      }
      if (response.data?.errors) {
        localErrors.value = response.data.errors
      }
    }

    // unconfirm
    const onUnconfirmDeposit = async () => {
      isLoadingUnconfirmRequest.value = true

      const depositId = parseInt(route.params.id)
      const response = await unconfirmDeposit(depositId)
      if (response.status === 200) {
        const purpose = params.value.purpose

        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          message: t('deposit.unconfirm_modal.unconfirm_success', { purpose })
        })
        router.push({ name: 'deposit' })
        return
      }

      if (response.data?.errors) {
        localErrors.value = response.data.errors
      }

      isLoadingUnconfirmRequest.value = false
    }

    /* --------------------- request function ------------------- */
    const fetchCategoryList = async (type) => {
      const { result: categoryResult = [] } = await getCategory({ divisionType: type })
      categoryList.value = categoryResult?.data || []

      // need check when request get detail
      checkSubCategory()
    }

    const fetchBankAccounts = async (id) => {
      if (!id) return

      const { result: bankAccountResult = [] } = await getBankAccounts({ groupId: id })
      bankAccountList.value = bankAccountResult?.data || []

      bankAccountList.value.forEach((bank) => {
        if (bank.id === params.value.withdrawalBankAccountId) withdrawalMoneyCurrency.value = bank.currencyCode
        if (bank.id === params.value.depositBankAccountId) depositMoneyCurrency.value = bank.currencyCode
      })
    }

    const fetchSubCategory = async (id) => {
      const { result: subCategoryResult = [] } = await getSubCategory({ categoryId: id })
      subCategoryList.value = subCategoryResult?.data || []
    }

    // copy or edit deposit
    const fetchDepositDetail = async () => {
      let depositId = undefined

      if (props.isEditDeposit) {
        depositId = route.params.id
      } else {
        depositId = route.query?.selectedId
        router.replace({ query: {} })
        depositId && (isCloneDeposit.value = true)
      }

      const paramsRequest = {
        is_get_root: isEditRoot
      }

      if (!depositId) return
      const { result = {} } = await getDepositDetail(depositId, paramsRequest)

      params.value = {
        ...params.value,
        ...convertDataToForm(result.data)
      }
    }

    /* --------------------- init data list ------------------- */
    onBeforeMount(async () => {
      const { result: groupResult = [] } = await getGroups()
      groupList.value = groupResult?.data || []

      fetchDepositDetail()
    })

    /* --------------------- watch params ------------------- */
    watch(
      () => params.value.type,
      (type, oldType) => {
        isCategoryDisabled.value = type === 30 || type === 40
        isSubCategoryDisabled.value = type === 30 || type === 40
        isAdvandceCurrency.value = type === 30
        isShowCaptionCurrency.value = type === 40
        isAllowNegativeMoney.value = type === 40

        const divistionType = type === 10 ? 0 : 1
        !isCategoryDisabled.value && fetchCategoryList(divistionType)

        // clear select
        if (oldType && type !== oldType) {
          params.value.categoryId = undefined
          params.value.subcategoryId = undefined
          isCompanySelection.value = false
          companyNameSelected.value = ''
        }
      }
    )

    watch(
      () => params.value.categoryId,
      (id) => {
        fetchSubCategory(id)
        checkSubCategory()
      }
    )

    watch(
      () => params.value.groupId,
      (groupId, oldGroupId) => {
        fetchBankAccounts(groupId)

        if (oldGroupId && oldGroupId !== groupId) {
          params.value.withdrawalBankAccountId = undefined
          params.value.depositBankAccountId = undefined
          params.value.withdrawalMoney = 0
          params.value.depositMoney = 0
          withdrawalMoneyCurrency.value = ''
          depositMoneyCurrency.value = ''
        }
      }
    )

    watch(
      () => isRepeatedEndMonth.value,
      (val) => {
        params.value.repeatedOption = val ? '31' : ''
      }
    )

    watch(
      () => isCategoryDisabled.value,
      (val) => {
        if (val) {
          depositFormRules.value.categoryId = []
        } else {
          depositFormRules.value.categoryId = rules.categoryId
        }
      }
    )

    watch(
      () => isSubCategoryDisabled.value,
      (val) => {
        if (val) {
          depositFormRules.value.subcategoryId = []
          params.value.subcategoryId = undefined
          companyNameSelected.value = ''
        } else {
          depositFormRules.value.subcategoryId = rules.subcategoryId
        }
      }
    )

    watch(isAdvandceCurrency, (val) => {
      if (val) {
        depositFormRules.value.depositBankAccountId = rules.depositBankAccountId
        depositFormRules.value.depositMoney = rules.depositMoney
      } else {
        depositFormRules.value.depositBankAccountId = []
        depositFormRules.value.depositMoney = []
      }
    })

    return {
      depositNewRef,
      params,
      depositFormRules,
      inputTagVal,
      categoryList,
      subCategoryList,
      groupList,
      bankAccountList,
      withdrawalMoneyCurrency,
      depositMoneyCurrency,
      companyNameSelected,
      currentCategory,

      isAdmin,
      isLoading,
      isCategoryDisabled,
      isSubCategoryDisabled,
      isAdvandceCurrency,
      isShowCaptionCurrency,
      isShowTagList,
      isOpenModalCompany,
      isCompanySelection,
      isRepeatedEndMonth,
      isDisabledSubmit,
      isAllowNegativeMoney,
      isDisableEditField,
      isRepeatedExpiredDateCorrect,
      isVisibleUnconfirmModal,
      isLoadingUnconfirmRequest,

      onSelectWithdrawalMoney,
      onSelectDepositMoney,
      handleInputTagConfirm,
      handleCloseTag,
      handleOpenModalCompany,
      handleSelectCompanyModal,
      handleValidateSubCategory,
      onSubmitForm,
      onCancelForm,
      onUnconfirmDeposit,
      handleOpenUnconfirmModal
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

$field-min-width: 300px;
$field-max-width: 300px;

.deposit-form {
  padding-top: 24px;
  padding-bottom: 32px;

  &__field-advance {
    padding-left: 20px;
  }

  &__field-cation {
    color: $color-grey-75;
    font-size: 12px;
    line-height: 18px;
  }

  &__currency-unit {
    color: $color-grey-75;
    margin-left: 8px;
  }

  &__tags {
    @include flexbox(null, flex-start);
    flex-direction: column;
    background-color: $color-grey-100;
    max-width: 500px;
    border: 1px solid $color-grey-85;

    &--input {
      border: 0;
    }

    &--list {
      padding: 4px 12px;
      width: 100%;
    }
  }

  &__company-selection {
    &--content {
      color: $color-grey-55;
      margin-right: 12px;
    }

    &--btn {
      border: 0;
      background-color: transparent;
      padding: 0;

      &:hover {
        span {
          text-decoration: underline;
        }
      }
    }
  }

  &__submit-btn {
    min-width: 105px;
  }

  &__unconfirm-btn {
    margin-left: 12px;
    color: $color-additional-red-6;
    border: 1px solid $color-additional-red-6;
    border-radius: 2px;
    cursor: pointer;
  }

  .has-max-width {
    min-width: $field-min-width;
    max-width: $field-max-width;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-label > label {
    color: $color-grey-15;
  }

  .ant-form-item-label > label.ant-form-item-required {
    &:after {
      display: inline-block;
      margin-left: 4px;
      color: $color-additional-red-6;
      font-size: 14px;
      line-height: 1;
      content: '*';
    }
  }

  .ant-form-item-required {
    &:before {
      display: none;
    }
  }

  .ant-tag {
    background: $color-grey-85;
    padding: 2px 28px 2px 7px;
    max-width: calc(100% - 10px);
    text-overflow: ellipsis;
    overflow: hidden;
    position: relative;

    .ant-tag-close-icon {
      position: absolute;
      top: 6px;
      right: 8px;
    }
  }

  .ant-btn[disabled] {
    background-color: transparent;
  }

  .ant-radio-wrapper {
    margin: 0 16px 0 0;
  }

  .ant-form-item-label {
    padding: 0 0 4px;
  }
}

.deposit-form__tags--tooltip {
  .ant-tooltip-inner {
    color: $color-grey-100;
    background-color: $color-grey-35;
  }
}
</style>
