<template>
  <section class="financing">
    <div class="financing__header">
      <div class="financing__header--top u-mx-32">
        <div class="financing__header--wrap">
          <template v-if="isTabAllGroup">
            <div class="form-group">
              <label class="form-label">{{ $t('financing.financing_list.company') }}:</label>

              <div class="form-select">
                <a-select v-model:value="groupCompany.group_id" class="dropdown-company" @change="onChangeCompany">
                  <a-select-option v-for="item in groupListTabAll" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </template>
          <!--Stages-->
          <div class="form-group">
            <label class="form-label">{{ $t('financing.financing_list.stages') }}:</label>

            <div class="form-select">
              <a-select v-model:value="filter.period_id" @change="onChangePeriod">
                <a-select-option v-for="item in periodList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <!--./Stages -->
          <template v-if="!isTabAllGroup">
            <!--Date From-->
            <div class="form-group">
              <label class="form-label"> {{ $t('financing.financing_list.date') }}: </label>

              <div class="form-select">
                <a-range-picker
                  v-model:value="filter.date_from_to"
                  :format="filter.show_by ? 'YYYY-MM-DD' : 'YYYY-MM'"
                  :style="{ width: '260px' }"
                  :placeholder="filter.show_by ? ['YYYY/MM/DD', 'YYYY/MM/DD'] : ['YYYY/MM', 'YYYY/MM']"
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
                <a-radio-group v-model:value="filter.show_by" @change="onChangeShowBy(filter.show_by)">
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
          </template>
        </div>
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
            <a-radio-group v-model:value="filter.view_mode" @change="onChangeViewMode(filter.view_mode)">
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

    <financing-chart :data-chart="dataChartFinancing" :is-visible="idVisible" @on-tab-change="handleTab" />
  </section>
</template>
<script>
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { dropRight, forEach, isEmpty, remove } from 'lodash-es'

import useGetGroupListService from '@/views/FinancingChart/composables/useGetGroupListService'
import useGetPeriodListService from '@/views/FinancingChart/composables/useGetPeriodListService'
import useGetBankAccountsService from '@/views/FinancingChart/composables/useGetBankAccountsService'
import useGetCurrencyService from '@/views/FinancingChart/composables/useGetCurrencyService'
import useGetDataChartService from '@/views/FinancingChart/composables/useGetDataChartService'

import { currentDate, addDaysInCurrentDate, getDiffDays } from '@/helpers/extend-financing'

import FinancingChart from '@/views/FinancingChart/-components/FinancingChart'

