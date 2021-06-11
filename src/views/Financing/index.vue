<template>
  <section class="financing">
    <Search @filter-changed="onFilterChange" />

    <a-button class="btn-download" :loading="loadingExportCsvButton" @click="exportFinancingAsCsvFile">
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
        row-key="Id"
        @change="handleChange"
      >
        <template v-for="(col, index) in columnsHeaderList" #[col]="{ text, record }" :key="index">
          <span>
            <a
              class="ant-dropdown-link"
              :class="parseInt(text) < 0 ? 'text--red' : ''"
              @click="handleNumber(text, record)"
            >
              {{ text }}
            </a>
          </span>
        </template>
        <template #balance="{ text, record }">
          <span>
            <a
              class="ant-dropdown-link"
              :class="parseInt(text) < 0 ? 'text--red' : ''"
              @click="handleNumber(text, record)"
            >
              {{ text }}
            </a>
          </span>
        </template>
      </a-table>
    </div>
  </section>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import { remove } from 'lodash-es'

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
    const route = useRoute()
    const router = useRouter()

    const loadingExportCsvButton = ref()
    const dataSource = ref([])
    const columns = ref([])
    const columnsHeaderList = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const height = ref(0)

    let dataTableRow = ref({})
    let initialListColumns = ref({})

    const initialDataTableColumn = ref([
      { title: t('financing.date'), dataIndex: 'date', key: 'date', sorter: (a, b) => a.date - b.date },
      { title: t('financing.balance'), dataIndex: 'balance', key: 'balance', slots: { customRender: 'balance' } }
    ])

    const initialStateFilter = {
      group_id: null,
      period_id: null,
      from_date: '',
      to_date: '',
      show_by: 0
    }
    const convertFilter = reactive({ ...initialStateFilter })

    const initialExportCSV = {
      fileTitle: 'financing',
      labels: [],
      items: []
    }

    const exportData = reactive({ ...initialExportCSV })

    onMounted(async () => {
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    const handleChange = async (pagination) => {
      const params = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize
      }

      await fetchList(params, route.meta['filter'])
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...evt }
      filter.value = { ...deleteEmptyValue(evt) }
      console.log('  filter.value:', filter.value)
      convertFilter.group_id = filter.value.group_id

      if (typeof filter.value.period_id !== 'undefined' && filter.value.period_id) {
        convertFilter.period_id = filter.value.period_id
      } else {
        convertFilter.period_id = null
      }

      if (typeof filter.value.date_from_to !== 'undefined' && filter.value.date_from_to) {
        filter.value.date_from_to.forEach((item, index) => {
          if (index === 0) {
            convertFilter.from_date = item.split('/').join('-')
          }
          if (index === 1) {
            convertFilter.to_date = item.split('/').join('-')
          }
        })
      } else {
        convertFilter.from_date = ''
        convertFilter.to_date = ''
      }
      convertFilter.show_by = filter.value.show_by
      route.meta['filter'] = convertFilter

      await fetchList({ pageNumber: 1, pageSize: 8 }, { ...convertFilter })
    }

    const convertDataTableHeader = async (data) => {
      if (Array.isArray(data.bankaccounts) && data.bankaccounts.length > 0) {
        for (let i = 0; i < data.bankaccounts.length; i++) {
          initialListColumns.value = {
            title: data.bankaccounts[i].name,
            dataIndex: `bank_balance_${data.bankaccounts[i].id}`,
            key: `bank_balance_${data.bankaccounts[i].id}`,
            slots: { customRender: data.bankaccounts[i].name }
          }
          columns.value.push(initialListColumns.value)
        }
        columns.value.unshift(initialDataTableColumn.value[0])
        columns.value.push(initialDataTableColumn.value[1])
      }
      console.log('columns:', columns.value)
    }

    const convertDataTableRows = async (data) => {
      if (Array.isArray(data.balances) && data.balances.length > 0) {
        for (let i = 0; i < data.balances.length; i++) {
          dataTableRow.value['date'] = moment(data.balances[i].date).format('YYYY/MM/DD')
          Object.assign(
            dataTableRow.value,
            convertArrayToObject(data.balances[i].bankaccounts, 'bankAccountId', 'bank_balance_', 'balance')
          )
          dataTableRow.value['balance'] = data.balances[i].balance
          dataSource.value.push(Object.assign({}, dataTableRow.value))
        }
        console.log('dataSource:', dataSource.value)
      }
    }

    const convertArrayToObject = (array, key, key_prefix, value) => {
      let keyField = ''
      let valueField = ''
      return array.reduce((obj, item) => {
        key_prefix === '' ? (keyField = item[key]) : (keyField = [key_prefix + item[key]])
        value === '' ? (valueField = item) : (valueField = item[value])

        return { ...obj, [keyField]: valueField }
      }, {})
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true

      try {
        const { getLists } = useGetFinancingListService({ ...params }, data)
        const { result } = await getLists()

        remove(dataSource.value)
        remove(columns.value)

        columnsHeaderList.value = [...result.data.bankaccounts].map((item) => item.name)
        await convertDataTableHeader(result.data)
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

    const handleNumber = (balance, data) => {
      console.log(balance + ':' + data)
      router.push({ name: 'deposit' })
    }

    const exportFinancingAsCsvFile = async () => {
      initialExportCSV.labels = JSON.parse(JSON.stringify(columns.value)).map((item) => ({
        header: item.title,
        field: item.dataIndex
      }))

      initialExportCSV.items = JSON.parse(JSON.stringify(dataSource.value))
      exportCSVFile(initialExportCSV)
    }

    return {
      useRoute,
      dataSource,
      columns,
      pagination,
      isLoading,
      t,
      height,
      convertFilter,
      exportData,
      initialStateFilter,
      columnsHeaderList,
      loadingExportCsvButton,
      getInnerHeight,
      convertDataTableHeader,
      convertDataTableRows,
      convertArrayToObject,
      exportFinancingAsCsvFile,
      handleChange,
      handleNumber,
      onFilterChange,
      fetchList
    }
  }
})
</script>
<style scoped lang="scss"></style>
