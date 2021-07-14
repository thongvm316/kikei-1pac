<template>
  <section class="financing">
    <div class="financing__header">
      <div class="financing__header--top u-mx-32">
        <!--Stages-->
        <div class="form-group">
          <label class="form-label">{{ $t('financing.stages') }}:</label>

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
          <label class="form-label"> {{ $t('financing.date') }}: </label>

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
          <label class="form-label">{{ $t('financing.display') }}:</label>

          <div class="form-checkbox">
            <a-radio-group v-model:value="filter.show_by" @change="onChangeShowBy">
              <a-radio
                v-for="item in SHOW_BY"
                :key="item.id"
                :value="item.id"
                :disabled="item.id === 1 ? isDisabledDisplay : false"
              >
                {{ $t(`financing.${item.value}`) }}
              </a-radio>
            </a-radio-group>
          </div>
        </div>
        <!-- ./Display -->
        <!-- Download CSV -->
        <a-tooltip placement="topLeft" title="CSV ファイルダウンロード">
          <a-button class="btn-download" :loading="loadingExportCsvButton" @click="exportFinancingCsvFile">
            <icon-csv />
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
                {{ $t(`financing.${item.value}`) }}
              </a-radio>
            </a-radio-group>
          </div>
          <!-- ./View mode -->
        </div>
        <!-- ./Bank Account -->

        <!-- Currency -->
        <div class="form-group">
          <label class="form-label">{{ $t('financing.currency') }}:</label>

          <div class="form-select form-select-currency">
            <a-select v-model:value="filter.currency_code" @change="onChangeCurrency">
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
      v-model:is-loading-data-table="isLoadingDataTable"
      v-model:columns-financing="columnsFinancing"
      v-model:columns-name-list="columnsNameList"
      v-model:data-financing="dataFinancing"
      v-model:current-selected-row-keys="currentSelectedRowKeys"
      @on-sort="onSortTable"
    />
  </section>
</template>
<script>
import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import moment from 'moment'

import useGetFinancingListService from '@/views/Financing/composables/useGetFinancingListService'
import useGetGroupListService from '@/views/Financing/composables/useGetGroupListService'
import useGetPeriodListService from '@/views/Financing/composables/useGetPeriodListService'
import useGetBankAccountsService from '@/views/Financing/composables/useGetBankAccountsService'

import FinancingTable from '@/views/Financing/-components/FinancingTable'
import { convertArrayToObject, convertDataByMonth } from './composables/useFinancing'

import { exportCSVFile } from '@/helpers/export-csv-file'
import Table from '@/mixins/table.mixin'
import { VIEW_MODE } from '@/enums/financing.enum'
import { SHOW_BY } from '@/enums/financing.enum'
import IconCsv from '@/assets/icons/ico_csv.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'
import { remove } from 'lodash-es'
import useGetCurrencyService from '@/views/Financing/composables/useGetCurrencyService'

