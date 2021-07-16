<template>
  <section class="financing">
    <div class="financing__header">
      <div class="financing__header--top u-mx-32">
        <!--Stages-->
        <div class="form-group">
          <label class="form-label">{{ $t('financing.financing_list.stages') }}:</label>

          <div class="form-select">
            <a-select
              v-model:value="filter.period_id"
              :disabled="isDisabledPeriod"
              allow-clear
              @change="onChangePeriod"
            >
              <a-select-option v-for="item in periodList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--./Stages -->
        <!--Date From-->
        <div class="form-group">
          <label class="form-label"> {{ $t('financing.financing_list.date') }}: </label>

          <div class="form-select">
            <a-range-picker
              v-model:value="filter.date_from_to"
              format="YYYY-MM-DD"
              :style="{ width: '260px' }"
              :disabled="isDisabledDate"
              :placeholder="['YYYY-MM-DD', 'YYYY-MM-DD']"
              @change="onChangeDate"
            >
              <template #suffixIcon>
                <CalendarOutlined />
              </template>
            </a-range-picker>
          </div>
        </div>
        <!--./Date From -->
        <!-- Display -->
        <div class="form-group">
          <label class="form-label">{{ $t('financing.financing_list.display') }}:</label>

          <div class="form-checkbox">
            <a-radio-group v-model:value="filter.show_by" @change="onChangeShowBy">
              <a-radio
                v-for="item in SHOW_BY"
                :key="item.id"
                :value="item.id"
                :disabled="item.id === 1 ? isDisabledDisplay : false"
              >
                {{ $t(`financing.financing_list.${item.value}`) }}
              </a-radio>
            </a-radio-group>
          </div>
        </div>
        <!-- ./Display -->
        <!-- Download CSV -->
        <a-tooltip placement="topLeft" title="CSV ファイルダウンロード">
          <a-button type="link" class="btn-download" :loading="isLoadingExportCsv" @click="exportFinancingCsvFile">
            <template #icon>
              <span class="btn-icon" style="height: 28px"><icon-csv /></span>
            </template>
          </a-button>
        </a-tooltip>
        <!-- ./Download CSV -->
      </div>
      <div class="financing__header--middle">
        <a-tabs v-model:activeKey="filter.group_id" default-active-key="1" :animated="false" @change="onChangeTabGroup">
          <a-tab-pane v-for="item in groupList" :key="item.id" :tab="item.name"></a-tab-pane>
        </a-tabs>
      </div>

      <div class="financing__header--bottom u-mx-32">
        <!-- Bank Account -->
        <div class="form-group">
          <div class="form-select form-select-bank">
            <a-select v-model:value="filter.bank_account_ids" :disabled="isDisabledBank" @change="onChangeBankAccount">
              <a-select-option v-for="item in bankAccountList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <!-- View mode -->
          <div class="form-checkbox">
            <a-radio-group v-model:value="filter.view_mode" @change="onChangeViewMode">
              <a-radio v-for="item in VIEW_MODE" :key="item.id" :value="item.id">
                {{ $t(`financing.financing_list.${item.value}`) }}
              </a-radio>
            </a-radio-group>
          </div>
          <!-- ./View mode -->
        </div>
        <!-- ./Bank Account -->

        <!-- Currency -->
        <div class="form-group">
          <label class="form-label">{{ $t('financing.financing_list.currency') }}:</label>

          <div class="form-select form-select-currency">
            <a-select v-model:value="filter.currency_code" :disabled="isDisabledCurrency" @change="onChangeCurrency">
              <a-select-option v-for="item in currencyList" :key="item.id" :value="item.code">
                {{ item.code }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!-- ./Currency -->
      </div>
    </div>

    <financing-table
      id="financing__table"
      v-model:is-loading-data-table="isLoadingDataTable"
      v-model:columns-financing="dataColumnsTableFinancing"
      v-model:columns-name-list="dataColumnsNameTable"
      v-model:data-financing="dataRowsTableFinancing"
      v-model:pagination="pagination"
      :data-request="requestParamsData"
      @on-sort="onSortTable"
    />
  </section>
</template>
<script>
import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import moment from 'moment'
import { find, remove } from 'lodash-es'

import useGetFinancingListService from '@/views/Financing/composables/useGetFinancingListService'
import useGetGroupListService from '@/views/Financing/composables/useGetGroupListService'
import useGetPeriodListService from '@/views/Financing/composables/useGetPeriodListService'
import useGetBankAccountsService from '@/views/Financing/composables/useGetBankAccountsService'
import useGetCurrencyService from '@/views/Financing/composables/useGetCurrencyService'

import { convertArrayToObject, convertDataByMonth, convertDataCsv } from './composables/useFinancing'
import FinancingTable from '@/views/Financing/-components/FinancingTable'

import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { exportCSVFile } from '@/helpers/export-csv-file'
import Table from '@/mixins/table.mixin'
import { VIEW_MODE } from '@/enums/financing.enum'
import { SHOW_BY } from '@/enums/financing.enum'
import IconCsv from '@/assets/icons/ico_csv.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Index',

  components: { FinancingTable, IconCsv, CalendarOutlined },

  mixins: [Table],

  setup() {
    const { t } = useI18n()

    const groupList = ref([])
    const periodList = ref([])
    const bankAccountList = ref([])
    const bankAccountId = ref([])
    const currencyList = ref([])
    const dataColumns = ref([])
    const dataByDates = ref([])

    // Tables
    const dataColumnsNameTable = ref([])
    const createColumns = ref({})
    const dataColumnsTableFinancing = ref([])
    const dataRows = ref({})
    const dataRowsTableFinancing = ref([])

    const isLoading = ref(false)
    const isLoadingDataTable = ref(true)
    const isDisabledPeriod = ref(false)
    const isDisabledDate = ref(true)
    const isDisabledDisplay = ref(false)
    const isDisabledBank = ref(false)
    const isDisabledCurrency = ref(false)
    const isLoadingExportCsv = ref(false)

    const pagination = ref({})
    const height = ref(0)

    // data for request financing
    const initialData = {
      group_id: 1,
      period_id: null,
      from_date: null,
      to_date: null,
      show_by: 1,
      bank_account_ids: [],
      currency_code: ''
    }

    const requestParamsData = reactive({
      data: { ...initialData },
      params: { pageNumber: 1, pageSize: 100 }
    })

    const initialCsvLabels = [
      { header: t('financing.csv.header.date'), field: 'date', formatBy: 'moment_l' },
      { header: t('financing.csv.header.total_money'), field: 'totalMoney' }
    ]

    const initialExportCSV = {
      fileTitle: 'financing',
      labels: [],
      items: []
    }

    const initialGroup = {
      id: null,
      name: t('financing.financing_list.show_all_group')
    }

    const initialBankAccount = {
      id: null,
      name: t('financing.financing_list.show_all_bank'),
      currency_code: null
    }

    const initialStateFilter = {
      group_id: 1,
      period_id: '',
      date_from_to: [null, null],
      show_by: 1,
      view_mode: 0,
      bank_account_ids: [],
      currency_code: ''
    }

    const initialColumns = ref([
      {
        title: t('financing.financing_list.date'),
        dataIndex: 'date',
        key: 'date',
        fixed: 'left',
        width: 160,
        align: 'left',
        sorter: true
      },
      {
        title: t('financing.financing_list.total_money'),
        dataIndex: 'totalMoney',
        key: 'totalMoney',
        fixed: 'right',
        width: 160,
        align: 'right',
        slots: { customRender: 'totalMoney' }
      }
    ])

    const filter = reactive({ ...initialStateFilter })
    const dataExportCsv = reactive({ ...initialExportCSV })

    // Handle filter
    const onChangePeriod = async (event) => {
      filter.date_from_to = []
      isDisabledDate.value = !(event === undefined || event === null)
      requestParamsData.data.period_id = filter.period_id

      await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
    }

    const onChangeDate = async (value, dateString) => {
      filter.period_id = null
      isDisabledPeriod.value = !(dateString[0] === '' && dateString[1] === '')

      filter.date_from_to = dateString
      requestParamsData.data.from_date = filter.date_from_to[0]
      requestParamsData.data.to_date = filter.date_from_to[1]
      requestParamsData.data.period_id = filter.period_id

      await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
    }

    const onChangeShowBy = async () => {
      requestParamsData.data.show_by = filter.show_by

      await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
    }

    const onChangeTabGroup = async (value) => {
      // fetch bank accounts
      if (value) {
        bankAccountList.value = []
        await fetchBankAccounts({ group_id: value })
        isDisabledDisplay.value = false
        isDisabledBank.value = false
      } else {
        filter.show_by = 0
        isDisabledDisplay.value = true
        isDisabledBank.value = true
        requestParamsData.data.bank_account_ids = []
      }
      requestParamsData.data.group_id = filter.group_id
      requestParamsData.data.show_by = filter.show_by

      await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
    }

    const onChangeBankAccount = async () => {
      requestParamsData.data.bank_account_ids = []
      if (filter.bank_account_ids !== null) {
        isDisabledCurrency.value = true
        filter.currency_code = ''
        let currencyBank = bankAccountList.value.find((item) => item.id === filter.bank_account_ids)
        requestParamsData.data.currency_code = currencyBank.currencyCode
        requestParamsData.data.bank_account_ids.push(filter.bank_account_ids)
      } else {
        isDisabledCurrency.value = false
      }

      await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
    }

    const onChangeViewMode = async () => {}

    const onChangeCurrency = async () => {
      requestParamsData.data.currency_code = filter.currency_code

      await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
    }

    // Fetch data group
    const fetchGroupList = async () => {
      const { getGroups } = useGetGroupListService()
      const { result } = await getGroups()

      groupList.value = result?.data
      groupList.value.push(initialGroup)
      filter.group_id = groupList?.value[0]?.id
    }

    // Fetch data period
    const fetchPeriodList = async (groupID) => {
      const { getPeriods } = useGetPeriodListService(groupID)
      const { result } = await getPeriods()

      periodList.value = result?.data
      // set period current
      const periodCurrentFound = find(periodList.value, (periodItem) => {
        const currentTime = moment()
        const startedDate = periodItem?.startedDate
        const finishedDate = periodItem?.finishedDate

        if (!startedDate || !finishedDate) return false

        return currentTime >= moment(startedDate) && currentTime <= moment(finishedDate)
      })
      if (periodCurrentFound) {
        filter.period_id = periodCurrentFound.id
      }
    }

    // Fetch bank accounts
    const fetchBankAccounts = async (groupID) => {
      const { getBankAccounts } = useGetBankAccountsService(groupID)
      const { result } = await getBankAccounts()

      bankAccountList.value = result?.data
      bankAccountList.value.unshift(initialBankAccount)
      filter.bank_account_ids = bankAccountList?.value[0].id
    }

    // Fetch currency
    const fetchCurrency = async () => {
      const { getCurrency } = useGetCurrencyService()
      const { result } = await getCurrency()

      currencyList.value = result?.data
      filter.currency_code = currencyList?.value[1].code
    }

    const onSortTable = async (emitData) => {
      let currentSortStr = ''
      if (emitData.orderBy !== '') {
        currentSortStr = `${emitData.field} ${emitData.orderBy}`
      }

      requestParamsData.params.orderBy = currentSortStr
      await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
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
            width: 150,
            align: 'right',
            slots: { customRender: `columns_${data[i].id}` }
          }
          dataColumnsTableFinancing.value.push(createColumns.value)
        }
        dataColumnsTableFinancing.value.unshift(initialColumns.value[0])

        dataColumnsTableFinancing.value.push(initialColumns.value[1])
      }
    }

    const convertDataTableRows = async (data) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          dataRows.value['date'] =
            requestParamsData.data.show_by === 1
              ? moment(data[i].date).format('YYYY/MM/DD')
              : moment(data[i].date).format('YYYY/MM')

          if (requestParamsData.data.show_by === 1) {
            Object.assign(dataRows.value, convertArrayToObject(data[i].dataByColumns, 'columnId', 'columns_', 'money'))
          } else {
            Object.assign(dataRows.value, convertDataByMonth(data[i].dataByColumns, 'columnId', 'columns_', 'money'))
          }

          dataRows.value['totalMoney'] = data[i].totalMoney
          dataRowsTableFinancing.value.push(Object.assign({}, dataRows.value))
        }
      }
    }

    const fetchDataTableFinancing = async (data, params) => {
      isLoadingDataTable.value = true

      // eslint-disable-next-line no-useless-catch
      try {
        const { getLists } = useGetFinancingListService(data, params)
        const { result } = await getLists()

        remove(dataRowsTableFinancing.value)
        remove(dataColumnsTableFinancing.value)
        remove(dataColumnsNameTable.value)
        deleteEmptyValue(dataRows.value)

        dataColumns.value = result.data?.columns || []
        dataByDates.value = result.data?.dataByDates || []
        dataColumnsNameTable.value = dataColumns.value.map((item) => `columns_${item.id}`)

        await convertDataTableHeader(dataColumns.value)
        await convertDataTableRows(dataByDates.value)
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
          requestParamsData.data.show_by === 1
            ? moment(item.date).format('YYYY/MM/DD')
            : moment(item.date).format('YYYY/MM')

        Object.assign(dataCsv, convertDataCsv(item.dataByColumns, 'columnId', 'columns_', 'money'))
        dataCsv.totalMoney = item.totalMoney.money
        dataExportCsv.items.push(Object.assign({}, dataCsv))
      })

      isLoadingExportCsv.value = false
      exportCSVFile(dataExportCsv)
    }

    onBeforeMount(async () => {
      await fetchGroupList()
      await fetchCurrency()
      const groupID = filter?.group_id

      if (groupID) {
        await fetchPeriodList(groupID)
        await fetchBankAccounts({ group_id: groupID })

        requestParamsData.data.group_id = filter.group_id
        requestParamsData.data.period_id = filter.period_id

        await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
      }
    })

    onMounted(async () => {
      pagination.value = { ...requestParamsData.params }
    })

    return {
      t,
      useRoute,
      initialGroup,
      initialBankAccount,
      initialStateFilter,
      initialColumns,
      groupList,
      periodList,
      bankAccountList,
      currencyList,
      dataColumns,
      dataByDates,
      dataColumnsNameTable,
      dataColumnsTableFinancing,
      dataRowsTableFinancing,
      bankAccountId,
      dataExportCsv,
      filter,
      requestParamsData,
      height,
      pagination,
      isLoading,
      isDisabledPeriod,
      isDisabledDate,
      isDisabledDisplay,
      isLoadingDataTable,
      isDisabledBank,
      isDisabledCurrency,
      isLoadingExportCsv,
      SHOW_BY,
      VIEW_MODE,
      convertArrayToObject,
      onChangePeriod,
      onChangeDate,
      onChangeShowBy,
      onChangeTabGroup,
      onChangeBankAccount,
      onChangeViewMode,
      onChangeCurrency,
      onSortTable,
      fetchGroupList,
      fetchPeriodList,
      fetchCurrency,
      fetchDataTableFinancing,
      convertDataTableHeader,
      convertDataTableRows,
      exportFinancingCsvFile
    }
  }
})
</script>
<style scoped lang="scss"></style>
