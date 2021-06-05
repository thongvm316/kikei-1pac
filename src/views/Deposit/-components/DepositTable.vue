<template>
  <a-table
    class="deposit-table"
    :expanded-row-keys="expandedRowKeys"
    :loading="isLoadingDataTable"
    :scroll="{ x: 1500 }"
    @expand="onClickExpandRowButton"
    :rowClassName="onAddRowClass"
    :onCustomRow="onCustomRow"
    :columns="columnsDeposit"
    :data-source="dataDeposit"
    :row-selection="{
      onChange: onSelectChangeRow,
      onSelectAll: onSelectAllChangeRows,
      selectedRowKeys: currentSelectedRowKeys,
      getCheckboxProps: (record) => ({ disabled: record.confirmed })
    }"

    :pagination="false"
    :expand-icon-column-index="expandIconColumnIndex"
    :expand-icon-as-cell="false">
    <template #typeName="{ record }">
      <span :class="`type-${record.type}`">{{ record.typeName }}</span>
    </template>

    <template #deposit="{ record }">
      <span :class="`type-${record.type}`">{{ record.deposit }}</span>
    </template>

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
import { columnsDeposit, expandIconColumnIndex } from '../data'

export default defineComponent({
  name: 'DepositTable',

  props: {
    indeterminateCheckAllRows: Boolean,
    checkAllRowTable: Boolean,
    currentSelectedRowKeys: Array,
    dataDeposit: Array,
    isLoadingDataTable: Boolean,
    expandedRowKeys: Array
  },

  setup(props, { emit }) {
    const onSelectChangeRow = (selectedRowKeys) => {
      emit('update:indeterminateCheckAllRows', selectedRowKeys.length < props.dataDeposit.filter(item => !item.confirmed).length)
      emit('update:checkAllRowTable', selectedRowKeys.length === props.dataDeposit.filter(item => !item.confirmed).length)
      emit('update:currentSelectedRowKeys', selectedRowKeys)
    }

    const onSelectAllChangeRows = (_, selectedRows) => {
      emit('update:currentSelectedRowKeys', selectedRows.map(item => item.key))
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
        props.expandedRowKeys.push(record.key)
      } else {
        emit('update:expandedRowKeys', props.expandedRowKeys.filter(item => item !== record.key))
      }
    }

    const onAddRowClass = (record) => props.expandedRowKeys.includes(record.key) ? 'is-expand-row' : null

    return {
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

.ant-table-wrapper.deposit-table {
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

  $text-color-type: (
    10: $color-additional-blue-6,
    20: $color-additional-red-6,
    30: $color-grey-15,
    40: $color-grey-15
  );

  @each $key, $val in $text-color-type {
    .type-#{$key} {
      color: #{$val};
    }
  }
}
</style>
