<template>
  <section class="financing">
    <div class="financing__header">
      <div class="financing__header--top u-mx-32">
        <div class="financing__header--wrap">
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
                :format="filter.show_by ? 'YYYY-MM-DD' : 'YYYY-MM'"
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
        </div>
      </div>
      <div class="financing__header--middle">
        <a-tabs ref="tabGroup" v-model:activeKey="filter.group_id" @change="onChangeTabGroup">
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
import moment from 'moment'

import { isEmpty, remove } from 'lodash-es'

import useGetGroupListService from '@/views/FinancingChart/composables/useGetGroupListService'
import useGetPeriodListService from '@/views/FinancingChart/composables/useGetPeriodListService'
import useGetBankAccountsService from '@/views/FinancingChart/composables/useGetBankAccountsService'
import useGetCurrencyService from '@/views/FinancingChart/composables/useGetCurrencyService'
import useGetDataChartService from '@/views/FinancingChart/composables/useGetDataChartService'

import { convertDataFilter, findCurrentPeriod } from './composables/useFinancing'

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
      data: { ...initialDataRequest }
    })

    const updateParamRequestFinancing = ({ data = {} }) => {
      requestParamsData.value = {
        data: { ...requestParamsData.value.data, ...data }
      }
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
    const onChangePeriod = async (event) => {
      isDisabledDate.value = !(event === undefined || event === null)
      if (filter.period_id === undefined) {
        filter.period_id = null
        filter.date_from_to[0] = moment().format('YYYY-MM-DD')
        filter.date_from_to[1] = moment().add(59, 'days').format('YYYY-MM-DD')
        updateParamRequestFinancing({
          data: {
            period_id: filter.period_id,
            from_date: moment().format('YYYY-MM-DD'),
            to_date: moment().add(59, 'days').format('YYYY-MM-DD')
          }
        })
      } else {
        filter.date_from_to[0] = null
        filter.date_from_to[1] = null
        updateParamRequestFinancing({
          data: {
            period_id: filter.period_id,
            from_date: null,
            to_date: null
          }
        })
      }

      // save filters to store
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
    }

    const onChangeDate = async (value, dateString) => {
      const startDate = new Date(dateString[0])
      const endDate = new Date(dateString[1])
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const diffDays = Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)
      let periodCurrentFound = findCurrentPeriod(periodList.value)
      if (dateString.length > 1) {
        if (!filter.show_by) {
          if (!filter.show_by) {
            if (filter.date_from_to[0] === undefined && filter.date_from_to[1] === undefined) {
              filter.period_id = periodCurrentFound?.id || null
              filter.date_from_to[0] = null
              filter.date_from_to[1] = null
              updateParamRequestFinancing({
                data: {
                  period_id: filter.period_id,
                  from_date: null,
                  to_date: null
                }
              })
            } else {
              if (diffDays <= 60) {
                filter.period_id = null
                filter.date_from_to[0] = dateString[0] || null
                filter.date_from_to[1] = moment(dateString[0]).add(59, 'days').format('MM') || null
                updateParamRequestFinancing({
                  data: {
                    period_id: filter.period_id,
                    from_date: moment(dateString[0]).format('YYYY-MM-DD') || null,
                    to_date: moment(dateString[0]).add(59, 'days').format('MM') || null
                  }
                })
              } else {
                filter.period_id = null
                filter.date_from_to[0] = dateString[0] || null
                filter.date_from_to[1] = dateString[1] || null
                updateParamRequestFinancing({
                  data: {
                    period_id: filter.period_id,
                    from_date: moment(dateString[0]).format('YYYY-MM-DD') || null,
                    to_date: moment(dateString[1]).format('YYYY-MM-DD') || null
                  }
                })
              }
            }
          } else {
            filter.period_id = null
            filter.date_from_to[0] = dateString[0] || null
            filter.date_from_to[1] = dateString[1] || null
            updateParamRequestFinancing({
              data: {
                period_id: filter.period_id,
                from_date: moment(dateString[0]).format('YYYY-MM-DD') || null,
                to_date: moment(dateString[1]).format('YYYY-MM-DD') || null
              }
            })
          }
        } else {
          filter.period_id = null
          filter.date_from_to[0] = dateString[0] || null
          filter.date_from_to[1] = dateString[1] || null
          updateParamRequestFinancing({
            data: {
              period_id: filter.period_id,
              from_date: dateString[0] || null,
              to_date: dateString[1] || null
            }
          })
          if (diffDays > 59) {
            store.commit('flash/STORE_FLASH_MESSAGE', {
              variant: 'error',
              message: 'errors.chart_date_2m'
            })
            filter.period_id = requestParamsData.value.data.period_id
            filter.date_from_to[0] = dateString[0] || null
            filter.date_from_to[1] = moment(dateString[0]).add(59, 'days').format('YYYY-MM-DD') || null
            updateParamRequestFinancing({
              data: {
                period_id: requestParamsData.value.data.period_id,
                from_date: moment(dateString[0]).format('YYYY-MM-DD') || null,
                to_date: moment(dateString[0]).add(59, 'days').format('YYYY-MM-DD') || null
              }
            })
          }
          if (!dateString[0] && !dateString[1]) {
            filter.period_id = periodCurrentFound?.id || null
            filter.date_from_to[0] = null
            filter.date_from_to[1] = null
            updateParamRequestFinancing({
              data: {
                period_id: filter.period_id,
                from_date: null,
                to_date: null
              }
            })
          }
        }

        // save filters to store
        store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
      }
    }

    const onChangeShowBy = async (value) => {
      const startDate = new Date(requestParamsData.value.data.from_date)
      const endDate = new Date(requestParamsData.value.data.to_date)
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const diffDays = Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)
      if (diffDays > 59) {
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'error',
          message: 'errors.chart_date_2m'
        })
        filter.period_id = requestParamsData.value.data.period_id
        filter.show_by = value
        filter.date_from_to[0] = requestParamsData.value.data.from_date
        filter.date_from_to[1] = moment(requestParamsData.value.data.from_date).add(59, 'days').format('YYYY-MM-DD')
        updateParamRequestFinancing({
          data: {
            show_by: value,
            from_date: requestParamsData.value.data.from_date,
            to_date: moment(requestParamsData.value.data.from_date).add(59, 'days').format('YYYY-MM-DD')
          }
        })
      } else {
        filter.period_id = requestParamsData.value.data.period_id
        filter.show_by = value
        filter.date_from_to[0] = requestParamsData.value.data.from_date
        filter.date_from_to[1] = requestParamsData.value.data.to_date
        updateParamRequestFinancing({
          data: {
            show_by: value,
            from_date: requestParamsData.value.data.from_date,
            to_date: requestParamsData.value.data.to_date
          }
        })
      }

      // save filters to store
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
    }

    const onChangeTabGroup = async (value) => {
      const startDate = new Date(requestParamsData.value.data.from_date)
      const endDate = new Date(requestParamsData.value.data.to_date)
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const diffDays = Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)
      // Check show tab all
      if (value !== 0) {
        await fetchBankAccounts({ group_id: value })
        idVisible.value = false
        filter.bank_account_ids = bankAccountList.value[0].id
        isDisabledDisplay.value = false
        isDisabledBank.value = false
        if (!filter.show_by) {
          filter.show_by = requestParamsData.value.data.show_by
          filter.period_id = requestParamsData.value.data.period_id
          filter.date_from_to[0] = requestParamsData.value.data.from_date
          filter.date_from_to[1] = requestParamsData.value.data.to_date
          filter.show_by = requestParamsData.value.data.show_by
          updateParamRequestFinancing({
            data: {
              show_by: filter.show_by,
              period_id: requestParamsData.value.data.period_id,
              group_id: value,
              from_date: requestParamsData.value.data.from_date,
              to_date: requestParamsData.value.data.to_date
            }
          })
        } else {
          if (diffDays > 59) {
            store.commit('flash/STORE_FLASH_MESSAGE', {
              variant: 'error',
              message: 'errors.chart_date_2m'
            })
            filter.show_by = requestParamsData.value.data.show_by
            filter.group_id = value
            filter.period_id = requestParamsData.value.data.period_id
            filter.date_from_to[0] = requestParamsData.value.data.from_date
            filter.date_from_to[1] = moment(requestParamsData.value.data.from_date).add(59, 'days').format('YYYY-MM-DD')
            updateParamRequestFinancing({
              data: {
                show_by: requestParamsData.value.data.show_by,
                group_id: value,
                period_id: requestParamsData.value.data.period_id,
                from_date: requestParamsData.value.data.from_date,
                to_date: moment(requestParamsData.value.data.from_date).add(59, 'days').format('YYYY-MM-DD')
              }
            })
          } else {
            filter.show_by = !filter.show_by ? requestParamsData.value.data.show_by : 1
            filter.group_id = value
            filter.period_id = requestParamsData.value.data.period_id
            filter.date_from_to[0] = requestParamsData.value.data.from_date
            filter.date_from_to[1] = requestParamsData.value.data.to_date
            filter.bank_account_ids = 0
            updateParamRequestFinancing({
              data: {
                bank_account_ids: [],
                show_by: filter.show_by,
                group_id: filter.group_id,
                period_id: filter.period_id,
                from_date: filter.date_from_to[0],
                to_date: filter.date_from_to[1]
              }
            })
          }
        }
        // save filters to store
        store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
      } else {
        idVisible.value = true
        filter.show_by = 0
        filter.bank_account_ids = bankAccountList?.value[0]?.id
        isDisabledDisplay.value = true
        isDisabledBank.value = true
        requestParamsData.value.data = {
          ...requestParamsData.value.data,
          group_id: null,
          show_by: filter.show_by
        }
        // save filters to store
        store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
      }

      isDisabledCurrency.value = false

    }

    const handleTab = (evt) => {
      requestParamsData.value.data = {
        ...evt,
        currency_code: requestParamsData.value.data.currency_code
      }

      filter.group_id = evt.group_id
      filter.date_from_to[0] = evt.from_date
      filter.date_from_to[1] = evt.to_date

      onChangeTabGroup(evt.group_id)
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

    const onChangeViewMode = async (mode) => {
      if (!mode) {
        await router.push({ name: 'financing' })
      }
    }

    const onChangeCurrency = async () => {
      updateParamRequestFinancing({ data: { currency_code: filter.currency_code } })
      store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value)
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

      localStorage.setItem('flagChart', true)
    }

    const resetFilterChart = async () => {
      let flagChart = JSON.parse(localStorage.getItem('flagChart'))
      let initialDataRequest = {
        group_id: 1,
        period_id: null,
        from_date: null,
        to_date: null,
        show_by: 1,
        bank_account_ids: [],
        currency_code: null
      }
      let groupID = filter?.group_id || null
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
      let currencyDefault = currencyList?.value.find((item) => item.code === 'JPY')
      filter.currency_code = currencyDefault?.code || null
      if (filter.bank_account_ids.length === 0) {
        filter.bank_account_ids = bankAccountList?.value[0]?.id
      }

      isDisabledCurrency.value = !!filter.bank_account_ids

      if (localStorage.getItem('flagChart') === null || !flagChart) {
        filter.period_id = null
        filter.date_from_to = [moment().format('YYYY-MM-DD'), moment().add(59, 'days').format('YYYY-MM-DD')]
        filter.group_id = 1
        filter.bank_account_ids = 0
        filter.show_by = 1

        initialDataRequest = {
          group_id: 1,
          period_id: null,
          from_date: moment().format('YYYY-MM-DD'),
          to_date: moment().add(59, 'days').format('YYYY-MM-DD'),
          show_by: 1,
          bank_account_ids: [],
          currency_code: null
        }

        requestParamsData.value.data = {...initialDataRequest}

        const { getDataChart } = useGetDataChartService(requestParamsData.value.data)
        const { result } = await getDataChart()

        remove(dataChartFinancing.value)
        dataChartFinancing.value = result?.data?.data

        store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value.data)
      } else {
        filter.currency_code =
          requestParamsData.value.data.currency_code === null
            ? currencyDefault?.code
            : requestParamsData.value.data.currency_code
        filter.period_id = requestParamsData.value.data.period_id
        filter.date_from_to[0] = requestParamsData.value.data.from_date
        filter.date_from_to[1] = requestParamsData.value.data.to_date
        requestParamsData.value.data = {
          ...requestParamsData.value.data,
          period_id: filter.period_id,
          from_date: requestParamsData.value.data.from_date,
          to_date: requestParamsData.value.data.to_date
        }
        const { getDataChart } = useGetDataChartService(requestParamsData.value.data)
        const { result } = await getDataChart()

        remove(dataChartFinancing.value)
        dataChartFinancing.value = result?.data?.data

        store.commit('financing/STORE_FINANCING_FILTER', requestParamsData.value.data)
      }
    }

    onBeforeMount(async () => {
      await fetchGroupList()
      await fetchCurrency()

      // get filters financing from store
      const filtersFinancingStore = store.state.financing?.filters || {}

      // Load data by filter store
      if (!isEmpty(filtersFinancingStore)) {
        const dataFilter = await convertDataFilter(filtersFinancingStore.data)

        Object.assign(filter, dataFilter)
        Object.assign(requestParamsData.value, filtersFinancingStore)

        // reset default chart
        await resetFilterChart()

      } else {
        // Load data default
        localStorage.removeItem('flagChart')
        let groupID = filter?.group_id || null
        let currencyDefault = currencyList?.value.find((item) => item.code === 'JPY')
        if (groupID) {
          await fetchPeriodList(groupID)
          await fetchBankAccounts({ group_id: groupID })
        }
        filter.currency_code = currencyDefault?.code || null
        filter.bank_account_ids = bankAccountList?.value[0]?.id
        requestParamsData.value.data.group_id = filter?.group_id || null
        filter.period_id = null
        filter.date_from_to[0] = moment().format('YYYY-MM-DD')
        filter.date_from_to[1] = moment().add(59, 'days').format('YYYY-MM-DD')
        requestParamsData.value.data = {
          ...requestParamsData.value.data,
          period_id: null,
          from_date: moment().format('YYYY-MM-DD'),
          to_date: moment().add(59, 'days').format('YYYY-MM-DD')
        }
        const { getDataChart } = useGetDataChartService(requestParamsData.value.data)
        const { result } = await getDataChart()

        remove(dataChartFinancing.value)
        dataChartFinancing.value = result?.data?.data
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
      handleTab,
      onChangePeriod,
      onChangeDate,
      onChangeShowBy,
      onChangeTabGroup,
      onChangeBankAccount,
      onChangeViewMode,
      onChangeCurrency,
      SHOW_BY,
      VIEW_MODE
    }
  }
})
</script>
<style scoped lang="scss"></style>
