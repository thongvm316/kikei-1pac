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
        option-label-prop="label"      >
        <template #maxTagPlaceholder>
          dsaas
        </template>
        <!-- <template #dropdownRender>
        <p>dsmnmkdsa</p>
        </template> -->
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="tom">Tom</a-select-option>
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
        <a-table
          :scroll="{ x: 1500 }"
          @expand="xxx"
          :customRow="customRow"
          :columns="columnsDeposit"
          :data-source="dataDeposit"
          :row-selection="{
            onChange: onSelectChangeRow,
            onSelectAll: onSelectAllChangeRows,
            selectedRowKeys: currentSelectedRowKeys
          }"
          :rowClassName="addRowClass"
          :pagination="false"
          :expand-icon-column-index="expandIconColumnIndex"
          :expand-icon-as-cell="false">
          <template #action="{ record }">
            <a-button v-if="record.children" :disabled="record.confirmed" type="primary">確定</a-button>
          </template>

          <template #customTitleDeposit>
            入出金額<br>(JPY)
          </template>

          <template #customTitleBalance>
            残高<br>(JPY)
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="VAND">Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="グループ名">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import { columnsDeposit, dataDeposit, expandIconColumnIndex } from './data'

export default defineComponent({
  name: 'DepositPage',

  components: {
    LineDownIcon,
    LineAddIcon
  },

  setup() {
    const checkAllRowTable = ref()
    const searchKeyMultipleSelect = ref([])
    const currentPage = ref(3)
    const currentSelectedRowKeys = ref([])
    const indeterminateCheckAllRows = ref()

    const onSelectChangeRow = (selectedRowKeys) => {
      indeterminateCheckAllRows.value = selectedRowKeys.length < dataDeposit.length && selectedRowKeys.length > 0
      checkAllRowTable.value = selectedRowKeys.length === dataDeposit.length
      currentSelectedRowKeys.value = selectedRowKeys
    }

    const onSelectAllChangeRows = (_, selectedRows) => currentSelectedRowKeys.value = selectedRows.map(item => item.key)

    const onSelectAllRowsByCustomCheckbox = (e) => {
      indeterminateCheckAllRows.value = false
      e.target.checked ? currentSelectedRowKeys.value = dataDeposit.map(item => item.key) : currentSelectedRowKeys.value = []
    }

    const customRow = (record) => {
      return {
        onClick: (event) => {
          console.log(event.target)
        }
      }
    }

    const abc = ref('')

    const xxx = (expanded, record) => {
      if (expanded) {
        abc.value = record.key
      } else {
        abc.value = ''
      }
    }

    const addRowClass = (record, index) => {
      return record.key === abc.value ? 'is-expand-row' : null
    }

    return {
      checkAllRowTable,
      searchKeyMultipleSelect,
      currentPage,
      dataDeposit,
      columnsDeposit,
      onSelectChangeRow,
      onSelectAllChangeRows,
      expandIconColumnIndex,
      onSelectAllRowsByCustomCheckbox,
      currentSelectedRowKeys,
      indeterminateCheckAllRows,
      customRow,
      xxx,
      addRowClass
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.-mx-32 {
  margin: 0 -32px;
}

table thead .ant-checkbox-wrapper {
  display: none;
}

table tbody {
  .is-expand-row td {
    border-bottom: 0;
  }
}

.ant-table-row.is-expand-row.ant-table-row-level-0 {
  background-color: $color-grey-98;
}
</style>
