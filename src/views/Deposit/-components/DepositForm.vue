/* eslint-disable indent */
<template>
  <a-form
    ref="depositNewRef"
    :model="params.data"
    :rules="depositNewFormRules"
    layout="vertical"
    class="deposit-form"
    @submit="onSubmitForm"
  >
    <a-form-item name="date" :label="$t('deposit.new.date')">
      <a-date-picker v-model:value="params.data.date" placeholder="YYYY/MM/DD" />
    </a-form-item>

    <a-form-item name="type" :label="$t('deposit.new.type')">
      <a-radio-group v-model:value="params.data.type">
        <a-radio :value="10">{{ $t('deposit.new.type_deposit') }}</a-radio>
        <a-radio :value="20">{{ $t('deposit.new.type_withdrawal') }}</a-radio>
        <a-radio :value="30">{{ $t('deposit.new.type_transfer') }}</a-radio>
        <a-radio :value="40">{{ $t('deposit.new.type_unclear') }}</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item name="categoryId" :label="$t('deposit.new.category')">
      <a-select
        v-model:value="params.data.categoryId"
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
        v-model:value="params.data.subcategoryId"
        :placeholder="$t('deposit.new.sub_category_place_holder')"
        :disabled="isCategoryDisabled"
        class="has-max-width"
      >
        <template v-for="subCategory in subCategoryList" :key="subCategory.id">
          <a-select-option :value="subCategory.id">{{ subCategory.name }}</a-select-option>
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
        <search-company-name
          v-model:visible="isOpenModalCompany"
          v-model:companyName="companyNameSelected"
          v-model:subcategoryId="params.data.subcategoryId"
        />
      </div>
    </a-form-item>

    <a-form-item name="purpose" :label="$t('deposit.new.purpose')">
      <a-input
        v-model:value="params.data.purpose"
        :placeholder="$t('deposit.new.purpose_place_holder')"
        class="has-max-width"
      />
    </a-form-item>

    <a-form-item name="statisticsMonth" :label="$t('deposit.new.statistics_month')">
      <a-month-picker v-model:value="params.data.statisticsMonth" placeholder="YYYY/MM" />
    </a-form-item>

    <a-form-item name="groupId" :label="$t('deposit.new.group')">
      <a-select
        v-model:value="params.data.groupId"
        :placeholder="$t('deposit.new.group_place_holder')"
        class="has-max-width"
      >
        <template v-for="group in groupList" :key="group.id">
          <a-select-option :value="group.id">{{ group.name }}</a-select-option>
        </template>
      </a-select>
    </a-form-item>

    <a-form-item name="withdrawalBankAccountId" :label="$t('deposit.new.withdrawal_bank_account')">
      <a-select
        v-model:value="params.data.withdrawalBankAccountId"
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
        v-model:value="params.data.withdrawalMoney"
        :placeholder="$t('deposit.new.withdrawal_money_place_holder')"
        class="has-max-width"
        :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
        :precision="3"
      />
      <span v-if="withdrawalMoneyCurrency" class="deposit-form__currency-unit">
        {{ `(${withdrawalMoneyCurrency})` }}
      </span>
      <p v-if="isShowCaptionCurrency" class="deposit-form__field-cation">
        {{ $t('deposit.new.withdrawal_money_cation') }}
      </p>
    </a-form-item>

    <div v-if="isAdvandceCurrency" class="deposit-form__field-advance">
      <a-form-item name="depositBankAccountId" :label="$t('deposit.new.deposit_bank_account')">
        <a-select
          v-model:value="params.data.depositBankAccountId"
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
          v-model:value="params.data.depositMoney"
          :placeholder="$t('deposit.new.deposit_money_place_holder')"
          class="has-max-width"
          :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
          :precision="3"
        />
        <span v-if="depositMoneyCurrency" class="deposit-form__currency-unit">{{ `(${depositMoneyCurrency})` }}</span>
      </a-form-item>
    </div>

    <a-form-item name="tags" :label="$t('deposit.new.tag')">
      <div class="deposit-form__tags">
        <a-input
          v-model:value="inputTagVal"
          :placeholder="$t('deposit.new.tag_place_holder')"
          class="deposit-form__tags--input"
          @blur="handleInputTagConfirm"
          @keyup.enter="handleInputTagConfirm"
        />
        <div v-if="isShowTagList" class="deposit-form__tags--list">
          <a-tag v-for="tag in params.data.tags" :key="tag" closable @close="handleCloseTag(tag)">{{ tag }}</a-tag>
        </div>
      </div>
    </a-form-item>

    <a-form-item name="memo" :label="$t('deposit.new.memo')">
      <a-input
        v-model:value="params.data.memo"
        :placeholder="$t('deposit.new.memo_place_holder')"
        class="has-max-width"
      />
    </a-form-item>

    <a-form-item name="repeated" :label="$t('deposit.new.repeat')">
      <a-radio-group v-model:value="params.data.repeated">
        <a-radio :value="1">{{ $t('deposit.new.daily') }}</a-radio>
        <a-radio :value="2">{{ $t('deposit.new.weekly') }}</a-radio>
        <a-radio :value="3">{{ $t('deposit.new.monthly') }}</a-radio>
        <a-radio :value="4">{{ $t('deposit.new.yearly') }}</a-radio>
        <a-radio :value="0">{{ $t('deposit.new.no_repetition') }}</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item v-if="params.data.repeated === 3" name="repeated_end_month">
      <a-checkbox v-model:checked="isRepeatedEndMonth">{{ $t('deposit.new.repeated_end_month') }}</a-checkbox>
    </a-form-item>

    <a-form-item
      v-if="params.data.repeated !== 0 && params.data.repeated !== null"
      name="repeatedExpiredDate"
      :label="$t('deposit.new.repeated_expired_date')"
    >
      <a-date-picker v-model:value="params.data.repeatedExpiredDate" placeholder="YYYY/MM/DD" />
    </a-form-item>

    <a-form-item name="confirmed" :label="$t('deposit.new.confirmed')">
      <a-checkbox v-model:checked="params.data.confirmed">{{ $t('deposit.new.confirmed') }}</a-checkbox>
    </a-form-item>

    <a-form-item>
      <a-button type="default" class="deposit-form__submit-btn" @click="onCancelForm">
        {{ $t('deposit.new.cancel') }}
      </a-button>
      <a-button type="primary" class="deposit-form__submit-btn u-ml-16" :loading="isLoading" @click="onSubmitForm">
        {{ $t('deposit.new.registration') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent, defineAsyncComponent, reactive, ref, watch, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'

import {
  getGroups,
  getBankAccounts,
  getCategory,
  getSubCategory,
  createDeposit,
  getDepositDetail
} from '../composables/useDepositService'
const SearchCompanyName = defineAsyncComponent(() => import('../-components/SearchCompanyName'))

export default defineComponent({
  name: 'DepositForm',

  components: {
    SearchCompanyName
  },

  props: {
    edit: Boolean
  },

  setup(props) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const depositNewRef = ref()
    const isLoading = ref(false)

    // list data
    const categoryList = ref([])
    const subCategoryList = ref([])
    const bankAccountList = ref([])
    const groupList = ref([])

    // modal select company name
    const isCompanySelection = ref(false)
    const isOpenModalCompany = ref(false)
    const companyNameSelected = ref('')

    // disabled fields
    const isCategoryDisabled = ref(false)
    const isAdvandceCurrency = ref(false)
    const isShowCaptionCurrency = ref(false)

    // tags
    const inputTagVal = ref('')
    const isShowTagList = computed(() => params.data.tags?.length !== 0)

    // check currency unit
    const withdrawalMoneyCurrency = ref('')
    const depositMoneyCurrency = ref('')

    const isRepeatedEndMonth = ref(false)

    // params deposit form
    const params = reactive({
      data: {
        date: null,
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
        // createdBy: 1,
        // updatedBy: 1
      }
    })

    // form validator rules
    const depositNewFormRules = ref({
      date: [{ required: true, message: 'Please select date', trigger: ['blur', 'change'], type: 'object' }],
      type: [{ required: true, message: 'Please select type', trigger: 'change', type: 'number' }],
      categoryId: [{ required: true, message: 'Please input category', trigger: 'change', type: 'number' }],
      subcategoryId: [
        { required: true, message: 'Please input sub category', trigger: ['change', 'blur'], type: 'number' }
      ],
      purpose: [{ required: true, message: 'Please input purpose', trigger: 'change' }],
      statisticsMonth: [{ required: true, message: 'Please select month', trigger: 'change', type: 'object' }],
      groupId: [{ required: true, message: 'Please select deposit group', trigger: 'change', type: 'number' }],
      withdrawalBankAccountId: [
        { required: true, message: 'Please input bank account', trigger: 'change', type: 'number' }
      ],
      withdrawalMoney: [
        { required: true, message: 'Please select withdrawal money', trigger: 'change', type: 'number' }
      ],
      depositBankAccountId: [
        { required: true, message: 'Please input bank account', trigger: 'change', type: 'number' }
      ],
      depositMoney: [{ required: true, message: 'Please select withdrawal money', trigger: 'change', type: 'number' }],
      tags: [{ required: true, message: 'Please input tag', trigger: 'blur', type: 'array' }],
      repeated: [{ required: true, message: 'Please select repeated', trigger: 'change', type: 'number' }]
    })

    /* --------------------- methods ------------------- */
    const onSelectWithdrawalMoney = (currency) => {
      withdrawalMoneyCurrency.value = currency
    }

    const onSelectDepositMoney = (currency) => {
      depositMoneyCurrency.value = currency
    }

    const handleInputTagConfirm = () => {
      if (!inputTagVal.value) return
      params.data.tags = [...params.data.tags, inputTagVal.value]
      inputTagVal.value = ''
    }

    const handleCloseTag = (removedTag) => {
      params.data.tags = params.data.tags.filter((tag) => tag !== removedTag)
    }

    const handleOpenModalCompany = () => {
      isOpenModalCompany.value = true
    }

    const convertDataToForm = (obj = {}) => {
      const {
        type,
        adCategory,
        adSubcategory,
        adSubcategoryCompany,
        adSubcategoryGroup,
        date,
        statisticsMonth,
        repeatedExpiredDate,
        tags,
        ...restData
      } = obj
      const subcategoryKind = adCategory?.subcategoryKind

      let subcategoryId = undefined
      if (type !== 40) {
        switch (subcategoryKind) {
          case 10:
            subcategoryId = adSubcategory?.id
            break
          case 20:
            subcategoryId = adSubcategoryCompany?.id
            isCompanySelection.value = true
            companyNameSelected.value = adSubcategoryCompany?.name || ''
            break
          case 30:
            subcategoryId = adSubcategoryGroup?.id
            isCompanySelection.value = true
            companyNameSelected.value = adSubcategoryGroup?.name || ''
            break
        }
      }

      return {
        type,
        categoryId: type === 40 ? undefined : adCategory?.id,
        subcategoryId: subcategoryId,
        date: date ? moment(date).format('YYYY-MM-DD') : null,
        statisticsMonth: statisticsMonth ? moment(statisticsMonth).format('YYYY-MM-DD') : null,
        repeatedExpiredDate: repeatedExpiredDate ? moment(repeatedExpiredDate).format('YYYY-MM-DD') : null,
        tags: tags.filter(Boolean),
        ...restData
      }
    }

    const convertDepositDataRequest = (data = {}) => {
      const date = data.date ? moment(data.date).format('YYYY-MM-DD') : null
      const statisticsMonth = data.statisticsMonth ? moment(data.statisticsMonth).format('YYYY-MM-DD') : null
      const repeatedExpiredDate = data.repeatedExpiredDate ? moment(data.statisticsMonth).format('YYYY-MM-DD') : null

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
          depositMoney = data.withdrawalMoney < 0 ? data.withdrawalMoney : 0
          break
      }

      return {
        ...data,
        date,
        statisticsMonth,
        repeatedExpiredDate,
        withdrawalBankAccountId,
        withdrawalMoney,
        depositBankAccountId,
        depositMoney
      }
    }

    /* --------------------- submit form ------------------- */

    // handle cancel form
    const onCancelForm = () => {
      depositNewRef.value.resetFields()
    }

    // handle validator when submit form
    const onSubmitForm = async () => {
      isLoading.value = true
      try {
        const validateRes = await depositNewRef.value.validate()

        if (validateRes) {
          const depositDataRequest = convertDepositDataRequest(params.data)

          await createDeposit(depositDataRequest)
          depositNewRef.value.resetFields()
          router.push({ name: 'deposit' })
        }
      } finally {
        isLoading.value = false
      }
    }

    /* --------------------- request function ------------------- */
    const fetchCategoryList = async (type) => {
      const { result: categoryResult = [] } = await getCategory({ divisionType: type })
      categoryList.value = categoryResult?.data || []
    }

    const fetchBankAccounts = async (id) => {
      if (!id) return

      const { result: bankAccountResult = [] } = await getBankAccounts({ groupId: id })
      bankAccountList.value = bankAccountResult?.data || []
    }

    const fetchSubCategory = async (id) => {
      const { result: subCategoryResult = [] } = await getSubCategory({ categoryId: id })
      subCategoryList.value = subCategoryResult?.data || []
    }

    // copy or edit deposit
    const fetchDepositDetail = async () => {
      let depositId = undefined

      if (props.edit) {
        depositId = route.params.id
      } else {
        const recordDeposit = store.state?.deposit?.recordDeposit || {}
        depositId = recordDeposit?.id || undefined
        store.commit('deposit/CLEAR_RECORD_DEPOSIT')
      }

      if (!depositId) return
      const { result = {} } = await getDepositDetail(depositId)

      params.data = {
        ...params.data,
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
      () => params.data.type,
      (type) => {
        isCategoryDisabled.value = type === 30 || type === 40
        isAdvandceCurrency.value = type === 30
        isShowCaptionCurrency.value = type === 40

        const divistionType = type === 10 ? 0 : 1
        fetchCategoryList(divistionType)
      }
    )

    watch(
      () => params.data.categoryId,
      (id) => {
        fetchSubCategory(id)

        if (categoryList.value.length) {
          isCompanySelection.value =
            categoryList.value.findIndex(
              (item) => item.id === id && (item.subcategoryKind === 20 || item.subcategoryKind === 30)
            ) !== -1
        }
      }
    )

    watch(
      () => params.data.groupId,
      (groupId) => {
        fetchBankAccounts(groupId)
      }
    )

    watch(isRepeatedEndMonth, (val) => {
      params.data.repeatedOption = val ? '31' : ''
    })

    watch(isCategoryDisabled, (val) => {
      if (val) {
        depositNewFormRules.value.categoryId = []
        depositNewFormRules.value.subcategoryId = []
      } else {
        depositNewFormRules.value.categoryId = [
          { required: true, message: 'Please input category', trigger: 'change', type: 'number' }
        ]
        depositNewFormRules.value.subcategoryId = [
          { required: true, message: 'Please input sub category', trigger: ['change', 'blur'], type: 'number' }
        ]
      }
    })

    watch(isAdvandceCurrency, (val) => {
      if (val) {
        depositNewFormRules.value.depositBankAccountId = [
          { required: true, message: 'Please input bank account', trigger: 'change', type: 'number' }
        ]
        depositNewFormRules.value.depositMoney = [
          { required: true, message: 'Please select withdrawal money', trigger: 'change', type: 'number' }
        ]
      } else {
        depositNewFormRules.value.depositBankAccountId = []
        depositNewFormRules.value.depositMoney = []
      }
    })

    return {
      depositNewRef,
      params,
      isLoading,
      depositNewFormRules,
      isCategoryDisabled,
      isAdvandceCurrency,
      isShowCaptionCurrency,
      inputTagVal,
      categoryList,
      subCategoryList,
      bankAccountList,
      groupList,
      isShowTagList,
      isOpenModalCompany,
      isCompanySelection,
      withdrawalMoneyCurrency,
      depositMoneyCurrency,
      companyNameSelected,
      isRepeatedEndMonth,

      onSelectWithdrawalMoney,
      onSelectDepositMoney,
      onSubmitForm,
      onCancelForm,
      handleInputTagConfirm,
      handleCloseTag,
      handleOpenModalCompany
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

$field-min-width: 300px;
$field-max-width: 500px;

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
    }
  }

  &__submit-btn {
    min-width: 105px;
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
    padding: 2px 7px;
  }
}
</style>
