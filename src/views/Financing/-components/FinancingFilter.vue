<template>
  <div class="financing__header">
    <div class="financing__header--top u-mx-32">
      <div class="financing__header--wrap">
        <template v-if="isTabAllGroup">
          <div class="form-group">
            <label class="form-label">{{ $t('financing.financing_list.company') }}</label>

            <div class="form-select">
              <a-select
                v-model:value="groupCompany.group_id"
                class="dropdown-company"
                allow-clear
                @change="onChangeCompany"
              >
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
            <a-select v-model:value="filter.period_id" allow-clear @change="onChangePeriod">
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
        </template>
      </div>
      <!-- Download CSV -->
      <a-tooltip placement="topLeft" title="CSV ファイルダウンロード">
        <a-button type="link" class="btn-download" :loading="isLoadingExportCsv" @click="onExportFinancingCsv">
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
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { onBeforeMount, reactive, ref, watch } from 'vue'
import { isEmpty, remove, dropRight, forEach } from 'lodash-es'
import { useRouter } from 'vue-router'
import moment from 'moment'

import useGetGroupListService from '@/views/Financing/composables/useGetGroupListService'
import useGetPeriodListService from '@/views/Financing/composables/useGetPeriodListService'
import useGetBankAccountsService from '@/views/Financing/composables/useGetBankAccountsService'
import useGetCurrencyService from '@/views/Financing/composables/useGetCurrencyService'

import { addDaysInCurrentDate, convertDataFilter, currentDate, findCurrentPeriod } from '@/helpers/extend-financing'
import { CalendarOutlined } from '@ant-design/icons-vue'
import IconCsv from '@/assets/icons/ico_csv.svg'
import { SHOW_BY, VIEW_MODE } from '@/enums/financing.enum'

