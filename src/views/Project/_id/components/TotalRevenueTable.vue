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
    <template #customRenderType="{ text }"
      >{{ text }}
      <template v-if="finance?.type === PROJECT_TYPES[1].value">({{ totalRangeMonth }}ヶ月)</template></template
    >
    <template #customRenderRevenue="{ text }">
      {{ text !== null ? $filters.number_with_commas(text) + ' (JPY)' : '-' }}
    </template>
    <template #customRenderTotalProfit="{ text }">
      {{ text !== null ? $filters.number_with_commas(text) + ' (JPY)' : '-' }}
    </template>
    <template #customRenderProfitMargin="{ text }">
      {{ text !== null ? $filters.number_with_commas(text, 2) + '%' : '-' }}
    </template>
    <template #customRenderCost="{ text }">
      {{ text !== null ? $filters.number_with_commas(text) + ' (JPY)' : '-' }}
    </template>
    <template #customRenderExpenseRatio="{ text }">
      {{ text !== null ? $filters.number_with_commas(text, 2) + '%' : '-' }}
    </template>
  </a-table>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { uniqueId } from 'lodash-es'
import moment from 'moment'
import { PROJECT_TYPES } from '@/enums/project.enum'

export default defineComponent({
  name: 'TotalRevenueTable',

  props: {
    finance: {
      type: Object,
      default: undefined
    }
  },

  setup(props) {
    const isLoadingTable = ref(false)

    const localeTable = {
      emptyText: 'Empty data'
    }

    const totalRangeMonth = computed(() =>
      moment(props.finance?.statisticsToMonth).diff(moment(props.finance?.statisticsFromMonth), 'months', true)
    )

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
        slots: { customRender: 'customRenderProfitMargin' },
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
        slots: { customRender: 'customRenderExpenseRatio' },
        align: 'right'
      }
    ]

    const financeData = computed(() => props?.finance?.finance)

    const dataSource = computed(() => [
      {
        key: uniqueId('__row__'),
        type: '予測',
        revenue: financeData.value?.revenue?.estimate,
        totalProfit: financeData.value?.totalProfit?.estimate,
        profitRate: financeData.value?.profitRate?.estimate,
        cost: financeData.value?.cost?.estimate,
        costRate: financeData.value?.costRate?.estimate
      },
      {
        key: uniqueId('__row__'),
        type: '実績',
        revenue: financeData.value?.revenue?.invoice,
        totalProfit: financeData.value?.totalProfit?.invoice,
        profitRate: financeData.value?.profitRate?.invoice,
        cost: financeData.value?.cost?.invoice,
        costRate: financeData.value?.costRate?.invoice
      }
    ])

    return {
      isLoadingTable,
      totalRangeMonth,
      PROJECT_TYPES,

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
