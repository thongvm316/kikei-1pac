<template>
  <div class="u-mx-32">
    <div class="u-flex u-justify-end u-mt-24 u-mb-16">
      <a-button>
        <template #icon><span class="btn-icon"><line-down-icon /></span></template>
        CSVファイルダウンロード
      </a-button>

      <a-button type="primary" class="u-ml-12">
        <template #icon><span class="btn-icon"><line-add-icon /></span></template>
        新規入出金追加
      </a-button>
    </div>

    <div class="u-flex u-justify-between u-mb-24">
      <a-checkbox
        v-model:checked="checkAllRowTable"
        @change="onSelectAllRowsByCustomCheckbox"
        :indeterminate="indeterminateCheckAllRows">
        チェックした項目全てを確定する
      </a-checkbox>

      <a-select
        v-model:value="searchKeyMultipleSelect"
        show-arrow
        :maxTagCount="0"
        mode="multiple"
        placeholder="Select a bank"
        style="width: 200px"
        option-label-prop="label">
        <template #menuItemSelectedIcon>
          <a-checkbox :checked="true" />
        </template>

        <a-select-option v-for="option in bankAccountList" :key="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>

      <a-pagination
        v-model:current="currentPage"
        :total="101"
        :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
        :page-size="10"
        size="small" />
    </div>

    <a-tabs
      class="-mx-32"
      defaultActiveKey="1"
      :animated="false">
      <a-tab-pane key="1" tab="GumiVietNam">
        <deposit-table
          v-model:indeterminate-check-all-rows="indeterminateCheckAllRows"
          v-model:check-all-row-table="checkAllRowTable"
          v-model:current-selected-row-keys="currentSelectedRowKeys"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="VAND">
        <!-- test -->
        <deposit-table
          v-model:indeterminate-check-all-rows="indeterminateCheckAllRows"
          v-model:check-all-row-table="checkAllRowTable"
          v-model:current-selected-row-keys="currentSelectedRowKeys"
        />
      </a-tab-pane>
      <a-tab-pane key="3" tab="グループ名">
        <!-- test -->
        <deposit-table
          v-model:indeterminate-check-all-rows="indeterminateCheckAllRows"
          v-model:check-all-row-table="checkAllRowTable"
          v-model:current-selected-row-keys="currentSelectedRowKeys"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import { dataDeposit } from './data'
import DepositTable from './-components/DepositTable'

const bankAccountList = [
  {
    value: 'bank1',
    label: 'Bank 1'
  },
  {
    value: 'bank2',
    label: 'Bank 2'
  },
  {
    value: 'bank3',
    label: 'Bank 3'
  },
]

export default defineComponent({
  name: 'DepositPage',

  components: {
    LineDownIcon,
    LineAddIcon,
    DepositTable
  },

  setup() {
    const checkAllRowTable = ref()
    const indeterminateCheckAllRows = ref()
    const searchKeyMultipleSelect = ref([])
    const currentPage = ref(1)
    const currentSelectedRowKeys = ref([])

    const onSelectAllRowsByCustomCheckbox = (e) => {
      indeterminateCheckAllRows.value = false
      e.target.checked ? currentSelectedRowKeys.value = dataDeposit.map(item => item.key) : currentSelectedRowKeys.value = []
    }

    return {
      checkAllRowTable,
      searchKeyMultipleSelect,
      currentPage,
      indeterminateCheckAllRows,
      currentSelectedRowKeys,
      bankAccountList,

      onSelectAllRowsByCustomCheckbox
    }
  }
})
</script>

<style lang="scss">
.-mx-32 {
  margin: 0 -32px;
}
</style>
