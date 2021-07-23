<template>
  <a-table
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataSource"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 1500 }"
  >
    <template
      v-for="col in ['renderS', 'renderA', 'renderB', 'renderC', 'renderD', 'renderE']"
      #[col]="{ text }"
      :key="col"
    >
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
  name: 'SalesTable',

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
        title: 'S（受注)',
        dataIndex: 'S',
        key: 'S',
        align: 'right',
        ellipsis: true,
        width: 110,
        slots: { customRender: 'renderS' }
      },
      {
        title: 'A（口頭受注)',
        dataIndex: 'A',
        key: 'A',
        align: 'right',
        ellipsis: true,
        width: 110,
        slots: { customRender: 'renderA' }
      },
      {
        title: 'B',
        dataIndex: 'B',
        key: 'B',
        align: 'right',
        ellipsis: true,
        width: 110,
        slots: { customRender: 'renderB' }
      },
      {
        title: 'C（金額次第)',
        dataIndex: 'C',
        key: 'C',
        align: 'right',
        ellipsis: true,
        width: 110,
        slots: { customRender: 'renderC' }
      },
      {
        title: 'D（とりあえず見積もり)',
        dataIndex: 'D',
        key: 'D',
        align: 'right',
        ellipsis: true,
        width: 110,
        slots: { customRender: 'renderD' }
      },
      {
        title: 'E（引合)',
        dataIndex: 'E',
        key: 'E',
        align: 'right',
        ellipsis: true,
        width: 110,
        slots: { customRender: 'renderE' }
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
// @import '@/styles/shared/variables';
// @import '@/styles/shared/mixins';
</style>
