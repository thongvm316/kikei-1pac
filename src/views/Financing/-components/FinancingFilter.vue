<template>
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
import { isEmpty, remove } from 'lodash-es'
import { useRouter } from 'vue-router'

import useGetGroupListService from '@/views/Financing/composables/useGetGroupListService'
import useGetPeriodListService from '@/views/Financing/composables/useGetPeriodListService'
import useGetBankAccountsService from '@/views/Financing/composables/useGetBankAccountsService'
import useGetCurrencyService from '@/views/Financing/composables/useGetCurrencyService'

import { convertDataFilter, findCurrentPeriod } from '@/views/Financing/composables/useFinancing'
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
    const periodList = ref([])
    const periodDefault = ref([])
    const bankAccountList = ref([])
    const bankAccountId = ref([])
    const currencyList = ref([])
    const currencyDefault = ref()

    const isLoadingDataTable = ref(true)
    const isDisabledPeriod = ref(false)
    const isDisabledDate = ref(false)
    const isDisabledDisplay = ref(false)
    const isDisabledBank = ref(false)
    const isDisabledCurrency = ref(false)

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

    const filter = reactive({ ...initialStateFilter })

    const dataFilterRequest = ref({})

    const updateDataFilterRequest = ({ data = {} }) => {
      dataFilterRequest.value = { ...dataFilterRequest.value, ...data }
    }

    // Handle filter
    const onChangePeriod = async (event) => {
      filter.date_from_to = [null, null]
      isDisabledDate.value = !(event === undefined || event === null)

      updateDataFilterRequest({
        data: {
          period_id: filter.period_id,
          from_date: null,
          to_date: null
        }
      })
    }

    const onChangeDate = async (value, dateString) => {
      filter.period_id = null
      isDisabledPeriod.value = !(dateString[0] === null && dateString[1] === null)
      filter.date_from_to = dateString
      if (dateString[0] === '' && dateString[1] === '') {
        periodDefault.value = findCurrentPeriod(periodList.value)
        filter.period_id = periodDefault.value?.id || null
      }
      updateDataFilterRequest({
        data: {
          period_id: filter.period_id,
          from_date: filter.date_from_to[0],
          to_date: filter.date_from_to[1]
        }
      })
    }

    const onChangeShowBy = async () => {
      updateDataFilterRequest({
        data: {
          show_by: filter.show_by
        }
      })
    }

    const onChangeTabGroup = async (value) => {
      // Check show tab all
      if (value !== 0) {
        await fetchBankAccounts({ group_id: value })
        filter.show_by = 1
        filter.bank_account_ids = bankAccountList.value[0].id
        isDisabledDisplay.value = false
        isDisabledBank.value = false
        isDisabledCurrency.value = false
        updateDataFilterRequest({ data: { group_id: filter.group_id } })
      } else {
        filter.show_by = 0
        filter.bank_account_ids = bankAccountList?.value[0]?.id
        isDisabledDisplay.value = true
        isDisabledBank.value = true
        isDisabledCurrency.value = false

        updateDataFilterRequest({ data: { group_id: null } })
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
      if (mode) {
        await router.push({ name: 'financing-chart' })
      }
    }

    const onChangeCurrency = async () => {
      updateDataFilterRequest({ data: { currency_code: filter.currency_code } })
    }

    const onExportFinancingCsv = () => {
      emit('onExportCsv')
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

    const handleGroupDefault = async (groupID) => {
      if (!groupID) {
        await fetchPeriodList(1)
        await fetchBankAccounts({ group_id: 1 })

        filter.group_id = groupList?.value[groupList.value.length - 1].id
        isDisabledDisplay.value = true
        isDisabledBank.value = true
      } else {
        isDisabledDisplay.value = false
        isDisabledBank.value = false

        await fetchPeriodList(groupID)
        await fetchBankAccounts({ group_id: groupID })
      }
    }

    const handlePeriodDefault = (periodID) => {
      if (periodID) {
        filter.period_id = periodID
      } else {
        if (periodList.value) {
          periodDefault.value = findCurrentPeriod(periodList.value)
          filter.period_id = periodDefault.value?.id || null
          updateDataFilterRequest({
            data: { period_id: filter.period_id }
          })
        }
      }
    }

    const handleBankAccountDefault = (bankAccountIds) => {
      if (bankAccountIds === null || bankAccountIds.length === 0) {
        filter.bank_account_ids = bankAccountList?.value[0]?.id
      } else {
        isDisabledCurrency.value = !!bankAccountIds
      }
    }

    const handleDateFromTo = (dateFromTo) => {
      if (dateFromTo[0] && dateFromTo[1]) {
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
      let groupID = filter?.group_id || null
      let periodID = filter?.period_id || null
      let bankAccountIds = filter.bank_account_ids
      let currencyCode = filter.currency_code

      // Get filters financing from store
      const filtersFinancingStore = store.getters['financing/filters']?.data || {}

      // Load data by filter store
      if (isEmpty(filtersFinancingStore)) {
        localStorage.removeItem('flag_chart')
        // Load  group default
        await handleGroupDefault(groupID)

        // Load period default
        handlePeriodDefault(periodID)

        // Load bank account default
        handleBankAccountDefault(bankAccountIds)

        // Load currency default
        handleCurrencyDefault(currencyCode)
      } else {
        const dataFilter = convertDataFilter(filtersFinancingStore)
        Object.assign(filter, dataFilter)
        Object.assign(dataFilterRequest.value, filtersFinancingStore)

        // Set group ID id by store
        groupID = filtersFinancingStore.group_id
        await handleGroupDefault(groupID)

        // Set period ID id by store
        periodID = filtersFinancingStore.period_id
        handlePeriodDefault(periodID)

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
        const data = Object.assign({}, dataFilterRequest.value)
        store.commit('financing/STORE_FINANCING_FILTER', { data })
      }
    )

    watch(
      () => store.state.financing.filters,
      () => {
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
      fetchCurrency
    }
  }
}
</script>

<style scoped></style>