export default {
  name: 'FinancingFilter',

  components: {
    CalendarOutlined,
    IconCsv
  },

  props: {
    // eslint-disable-next-line vue/require-default-prop
    dataFilterTable: {
      type: [Object, Array],
      required: false
    },
    isLoadingExportCsv: {
      type: Boolean,
      required: true
    }
  },
  emits: ['onFilterRequest', 'onExportCsv'],

  setup(props, { emit }) {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()

    const groupList = ref([])
    const groupListTabAll = ref([])
    const periodList = ref([])
    const periodDefault = ref([])
    const bankAccountList = ref([])
    const bankAccountId = ref([])
    const currencyList = ref([])
    const currencyDefault = ref()
    const fromDateRangePicker = ref()
    const toDateRangePicker = ref()

    const isLoadingDataTable = ref(true)
    const isDisabledPeriod = ref(false)
    const isDisabledDate = ref(false)
    const isDisabledDisplay = ref(false)
    const isDisabledBank = ref(false)
    const isDisabledCurrency = ref(false)
    const isTabAllGroup = ref(false)

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
      group_id: null,
      period_id: null,
      date_from_to: [null, null],
      show_by: 1,
      view_mode: 0,
      bank_account_ids: null,
      currency_code: null
    }

    const groupCompany = ref({
      group_id: 1
    })

    const filter = reactive({ ...initialStateFilter })

    const initialDataRequest = {
      group_id: null,
      period_id: null,
      from_date: null,
      to_date: null,
      show_by: 1,
      bank_account_ids: [],
      currency_code: null
    }

    const dataFilterRequest = ref({
      data: { ...initialDataRequest },
      params: {}
    })

    const updateDataFilterRequest = ({ data = {}, params = {} }) => {
      dataFilterRequest.value = {
        data: { ...dataFilterRequest.value.data, ...data },
        params: { ...dataFilterRequest.value.params, ...params },
        group_id: groupCompany.value.group_id
      }
    }

    // Handle filter
    const onChangeCompany = async (event) => {
      await fetchPeriodList(event)
      forEach(periodList.value, (value) => {
        value.currentPeriod ? (filter.period_id = value.id) : null
      })
      updateDataFilterRequest({ data: { group_id: null, period_id: filter.period_id }, group_id: event })
    }

    const onChangePeriod = async (event) => {
      filter.date_from_to = [null, null]
      fromDateRangePicker.value = null
      toDateRangePicker.value = null
      isDisabledDate.value = !(event === undefined || event === null)

      updateDataFilterRequest({
        data: {
          period_id: filter.period_id,
          from_date: currentDate() || null,
          to_date: addDaysInCurrentDate(currentDate(), 59) || null
        }
      })
    }

    const onChangeDate = async (value, dateString) => {
      filter.date_from_to = dateString
      fromDateRangePicker.value = filter.date_from_to[0]
      toDateRangePicker.value = filter.date_from_to[1]

      if (filter.show_by === 0) {
        fromDateRangePicker.value = value.length > 0 ? value[0].startOf('month').format('YYYY-MM-DD') : null
        toDateRangePicker.value = value.length > 0 ? value[1].endOf('month').format('YYYY-MM-DD') : null
      }

      filter.period_id = null
      isDisabledPeriod.value = !(dateString[0] === null && dateString[1] === null)

      if (dateString[0] === null && dateString[1] === null) {
        periodDefault.value = findCurrentPeriod(periodList.value)
        filter.period_id = periodDefault.value?.id || null
      }

      updateDataFilterRequest({
        data: {
          period_id: filter.period_id,
          from_date: fromDateRangePicker.value,
          to_date: toDateRangePicker.value
        }
      })
    }

    const onChangeShowBy = async (evt) => {
      let fromDateBytMonth = fromDateRangePicker.value
      let toDateBytMonth = toDateRangePicker.value

      filter.date_from_to = [fromDateBytMonth, toDateBytMonth]
      if (evt.target.value === 0) {
        fromDateBytMonth = fromDateBytMonth
          ? moment(fromDateRangePicker.value).startOf('month').format('YYYY-MM-DD')
          : null
        toDateBytMonth = toDateBytMonth ? moment(toDateRangePicker.value).endOf('month').format('YYYY-MM-DD') : null
        store.commit('financing/STORE_FINANCING_IS_CHECK_SCROLL', false)
        store.commit('financing/STORE_FINANCING_IS_SHOW_BY', false)
      } else {
        fromDateBytMonth = currentDate()
        toDateBytMonth = addDaysInCurrentDate(null, 59) || null
        store.commit('financing/STORE_FINANCING_IS_CHECK_SCROLL', true)
        store.commit('financing/STORE_FINANCING_IS_SHOW_BY', true)
      }
      updateDataFilterRequest({
        data: {
          show_by: filter.show_by,
          from_date: fromDateBytMonth,
          to_date: toDateBytMonth
        }
      })
    }

    const onChangeTabGroup = async (value) => {
      isDisabledDisplay.value = value === 0
      isDisabledBank.value = value === 0
      isDisabledCurrency.value = false
      filter.period_id = null

      filter.bank_account_ids = bankAccountList?.value[0]?.id

      // Check show tab all
      if (value !== 0) {
        isTabAllGroup.value = false
        await fetchBankAccounts({ group_id: value })
        await fetchPeriodList(value)
        forEach(periodList.value, (value) => {
          value.currentPeriod ? (filter.period_id = value.id) : null
        })
        updateDataFilterRequest({
          data: {
            group_id: value,
            period_id: null,
            from_date: filter.show_by === 0 ? null : currentDate() || null,
            to_date: filter.show_by === 0 ? null : addDaysInCurrentDate(currentDate(), 59) || null
          }
        })
        store.commit('financing/STORE_FINANCING_GET_PERIOD', periodList.value)
        store.commit('financing/STORE_FINANCING_IS_CHECK_SCROLL', true)
        store.commit('financing/STORE_FINANCING_FILTER_FROM_DATE', currentDate() || null)
        store.commit('financing/STORE_FINANCING_FILTER_TO_DATE', addDaysInCurrentDate(currentDate(), 59) || null)
        filter.show_by === 0
          ? store.commit('financing/STORE_FINANCING_IS_SHOW_BY', false)
          : store.commit('financing/STORE_FINANCING_IS_SHOW_BY', true)
      } else {
        filter.show_by = 0
        isTabAllGroup.value = true
        await fetchPeriodList(groupCompany.value.group_id)
        forEach(periodList.value, (value) => {
          value.currentPeriod ? (filter.period_id = value.id) : null
        })
        filter.date_from_to[0] = filter.date_from_to[1] = null
        store.commit('financing/STORE_FINANCING_IS_SHOW_BY', false)
        updateDataFilterRequest({
          data: { group_id: null, from_date: null, to_date: null, period_id: filter.period_id }
        })
      }

      updateDataFilterRequest({
        data: { show_by: filter.show_by, bank_account_ids: [] }
      })
    }

    const onChangeBankAccount = async () => {
      if (filter.bank_account_ids !== 0) {
        isDisabledCurrency.value = true
        updateDataFilterRequest({
          data: {
            currency_code: null,
            bank_account_ids: [filter.bank_account_ids]
          }
        })
      } else {
        isDisabledCurrency.value = false
        updateDataFilterRequest({ data: { bank_account_ids: [] } })
      }
    }

    const onChangeViewMode = async (mode) => {
      filter.period_id = null
      if (mode) {
        await router.push({ name: 'financing-chart' })
      }
    }

    const onChangeCurrency = async () => {
      store.commit('financing/STORE_FINANCING_FILTER_FROM_DATE', currentDate() || null)
      store.commit('financing/STORE_FINANCING_FILTER_TO_DATE', addDaysInCurrentDate(currentDate(), 59) || null)
      updateDataFilterRequest({
        data: {
          currency_code: filter.currency_code,
          from_date: currentDate() || null,
          to_date: addDaysInCurrentDate(currentDate(), 59) || null
        }
      })
    }

    const onExportFinancingCsv = () => {
      emit('onExportCsv')
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

      periodList.value = result?.data || []
    }

    // Fetch bank accounts
    const fetchBankAccounts = async (groupID) => {
      remove(bankAccountList.value)
      const { getBankAccounts } = useGetBankAccountsService(groupID)
      const { result } = await getBankAccounts()

      bankAccountList.value = result?.data || []
      bankAccountList.value.unshift(initialBankAccount)
    }

    // Fetch currency
    const fetchCurrency = async () => {
      const { getCurrency } = useGetCurrencyService()
      const { result } = await getCurrency()

      currencyList.value = result?.data || []
    }

    const handleGroupDefault = async (groupID, periodID) => {
      if (!groupID) {
        groupCompany.value.group_id = store.getters['financing/filters'].group_id || {}
        await fetchPeriodList(groupCompany.value.group_id)
        await fetchBankAccounts({ group_id: 1 })

        filter.group_id = groupList?.value[groupList.value.length - 1].id
        isDisabledDisplay.value = true
        isDisabledBank.value = true
      } else {
        filter.group_id = groupID
        filter.period_id = periodID
        filter.date_from_to[0] = null
        filter.date_from_to[1] = null
        isDisabledDisplay.value = false
        isDisabledBank.value = false

        await fetchPeriodList(groupID)
        await fetchBankAccounts({ group_id: groupID })
      }

      if (periodID) {
        filter.period_id = periodID
        updateDataFilterRequest({ data: { group_id: groupID, period_id: filter.period_id } })
      } else {
        let flagChart = JSON.parse(localStorage.getItem('flag_chart'))
        if (localStorage.getItem('flag_chart') === null || !flagChart) {
          forEach(periodList.value, (value) => {
            value.currentPeriod ? (filter.period_id = value.id) : null
          })
          filter.date_from_to[0] = null
          filter.date_from_to[1] = null
          store.commit('financing/STORE_FINANCING_FILTER_FROM_DATE', currentDate() || null)
          store.commit('financing/STORE_FINANCING_FILTER_TO_DATE', addDaysInCurrentDate(currentDate(), 59) || null)
          store.commit('financing/STORE_FINANCING_GET_PERIOD', periodList.value)
          updateDataFilterRequest({
            data: {
              group_id: groupID,
              from_date: filter.show_by === 0 ? null : currentDate() || null,
              to_date: filter.show_by === 0 ? null : addDaysInCurrentDate(currentDate(), 59) || null
            }
          })
        } else {
          const filtersFinancingStore = store.getters['financing/filters'].data || {}
          filter.period_id = null
          filter.from_date = filtersFinancingStore.from_date || null
          filter.to_date = filtersFinancingStore.to_date || null
          updateDataFilterRequest({ data: { group_id: groupID, from_date: filter.from_date, to_date: filter.to_date } })
        }
      }
    }

    const handleBankAccountDefault = (bankAccountIds) => {
      if (!bankAccountIds || bankAccountIds.length === 0) {
        filter.bank_account_ids = bankAccountList?.value[0]?.id
      } else {
        isDisabledCurrency.value = !!bankAccountIds
      }
    }

    const handleDateFromTo = (dateFromTo) => {
      if (dateFromTo[0] && dateFromTo[1]) {
        filter.from_date = dateFromTo[0]
        filter.to_date = dateFromTo[1]
        fromDateRangePicker.value = dateFromTo[0]
        toDateRangePicker.value = dateFromTo[1]
        filter.period_id = null
      }
    }

    const handleCurrencyDefault = (currencyCode) => {
      if (currencyCode) {
        filter.currency_code = currencyCode
      } else {
        if (currencyList.value) {
          currencyDefault.value = currencyList?.value.find((item) => item.code === 'JPY')
          filter.currency_code = currencyDefault.value?.code || null
        }
      }
    }

    const handleLoadingData = async () => {
      // permission
      let groupID = groupList.value[0].id || null

      let periodID = filter?.period_id || null
      let bankAccountIds = filter.bank_account_ids
      let currencyCode = filter.currency_code

      // Get filters financing from store
      const filtersFinancingStore = store.getters['financing/filters'].data || {}
      // Load data by filter store
      if (isEmpty(filtersFinancingStore)) {
        localStorage.removeItem('flag_chart')
        // Load  group default, period default
        await handleGroupDefault(groupID, periodID)

        // Load bank account default
        handleBankAccountDefault(bankAccountIds)

        // Load currency default
        handleCurrencyDefault(currencyCode)
      } else {
        const dataFilter = convertDataFilter(filtersFinancingStore)
        Object.assign(filter, dataFilter)
        Object.assign(dataFilterRequest.value.data, filtersFinancingStore)

        // Set group ID id by store, period ID id by store
        groupID = filtersFinancingStore.group_id
        periodID = filtersFinancingStore.period_id
        await handleGroupDefault(groupID, periodID)
        if (!groupID) isTabAllGroup.value = true

        // Check dateFromTo
        let dateFromTo = filter.date_from_to
        handleDateFromTo(dateFromTo)

        // Set bank account id by store
        bankAccountIds = filtersFinancingStore.bank_account_ids
        handleBankAccountDefault(bankAccountIds)

        // Set currency id by store
        currencyCode = filtersFinancingStore.currency_code
        handleCurrencyDefault(currencyCode)
      }
    }

    onBeforeMount(async () => {
      await fetchGroupList()
      await fetchCurrency()
      await handleLoadingData()
    })

    watch(
      () => dataFilterRequest.value,
      () => {
        const data = Object.assign({}, dataFilterRequest.value.data)
        const company = Object.assign({}, dataFilterRequest.value)
        store.commit('financing/STORE_FINANCING_FILTER', { data, ...company })
        emit('onFilterRequest', dataFilterRequest.value)
      }
    )

    watch(
      () => props.dataFilterTable,
      () => {
        if (props.dataFilterTable) {
          handleLoadingData()
        }
      }
    )

    return {
      initialGroup,
      initialBankAccount,
      initialStateFilter,
      groupList,
      periodList,
      bankAccountList,
      currencyList,
      bankAccountId,
      filter,
      isDisabledPeriod,
      isDisabledDate,
      isDisabledDisplay,
      isLoadingDataTable,
      isDisabledBank,
      isDisabledCurrency,
      dataFilterRequest,
      isTabAllGroup,
      groupListTabAll,
      groupCompany,
      SHOW_BY,
      VIEW_MODE,
      onChangePeriod,
      onChangeDate,
      onChangeShowBy,
      onChangeTabGroup,
      onChangeBankAccount,
      onChangeViewMode,
      onChangeCurrency,
      onExportFinancingCsv,
      fetchGroupList,
      fetchPeriodList,
      fetchCurrency,
      onChangeCompany
    }
  }
}
</script>

<style scoped></style>
