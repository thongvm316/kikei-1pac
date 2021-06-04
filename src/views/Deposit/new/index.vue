<template>
  <div class="k-deposit-new container">
    <a-form ref="depositNewRef" :model="params" :rules="depositNewFormRules" layout="vertical" @submit="onSubmitForm">
      <a-form-item name="date" label="入出金日">
        <a-date-picker v-model:value="params.date" placeholder="YYYY/MM/DD" />
      </a-form-item>

      <a-form-item name="type" label="入出金">
        <a-radio-group v-model:value="params.type">
          <a-radio value="deposit">入金</a-radio>
          <a-radio value="withdrawal">出金</a-radio>
          <a-radio value="transfer">移動</a-radio>
          <a-radio value="unclear">不明</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="categoryId" label="大分類">
        <a-select
          v-model:value="params.categoryId"
          placeholder="選択して下さい"
          :disabled="isCategoryDisabled"
          class="has-max-width"
        >
          <template v-for="category in categoryList" :key="category.id">
            <a-select-option :value="category.id">{{ category.name }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item name="subcategoryId" label="大分類">
        <a-select
          v-model:value="params.subcategoryId"
          placeholder="選択して下さい"
          :disabled="isCategoryDisabled"
          class="has-max-width"
        >
          <template v-for="subCategory in subCategoryList" :key="subCategory.id">
            <a-select-option :value="subCategory.id">{{ subCategory.name }}</a-select-option>
          </template>
        </a-select>

        <a-button v-if="true" @click="handleOpenModalCompany">選択</a-button>
        <modal-company-list v-model:visible="openModalCompany" v-model:company="params.subcategoryId" />
      </a-form-item>

      <a-form-item name="purpose" label="項目名">
        <a-input v-model:value="params.purpose" placeholder="入力してください" class="has-max-width" />
      </a-form-item>

      <a-form-item name="statisticsMonth" label="計上月">
        <a-month-picker v-model:value="params.statisticsMonth" placeholder="YYYY/MM" />
      </a-form-item>

      <a-form-item name="groupId" label="入出金グループ">
        <a-select v-model:value="params.groupId" placeholder="選択して下さい" class="has-max-width">
          <template v-for="group in groupList" :key="group.id">
            <a-select-option :value="group.id">{{ group.name }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item name="withdrawalBankAccountId" label="銀行口座">
        <a-select v-model:value="params.withdrawalBankAccountId" placeholder="選択して下さい" class="has-max-width">
          <template v-for="bankAccount in bankAccountList" :key="bankAccount.id">
            <a-select-option :value="bankAccount.id">{{ bankAccount.number }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item name="currency" label="金額">
        <a-input v-model:value="params.currency" placeholder="入力してください" class="has-max-width" />
        <span class="k-deposit-new__currency-unit">(VND)</span>
        <p v-if="params.depositType === 'unclear'" class="k-deposit-new__field-cation">
          ※仮受金の場合はマイナスで入力してください
        </p>
      </a-form-item>

      <div v-if="isAdvandceCurrency" class="k-deposit-new__field-advance">
        <a-form-item name="currency" label="金額">
          <a-input v-model:value="params.currency" placeholder="入力してください" class="has-max-width" />
        </a-form-item>
        <a-form-item name="currency" label="金額">
          <a-input v-model:value="params.currency" placeholder="入力してください" class="has-max-width" />
        </a-form-item>
      </div>

      <a-form-item name="tags" label="タグ">
        <div class="k-deposit-new__tags">
          <a-input
            v-model:value="inputTagVal"
            placeholder="タグを入力してください"
            class="k-deposit-new__tags--input"
            @blur="handleInputTagConfirm"
            @keyup.enter="handleInputTagConfirm"
          />
          <div v-if="isShowTagList" class="k-deposit-new__tags--list">
            <a-tag v-for="tag in params.tags" :key="tag" closable @close="handleCloseTag(tag)">{{ tag }}</a-tag>
          </div>
        </div>
      </a-form-item>

      <a-form-item name="memo" label="メモ">
        <a-input v-model:value="params.memo" placeholder="入力してください" class="has-max-width" />
      </a-form-item>

      <a-form-item name="depositRepeatType" label="繰返し">
        <a-radio-group v-model:value="params.depositRepeatType">
          <a-radio :value="1">毎日</a-radio>
          <a-radio :value="2">毎週</a-radio>
          <a-radio :value="3">毎月</a-radio>
          <a-radio :value="4">毎年</a-radio>
          <a-radio :value="0">繰返し無し</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item v-if="params.depositRepeatType === 3" name="confirm">
        <a-checkbox v-model:checked="params.confirm">月末</a-checkbox>
      </a-form-item>

      <a-form-item
        v-if="params.depositRepeatType !== 0 && params.depositRepeatType !== null"
        name="repeatedExpiredDate"
        label="終了日"
      >
        <a-date-picker v-model:value="params.repeatedExpiredDate" placeholder="YYYY/MM/DD" />
      </a-form-item>

      <a-form-item name="confirmed" label="確定">
        <a-checkbox v-model:checked="params.confirmed">確定</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button type="default" size="large" @click="onCancelForm">キャンセル</a-button>
        <a-button type="primary" size="large" :loading="loading" @click="onSubmitForm">登録</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch, onMounted, computed } from 'vue'
import useDepositNewService from '../composables/useDepositNewService'
import ModalCompanyList from '../-components/ModalCompanyList'

export default defineComponent({
  name: 'DepositNewPage',

  components: {
    ModalCompanyList
  },

  setup() {
    const depositNewRef = ref()
    const loading = ref(false)
    const params = reactive({
      date: null,
      type: '',
      categoryId: undefined,
      // subcategoryId: undefined,
      subcategoryId: 1,
      purpose: '',
      statisticsMonth: null,
      groupId: undefined,
      withdrawalBankAccountId: undefined,
      depositBankAccountId: '',
      withdrawalMoney: 0,
      depositMoney: 0,
      tags: ['tags'],
      memo: '',
      numberOfDividedMonth: 0,
      repeated: 3,
      repeatedExpiredDate: null,
      repeatedOption: '12',
      repeatedInterval: 2,
      confirmed: true,
      createdBy: 1,
      updatedBy: 1
    })

    const categoryList = ref([])
    const subCategoryList = ref([])
    const bankAccountList = ref([])
    const groupList = ref([])

    // form validator rules
    const depositNewFormRules = {
      date: [{ required: true, message: 'Please select date', trigger: 'change', type: 'object' }],
      type: [{ required: true, message: 'Please select deposit type', trigger: 'change' }],
      categoryId: [{ required: true, message: 'Please input category', trigger: 'change', type: 'number' }],
      subcategoryId: [{ required: true, message: 'Please input sub category', trigger: 'change', type: 'number' }],
      purpose: [{ required: true, message: 'Please input deposit title', trigger: 'change' }],
      statisticsMonth: [{ required: true, message: 'Please select month', trigger: 'change', type: 'object' }],
      groupId: [{ required: true, message: 'Please select deposit group', trigger: 'change', type: 'number' }],
      withdrawalBankAccountId: [
        { required: true, message: 'Please input bank account', trigger: 'change', type: 'number' }
      ],
      tags: [{ required: true, message: 'Please input tag', trigger: 'blur', type: 'array' }],
      confirmed: [{ required: true, message: 'Please check confirm', trigger: 'change', type: 'boolean' }],
      repeatedExpiredDate: [{ required: true, message: 'Please select date', trigger: 'change', type: 'object' }]
    }

    onMounted(async () => {
      const { getCategoryList, getSubCategoryList, getBankAccountList, getGroupList } = useDepositNewService()

      const { result: categoryResult = [] } = await getCategoryList()
      categoryList.value = categoryResult

      const { result: subCategoryResult = [] } = await getSubCategoryList()
      subCategoryList.value = subCategoryResult

      const { result: bankAccountResult = [] } = await getBankAccountList()
      bankAccountList.value = bankAccountResult

      const { result: groupResult = [] } = await getGroupList()
      groupList.value = groupResult
    })

    // handle cancel form
    const onCancelForm = () => {
      depositNewRef.value.resetFields()
    }

    // handle validator when submit form
    const onSubmitForm = async () => {
      // try {
      const validateRes = await depositNewRef.value.validate()

      if (validateRes) {
        console.log('comfirm success', params)
      }
      // } catch (e) {
      //   throw e
      // }
    }

    // disabled form field
    const isCategoryDisabled = ref(false)
    const isAdvandceCurrency = ref(false)
    const isShowCaptionCurrency = ref(false)

    watch(
      () => params.type,
      () => {
        isCategoryDisabled.value = params.type === 'transfer' || params.type === 'unclear'
        isAdvandceCurrency.value = params.type === 'transfer'
        isShowCaptionCurrency.value = params.type === 'unclear'
      }
    )

    // tags
    const inputTagVal = ref('')
    const isShowTagList = computed(() => params.tags.length !== 0)
    const handleInputTagConfirm = () => {
      if (!inputTagVal.value) return
      params.tags = [...params.tags, inputTagVal.value]
      inputTagVal.value = ''
    }

    const handleCloseTag = (removedTag) => {
      params.tags = params.tags.filter((tag) => tag !== removedTag)
    }

    // modal sub category
    const openModalCompany = ref(false)
    const handleOpenModalCompany = () => {
      openModalCompany.value = true
    }

    return {
      depositNewRef,
      params,
      loading,
      depositNewFormRules,
      onSubmitForm,
      onCancelForm,
      isCategoryDisabled,
      isAdvandceCurrency,
      isShowCaptionCurrency,
      inputTagVal,
      handleInputTagConfirm,
      categoryList,
      subCategoryList,
      bankAccountList,
      groupList,
      isShowTagList,
      handleCloseTag,
      openModalCompany,
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

.k-deposit-new {
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
