<template>
  <section class="financing">
    <Search @filter-changed="onFilterChange" />

    <a-button class="btn-download" @click="exportFinancingAsCsvFile">
      <DownloadIcon class="btn-download-icon" />
      {{ $t('financing.download_csv') }}
    </a-button>

    <div class="list-table">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="{ ...pagination, showTotal: showTotal }"
        :loading="isLoading"
        size="middle"
        :scroll="{ y: height - 330 }"
        @change="handleChange"
      >
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
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import useGetFinancingListService from '@/views/Financing/composables/useGetFinancingListService'
import { convertPagination } from '@/helpers/convert-pagination'
import { exportCSVFile } from '@/helpers/export-csv-file'

import Table from '@/mixins/table.mixin'
import Search from '@/views/Financing/Search'
import DownloadIcon from '@/assets/icons/ico_line-down.svg'
import useGetGroupListService from '@/views/Financing/composables/useGetGroupListService'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'

export default defineComponent({
  name: 'Index',

  components: { Search, DownloadIcon },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getGroups } = useGetGroupListService()
    const { result } = await getGroups()
    to.meta['lists'] = result.data
    next()
  },

  setup() {
    const { t } = useI18n()

    const dataSource = ref([])
    const columns = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const height = ref(0)

    let dataTableRow = ref({})
    let initialListColumns = ref({})

    const initialDataTableColumn = ref([
      { title: t('financing.date'), dataIndex: 'date', key: 'date', sorter: (a, b) => a.date - b.date },
      { title: t('financing.balance'), dataIndex: 'balance', key: 'balance' }
    ])

    const initialStateFilter = {
      group_id: null,
      period_id: null,
      from_date: '',
      to_date: '',
      show_by: 0
    }
    const paramsFilter = reactive({ ...initialStateFilter })

    const initialExportCSV = {
      header: [],
      fileTitle: 'financing',
      labels: [],
      items: []
    }

    const exportData = reactive({ ...initialExportCSV })

    onMounted(async () => {
      // dataSource.value = [...route.meta['list']]
      // pagination.value = { ...route.meta['pagination'] }

      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    const handleChange = async (pagination) => {
      const params = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize
      }
      await fetchList(params)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...evt }
      filter.value = { ...deleteEmptyValue(evt) }

      paramsFilter.group_id = filter.value.group_id

      console.log('filter.value.date_from_to:', filter.value.date_from_to)

      if (typeof filter.value.period_id !== 'undefined' && filter.value.period_id) {
        paramsFilter.period_id = filter.value.period_id
      } else {
        paramsFilter.period_id = null
      }

      if (typeof filter.value.date_from_to !== 'undefined' && filter.value.date_from_to.length > 0) {
        filter.value.date_from_to.forEach((item, index) => {
          if (index === 0) {
            paramsFilter.from_date = item.split('/').join('-')
          }
          if (index === 1) {
            paramsFilter.to_date = item.split('/').join('-')
          }
        })
      } else {
        paramsFilter.from_date = ''
        paramsFilter.to_date = ''
      }
      paramsFilter.show_by = filter.value.show_by

      console.log('filter after get data:', filter.value)
      console.log('paramsFilter:', paramsFilter)

      await fetchList({ pageNumber: 1, pageSize: 30 }, { ...paramsFilter })
    }

    const convertDataTableColumns = async (data) => {
      if (Array.isArray(data.bankaccounts) && data.bankaccounts.length > 0) {
        for (let i = 0; i < data.bankaccounts.length; i++) {
          initialListColumns.value = {
            title: data.bankaccounts[i].name,
            dataIndex: `bank_balance_${data.bankaccounts[i].id}`,
            key: `bank_balance_${data.bankaccounts[i].id}`
          }

          columns.value.push(initialListColumns.value)
        }
        columns.value.unshift(initialDataTableColumn.value[0])
        columns.value.push(initialDataTableColumn.value[1])
      }
    }

    const convertDataTableRows = async (data) => {
      if (Array.isArray(data.balances) && data.balances.length > 0) {
        for (let i = 0; i < data.balances.length; i++) {
          dataTableRow.value['date'] = moment(data.balances[i].date).format('YYYY/MM/DD')
          dataTableRow.value['balance'] = data.balances[i].balance

          if (Array.isArray(data.balances[i].bankaccounts) && data.balances[i].bankaccounts.length > 0) {
            for (let j = 0; j < data.balances[i].bankaccounts.length; j++) {
              let bank_account = 'bank_balance_' + `${data.balances[i].bankaccounts[j].bankAccountId}`

              dataTableRow.value[bank_account] = data.balances[i].bankaccounts[j].balance
            }
          }
          dataSource.value.push(Object.assign({}, dataTableRow.value))
        }
        console.log(' dataSource.value  push:', dataSource.value)
      }
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      try {
        const { getLists } = useGetFinancingListService({ ...params }, data)
        const { result } = await getLists()

        dataSource.value.splice(0, dataSource.value.length)
        columns.value.splice(0, columns.value.length)
        console.log('columns after delete:', columns.value)
        console.log('dataSource after delete:', dataSource.value)
        debugger
        await convertDataTableColumns(result.data)
        await convertDataTableRows(result.data)

        pagination.value = convertPagination(result.meta)
        isLoading.value = false
      } catch (e) {
        isLoading.value = false
      }
    }

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const exportFinancingAsCsvFile = async () => {
      // const { financingList } = await getFinancingtList({ pageSize: 1, pageNumber: 30 })
      // exportData.items = financingList
      exportCSVFile(exportData)
    }

    return {
      dataSource,
      columns,
      pagination,
      isLoading,
      t,
      height,
      paramsFilter,
      exportData,
      initialStateFilter,
      getInnerHeight,
      convertDataTableColumns,
      convertDataTableRows,
      exportFinancingAsCsvFile,
      handleChange,
      onFilterChange,
      fetchList
    }
  }
})
</script>
<style scoped lang="scss"></style>
