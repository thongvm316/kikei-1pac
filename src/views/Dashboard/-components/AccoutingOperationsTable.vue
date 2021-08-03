<template>
  <a-table
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataRows"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 700 }"
    class="accounting-operations"
  >
    <template #renderGroup="{ text, column }">
      <router-link
        v-if="text > 0"
        :to="{ name: 'deposit' }"
        class="accounting-operations__link"
        @click="handleSelectPendingDeposits(column)"
      >
        {{ `${$filters.number_with_commas(text)} 件` }}
      </router-link>
      <span v-else>
        {{ `${$filters.number_with_commas(text)} 件` }}
      </span>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { find } from 'lodash-es'

export default defineComponent({
  name: 'AccountingOperationsTable',

  props: {
    isLoadingTable: Boolean,
    dataSource: Object
  },

  setup(props) {
    const { t } = useI18n()
    const store = useStore()

    const localeTable = {
      emptyText: t('accounting.empty_text_table')
    }

    const columns = computed(() => {
      let headerList = [
        {
          title: '',
          dataIndex: 'firstCol',
          key: 'firstCol',
          align: 'center',
          ellipsis: true,
          fixed: 'left',
          width: 200
        }
      ]

      ;(props?.dataSource?.pendingDeposits || []).map((item) => {
        headerList.push({
          title: item?.groupName,
          dataIndex: item?.groupName,
          key: item?.groupId,
          align: 'right',
          ellipsis: true,
          slots: { customRender: 'renderGroup' }
        })
      })

      return headerList
    })

    const dataRows = computed(() => {
      const row = {
        key: '1',
        firstCol: '本日未確定'
      }

      ;(props?.dataSource?.pendingDeposits || []).map((item) => {
        row[item?.groupName] = item?.pendingDepositsCount || 0
      })

      return [row]
    })

    const handleSelectPendingDeposits = (column) => {
      const groupFound = find(props?.dataSource?.pendingDeposits || [], { groupName: column.dataIndex })

      const data = {
        groupId: groupFound?.groupId,
        confirmed: [false],
        fromDate: props?.dataSource?.fromDate || null,
        toDate: props?.dataSource?.toDate || null
      }

      store.commit('deposit/STORE_DEPOSIT_FILTER', { data })
    }

    return {
      columns,
      localeTable,
      dataRows,
      handleSelectPendingDeposits
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.accounting-operations {
  &__link {
    color: $color-additional-red-6;

    &:hover {
      text-decoration: underline;
      color: $color-additional-red-6;
    }
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
          color: $color-primary-9;
          font-weight: 700;
        }
      }
    }
  }

  .ant-table-placeholder {
    @include flexbox(center, center);
    height: 48px;
  }

  .ant-table-empty .ant-table-body {
    overflow-x: hidden !important;
  }

  .ant-table-body {
    overflow: auto !important;
  }

  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td:not(:first-child) {
    background: $color-grey-100;
  }
}
</style>
