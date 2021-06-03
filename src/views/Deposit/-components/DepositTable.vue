<template>
  <a-table
    :scroll="{ x: 1500 }"
    @expand="onClickExpandRowButton"
    :onCustomRow="onCustomRow"
    :columns="columnsDeposit"
    :data-source="dataDeposit"
    :row-selection="{
      onChange: onSelectChangeRow,
      onSelectAll: onSelectAllChangeRows,
      selectedRowKeys: currentSelectedRowKeys
    }"
    :rowClassName="onAddRowClass"
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
</template>

<script>
import { defineComponent, ref } from 'vue'
import { columnsDeposit, dataDeposit, expandIconColumnIndex } from '../data'

export default defineComponent({
  name: 'DepositTable',

  props: {
    indeterminateCheckAllRows: Boolean,
    checkAllRowTable: Boolean,
    currentSelectedRowKeys: Array
  },

  setup(_, context) {
    const currentExpandedRows = ref([])

    const onSelectChangeRow = (selectedRowKeys) => {
      context.emit('update:indeterminateCheckAllRows', selectedRowKeys.length < dataDeposit.length && selectedRowKeys.length > 0)
      context.emit('update:checkAllRowTable', selectedRowKeys.length === dataDeposit.length)
      context.emit('update:currentSelectedRowKeys', selectedRowKeys)
    }

    const onSelectAllChangeRows = (_, selectedRows) => {
      context.emit('update:currentSelectedRowKeys', selectedRows.map(item => item.key))
    }

    const onCustomRow = (record) => {
      return {
        onClick: (event) => {
          console.log(event.target)
        }
      }
    }

    const onClickExpandRowButton = (expanded, record) => {
      if (expanded) {
        currentExpandedRows.value.push(record.key)
      } else {
        currentExpandedRows.value = currentExpandedRows.value.filter(item => item !== record.key)
      }
    }

    const onAddRowClass = (record) => currentExpandedRows.value.includes(record.key) ? 'is-expand-row' : null

    return {
      dataDeposit,
      columnsDeposit,
      expandIconColumnIndex,

      onSelectChangeRow,
      onSelectAllChangeRows,
      onCustomRow,
      onClickExpandRowButton,
      onAddRowClass
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

table thead .ant-checkbox-wrapper {
  display: none;
}

table tbody {
  .ant-table-row {
    cursor: pointer;
  }

  .is-expand-row td {
    border-bottom: 0;
  }
}

.ant-table-row.is-expand-row.ant-table-row-level-0 {
  background-color: $color-grey-98;
}

.ant-table-row.is-expand-row.ant-table-row-level-1:last-child td {
  border-bottom: 1px solid $color-grey-85 !important;
}

$columns: 11;
@for $i from 1 through ($columns) {
  @if ($i < 10) {
    @if ($i > 5) {
      .ant-table-row.is-expand-row.ant-table-row-level-1 td:nth-child(#{$i}) {
        border-bottom: 1px solid $color-grey-85;
      }
    }
  } @else {
    .ant-table-row.is-expand-row.ant-table-row-level-1 td:nth-child(#{$i}) {
      border-bottom: 0;
    }
  }
}
</style>
