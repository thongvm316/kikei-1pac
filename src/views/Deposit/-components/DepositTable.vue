<template>
  <a-table
    class="deposit-table"
    :expanded-row-keys="expandedRowKeys"
    :loading="isLoadingDataTable"
    :scroll="{ x: 1200 }"
    :row-class-name="onAddRowClass"
    :custom-row="onCustomRow"
    :columns="columnsDeposit"
    :data-source="dataDeposit"
    :row-selection="{
      onChange: onSelectChangeRow,
      onSelectAll: onSelectAllChangeRows,
      selectedRowKeys: currentSelectedRowKeys,
      getCheckboxProps: (record) => {
        return { disabled: record.confirmed }
      }
    }"
    :pagination="false"
    :expand-icon-column-index="expandIconColumnIndex"
    :expand-icon-as-cell="false"
    :locale="localeTable"
    @expand="onClickExpandRowButton"
  >
    <template #dateTitle>
      <div class="u-flex u-items-center">
        <span class="u-mr-8">入出金日</span>
        <k-sort-caret @sort="sort($event, 'date')" />
      </div>
    </template>

    <template #statisticsMonthTitle>
      <div class="u-flex u-items-center">
        <span class="u-mr-8">計上月</span>
        <k-sort-caret @sort="sort($event, 'statistics_month')" />
      </div>
    </template>

    <template #renderDepositUpdatedAt="{ record }">{{ $filters.moment_l(record.date) }}</template>

    <template #renderDepositStatictis="{ record }">{{ $filters.moment_yyyy_mm(record.statisticsMonth) }}</template>

    <template #typeName="{ record }">
      <span
        :class="`type-${record.type} bank-${record.class} ${
          record.type === 40 && record.depositMoney > record.withdrawalMoney ? 'deposit' : 'withdraw'
        }`"
        >{{ $t(`deposit.deposit_list.${record.typeName}`) }}</span
      >
    </template>

    <template #deposit="{ record }">
      <span
        :class="`type-${record.type} bank-${record.class} ${
          record.type === 40 && record.depositMoney > record.withdrawalMoney ? 'deposit' : 'withdraw'
        }`"
        >{{ record.deposit === '-' ? '-' : $filters.number_with_commas(record.deposit, 2) }}</span
      >
    </template>

    <template #balance="{ record }">
      <span :class="record.balance < 0 ? 'type-20' : ''">
        {{ record.balance < 0 ? '-' : '' }}{{ $filters.number_with_commas(record.balance, 2) }}
      </span>
    </template>

    <template #action="{ record }">
      <a-button
        v-if="record.children"
        :disabled="record.confirmed"
        type="primary"
        @click="$emit('on-open-confirm-deposit-record-modal', [record.id])"
      >
        確定
      </a-button>
    </template>

    <template #customTitleDeposit> 入出金額<br />(JPY) </template>

    <template #customTitleBalance> 残高<br />(JPY) </template>
  </a-table>
</template>
<script>
import { defineComponent, ref } from 'vue'
import KSortCaret from '@/components/KSortCaret'

const columnsDeposit = [
  {
    dataIndex: 'date',
    key: 'date',
    align: 'left',
    slots: {
      customRender: 'renderDepositUpdatedAt',
      title: 'dateTitle'
    },
    ellipsis: true
  },
  {
    dataIndex: 'statisticsMonth',
    key: 'statisticsMonth',
    slots: {
      customRender: 'renderDepositStatictis',
      title: 'statisticsMonthTitle'
    },
    ellipsis: true
  },
  { title: '大分類', dataIndex: 'categoryName', key: 'categoryName', ellipsis: true },
  { title: '中分類', dataIndex: 'subcategoryName', key: 'subcategoryName', ellipsis: true },
  {
    title: '項目名',
    dataIndex: 'purpose',
    key: 'purpose',
    ellipsis: true,
    slots: { customRender: 'purpose' }
  },
  {
    title: '区分',
    dataIndex: 'typeName',
    key: 'typeName',
    align: 'center',
    slots: { customRender: 'typeName' },
    ellipsis: true
  },
  {
    dataIndex: 'deposit',
    key: 'deposit',
    align: 'right',
    slots: { title: 'customTitleDeposit', customRender: 'deposit' },
    ellipsis: true
  },
  {
    dataIndex: 'balance',
    key: 'balance',
    align: 'right',
    slots: { title: 'customTitleBalance', customRender: 'balance' },
    ellipsis: true
  },
  {
    title: '確定',
    dataIndex: 'action',
    key: 'action',
    slots: { customRender: 'action' },
    width: '136px',
    align: 'center',
    ellipsis: true
  }
]

export default defineComponent({
  name: 'DepositTable',

  components: {
    KSortCaret
  },

  props: {
    indeterminateCheckAllRows: Boolean,
    checkAllRowTable: Boolean,
    currentSelectedRowKeys: Array,
    dataDeposit: Array,
    isLoadingDataTable: Boolean,
    expandedRowKeys: Array,
    expandIconColumnIndex: Number,
    isVisibleDepositButtonsFloat: Boolean
  },

  setup(props, { emit }) {
    const currentRowClick = ref()

    const localeTable = {
      emptyText: '該当する入出金が見つかりませんでした。'
    }

    const onSelectChangeRow = (selectedRowKeys) => {
      emit(
        'update:indeterminateCheckAllRows',
        selectedRowKeys.length < props.dataDeposit.filter((item) => !item.confirmed).length
      )
      emit(
        'update:checkAllRowTable',
        selectedRowKeys.length === props.dataDeposit.filter((item) => !item.confirmed).length
      )
      emit('update:currentSelectedRowKeys', selectedRowKeys)
    }

    const onSelectAllChangeRows = (_, selectedRows) => {
      emit(
        'update:currentSelectedRowKeys',
        selectedRows.map((item) => item.key)
      )
    }

    const onCustomRow = (record) => {
      return {
        onClick: (event) => {
          if (event.target.type === 'button') return
          currentRowClick.value = record.key
          emit('on-open-deposit-buttons-float', record)
        }
      }
    }

    const onClickExpandRowButton = (expanded, record) => {
      if (expanded) {
        props.expandedRowKeys.push(record.key)
      } else {
        emit(
          'update:expandedRowKeys',
          props.expandedRowKeys.filter((item) => item !== record.key)
        )
      }
    }

    const onAddRowClass = (record) => {
      let classes = ''
      if (record.key === currentRowClick.value) classes += 'is-clicked-row'
      if (props.expandedRowKeys.includes(record.key)) classes += ' is-expand-row'

      return classes
    }

    const sort = (sortBy, field) => {
      emit('on-sort', { sortBy, field })
    }

    return {
      columnsDeposit,
      localeTable,

      onSelectChangeRow,
      onSelectAllChangeRows,
      onCustomRow,
      onClickExpandRowButton,
      onAddRowClass,
      sort
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.ant-table-wrapper.deposit-table {
  table thead .ant-checkbox-wrapper {
    display: none;
  }

  td {
    white-space: nowrap;
  }

  .ant-table-tbody > tr.ant-table-row-selected td {
    background-color: $color-grey-100 !important;
  }

  table tbody {
    .ant-table-row {
      cursor: pointer;
    }

    .is-expand-row td,
    .ant-table-row.ant-table-row-level-1 td {
      border-bottom: 0;
    }

    tr.is-clicked-row.ant-table-row-level-0 td {
      background-color: $color-primary-1 !important;
    }

    tr td:last-child {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;

      .ant-table-row-expand-icon {
        margin-right: 0;
        margin-left: 16px;
      }

      .ant-table-row-collapsed,
      .ant-table-row-expanded {
        @include flexbox(center, center);
        height: 24px;
        width: 24px;
        font-size: 14px;
      }
    }
  }

  .ant-table-row.is-expand-row.ant-table-row-level-0 {
    background-color: $color-grey-98;
  }

  .ant-table-row.ant-table-row-level-1:last-child td {
    border-bottom: 1px solid $color-grey-85 !important;
  }

  $columns: 11;
  @for $i from 1 through ($columns) {
    @if ($i < 10) {
      @if ($i > 5) {
        .ant-table-row.ant-table-row-level-1 td:nth-child(#{$i}) {
          border-bottom: 1px solid $color-grey-85;
        }
      } @else {
        .ant-table-row.ant-table-row-level-1:hover > td:nth-child(#{$i}) {
          background-color: $color-grey-100;
        }
      }
    } @else {
      .ant-table-row.ant-table-row-level-1 td:nth-child(#{$i}) {
        border-bottom: 0;
      }

      .ant-table-row.ant-table-row-level-1:hover > td:nth-child(#{$i}) {
        background-color: $color-grey-100;
      }
    }
  }

  $text-color-type: (
    10: $color-additional-blue-6,
    20: $color-additional-red-6,
    30: $color-grey-15
  );

  @each $key, $val in $text-color-type {
    .type-#{$key} {
      color: #{$val};
    }
  }

  .type-40 {
    &.deposit {
      color: $color-additional-blue-6;
    }

    &.withdraw {
      color: $color-additional-red-6;
    }
  }

  .bank-type_deposit_sales {
    color: $color-additional-blue-6;
  }

  .bank-type_deposit_payment {
    color: $color-additional-red-6;
  }

  .ant-table-placeholder {
    padding-top: 48px;
  }
}
</style>
