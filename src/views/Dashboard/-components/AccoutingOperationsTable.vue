<template>
  <a-table
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataSource"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 1000 }"
    class="accounting-operations"
  >
    <template v-for="col in ['renderGumiVietnam', 'renderVand', 'renderVandCreative']" #[col]="{ text }" :key="col">
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
  name: 'AccountingOperationsTable',

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
        dataIndex: 'firstCol',
        key: 'firstCol',
        align: 'center',
        ellipsis: true,
        fixed: 'left',
        width: 200
      },
      {
        title: 'gumiVietnam',
        dataIndex: 'gumiVietnam',
        key: 'gumiVietnam',
        align: 'right',
        ellipsis: true,
        // width: 80,
        slots: { customRender: 'renderGumiVietnam' }
      },
      {
        title: 'vand',
        dataIndex: 'vand',
        key: 'vand',
        align: 'right',
        ellipsis: true,
        // width: 80,
        slots: { customRender: 'renderVand' }
      },
      {
        title: 'vandCreative',
        dataIndex: 'vandCreative',
        key: 'vandCreative',
        align: 'right',
        ellipsis: true,
        // width: 80,
        slots: { customRender: 'renderVandCreative' }
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

.accounting-operations {
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
