<template>
  <a-table
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataTable"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 1000 }"
    class="sales-table"
  >
    <template #renderAccuracy="{ text, column, record, index }">
      <span v-if="index === 1 && column.dataIndex === 'S'">累積売上</span>
      <router-link v-else :to="{ name: 'project' }" class="sales-table__link" @click="handleClickLink(column, record)">
        {{ $filters.number_with_commas(text) }}
      </router-link>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { find } from 'lodash-es'

export default defineComponent({
  name: 'SalesTable',

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
      if (!props?.dataSource?.statistics?.length) return []

      const headerList = props.dataSource.statistics.map((accuracy) => ({
        title: `${accuracy.accuracyCode} (${accuracy.accuracyName})`,
        dataIndex: accuracy.accuracyCode,
        key: accuracy.accuracyId,
        align: 'right',
        ellipsis: true,
        width: 90,
        slots: { customRender: 'renderAccuracy' }
      }))
      return headerList
    })

    const dataTable = computed(() => {
      if (!props?.dataSource?.statistics?.length) return []

      let rows = [
        {
          key: 1
        },
        {
          key: 2
        }
      ]

      const accuracyIdAccumulated = []
      props.dataSource.statistics.forEach((accuracy) => {
        accuracyIdAccumulated.push(accuracy.accuracyId)

        rows[0][accuracy.accuracyCode] = accuracy.revenue
        rows[0][`${accuracy.accuracyCode}Id`] = [accuracy.accuracyId]
        rows[1][accuracy.accuracyCode] = accuracy.accumulate
        rows[1][`${accuracy.accuracyCode}Id`] = [...accuracyIdAccumulated]
      })

      return rows
    })

    const handleClickLink = (column, record) => {
      const data = {
        accuracyId: record[`${column.dataIndex}Id`],
        statisticsFrom: props.dataSource?.fromDate || null,
        statisticsTo: props.dataSource?.toDate || null,
        statusCode: []
      }

      const blockFound = find(store.state.dashboard.blocks, { id: props.blockId })
      if (blockFound?.groupId) data.groupId = [blockFound.groupId]
      store.commit('project/STORE_PROJECT_FILTER', { data })
    }

    return {
      columns,
      localeTable,
      dataTable,
      handleClickLink
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.sales-table {
  &__link {
    &:hover {
      text-decoration: underline;
      color: $color-grey-15;
    }
  }

  .ant-table-placeholder {
    @include flexbox(center, center);
    height: 96px;
  }

  .ant-table-empty .ant-table-body {
    overflow-x: hidden !important;
  }
}
</style>
