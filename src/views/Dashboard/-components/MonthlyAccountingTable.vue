<template>
  <a-table
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataTable"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 1200 }"
    class="monthly-accounting"
  >
    <template #renderMonth="{ text, column, index }">
      <router-link
        v-if="index + 1 !== dataTable.length && groupIdCurrent"
        :to="{ name: 'deposit' }"
        :class="['monthly-accounting__link', index === 1 && 'text-color-red']"
        @click="handleSelectLink(column, index)"
      >
        {{ $filters.number_with_commas(text) }}
      </router-link>
      <span v-else :class="[(index === 1 || (index === 2 && text < 0)) && 'text-color-red']">
        {{ $filters.number_with_commas(text) }}
      </span>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { find } from 'lodash-es'
import moment from 'moment'

export default defineComponent({
  name: 'MonthlyAccountingTable',

  props: {
    isLoadingTable: Boolean,
    dataSource: Object,
    blockId: Number
  },

  setup(props) {
    const { t } = useI18n()
    const store = useStore()

    const localeTable = {
      emptyText: t('accounting.empty_text_table')
    }

    const columns = computed(() => {
      const headerList = [
        {
          title: '',
          dataIndex: 'type',
          key: 'type',
          align: 'center',
          ellipsis: true,
          fixed: 'left',
          width: 150
        }
      ]

      if (!props?.dataSource.length) return headerList

      const curentMonth = moment()
      const formatMonth = moment.locale() === 'ja' ? 'YYYY年MMMM' : 'YYYY MMMM'
      props.dataSource.forEach((item) => {
        const isCurrentMonth = moment(item?.month).isSame(curentMonth, 'month')

        headerList.push({
          title: `${moment(item?.month).format(formatMonth)}${isCurrentMonth ? '(当月)' : ''}`,
          dataIndex: item?.month,
          key: item?.month,
          align: 'right',
          ellipsis: true,
          width: 160,
          slots: { customRender: 'renderMonth' }
        })
      })
      return headerList
    })

    const dataTable = computed(() => {
      const rows = [
        {
          key: '1',
          type: '売上'
        },
        {
          key: '2',
          type: '支出'
        },
        {
          key: '3',
          type: '利益'
        }
      ]

      if (!props?.dataSource.length) return rows

      props.dataSource.forEach((item) => {
        rows[0][item.month] = item.revenue
        rows[1][item.month] = item.spending
        rows[2][item.month] = item.profit
      })

      return rows
    })

    const groupIdCurrent = computed(() => {
      const blockFound = find(store.state.dashboard.blocks, { id: props.blockId })
      return blockFound?.groupId
    })

    const handleSelectLink = (column, rowIndex) => {
      const data = {
        statisticsFrom: column?.dataIndex ? moment(column.dataIndex).startOf('month').format('YYYY-MM-DD') : null,
        statisticsTo: column?.dataIndex ? moment(column.dataIndex).endOf('month').format('YYYY-MM-DD') : null,
        type: rowIndex === 0 ? [10, 40] : [20, 40]
      }

      if (groupIdCurrent.value) data.groupId = groupIdCurrent.value

      store.commit('deposit/STORE_DEPOSIT_FILTER', { data })
    }

    return {
      columns,
      localeTable,
      dataTable,
      groupIdCurrent,
      handleSelectLink
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.monthly-accounting {
  &__link {
    &:hover {
      text-decoration: underline;
      color: inherit;
    }
  }

  .text-color-red {
    color: $color-additional-red-6;
  }

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

  .ant-table-placeholder {
    @include flexbox(center, center);
    height: 144px;
  }

  .ant-table-empty .ant-table-body {
    overflow-x: hidden !important;
  }
}
</style>
