<template>
  <section class="financing">
    <financing-filter
      :is-loading-export-csv="isLoadingExportCsv"
      :data-filter-table="dataFilterTable"
      @on-filter-request="onDataFilterRequest"
      @on-export-csv="exportFinancingCsvFile"
    />

    <financing-table
      :is-loading-data-table="isLoadingDataTable"
      :columns-financing="dataColumnsTableFinancing"
      :columns-name-list="dataColumnsNameTable"
      :data-financing="dataRowsTableFinancing"
      :data-request="updateDataRequest"
      :scroll-custom="scrollCustom"
      @on-sort="onSortTable"
      @on-filter-tables="onFilterTablesRender"
    />
  </section>
</template>
<script>
import { defineComponent, onBeforeMount, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import moment from 'moment'
import { remove, isArray } from 'lodash-es'

import useGetFinancingListService from '@/views/Financing/composables/useGetFinancingListService'

import FinancingTable from '@/views/Financing/-components/FinancingTable'
import FinancingFilter from '@/views/Financing/-components/FinancingFilter'

import { convertDataByDates, convertDataByMonth, convertDataCsv } from '@/helpers/extend-financing'
import { convertPagination } from '@/helpers/convert-pagination'
import { exportCSVFile } from '@/helpers/export-csv-file'
import Table from '@/mixins/table.mixin'

export default defineComponent({
  name: 'Index',

  components: {
    FinancingFilter,
    FinancingTable
  },

  mixins: [Table],

  setup() {
    const { t } = useI18n()
    const store = useStore()

    const filter = ref([])
    const dataColumns = ref([])
    const dataByDates = ref([])

    // Tables
    const dataColumnsNameTable = ref([])
    const createColumns = ref({})
    const dataColumnsTableFinancing = ref([])
    const dataRows = ref({})
    const dataRowsTableFinancing = ref([])
    const updateDataRequest = ref({})
    const dataFilterTable = ref({})
    const height = ref(0)
    const pagination = ref({})

    const isLoading = ref(false)
    const isLoadingDataTable = ref(true)
    const isDisabledPeriod = ref(false)
    const isDisabledDate = ref(false)
    const isDisabledDisplay = ref(false)
    const isDisabledBank = ref(false)
    const isDisabledCurrency = ref(false)
    const isLoadingExportCsv = ref(false)
    const scrollCustom = ref({})

    // data for request financing
    const initialDataRequest = {
      group_id: null,
      period_id: null,
      from_date: null,
      to_date: null,
      show_by: 1,
      bank_account_ids: [],
      currency_code: null
    }

    const requestParamsData = ref({
      data: { ...initialDataRequest },
      params: { pageNumber: 1, pageSize: 60 }
    })

    const updateParamRequestFinancing = ({ data = {}, params = {} }) => {
      requestParamsData.value = {
        data: { ...requestParamsData.value.data, ...data },
        params: { ...requestParamsData.value.params, ...params }
      }
    }

    const initialColumns = [
      {
        title: t('financing.financing_list.date'),
        dataIndex: 'date',
        key: 'date',
        fixed: 'left',
        width: 160,
        sorter: true,
        slots: { customRender: 'customDate' }
      },
      {
        title: t('financing.financing_list.total_money'),
        dataIndex: 'totalMoney',
        key: 'totalMoney',
        fixed: 'right',
        width: 200,
        align: 'right',
        slots: { customRender: 'totalMoney' }
      }
    ]

    const initialCsvLabels = [
      { header: t('financing.csv.header.date'), field: 'date', formatBy: 'moment_l' },
      { header: t('financing.csv.header.total_money'), field: 'totalMoney' }
    ]

    const initialExportCSV = {
      fileTitle: 'financing',
      labels: [],
      items: []
    }

    const dataExportCsv = reactive({ ...initialExportCSV })

    const onDataFilterRequest = (filter) => {
      updateParamRequestFinancing({
        data: filter.data,
        params: filter.params
      })
    }

    const onSortTable = async (data) => {
      let currentSortStr = null
      if (data.orderBy !== null) {
        currentSortStr = `${data.field} ${data.orderBy}`
      }
      remove(dataRowsTableFinancing.value)

      updateParamRequestFinancing({ params: { orderBy: currentSortStr, pageNumber: 1 } })
    }

    const onFilterTablesRender = (data) => {
      if (data) {
        dataFilterTable.value = data
        updateParamRequestFinancing({ data: { ...data } })
      }
    }

    const convertDataTableHeader = async (data) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let titleName = data[i].name
          if (data[i].name === 'deposit' || data[i].name === 'withdrawal') {
            titleName = t(`financing.financing_list.${data[i].name}`)
          }
          createColumns.value = {
            title: titleName,
            dataIndex: `columns_${data[i].id}`,
            key: `columns_${data[i].id}`,
            width: 200,
            align: 'right',
            slots: { customRender: `columns_${data[i].id}` }
          }
          dataColumnsTableFinancing.value.push(createColumns.value)
        }

        dataColumnsTableFinancing.value.unshift(initialColumns[0])
        dataColumnsTableFinancing.value.push(initialColumns[1])
        if (dataColumnsTableFinancing.value.length < 6) {
          scrollCustom.value = { y: height.value - 274 }
          dataColumnsTableFinancing.value.map((item) => {
            delete item.width
            delete item.fixed
          })
        } else {
          scrollCustom.value = { x: 1500, y: height.value - 274 }
          dataColumnsTableFinancing.value.map((item, index) => {
            if (index === 0) {
              item.width = 180
              item.fixed = 'left'
            }
            if (index === dataColumnsTableFinancing.value.length - 1) {
              item.width = 200
              item.fixed = 'right'
            }
          })
        }
      }
    }

    const convertDataTableRows = async (data) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          if (requestParamsData.value.data.show_by === 1) {
            dataRows.value = Object.assign(
              {},
              convertDataByDates(data[i].dataByColumns, 'columnId', 'columns_', 'money')
            )
          } else {
            dataRows.value = Object.assign(
              {},
              convertDataByMonth(data[i].dataByColumns, 'columnId', 'columns_', 'money')
            )
          }
          dataRows.value['date'] = moment(data[i].date).format('YYYY/MM/DD')
          dataRows.value['totalMoney'] = data[i].totalMoney
          dataRowsTableFinancing.value.push(dataRows.value)
        }
      }
    }

    const fetchDataTableFinancing = async (data, params) => {
      isLoadingDataTable.value = true
      // eslint-disable-next-line no-useless-catch
      try {
        const groupId = data?.group_id || null
        const groupIdArr = isArray(groupId) ? groupId : [groupId]

        const { getLists } = useGetFinancingListService({ ...data, groupId: groupIdArr }, params)
        const { result } = await getLists()

        // remove(dataRowsTableFinancing.value)
        remove(dataColumnsTableFinancing.value)
        remove(dataColumnsNameTable.value)
        remove(dataColumns.value)
        remove(dataByDates.value)
        dataColumns.value = result.data?.columns || []
        dataByDates.value = result.data?.dataByDates ?? []
        dataColumnsNameTable.value = dataColumns.value.map((item) => `columns_${item.id}`)

        await convertDataTableHeader(dataColumns.value)
        await convertDataTableRows(dataByDates.value)

        pagination.value = { ...convertPagination(result.meta) }
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const exportFinancingCsvFile = async () => {
      isLoadingExportCsv.value = true
      dataExportCsv.labels = []

      if (dataColumns.value) {
        for (let i = 0; i < dataColumns.value.length; i++) {
          let titleName = dataColumns.value[i].name
          if (titleName === 'deposit' || titleName === 'withdrawal') {
            titleName = t(`financing.csv.header.${dataColumns.value[i].name}`)
          }
          const createLabels = {
            header: titleName,
            field: `columns_${dataColumns.value[i].id}`
          }
          dataExportCsv.labels.push(createLabels)
        }
        dataExportCsv.labels.unshift(initialCsvLabels[0])

        dataExportCsv.labels.push(initialCsvLabels[1])
      }

      const dataCsv = {}
      dataByDates.value.forEach((item) => {
        dataCsv.date =
          requestParamsData.value.data.show_by === 1
            ? moment(item.date).format('YYYY/MM/DD')
            : moment(item.date).format('YYYY/MM')

        Object.assign(dataCsv, convertDataCsv(item.dataByColumns, 'columnId', 'columns_', 'money'))
        dataCsv.totalMoney = item.totalMoney.money
        dataExportCsv.items.push(Object.assign({}, dataCsv))
      })

      isLoadingExportCsv.value = false
      exportCSVFile(dataExportCsv)
    }

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    onBeforeMount(async () => {
      // Get filters financing from store
      const filtersFinancingStore = store.getters['financing/filters'] || {}
      if (filtersFinancingStore) {
        Object.assign(requestParamsData.value, filtersFinancingStore)
        // fetch data table
        requestParamsData.value.data.group_id &&
          (await fetchDataTableFinancing(requestParamsData.value.data, requestParamsData.value.params))
      }
      updateDataRequest.value = requestParamsData.value
    })

    onMounted(async () => {
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getInnerHeight)
    })

    // watch to event scroll table financing
    watch(dataRowsTableFinancing.value, () => {
      const tableContent = document.querySelector('.ant-table-body')

      if (tableContent) {
        tableContent.addEventListener('scroll', () => {
          // checking whether a selector is well defined
          const per = (tableContent.scrollTop / (tableContent.scrollHeight - tableContent.clientHeight)) * 100
          if (per >= 100 && !isLoadingDataTable.value) {
            const pageCurrent = pagination.value.current + 1

            if (pageCurrent <= pagination.value.totalPage) {
              updateParamRequestFinancing({ params: { pageNumber: pageCurrent } })
            }
          }
        })
      }
    })

    // watch to event click table financing
    watch(
      () => store.state.financing.filters,
      () => {
        remove(dataRowsTableFinancing.value)
        updateParamRequestFinancing({
          params: {
            pageNumber: 1
          }
        })
      }
    )

    // watch to fetch data financing
    watch(
      () => requestParamsData.value,
      () => {
        updateDataRequest.value = requestParamsData.value
        // fetch data table
        fetchDataTableFinancing(requestParamsData.value.data, requestParamsData.value.params)
      }
    )

    return {
      filter,
      updateDataRequest,
      scrollCustom,
      height,
      dataColumns,
      dataByDates,
      dataColumnsNameTable,
      dataColumnsTableFinancing,
      dataRowsTableFinancing,
      dataExportCsv,
      dataFilterTable,
      isLoading,
      isDisabledPeriod,
      isDisabledDate,
      isDisabledDisplay,
      isLoadingDataTable,
      isDisabledBank,
      isDisabledCurrency,
      isLoadingExportCsv,
      onDataFilterRequest,
      onFilterTablesRender,
      onSortTable,
      fetchDataTableFinancing,
      convertDataTableHeader,
      convertDataTableRows,
      exportFinancingCsvFile,
      updateParamRequestFinancing
    }
  }
})
</script>
<style scoped lang="scss"></style>