import { VIEW_MODE } from '@/enums/financing.enum'
import { SHOW_BY } from '@/enums/financing.enum'
import { CalendarOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Index',

  components: { CalendarOutlined, FinancingChart },

  setup() {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()

    const groupList = ref([])
    const groupListTabAll = ref([])
    const periodList = ref([])
    const bankAccountList = ref([])
    const currencyList = ref([])

    // Chart
    const dataChartFinancing = ref([])
    const idVisible = ref(false)
    const tabGroup = ref()

    const isLoading = ref(false)
    const isLoadingDataChart = ref(true)
    const isDisabledDate = ref(false)
    const isDisabledDisplay = ref(false)
    const isDisabledBank = ref(false)
    const isDisabledCurrency = ref(false)
    const isTabAllGroup = ref(false)

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

    const groupCompany = ref({
      group_id: 1
    })

    const requestParamsData = ref({
      data: { ...initialDataRequest }
    })

    const updateParamRequestFinancing = ({ data = {} }) => {
      requestParamsData.value = {
        data: { ...requestParamsData.value.data, ...data },
        group_id: groupCompany.value.group_id
      }
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
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
      view_mode: 1,
      bank_account_ids: null,
      currency_code: null
    }

    const filter = reactive({ ...initialStateFilter })

    // Handle filter
    const onChangeCompany = async (event) => {
      await fetchPeriodList(event)
      forEach(periodList.value, (value) => {
        value.currentPeriod ? (filter.period_id = value.id) : null
      })
      updateParamRequestFinancing({
        data: { group_id: null, from_date: null, to_date: null, period_id: filter.period_id }
      })
    }

    const onChangePeriod = async (event) => {
      isDisabledDate.value = !(event === undefined || event === null)
      if (filter.period_id === undefined) filter.period_id = null

      filter.date_from_to[0] = filter.period_id === null ? currentDate() : null
      filter.date_from_to[1] = filter.period_id === null ? addDaysInCurrentDate(null, 59) : null

      updateParamRequestFinancing({
        data: {
          period_id: filter.period_id,
          from_date: filter.date_from_to[0],
          to_date: filter.date_from_to[1]
        }
      })
    }

    const onChangeDate = async (value, dateString) => {
      forEach(periodList.value, (value) => {
        value.currentPeriod ? (filter.period_id = value.id) : null
      })
      if (dateString.length > 1) {
        if (!filter.show_by) {
          let checkDateUndefined = filter.date_from_to[0] === null && filter.date_from_to[1] === null

          filter.period_id = checkDateUndefined ? filter.period_id : null
          filter.date_from_to[0] = checkDateUndefined ? null : currentDate(value[0])
          filter.date_from_to[1] = checkDateUndefined ? null : currentDate(value[1])
        } else {
          if (getDiffDays(dateString[0], dateString[1]) > 59) {
            store.commit('flash/STORE_FLASH_MESSAGE', {
              variant: 'error',
              message: 'errors.chart_date_2m'
            })
          }

          filter.period_id = !dateString[0] && !dateString[1] ? filter.period_id : null
          filter.date_from_to[0] = !dateString[0] && !dateString[1] ? null : currentDate(dateString[0])
          filter.date_from_to[1] =
            getDiffDays(dateString[0], dateString[1]) > 59
              ? addDaysInCurrentDate(dateString[0], 59)
              : currentDate(dateString[1])

          if (!dateString[0] && !dateString[1]) filter.date_from_to[1] = null
        }

        updateParamRequestFinancing({
          data: {
            period_id: filter.period_id,
            from_date: filter.date_from_to[0],
            to_date: filter.date_from_to[1]
          }
        })
      }
    }

    const onChangeShowBy = async (value) => {
      let startPiker = requestParamsData.value.data.from_date
      let endPiker = requestParamsData.value.data.to_date

      if (filter.period_id === null) {
        if (getDiffDays(startPiker, endPiker) > 59) {
          store.commit('flash/STORE_FLASH_MESSAGE', {
            variant: 'error',
            message: 'errors.chart_date_2m'
          })
          filter.show_by = value
        }

        filter.date_from_to[0] = currentDate(startPiker)
        filter.date_from_to[1] =
          getDiffDays(startPiker, endPiker) > 59 ? addDaysInCurrentDate(startPiker, 59) : currentDate(endPiker)
      }

      updateParamRequestFinancing({
        data: {
          show_by: filter.show_by,
          from_date: filter.date_from_to[0],
          to_date: filter.date_from_to[1]
        }
      })
    }

    const onChangeTabGroup = async (value) => {
      value !== 0 ? (isTabAllGroup.value = false) : (isTabAllGroup.value = true)
      let currencyCode = requestParamsData.value.data.currency_code
      let currencyDefault = currencyList?.value.find((item) => item.code === 'JPY')
      filter.period_id = null

      if (value !== 0) {
        await fetchBankAccounts({ group_id: value })
        await fetchPeriodList(value)
        if (!filter.date_from_to[0]) {
          forEach(periodList.value, (value) => {
            value.currentPeriod ? (filter.period_id = value.id) : null
          })
          updateParamRequestFinancing({
            data: { from_date: filter.date_from_to[0], to_date: filter.date_from_to[1], period_id: filter.period_id }
          })
        } else {
          updateParamRequestFinancing({
            data: { from_date: filter.date_from_to[0], to_date: filter.date_from_to[1] }
          })
        }
      } else {
        await fetchPeriodList(groupCompany.value.group_id)
        forEach(periodList.value, (value) => {
          value.currentPeriod ? (filter.period_id = value.id) : null
        })
        updateParamRequestFinancing({
          data: { group_id: null, from_date: null, to_date: null, period_id: filter.period_id }
        })
      }

      filter.currency_code = currencyCode === null ? currencyDefault?.code : currencyCode
      filter.show_by = value !== 0 ? requestParamsData.value.data.show_by : 0
      filter.bank_account_ids = bankAccountList?.value[0]?.id

      updateParamRequestFinancing({
        data: {
          group_id: value !== 0 ? value : null,
          show_by: filter.show_by,
          bank_account_ids: []
        }
      })

      idVisible.value = value === 0
      isDisabledDisplay.value = value === 0
      isDisabledBank.value = value === 0
      isDisabledCurrency.value = false
    }

    const handleTab = (evt) => {
      requestParamsData.value.data = {
        ...evt,
        currency_code: requestParamsData.value.data.currency_code
      }

      filter.group_id = evt.group_id
      filter.period_id = evt.period_id
      filter.date_from_to[0] = evt.from_date
      filter.date_from_to[1] = evt.to_date

      onChangeTabGroup(evt.group_id)
    }

    const onChangeBankAccount = async () => {
      let currencyCode = currencyList?.value.find((item) => item.code === 'JPY')

      filter.currency_code = filter.bank_account_ids !== 0 ? null : currencyCode.code

      updateParamRequestFinancing({
        data: {
          bank_account_ids: filter.bank_account_ids !== 0 ? [filter.bank_account_ids] : [],
          currency_code: filter.currency_code
        }
      })

      isDisabledCurrency.value = filter.bank_account_ids !== 0
    }

    const onChangeViewMode = async (mode) => {
      if (!mode) {
        await router.push({ name: 'financing' })
      }
    }

    const onChangeCurrency = async () => {
      updateParamRequestFinancing({ data: { currency_code: filter.currency_code } })
    }

    // Fetch data group
    const fetchGroupList = async () => {
      const { getGroupsFinancing } = useGetGroupListService()
      const { result } = await getGroupsFinancing()

      groupListTabAll.value = dropRight(result?.data, 0)
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
      bankAccountList.value = result?.data || []
      bankAccountList?.value?.unshift(initialBankAccount)
    }

    // Fetch currency
    const fetchCurrency = async () => {
      const { getCurrency } = useGetCurrencyService()
      const { result } = await getCurrency()

      currencyList.value = result?.data
    }

    const fetchDataChartFinancing = async (data, params) => {
      isLoadingDataChart.value = true
      // eslint-disable-next-line no-useless-catch
      try {
        const { getDataChart } = useGetDataChartService(data, params)
        const { result } = await getDataChart()

        remove(dataChartFinancing.value)
        dataChartFinancing.value = result?.data?.data
      } finally {
        isLoadingDataChart.value = false
      }

      localStorage.setItem('flag_chart', true)
    }

    const resetFilterChart = async () => {
      let flagChart = JSON.parse(localStorage.getItem('flag_chart'))
      let initialDataRequest = {
        group_id: groupList.value[0].id,
        period_id: null,
        from_date: null,
        to_date: null,
        show_by: 1,
        bank_account_ids: [],
        currency_code: null
      }
      let groupID = filter?.group_id || null

      if (groupID === null) {
        await fetchPeriodList(groupList.value[0].id)
        await fetchBankAccounts({ group_id: groupList.value[0].id })
      } else {
        await fetchPeriodList(groupID)
        await fetchBankAccounts({ group_id: groupID })
      }

      let currencyDefault = currencyList?.value.find((item) => item.code === 'JPY')

      if (localStorage.getItem('flag_chart') === null || !flagChart) {
        filter.currency_code = currencyDefault?.code
        filter.period_id = null
        filter.date_from_to = [currentDate(), addDaysInCurrentDate(null, 59)]
        filter.group_id = groupList.value[0].id
        filter.bank_account_ids = bankAccountList?.value[0]?.id
        filter.show_by = 1

        initialDataRequest = {
          ...initialDataRequest,
          group_id: groupList.value[0].id,
          from_date: currentDate(),
          to_date: addDaysInCurrentDate(null, 59)
        }

        requestParamsData.value.data = { ...initialDataRequest }
      } else {
        if (groupID === null) {
          filter.group_id = groupList?.value[groupList.value.length - 1].id
          isDisabledDisplay.value = true
          isDisabledBank.value = true
          isTabAllGroup.value = true
        }
        groupCompany.value.group_id = store.getters['financing/filters'].group_id || {}
        await fetchPeriodList(groupCompany.value.group_id)

        filter.period_id = requestParamsData.value.data.period_id
        filter.date_from_to[0] = requestParamsData.value.data.from_date
        filter.date_from_to[1] = requestParamsData.value.data.to_date
        filter.bank_account_ids =
          requestParamsData.value.data.bank_account_ids.length === 0 ? 0 : requestParamsData.value.data.bank_account_ids
        filter.currency_code =
          requestParamsData.value.data.currency_code === null
            ? currencyDefault?.code
            : requestParamsData.value.data.currency_code

        requestParamsData.value.data = {
          ...requestParamsData.value.data,
          currency_code: filter.currency_code,
          bank_account_ids: filter.bank_account_ids !== 0 ? filter.bank_account_ids : [],
          period_id: filter.period_id,
          from_date: filter.date_from_to[0],
          to_date: filter.date_from_to[1]
        }

        isDisabledCurrency.value = filter.bank_account_ids !== 0
      }

      const { getDataChart } = useGetDataChartService(requestParamsData.value.data)
      const { result } = await getDataChart()

      dataChartFinancing.value = result?.data?.data
    }

    const loadDataDefault = async () => {
      localStorage.removeItem('flag_chart')
      let groupID = groupList.value[0].id || null
      let currencyDefault = currencyList?.value.find((item) => item.code === 'JPY')
      if (groupID) {
        await fetchPeriodList(groupID)
        await fetchBankAccounts({ group_id: groupID })
      }
      filter.group_id = groupList.value[0].id
      filter.currency_code = currencyDefault?.code || null
      filter.bank_account_ids = bankAccountList?.value[0]?.id
      filter.period_id = null
      filter.date_from_to[0] = currentDate() || null
      filter.date_from_to[1] = addDaysInCurrentDate(null, 59) || null
      requestParamsData.value.data = {
        ...requestParamsData.value.data,
        group_id: groupList.value[0].id,
        period_id: filter.period_id,
        from_date: filter.date_from_to[0],
        to_date: filter.date_from_to[1]
      }
      const { getDataChart } = useGetDataChartService(requestParamsData.value.data)
      const { result } = await getDataChart()

      dataChartFinancing.value = result?.data?.data
    }

    onBeforeMount(async () => {
      await fetchGroupList()
      await fetchCurrency()

      // get filters financing from store
      const filtersFinancingStore = store.state.financing?.filters || {}

      // Load data by filter store
      if (!isEmpty(filtersFinancingStore)) {
        Object.assign(filter, filtersFinancingStore.data)
        Object.assign(requestParamsData.value, filtersFinancingStore)

        // reset default chart
        await resetFilterChart()
      } else {
        // Load data default
        await loadDataDefault()
      }
    })

    // watch to fetch data financing
    watch(
      () => requestParamsData.value,
      () => {
        // fetch data chart
        fetchDataChartFinancing(requestParamsData.value.data)
      }
    )

    return {
      groupList,
      periodList,
      bankAccountList,
      currencyList,
      filter,
      isLoading,
      isDisabledDisplay,
      isDisabledBank,
      isDisabledCurrency,
      dataChartFinancing,
      idVisible,
      tabGroup,
      isTabAllGroup,
      groupCompany,
      groupListTabAll,
      handleTab,
      onChangePeriod,
      onChangeDate,
      onChangeShowBy,
      onChangeTabGroup,
      onChangeBankAccount,
      onChangeViewMode,
      onChangeCurrency,
      onChangeCompany,
      SHOW_BY,
      VIEW_MODE
    }
  }
})
</script>
