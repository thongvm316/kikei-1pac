<template>
  <a-table
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataSource"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 1000 }"
    class="monthly-accounting"
  >
    <template #month="{ record, index, text, column }">
      <span>
        {{ $filters.number_with_commas(text) }}
      </span>
    </template>
  </a-table>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'MonthlyAccountingTable',

  props: {
    isLoadingTable: Boolean,
    dataSource: Object
  },

  setup() {
    const { t } = useI18n()

    const localeTable = {
      emptyText: t('accounting.empty_text_table')
    }

    const columns = [
      {
        title: '',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        ellipsis: true,
        fixed: 'left',
        width: 200
      },
      {
        title: '2021年4月',
        dataIndex: '202104',
        key: '202104',
        align: 'right',
        ellipsis: true,
        // width: 80,
        slots: { customRender: 'month' }
      },
      {
        title: '2021年5月',
        dataIndex: '202105',
        key: '202105',
        align: 'right',
        ellipsis: true,
        // width: 80,
        slots: { customRender: 'month' }
      },
      {
        title: '2021年6月',
        dataIndex: '202106',
        key: '202106',
        align: 'right',
        ellipsis: true,
        // width: 80,
        slots: { customRender: 'month' }
      },
      {
        title: '2021年7月',
        dataIndex: '202107',
        key: '202107',
        align: 'right',
        ellipsis: true,
        // width: 80,
        slots: { customRender: 'month' }
      }
    ]

    return {
      columns,
      localeTable
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.monthly-accounting {
  .ant-table-fixed-left {
    border-top: 1px solid #bfbfbf;

    .ant-table-row-cell-break-word:first-child {
      padding-left: 32px;
    }

    th.ant-table-row-cell-break-word:first-child {
      background-color: $color-grey-92;
      color: $color-grey-100;
      font-size: 16px;
    }

    .ant-table-tbody {
      tr.ant-table-row {
        td.ant-table-row-cell-break-word {
          background-color: $color-grey-96;
          color: $color-grey-15;
        }
      }
    }
  }
}
</style>
