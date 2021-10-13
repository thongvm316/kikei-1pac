<template>
  <a-table
    :class="'project-form-dashboard'"
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataSource"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 1400 }"
  >
    <template #customRenderRevenue="{ text }">
      {{ text !== null ? $filters.number_with_commas(text) + ' (VND)' : '-' }}
    </template>
    <template #customRenderTotalProfit="{ text }">
      {{ text !== null ? $filters.number_with_commas(text) + ' (VND)' : '-' }}
    </template>
    <template #customRenderProfitRate="{ text }">
      {{ text !== null ? $filters.number_with_commas(text, 2) + '%' : '-' }}
    </template>
    <template #customRenderCost="{ text }">
      {{ text !== null ? $filters.number_with_commas(text) + ' (VND)' : '-' }}
    </template>
    <template #customRenderCostRate="{ text }">
      {{ text !== null ? $filters.number_with_commas(text, 2) + '%' : '-' }}
    </template>
  </a-table>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { uniqueId } from 'lodash-es'

export default defineComponent({
  name: 'ProjectEditPage',

  setup() {
    const isLoadingTable = ref(false)

    const localeTable = {
      emptyText: 'Empty data'
    }

    const columns = [
      {
        title: '',
        dataIndex: 'type',
        key: 'type',
        fixed: 'left',
        slots: { customRender: 'customRenderType' },
        width: 120,
        align: 'center'
      },
      {
        title: '受注金額',
        dataIndex: 'revenue',
        key: 'revenue',
        slots: { customRender: 'customRenderRevenue' },
        align: 'right'
      },
      {
        title: '粗利益',
        dataIndex: 'totalProfit',
        key: 'totalProfit',
        slots: { customRender: 'customRenderTotalProfit' },
        align: 'right'
      },
      {
        title: '利益率',
        dataIndex: 'profitRate',
        key: 'profitRate',
        slots: { customRender: 'customRenderProfitRate' },
        align: 'right'
      },
      {
        title: '原価',
        dataIndex: 'cost',
        key: 'cost',
        slots: { customRender: 'customRenderCost' },
        align: 'right'
      },
      {
        title: '原価率',
        dataIndex: 'costRate',
        key: 'costRate',
        slots: { customRender: 'customRenderCostRate' },
        align: 'right'
      }
    ]

    const dataSource = [
      {
        key: uniqueId('__row__'),
        type: '予測',
        revenue: 1111111323343343,
        totalProfit: 1111111323343343,
        profitRate: 0,
        cost: 1111111323343343,
        costRate: 30.5678
      },
      {
        key: uniqueId('__row__'),
        type: '実績',
        revenue: 1111111323343343,
        totalProfit: null,
        profitRate: null,
        cost: 1111111323343343,
        costRate: 0
      }
    ]

    return {
      isLoadingTable,

      columns,
      dataSource,
      localeTable
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
// @import '@/styles/shared/mixins';

.project-form-dashboard {
  margin-top: 24px;

  .ant-table-placeholder {
    height: 96px;
    padding-top: 34px;
  }

  .ant-table-empty .ant-table-body {
    overflow-x: hidden !important;
  }

  .ant-table-fixed-left {
    border-top: 1px solid #bfbfbf;

    .ant-table-tbody {
      tr.ant-table-row {
        td.ant-table-row-cell-break-word {
          background-color: $color-grey-94;
          color: $color-primary-9;
        }
      }
    }
  }
}
</style>