export default defineComponent({
  name: 'Index',

  components: { FinancingTable, IconCsv, CalendarOutlined },

  mixins: [Table],

  setup() {
    const { t } = useI18n()

    const groupList = ref([])
    const periodList = ref([])
    const loadingExportCsvButton = ref()
    const bankAccountId = ref([])
    const bankAccountList = ref([])
    const currencyList = ref([])

    const isLoadingDataTable = ref(true)
    const dataFinancing = ref([])
    const columnsFinancing = ref([])
    const columnsNameList = ref([])
    const currentSelectedRowKeys = ref([])
    let dataTableRow = ref({})
    let initialListColumns = ref({})

    const isLoading = ref(false)
    const isDisabledPeriod = ref(false)
    const isDisabledDate = ref(true)
    const isDisabledDisplay = ref(false)
    const isDisabledBank = ref(false)

    const height = ref(0)

    // data for request financing
    const initialData = {
      group_id: 1,
      period_id: null,
      from_date: null,
      to_date: null,
      show_by: 0,
      bank_account_ids: [],
      currency_code: ''
    }

    const requestParamsData = reactive({
      data: { ...initialData },
      params: { pageNumber: 1, pageSize: 100 }
    })

    const initialExportCSV = {
      fileTitle: 'financing',
      labels: [],
      items: []
    }

    const initialGroup = {
      id: null,
      name: t('financing.show_all_group')
    }

    const initialBankAccount = {
      id: null,
      name: t('financing.show_all_bank'),
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

    const initialTableColumn = ref([
      { title: t('financing.date'), dataIndex: 'date', key: 'date', sorter: true },
      { title: t('financing.balance'), dataIndex: 'balance', key: 'balance', slots: { customRender: 'balance' } }
    ])

    const filter = reactive({ ...initialStateFilter })
    const exportData = reactive({ ...initialExportCSV })

    // Handle Header filter
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
        await fetchPeriodList(value)
        await fetchBankAccounts({ group_id: value })
        filter.show_by = 1
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
        requestParamsData.data.bank_account_ids.push(filter.bank_account_ids)
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
      filter.period_id = periodList?.value[0]?.id
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
      filter.currency_code = currencyList?.value[0].code
    }

    const onSortTable = async (emitData) => {
      let currentSortStr = ''
      emitData.orderBy === ''
        ? (currentSortStr = 'date asc')
        : (currentSortStr = `${emitData.field} ${emitData.orderBy}`)

      requestParamsData.params.orderBy = currentSortStr
      await fetchDataTableFinancing(requestParamsData.data, requestParamsData.params)
    }

    const convertDataTableHeader = async (data) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          initialListColumns.value = {
            title: data[i].name,
            dataIndex: `columns_${data[i].id}`,
            key: `columns_${data[i].id}`,
            slots: { customRender: `columns_${data[i].id}` }
          }
          columnsFinancing.value.push(initialListColumns.value)
        }
        columnsFinancing.value.unshift(initialTableColumn.value[0])

        columnsFinancing.value.push(initialTableColumn.value[1])
      }
    }

    const convertDataTableRows = async (data) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          dataTableRow.value['date'] =
            requestParamsData.data.show_by === 0
              ? moment(data[i].date).format('YYYY/MM/DD')
              : moment(data[i].date).format('YYYY/MM')

          if (requestParamsData.data.show_by === 0) {
            Object.assign(
              dataTableRow.value,
              convertArrayToObject(data[i].dataByColumns, 'columnId', 'columns_', 'money')
            )
          } else {
            Object.assign(
              dataTableRow.value,
              convertDataByMonth(data[i].dataByColumns, 'columnId', 'columns_', 'money')
            )
          }

          dataTableRow.value['balance'] = data[i].totalMoney
          dataFinancing.value.push(Object.assign({}, dataTableRow.value))
        }
      }
    }

    const fetchDataTableFinancing = async (data, params) => {
      isLoadingDataTable.value = true

      // eslint-disable-next-line no-useless-catch
      try {
        const { getLists } = useGetFinancingListService(data, params)
        const { result } = await getLists()
        remove(dataFinancing.value)
        remove(columnsFinancing.value)
        columnsNameList.value = result.data?.columns.map((item) => `columns_${item.id}`)

        await convertDataTableHeader(result.data?.columns)
        await convertDataTableRows(result.data?.dataByDates)
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const exportFinancingCsvFile = async () => {
      initialExportCSV.labels = JSON.parse(JSON.stringify(columnsFinancing.value)).map((item) => ({
        header: item.title,
        field: item.dataIndex
      }))
      initialExportCSV.items = JSON.parse(JSON.stringify(dataFinancing.value))
      exportCSVFile(initialExportCSV)
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

    onMounted(async () => {})

    return {
      t,
      useRoute,
      initialGroup,
      groupList,
      periodList,
      initialBankAccount,
      bankAccountId,
      bankAccountList,
      currencyList,
      SHOW_BY,
      VIEW_MODE,
      initialStateFilter,
      filter,
      requestParamsData,
      loadingExportCsvButton,
      exportData,
      isLoadingDataTable,
      currentSelectedRowKeys,
      dataFinancing,
      initialTableColumn,
      columnsNameList,
      columnsFinancing,
      isLoading,
      isDisabledPeriod,
      isDisabledDate,
      isDisabledDisplay,
      isDisabledBank,
      height,
      convertArrayToObject,
      convertDataTableHeader,
      convertDataTableRows,
      exportFinancingCsvFile,
      onChangePeriod,
      onChangeDate,
      onChangeShowBy,
      onChangeTabGroup,
      onChangeBankAccount,
      onChangeViewMode,
      onChangeCurrency,
      fetchGroupList,
      fetchPeriodList,
      fetchCurrency,
      fetchDataTableFinancing,
      onSortTable
    }
  }
})
</script>
<style scoped lang="scss"></style>
