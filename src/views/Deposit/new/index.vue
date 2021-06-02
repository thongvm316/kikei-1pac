<template>
  <div class="k-deposit-new container">
    <a-form ref="depositNewRef" :model="params" :rules="depositNewFormRules" layout="vertical" @submit="onSubmitForm">
      <a-form-item name="depositDate" label="入出金日">
        <a-date-picker v-model:value="params.depositDate" placeholder="YYYY/MM/DD" />
      </a-form-item>

      <a-form-item name="depositType" label="入出金">
        <a-radio-group v-model:value="params.depositType">
          <a-radio value="deposit">入金</a-radio>
          <a-radio value="withdrawal">出金</a-radio>
          <a-radio value="transfer">移動</a-radio>
          <a-radio value="unclear">不明</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="category" label="大分類">
        <a-select
          v-model:value="params.category"
          placeholder="選択して下さい"
          :disabled="isCategoryDisabled"
          class="has-max-width"
        >
          <a-select-option value="category-1">Category 1</a-select-option>
          <a-select-option value="category-2">Category 2</a-select-option>
          <a-select-option value="category-3">Category 3</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="subCategory" label="大分類">
        <a-select
          v-model:value="params.subCategory"
          placeholder="選択して下さい"
          :disabled="isCategoryDisabled"
          class="has-max-width"
        >
          <a-select-option value="sub-category-1">Sub category 1</a-select-option>
          <a-select-option value="sub-category-2">Sub category 2</a-select-option>
          <a-select-option value="sub-category-3">Sub category 3</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="depositTitle" label="項目名">
        <a-input v-model:value="params.depositTitle" placeholder="入力してください" class="has-max-width" />
      </a-form-item>

      <a-form-item name="depositOfMonth" label="計上月">
        <a-month-picker v-model:value="params.depositOfMonth" placeholder="YYYY/MM" />
      </a-form-item>

      <a-form-item name="depositGroup" label="入出金グループ">
        <a-select v-model:value="params.depositGroup" placeholder="選択して下さい" class="has-max-width">
          <a-select-option value="depositGroup-1">depositGroup 1</a-select-option>
          <a-select-option value="depositGroup-2">depositGroup 2</a-select-option>
          <a-select-option value="depositGroup-3">depositGroup 3</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="bankAccount" label="銀行口座">
        <a-select v-model:value="params.bankAccount" placeholder="選択して下さい" class="has-max-width">
          <a-select-option value="bankAccount-1">bankAccount 1</a-select-option>
          <a-select-option value="bankAccount-2">bankAccount 2</a-select-option>
          <a-select-option value="bankAccount-3">bankAccount 3</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="currency" label="金額">
        <a-input v-model:value="params.currency" placeholder="入力してください" class="has-max-width" />
        <p v-if="isShowCaptionCurrency" class="k-deposit-new__field-cation">
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

      <a-form-item name="tag" label="タグ">
        <a-tag v-for="item in params.tags" :key="item" closable>{{ item }}</a-tag>
      </a-form-item>

      <a-form-item name="memo" label="メモ">
        <a-input v-model:value="params.memo" placeholder="入力してください" class="has-max-width" />
      </a-form-item>

      <a-form-item name="depositRepeatType" label="繰返し">
        <a-radio-group v-model:value="params.depositRepeatType">
          <a-radio value="day">毎日</a-radio>
          <a-radio value="week">毎週</a-radio>
          <a-radio value="month">毎月</a-radio>
          <a-radio value="year">毎年</a-radio>
          <a-radio value="none">繰返し無し</a-radio>
        </a-radio-group>

        <a-form-item v-if="params.depositRepeatType === 'none'" name="endDateRepeat" label="終了日">
          <a-date-picker v-model:value="params.endDateRepeat" placeholder="YYYY/MM/DD" />
        </a-form-item>
      </a-form-item>

      <a-form-item name="confirm" label="確定">
        <a-checkbox v-model:checked="params.confirm">確定</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button type="default" size="large" @click="onCancelForm">キャンセル</a-button>
        <a-button type="primary" size="large" :loading="loading" @click="onSubmitForm">登録</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'

export default defineComponent({
  name: 'DepositNewPage',

  setup() {
    const depositNewRef = ref()
    const loading = ref(false)
    const params = reactive({
      depositDate: null,
      depositType: '',
      category: undefined,
      subCategory: undefined,
      depositTitle: '',
      depositOfMonth: null,
      depositGroup: undefined,
      bankAccount: undefined,
      currency: 0,
      tags: ['tags'],
      memo: '',
      depositRepeatType: '',
      endDateRepeat: null,
      confirm: false
    })

    // form validator rules
    const depositNewFormRules = {
      depositDate: [{ required: true, message: 'Please select date', trigger: 'change' }],
      depositType: [{ required: true, message: 'Please select deposit type', trigger: 'change' }],
      category: [{ required: true, message: 'Please input category', trigger: 'change' }],
      subCategory: [{ required: true, message: 'Please input sub category', trigger: 'change' }],
      depositTitle: [{ required: true, message: 'Please input deposit title', trigger: 'change' }],
      depositOfMonth: [{ required: true, message: 'Please select month', trigger: 'change' }],
      depositGroup: [{ required: true, message: 'Please select deposit group', trigger: 'change' }],
      bankAccount: [{ required: true, message: 'Please input bank account', trigger: 'change' }],
      confirm: [{ required: true, message: 'Please select deposit type', trigger: 'change' }]
    }

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
      () => params.depositType,
      () => {
        console.log('watch type:::::')
        isCategoryDisabled.value = params.depositType === 'transfer' || params.depositType === 'unclear'
        isAdvandceCurrency.value = params.depositType === 'transfer'
        isShowCaptionCurrency.value = params.depositType === 'unclear'
      }
    )

    return {
      depositNewRef,
      params,
      loading,
      depositNewFormRules,
      onSubmitForm,
      onCancelForm,
      isCategoryDisabled,
      isAdvandceCurrency,
      isShowCaptionCurrency
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

$field-max-width: 300px;

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

  .has-max-width {
    max-width: $field-max-width;
  }

  .ant-form-item {
    margin-bottom: 16px;
    // max-width: 300px;
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
}
</style>
