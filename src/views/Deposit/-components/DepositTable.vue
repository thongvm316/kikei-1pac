<template>
  <a-table
    :class="['deposit-table', isTableModal && 'is-table-modal', isRecoverModal && 'is-recover-modal']"
    :loading="isLoadingDataTable"
    :scroll="{ x: 1200, y: isTableModal ? height - 400 : height - 295 }"
    :row-class-name="onAddRowClass"
    :custom-row="onCustomRow"
    :columns="columnsDeposit"
    :data-source="dataDeposit"
    :row-selection="
      isTableModal && typeModifyDepositRoot === TYPE_MODIFY_DEPOSIT_ROOT['EDIT']
        ? null
        : {
            onChange: onSelectChangeRow,
            onSelectAll: onSelectAllChangeRows,
            selectedRowKeys: currentSelectedRowKeys,
            getCheckboxProps: (record) => ({ disabled: record.confirmed }),
            order: 3
          }
    "
    :pagination="false"
    :expand-icon-as-cell="false"
    :locale="localeTable"
    @change="changeDepositTable"
  >
    <template #renderProjectRead="{ text: read }">
      <div class="column-read">
        <p class="point-status" :style="{ backgroundColor: tagsAction(read).backgroundColor }"></p>
      </div>
    </template>

    <template #renderDepositUpdatedAt="{ record }">{{ $filters.moment_l(record.date) }}</template>

    <template #renderDepositStatictis="{ record }">{{ $filters.moment_yyyy_mm(record.statisticsMonth) }}</template>

    <template #renderCategoryName="{ record }">
      <a-tooltip color="#fff" :title="record.categoryName">
        {{ record.categoryName }}
      </a-tooltip>
    </template>

    <template #renderSubcategoryName="{ record }">
      <a-tooltip color="#fff" :title="record.subcategoryName" placement="topLeft">
        {{ record.subcategoryName }}
      </a-tooltip>
    </template>

    <template #typeName="{ record }">
      <span
        :class="`${record.colorClass} type-${record.type} ${
          record.type === 40 && record.depositMoney > record.withdrawalMoney ? 'deposit' : 'withdraw'
        }`"
      >
        {{ $t(`deposit.deposit_list.${record.typeName}`) }}
      </span>
    </template>

    <template #deposit="{ record }">
      <span
        :class="`${record.colorClass} type-${record.type} ${
          record.type === 40 && record.depositMoney > record.withdrawalMoney ? 'deposit' : 'withdraw'
        }`"
      >
        {{ record.deposit === '-' ? '-' : $filters.number_with_commas(record.deposit) }}
      </span>
    </template>

    <template #balance="{ record }">
      <span :class="record.balance < 0 ? 'type-20' : ''">
        {{ $filters.number_with_commas(record.balance) }}
      </span>
    </template>

    <template #confirmed="{ record }">
      <a-button v-if="record.confirmed && isAdmin" type="danger" @click="$emit('handle-open-unconfirm-modal', record)">
        取消
      </a-button>
      <a-button v-else :disabled="record.confirmed" type="primary" @click="handleConfirmedRow(record)"> 確定 </a-button>
    </template>

    <template #purpose="{ record }">
      <div v-if="record.adProject?.code">
        <p class="u-mb-8 text-grey-55">{{ record.adProject?.code }}</p>
        <p class="mb-0 font-bold u-whitespace-normal">{{ record.adProject?.name }}</p>
      </div>

      <p v-else class="mb-0 u-whitespace-normal">{{ record.purpose }}</p>
    </template>

    <template #customTitleDeposit
      ><span>入出金額<br />({{ currencyCodeText }})</span></template
    >

    <template #customTitleBalance> 残高<br />({{ currencyCodeText }}) </template>
  </a-table>
</template>

<script>
import { defineComponent, onBeforeMount, ref, onUnmounted, computed } from 'vue'
import humps from 'humps'
import { useStore } from 'vuex'
import { toOrderBy } from '@/helpers/table'
import { TYPE_MODIFY_DEPOSIT_ROOT } from '@/enums/deposit.enum'
import useGetRecordRead from '@/views/Deposit/composables/useGetRecordRead'

export default defineComponent({
  name: 'DepositTable',

  props: {
    indeterminateCheckAllRows: Boolean,
    checkAllRowTable: Boolean,
    currentSelectedRowKeys: Array,
    dataDeposit: Array,
    isLoadingDataTable: Boolean,
    isVisibleModalActionBar: Boolean,
    isDeleteRootAll: Boolean,
    isTableModal: {
      type: Boolean,
      default: false
    },
    isRecoverModal: {
      type: Boolean,
      default: false
    },
    typeModifyDepositRoot: {
      type: String,
      default: undefined
    },
    currentSelectedRecordId: {
      type: Number,
      required: false
    }
  },

  setup(props, { emit }) {
    const store = useStore()

    const currentRowClick = ref()
    const height = ref(0)
    const isAdmin = store.state.auth?.authProfile?.isAdmin || false

    const localeTable = {
      emptyText: '該当する入出金が見つかりませんでした。'
    }

    const columnNotShowList = ['confirmed']

    const columnsDeposit = [
      {
        dataIndex: 'read',
        key: 'read',
        slots: {
          customRender: 'renderProjectRead'
        },
        width: 32
      },
      {
        title: '入出金日',
        dataIndex: 'date',
        key: 'date',
        align: 'left',
        slots: {
          customRender: 'renderDepositUpdatedAt'
        },
        ellipsis: true,
        sorter: true,
        width: 110
      },
      {
        title: '計上月',
        dataIndex: 'statisticsMonth',
        key: 'statisticsMonth',
        slots: {
          customRender: 'renderDepositStatictis'
        },
        ellipsis: true,
        sorter: true,
        width: 90
      },
      {
        title: '大分類',
        dataIndex: 'categoryName',
        key: 'categoryName',
        ellipsis: true,
        width: 150,
        slots: {
          customRender: 'renderCategoryName'
        }
      },
      {
        title: '中分類',
        dataIndex: 'subcategoryName',
        key: 'subcategoryName',
        ellipsis: true,
        width: 150,
        slots: {
          customRender: 'renderSubcategoryName'
        }
      },
      {
        title: '項目名',
        dataIndex: 'purpose',
        key: 'purpose',
        ellipsis: true,
        slots: { customRender: 'purpose' },
        width: 350
      },
      {
        title: '区分',
        dataIndex: 'typeName',
        key: 'typeName',
        align: 'center',
        slots: { customRender: 'typeName' },
        ellipsis: true,
        width: 70
      },
      {
        dataIndex: 'deposit',
        key: 'deposit',
        align: 'right',
        slots: { title: 'customTitleDeposit', customRender: 'deposit' },
        ellipsis: true,
        width: 150
      },
      {
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        slots: { title: 'customTitleBalance', customRender: 'balance' },
        width: 170
      },
      {
        title: '確定',
        dataIndex: 'confirmed',
        key: 'confirmed',
        slots: { customRender: 'confirmed' },
        width: '136px',
        align: 'center',
        sorter: true,
        ellipsis: true
      }
    ].filter((col) => {
      if (!props.isTableModal) return true
      if (props.isRecoverModal) columnNotShowList.push('read')
      return columnNotShowList.indexOf(col.dataIndex) === -1
    })

    const currencyCodeText = computed(() => (props?.dataDeposit[0] ? props?.dataDeposit[0]?.currency : ''))

    const onSelectChangeRow = (selectedRowKeys) => {
      if (
        selectedRowKeys.length < props.dataDeposit.filter((item) => !item.confirmed).length &&
        selectedRowKeys.length > 0
      ) {
        emit('update:indeterminateCheckAllRows', true)
      } else {
        emit('update:indeterminateCheckAllRows', false)
      }

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

      // use for delete root
      emit('update:isDeleteRootAll', selectedRows.length > 0)
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

    const onAddRowClass = (record) => {
      let classes = ''
      if (!props.isTableModal) {
        if (record.key === currentRowClick.value && props.isVisibleModalActionBar) classes += 'is-clicked-row'
      } else {
        if (record.key === props.currentSelectedRecordId) classes += 'is-clicked-row'
      }
      return classes
    }

    const changeDepositTable = (pagination, filters, sorter) => {
      const emitData = {
        orderBy: toOrderBy(sorter.order),
        field: humps.decamelize(sorter.field)
      }

      emit('on-sort', emitData)
    }

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const tagsAction = (status) => {
      if (!status) {
        return { backgroundColor: '#F5222D' }
      } else {
        return { backgroundColor: 'transparent' }
      }
    }

    const checkRead = async (evt) => {
      const { getRecordRead } = useGetRecordRead(evt.id)
      await getRecordRead()
      evt.read = true
    }

    const handleConfirmedRow = async (record) => {
      if (!record.read) checkRead(record)

      emit('on-open-confirm-deposit-record-modal', record)
    }

    onBeforeMount(() => {
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getInnerHeight)
    })

    return {
      isAdmin,
      columnsDeposit,
      localeTable,
      height,
      currencyCodeText,
      TYPE_MODIFY_DEPOSIT_ROOT,

      handleConfirmedRow,
      tagsAction,
      onSelectChangeRow,
      onSelectAllChangeRows,
      onCustomRow,
      onAddRowClass,
      changeDepositTable
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.deposit-table {
  .column-read {
    width: 12px;
    height: 12px;

    .point-status {
      width: 12px;
      height: 12px;
      margin: 0;
      border-radius: 50%;
      background-color: red;
    }

    .text-status {
      margin-bottom: 0;
    }
  }
}

.ant-table-wrapper.deposit-table {
  .ant-table-column-sorters {
    display: flex !important;

    .ant-table-column-sorter {
      margin-top: 2px;
    }
  }

  table thead .ant-checkbox-wrapper {
    display: none;
  }

  &.is-table-modal table thead .ant-checkbox-wrapper {
    display: block;
  }

  &.is-table-modal.is-recover-modal thead .ant-checkbox-wrapper {
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
      position: relative;

      .ant-table-row-expand-icon {
        @include y-centered;
        right: 0;
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

  .red {
    color: $color-additional-red-6 !important;
  }

  .blue {
    color: $color-additional-blue-6 !important;
  }

  .ant-table-placeholder {
    padding-top: 48px;
  }
}

.ant-table-wrapper.deposit-table.is-table-modal {
  .ant-table-placeholder {
    height: calc(100vh - 500px);
  }
}
</style>
