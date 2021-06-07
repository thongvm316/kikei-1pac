<template>
  <section class="financing">
    <Search @filter-changed="onFilterChange($event)" />

    <a-button class="btn-download" @click="downloadCSV">
      <DownloadIcon class="btn-download-icon" />
      CSVファイルダウンロード
    </a-button>

    <!--    <div class="box-utilities">-->
    <!--      <Pagination />-->
    <!--    </div>-->

    <div class="list-table">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="{ ...pagination, showTotal: showTotal }"
        :loading="isLoading"
        size="middle"
        @change="handleChange"
      >
        <!--        <template #acb_jp="{ text: acb_jp }">-->
        <!--          <span :class="parseInt(acb_jp) < 0 ? 'text&#45;&#45;red' : ''" @click="showNumberCell(acb_jp)">-->
        <!--            {{ acb_jp }}-->
        <!--          </span>-->
        <!--        </template>-->
        <!--        <template #acb_vn_1="{ text: acb_vn_1 }">-->
        <!--          <span :class="parseInt(acb_vn_1) < 0 ? 'text&#45;&#45;red' : ''">-->
        <!--            {{ acb_vn_1 }}-->
        <!--          </span>-->
        <!--        </template>-->
        <!--        <template #acb_vn_2="{ text: acb_vn_2 }">-->
        <!--          <span :class="parseInt(acb_vn_2) < 0 ? 'text&#45;&#45;red' : ''">-->
        <!--            {{ acb_vn_2 }}-->
        <!--          </span>-->
        <!--        </template>-->
        <template #bank_account_name="{ text: bank_account_name }">
          <span :class="parseInt(bank_account_name.balance) < 0 ? 'text--red' : ''">
            {{ bank_account_name.balance }}
          </span>
        </template>
      </a-table>
    </div>
  </section>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useGetFinancingListService from '@/views/Financing/composables/useGetFinancingListService'
import { convertPagination } from '@/helpers/convert-pagination'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'

import Table from '@/mixins/table.mixin'
import Search from '@/views/Financing/Search'
import DownloadIcon from '@/assets/icons/ico_line-down.svg'

// const columns = [
//   { title: '日付', dataIndex: 'date', key: 'date', sorter: true },
//   { title: 'ACB-JP', dataIndex: 'acb_jp', key: 'acb_jp', slots: { customRender: 'acb_jp' } },
//   { title: 'ACB-VN', dataIndex: 'acb_vn_1', key: 'acb_vn_1', slots: { customRender: 'acb_vn_1' } },
//   { title: 'ACB-VN', dataIndex: 'acb_vn_2', key: 'acb_vn_2', slots: { customRender: 'acb_vn_1' } },
//   { title: 'ACB-VN', dataIndex: 'acb_vn_3', key: 'acb_vn_3', slots: { customRender: 'acb_vn_1' } },
//   { title: '合計', dataIndex: 'total', key: 'total' }
// ]
//
// const data = []
// for (let i = 0; i < 30; i++) {
//   data.push({
//     key: i,
//     date: '20/12/2021',
//     acb_jp: `${new Intl.NumberFormat('vi-VN', {
//       minimumFractionDigits: 2,
//       style: 'currency',
//       currency: 'VND',
//       currencyDisplay: 'symbol'
//     }).format(Math.random() * 99996999 * (Math.round(Math.random()) ? 1 : -1))}`,
//     acb_vn_1: `${new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//       minimumFractionDigits: 2
//     }).format(Math.random() * 999933999 * (Math.round(Math.random()) ? 1 : -1))}`,
//     acb_vn_2: `${new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//       minimumFractionDigits: 2
//     }).format(Math.random() * 99699999 * (Math.round(Math.random()) ? 1 : -1))}`,
//     acb_vn_3: `${new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//       minimumFractionDigits: 2
//     }).format(Math.random() * 999955599 * (Math.round(Math.random()) ? 1 : -1))}`,
//     total: `${new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//       minimumFractionDigits: 2
//     }).format(Math.random() * 999999999 * (Math.round(Math.random()) ? 1 : 1))}`
//   })
// }

export default defineComponent({
  name: 'Index',

  components: { Search, DownloadIcon },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getLists } = useGetFinancingListService(
      { pageNumber: 1, pageSize: 30 },
      { group_id: 1, period_id: null, from_date: '2021-04-02', to_date: '2021-06-01', show_by: 1 }
    )
    const { result } = await getLists()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    next()
  },

  setup() {
    const route = useRoute()
    const { t } = useI18n()

    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)

    const columns = ref([
      { title: t('financing.date'), dataIndex: 'date', key: 'date', sorter: true },
      { title: 'Bank 1', dataIndex: 'balance_1', key: 'balance_1' },
      { title: 'Bank 2', dataIndex: 'balance_2', key: 'balance_2' },
      { title: 'Bank 3', dataIndex: 'balance_3', key: 'balance_3' },
      { title: 'Total', dataIndex: 'balance', key: 'balance' }
    ])

    // const dataSource = [
    //   {
    //     date: '2021-05-18T00:00:00Z',
    //     total: 10000,
    //     balance_1: 100000,
    //     balance_2: 110000,
    //     balance_3: 23243265
    //   },
    //
    //   {
    //     date: '2021-05-18T00:00:00Z',
    //     total: 10000,
    //     balance_1: 100000,
    //     balance_2: 110000,
    //     balance_3: 23243265
    //   }
    // ]

    onMounted(async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      filter.value = [...route.meta['lists']]
      console.log(filter)

      dataSource.value = [...route.meta['list']]
      pagination.value = { ...route.meta['pagination'] }
    })

    const handleChange = async (pagination) => {
      const params = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize
      }
      await fetchList(params)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      await fetchList({ pageNumber: 1, pageSize: 30 }, filter.value)
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true

      try {
        const { getLists } = useGetFinancingListService({ ...params }, data)
        const { result } = await getLists()
        dataSource.value = [...result.data]
        pagination.value = convertPagination(result.meta)
        isLoading.value = false
      } catch (e) {
        isLoading.value = false
      }
    }

    const downloadCSV = async () => {
      console.log('download')
    }
    return {
      dataSource,
      columns,
      pagination,
      isLoading,
      t,
      handleChange,
      onFilterChange,
      fetchList,
      downloadCSV
    }
  }
})
</script>
<style scoped lang="scss"></style>
