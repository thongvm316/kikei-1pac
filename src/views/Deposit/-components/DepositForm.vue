<template>
  <a-form
    ref="depositNewRef"
    :model="params"
    :rules="depositNewFormRules"
    layout="vertical"
    class="deposit-form"
    @submit="onSubmitForm"
  >
    <a-form-item name="date" :label="$t('deposit.new.date')">
      <a-date-picker v-model:value="params.date" placeholder="YYYY/MM/DD" />
    </a-form-item>

    <a-form-item name="type" :label="$t('deposit.new.type')">
      <a-radio-group v-model:value="params.type">
        <a-radio :value="0">{{ $t('deposit.new.type_deposit') }}</a-radio>
        <a-radio :value="1">{{ $t('deposit.new.type_withdrawal') }}</a-radio>
        <a-radio :value="2">{{ $t('deposit.new.type_transfer') }}</a-radio>
        <a-radio :value="3">{{ $t('deposit.new.type_unclear') }}</a-radio>
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
        :disabled="isCategoryDisabled"
        class="has-max-width"
      >
        <template v-for="subCategory in subCategoryList" :key="subCategory.id">
          <a-select-option :value="subCategory.id">{{ subCategory.name }}</a-select-option>
        </template>
      </a-select>

      <div v-else class="deposit-form__company-selection">
        <span v-if="params.companyName" class="deposit-form__company-selection--content">
          {{ params.companyName }}
        </span>
        <a-button v-if="true" class="deposit-form__company-selection--btn" @click="handleOpenModalCompany">
          {{ $t('deposit.new.company_selection') }}
        </a-button>
        <search-company-name v-model:visible="isOpenModalCompany" v-model:companyName="params.companyName" />
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
          <a-select-option :value="bankAccount.id">{{ bankAccount.number }}</a-select-option>
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
        :precision="3"
      />
      <span class="deposit-form__currency-unit">(VND)</span>
      <p v-if="isShowCaptionCurrency" class="deposit-form__field-cation">
        {{ $t('deposit.new.withdrawal_money_cation') }}
      </p>
    </a-form-item>

    <div v-if="isAdvandceCurrency" class="deposit-form__field-advance">
      <a-form-item name="depositBankAccountId" :label="$t('deposit.new.deposit_bank_account')">
        <a-input
          v-model:value="params.depositBankAccountId"
          :placeholder="$t('deposit.new.deposit_bank_account_place_holder')"
          class="has-max-width"
        />
      </a-form-item>
      <a-form-item name="depositMoney" :label="$t('deposit.new.deposit_money')">
        <a-input-number
          v-model:value="params.depositMoney"
          :placeholder="$t('deposit.new.deposit_money_place_holder')"
          class="has-max-width"
          :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
          :precision="3"
        />
        <span class="deposit-form__currency-unit">(USD)</span>
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
          <a-tag v-for="tag in params.tags" :key="tag" closable @close="handleCloseTag(tag)">{{ tag }}</a-tag>
        </div>
      </div>
    </a-form-item>

    <a-form-item name="memo" :label="$t('deposit.new.memo')">
      <a-input v-model:value="params.memo" :placeholder="$t('deposit.new.memo_place_holder')" class="has-max-width" />
    </a-form-item>

    <a-form-item name="repeated" :label="$t('deposit.new.repeat')">
      <a-radio-group v-model:value="params.repeated">
        <a-radio :value="1">{{ $t('deposit.new.daily') }}</a-radio>
        <a-radio :value="2">{{ $t('deposit.new.weekly') }}</a-radio>
        <a-radio :value="3">{{ $t('deposit.new.monthly') }}</a-radio>
        <a-radio :value="4">{{ $t('deposit.new.yearly') }}</a-radio>
        <a-radio :value="0">{{ $t('deposit.new.no_repetition') }}</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item v-if="params.repeated === 3" name="repeated_end_month">
      <a-checkbox v-model:checked="params.confirm">{{ $t('deposit.new.repeated_end_month') }}</a-checkbox>
    </a-form-item>

    <a-form-item
      v-if="params.repeated !== 0 && params.repeated !== null"
      name="repeatedExpiredDate"
      :label="$t('deposit.new.repeated_expired_date')"
    >
      <a-date-picker v-model:value="params.repeatedExpiredDate" placeholder="YYYY/MM/DD" />
    </a-form-item>

    <a-form-item name="confirmed" :label="$t('deposit.new.confirmed')">
      <a-checkbox v-model:checked="params.confirmed">{{ $t('deposit.new.confirmed') }}</a-checkbox>
    </a-form-item>

    <a-form-item>
      <a-button type="default" @click="onCancelForm">{{ $t('deposit.new.cancel') }}</a-button>
      <a-button type="primary" class="u-ml-16" :loading="isLoading" @click="onSubmitForm">
        {{ $t('deposit.new.registration') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  ref,
  watch,
  computed,
  onBeforeMount,
  toRefs,
  onMounted
} from 'vue'
import { useStore } from 'vuex'
import {
  getGroups,
  getBankAccounts,
  getCategory,
  getSubCategory,
  createDeposit
} from '../composables/useDepositService'
const SearchCompanyName = defineAsyncComponent(() => import('../-components/SearchCompanyName'))

export default defineComponent({
  name: 'DepositForm',

  components: {
    SearchCompanyName
  },

  props: {
    depositState: {
      type: Object,
      required: true,
      default() {
        return {
          date: null,
          type: '',
          categoryId: undefined,
          subcategoryId: undefined,
          companyName: '',
          purpose: 'deposit FORM',
          statisticsMonth: null,
          groupId: undefined,
          withdrawalBankAccountId: undefined,
          withdrawalMoney: 0,
          depositBankAccountId: undefined,
          depositMoney: 0,
          tags: [],
          memo: '',
          numberOfDividedMonth: 0,
          repeated: 3,
          repeatedExpiredDate: null,
          repeatedOption: 1,
          repeatedInterval: 1,
          confirmed: true
        }
      }
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const store = useStore()
    const depositNewRef = ref()
    const isLoading = ref(false)

    // list data
    const categoryList = ref([])
    const subCategoryList = ref([])
    const bankAccountList = ref([])
    const groupList = ref([])

    // tags
    const inputTagVal = ref('')
    const isShowTagList = computed(() => params.tags.length !== 0)

    // modal select company name
    const isCompanySelection = ref(false)
    const isOpenModalCompany = ref(false)

    // disabled fields
    const isCategoryDisabled = ref(false)
    const isAdvandceCurrency = ref(false)
    const isShowCaptionCurrency = ref(false)

    // copied record
    const currentCopiedRecord = ref()

    const params = reactive(props.depositState)

    watch(
      () => props.depositState,
      (val) => {
        // params = val
        console.log('new deposit state:::', val)
      }
    )

    // const a = ref()
    // onMounted(() => {
    //   // eslint-disable-next-line no-const-assign
    //   a.value = deepCopy(depositState)

    //   console.log('a:::', a.value)
    // })

    // form validator rules
    const depositNewFormRules = {
      date: [{ required: true, message: 'Please select date', trigger: 'change', type: 'object' }],
      type: [{ required: true, message: 'Please select deposit type', trigger: 'change', type: 'number' }],
      categoryId: [{ required: true, message: 'Please input category', trigger: 'change', type: 'number' }],
      subcategoryId: [{ required: true, message: 'Please input sub category', trigger: 'change', type: 'number' }],
      purpose: [{ required: true, message: 'Please input deposit title', trigger: 'change' }],
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
      tags: [{ required: true, message: 'Please input tag', trigger: 'blur', type: 'array' }]
    }

    const handleInputTagConfirm = () => {
      if (!inputTagVal.value) return
      params.tags = [...params.tags, inputTagVal.value]
      inputTagVal.value = ''
    }

    const handleCloseTag = (removedTag) => {
      params.tags = params.tags.filter((tag) => tag !== removedTag)
    }

    const handleOpenModalCompany = () => {
      isOpenModalCompany.value = true
    }

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
          console.log('comfirm success', params)

          await createDeposit(params)
        }
      } finally {
        isLoading.value = false
      }
    }

    const applyCopiedRecordToAddNewDeposit = () => {
      console.log(store.state.deposit.recordDeposit)
      currentCopiedRecord.value = store.state.deposit.recordDeposit
      store.commit('deposit/CLEAR_RECORD_DEPOSIT')
    }

    const fetchCategoryList = async (type) => {
      const { result: categoryResult = [] } = await getCategory({ divisionType: type })
      categoryList.value = categoryResult?.data || []
    }

    const fetchBankAccounts = async (id) => {
      const { result: bankAccountResult = [] } = await getBankAccounts({ groupId: id })
      bankAccountList.value = bankAccountResult?.data || []
    }

    const fetchSubCategory = async (id) => {
      const { result: subCategoryResult = [] } = await getSubCategory({ categoryId: id })
      subCategoryList.value = subCategoryResult?.data || []
    }

    // fetch list data
    onBeforeMount(async () => {
      const { result: groupResult = [] } = await getGroups()
      groupList.value = groupResult?.data || []
    })

    watch(
      () => params.type,
      (type) => {
        isCategoryDisabled.value = type === 2 || type === 3
        isAdvandceCurrency.value = type === 2
        isShowCaptionCurrency.value = type === 3

        fetchCategoryList(type)
      }
    )

    watch(
      () => params.categoryId,
      (id) => {
        fetchSubCategory(id)

        isCompanySelection.value =
          categoryList.value.findIndex((item) => item.id === id && item.subcategory_kind === 20) !== -1
      }
    )

    watch(
      () => params.groupId,
      (val) => {
        fetchBankAccounts(val)
      }
    )

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

  .has-max-width {
    min-width: $field-min-width;
    max-width: $field-max-width;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-label > label {
    color: $color-grey-15;

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
