<template>
  <section class="financing">
    <div class="financing__header">
      <div class="financing__header--top u-mx-32">
        <!--Stages-->
        <div class="form-group">
          <label class="form-label">{{ $t('financing.financing_list.stages') }}:</label>

          <div class="form-select">
            <a-select v-model:value="filter.period_id" allow-clear @change="onChangePeriod">
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
              :placeholder="['YYYY/MM/DD', 'YYYY/MM/DD']"
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
                <span v-if="item.currencyCode">
                  {{ item.name + ' (' + item.currencyCode + ')' }}
                </span>
                <span v-else>
                  {{ item.name }}
                </span>
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
        <div v-if="!isDisabledCurrency" class="form-group">
          <label class="form-label">
            <span v-if="filter.group_id"> {{ $t('financing.financing_list.currency') }}: </span>
            <span v-else> {{ $t('financing.financing_list.currency_by_all_group') }}:</span>
          </label>

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
      :is-loading-data-table="isLoadingDataTable"
      :columns-financing="dataColumnsTableFinancing"
      :columns-name-list="dataColumnsNameTable"
      :data-financing="dataRowsTableFinancing"
      :data-request="updateDataRequest"
      :scroll-custom="scrollCustom"
      @on-sort="onSortTable"
    />
  </section>
</template>
<script>
import { defineComponent, onBeforeMount, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import moment from 'moment'
import { isEmpty, remove } from 'lodash-es'

import useGetFinancingListService from '@/views/Financing/composables/useGetFinancingListService'
import useGetGroupListService from '@/views/Financing/composables/useGetGroupListService'
import useGetPeriodListService from '@/views/Financing/composables/useGetPeriodListService'
import useGetBankAccountsService from '@/views/Financing/composables/useGetBankAccountsService'
import useGetCurrencyService from '@/views/Financing/composables/useGetCurrencyService'

import {
  convertDataByDates,
  convertDataByMonth,
  convertDataCsv,
  convertDataFilter,
  findCurrentPeriod
} from './composables/useFinancing'
import FinancingTable from '@/views/Financing/-components/FinancingTable'

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
    const store = useStore()

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
    const updateDataRequest = ref({})
    const scrollCustom = ref({})
    const height = ref(0)

    const isLoading = ref(false)
    const isLoadingDataTable = ref(true)
    const isDisabledPeriod = ref(false)
    const isDisabledDate = ref(false)
    const isDisabledDisplay = ref(false)
    const isDisabledBank = ref(false)
    const isDisabledCurrency = ref(false)
    const isLoadingExportCsv = ref(false)

    // data for request financing
    const initialDataRequest = {
      group_id: 1,
      period_id: null,
      from_date: null,
      to_date: null,
      show_by: 1,
      bank_account_ids: [],
      currency_code: null
    }

    const requestParamsData = ref({
      data: { ...initialDataRequest },
      params: { pageNumber: 1, pageSize: 100 }
    })

    const updateParamRequestFinancing = ({ data = {}, params = {} }) => {
      requestParamsData.value = {
        data: { ...requestParamsData.value.data, ...data },
        params: { ...requestParamsData.value.params, ...params }
      }
    }

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
      id: 0,
      name: t('financing.financing_list.show_all_group')
    }

    const initialBankAccount = {
      id: 0,
      name: t('financing.financing_list.show_all_bank'),
      currency_code: null
    }

    const initialStateFilter = {
      group_id: 1,
      period_id: null,
      date_from_to: [null, null],
      show_by: 1,
      view_mode: 0,
      bank_account_ids: null,
      currency_code: null
    }

    const initialColumns = ref([
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
    ])

    const filter = reactive({ ...initialStateFilter })
    const dataExportCsv = reactive({ ...initialExportCSV })

    // Handle filter
    const onChangePeriod = async (event) => {
      filter.date_from_to = []
      isDisabledDate.value = !(event === undefined || event === null)
      updateParamRequestFinancing({
        data: {
          period_id: filter.period_id,
          from_date: null,
          to_date: null
        }
      })

      // save filters to store
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
    }

    const onChangeDate = async (value, dateString) => {
      filter.period_id = null
      isDisabledPeriod.value = !(dateString[0] === '' && dateString[1] === '')

      filter.date_from_to = dateString
      updateParamRequestFinancing({
        data: {
          period_id: filter.period_id,
          from_date: filter.date_from_to[0],
          to_date: filter.date_from_to[1]
        }
      })
      // save filters to store
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
    }

    const onChangeShowBy = async () => {
      updateParamRequestFinancing({
        data: {
          show_by: filter.show_by
        }
      })
      // save filters to store
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
    }

    const onChangeTabGroup = async (value) => {
      // Check show tab all
      if (value !== 0) {
        await fetchBankAccounts({ group_id: value })
        filter.show_by = 1
        filter.bank_account_ids = bankAccountList.value[0].id
        isDisabledDisplay.value = false
        isDisabledBank.value = false
        updateParamRequestFinancing({ data: { group_id: filter.group_id } })
      } else {
        filter.show_by = 0
        filter.bank_account_ids = bankAccountList?.value[0]?.id
        isDisabledDisplay.value = true
        isDisabledBank.value = true
        isDisabledCurrency.value = false
        updateParamRequestFinancing({ data: { group_id: null } })
      }
      updateParamRequestFinancing({
        data: { show_by: filter.show_by, bank_account_ids: [] }
      })

      // save filters to store
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
    }

    const onChangeBankAccount = async () => {
      if (filter.bank_account_ids !== 0) {
        isDisabledCurrency.value = true
        updateParamRequestFinancing({
          data: {
            currency_code: filter.currency_code,
            bank_account_ids: [filter.bank_account_ids]
          }
        })
      } else {
        isDisabledCurrency.value = false
        let currencyCode = currencyList?.value.find((item) => item.code === 'JPY')
        filter.currency_code = currencyCode.code
        updateParamRequestFinancing({ data: { bank_account_ids: [] } })
      }
      // save filters to store
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
    }

    const onChangeViewMode = async () => {}

    const onChangeCurrency = async () => {
      updateParamRequestFinancing({ data: { currency_code: filter.currency_code } })
    }

    // Fetch data group
    const fetchGroupList = async () => {
      const { getGroups } = useGetGroupListService()
      const { result } = await getGroups()

      groupList.value = result?.data
      groupList.value.push(initialGroup)
    }

    // Fetch data period
    const fetchPeriodList = async (groupID) => {
      const { getPeriods } = useGetPeriodListService(groupID)
      const { result } = await getPeriods()

      periodList.value = result?.data
    }

    // Fetch bank accounts
    const fetchBankAccounts = async (groupID) => {
      remove(bankAccountList.value)
      const { getBankAccounts } = useGetBankAccountsService(groupID)
      const { result } = await getBankAccounts()
      bankAccountList.value = result?.data
      bankAccountList.value.unshift(initialBankAccount)
    }

    // Fetch currency
    const fetchCurrency = async () => {
      const { getCurrency } = useGetCurrencyService()
      const { result } = await getCurrency()

      currencyList.value = result?.data
    }

    const onSortTable = async (emitData) => {
      let currentSortStr = ''
      if (emitData.orderBy !== '') {
        currentSortStr = `${emitData.field} ${emitData.orderBy}`
      }
      updateParamRequestFinancing({ params: { orderBy: currentSortStr } })
    }

    const onFilterRender = async (newFilterRequest) => {
      console.log(newFilterRequest)
      debugger
      if (newFilterRequest) {
        const dataFilter = await convertDataFilter(newFilterRequest)
        Object.assign(filter, dataFilter)
        await fetchDataTableFinancing(newFilterRequest, requestParamsData.value.params)
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
        dataColumnsTableFinancing.value.unshift(initialColumns.value[0])

        dataColumnsTableFinancing.value.push(initialColumns.value[1])
      }
      if (data.length < 5) {
        dataColumnsTableFinancing.value.map((item) => {
          delete item.width
          delete item.fixed
          return item
        })
        scrollCustom.value = { y: height.value - 274 }
      } else {
        scrollCustom.value = { x: 1500, y: height.value - 274 }
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
        const { getLists } = useGetFinancingListService(data, params)
        const { result } = await getLists()

        remove(dataRowsTableFinancing.value)
        remove(dataColumnsTableFinancing.value)
        remove(dataColumnsNameTable.value)
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
      await fetchGroupList()
      await fetchCurrency()

      // get filters financing from store
      const filtersFinancingStore = store.state.financing?.filters || {}
      let groupID = filter?.group_id || null
      let currencyDefault = currencyList?.value.find((item) => item.code === 'JPY')

      // Load data by filter store
      if (!isEmpty(filtersFinancingStore)) {
        const dataFilter = await convertDataFilter(filtersFinancingStore.data)

        Object.assign(filter, dataFilter)
        Object.assign(requestParamsData.value, filtersFinancingStore)
        groupID = filter?.group_id || null
        if (groupID === null) {
          await fetchPeriodList(1)
          await fetchBankAccounts({ group_id: 1 })
        } else {
          await fetchPeriodList(groupID)
          await fetchBankAccounts({ group_id: groupID })
        }

        if (groupID === null) {
          filter.group_id = groupList?.value[groupList.value.length - 1].id
          isDisabledDisplay.value = true
          isDisabledBank.value = true
        }

        if (filter.bank_account_ids.length === 0) {
          filter.bank_account_ids = bankAccountList?.value[0]?.id
        }

        isDisabledCurrency.value = !!filter.bank_account_ids
      } else {
        // Load data default
        if (groupID) {
          await fetchPeriodList(groupID)
          await fetchBankAccounts({ group_id: groupID })

          let periodCurrentFound = findCurrentPeriod(periodList.value)
          filter.period_id = periodCurrentFound?.id || null
        }

        filter.currency_code = currencyDefault?.code || null
        filter.bank_account_ids = bankAccountList?.value[0]?.id
        requestParamsData.value.data.group_id = filter?.group_id || null
        requestParamsData.value.data.period_id = filter?.period_id || null
      }

      updateDataRequest.value = requestParamsData.value
      // save filters to store
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
      await fetchDataTableFinancing(requestParamsData.value.data, requestParamsData.value.params)
    })

    onMounted(() => {
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getInnerHeight)
    })
    // watch to fetch data financing
    watch(
      () => requestParamsData.value,
      () => {
        updateDataRequest.value = requestParamsData.value
        // store.getters.finanancing
        // fetch data table
        fetchDataTableFinancing(requestParamsData.value.data, requestParamsData.value.params)
      }
    )
    // watch to event click table financing
    // watch(
    //   () => store.state.financing.filters,
    //   () => {
    //     // fetch data table
    //     onFilterRender()
    //   }
    // )

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
      updateDataRequest,
      scrollCustom,
      height,
      updateParamRequestFinancing,
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
      exportFinancingCsvFile,
      onFilterRender
    }
  }
})
</script>
<style scoped lang="scss"></style>
