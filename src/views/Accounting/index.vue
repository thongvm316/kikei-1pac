<template>
  <div class="accounting u-mx-32">
    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16">
      <div>
        <span class="u-mr-16 u-text-grey-15">{{ $t('accounting.financing_period_label') }}:</span>
        <a-select
          v-model:value="financingPeriod"
          :loading="isLoadingPeriod"
          :style="{ width: '120px' }"
          @change="handleChangeFinancingPeriod"
        >
          <a-select-option v-for="period in periodList" :key="period.id" :value="period.id">
            {{ period.name }}
          </a-select-option>
        </a-select>
        <span class="u-ml-8 u-text-grey-75">{{ $t('accounting.period') }}</span>
      </div>

      <a-button :loading="isLoadingExportCsv" @click="handleExportCsv">
        <template #icon>
          <span class="btn-icon"><line-down-icon /></span>
        </template>
        {{ $t('accounting.export_csv') }}
      </a-button>
    </div>

    <a-tabs
      v-model:active-key="activeKeyGroup"
      default-active-key="1"
      class="-mx-32"
      :animated="false"
      @change="onHandleChangeGroup"
    >
      <a-tab-pane v-for="item in tabListGroup" :key="item.id" :tab="item.name" />
    </a-tabs>

    <!-- deposit table -->
    <p class="u-mt-24">売上</p>
    <accounting-table
      :table-index="0"
      :table-index-disable-scroll="tableIndexDisableScroll"
      :pixels-scrolled="pixelsScrolled"
      :is-loading-table="isLoadingTable"
      :group-id="activeKeyGroup"
      :data-source="depositList"
      @getPixelsScrolled="getPixelsScrolled"
    />

    <!-- withdrawal table -->
    <p class="u-mt-24">支出</p>
    <accounting-table
      :table-index="1"
      :table-index-disable-scroll="tableIndexDisableScroll"
      :pixels-scrolled="pixelsScrolled"
      :is-loading-table="isLoadingTable"
      :group-id="activeKeyGroup"
      :data-source="withdrawalList"
      :money-color="'text-color-red'"
      @getPixelsScrolled="getPixelsScrolled"
    />

    <!-- financing total table -->
    <p class="u-mt-24">合計</p>
    <accounting-table
      :table-index="2"
      :table-index-disable-scroll="tableIndexDisableScroll"
      :pixels-scrolled="pixelsScrolled"
      :is-loading-table="isLoadingTable"
      :group-id="activeKeyGroup"
      :data-source="financingTotalList"
      :disable-go-to-deposit="true"
      @getPixelsScrolled="getPixelsScrolled"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from 'vue'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { find } from 'lodash-es'

import AccountingTable from './-components/AccountingTable'
import { getGroups, getPeriods, getDeposit, getWithdrawal, getTotal } from './composables/useAccounting'
import { exportCSVFile } from '@/helpers/export-csv-file'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'

export default defineComponent({
  name: 'AccountingManagementPage',

  components: {
    AccountingTable,
    LineDownIcon
  },

  setup() {
    const { t } = useI18n()

    const pixelsScrolled = ref(0)
    const tableIndexDisableScroll = ref()
    const isLoadingTable = ref(false)
    const depositList = ref([])
    const withdrawalList = ref([])
    const financingTotalList = ref([])

    // csv
    const isLoadingExportCsv = ref()

    // period
    const isLoadingPeriod = ref()
    const financingPeriod = ref()
    const periodList = ref([])

    // group tabs
    const activeKeyGroup = ref(1)
    const tabListGroup = ref([])

    const getPixelsScrolled = debounce(
      ({ tableIndex, pixel }) => {
        tableIndexDisableScroll.value = tableIndex
        pixelsScrolled.value = pixel
      },
      // time to disble update pixel scrolled after that
      100,
      // Invoke `getPixelsScrolled` when table scroll, debouncing subsequent calls.
      {
        leading: true,
        trailing: false
      }
    )

    const fetchPeriodList = async () => {
      isLoadingPeriod.value = true
      financingPeriod.value = ''

      try {
        const groupId = activeKeyGroup.value
        const periodResponse = await getPeriods(groupId)
        periodList.value = periodResponse.result?.data || []

        // set period current
        const periodCurrentFound = find(periodList.value, (periodItem) => {
          const currentTime = moment()
          const startedDate = periodItem?.startedDate
          const finishedDate = periodItem?.finishedDate

          if (!startedDate || !finishedDate) return false

          return currentTime >= moment(startedDate) && currentTime <= moment(finishedDate)
        })

        if (periodCurrentFound) {
          financingPeriod.value = periodCurrentFound.id
          fetchDataTables()
        }
      } finally {
        isLoadingPeriod.value = false
      }
    }

    const fetchDataTables = async () => {
      isLoadingTable.value = true

      try {
        const dataRequest = { groupId: activeKeyGroup.value, periodId: financingPeriod.value }

        const [depositReponse, withdrawalReponse, financingTotalReponse] = await Promise.all([
          getDeposit(dataRequest),
          getWithdrawal(dataRequest),
          getTotal(dataRequest)
        ])

        depositList.value = depositReponse?.result?.data || []
        withdrawalList.value = withdrawalReponse?.result?.data || []
        financingTotalList.value = financingTotalReponse?.result?.data || []
      } finally {
        isLoadingTable.value = false
      }
    }

    const handleChangeFinancingPeriod = () => {
      fetchDataTables()
    }

    const onHandleChangeGroup = () => {
      fetchPeriodList()
    }

    /* --------------------- handle export CSV ------------------- */
    const monthStrFormat = (val) => moment(val).format('YYYY-MM')

    const getHeaderCsv = () => {
      const labels = [
        { header: t('accounting.financing_period_label'), field: 'period' },
        { header: t('accounting.group'), field: 'group' },
        { header: t('accounting.type'), field: 'type' },
        { header: t('accounting.category'), field: 'category' },
        { header: t('accounting.subcategory'), field: 'subcategory' }
      ]

      const periodFound = find(periodList.value, { id: financingPeriod.value })
      const monthFrom = periodFound?.startedDate
      const monthTo = periodFound?.finishedDate

      if (!monthFrom || !monthTo) return labels

      const startTime = moment(monthFrom)
      const endTime = moment(monthTo)
      let month = startTime.clone()

      while (month <= endTime && labels.length < 9999) {
        const monthStr = monthStrFormat(month)
        labels.push({
          header: moment(monthStr).format('MMMM'),
          field: monthStr
        })

        month = month.clone().add(1, 'M')
      }

      return labels
    }

    const getDataCsv = (tableList = [], tableName = '') => {
      const items = []

      const { detail = [] } = tableList
      if (detail.length === 0) return items

      const periodFound = find(periodList.value, { id: financingPeriod.value })
      const periodName = periodFound ? periodFound.name : ''

      const groupFound = find(tabListGroup.value, { id: activeKeyGroup.value })
      const groupName = groupFound ? groupFound.name : ''

      detail.map((category) => {
        // add category
        const rowCategory = {
          period: periodName,
          group: groupName,
          type: tableName,
          category: category?.categoryName || '',
          subcategory: ''
        }

        // add month data
        ;(category?.data || []).map((categoryMonth) => {
          const monthStr = monthStrFormat(categoryMonth.month)
          rowCategory[monthStr] = categoryMonth.money
        })

        items.push(rowCategory)

        // add subcategory
        const subcategories = category?.subcategories || []
        if (subcategories.length > 0) {
          subcategories.map((subItem) => {
            const rowSubcategory = {
              period: periodName,
              group: groupName,
              type: tableName,
              category: '',
              subcategory: subItem?.subcategoryName || ''
            }

            ;(subItem?.data || []).map((subData) => {
              const monthStr = monthStrFormat(subData.month)
              rowSubcategory[monthStr] = subData.money
            })

            items.push(rowSubcategory)
          })
        }
      })

      return items
    }

    const handleExportCsv = () => {
      const depositItems = getDataCsv(depositList.value, t('accounting.table_deposit'))
      const withdrawalItems = getDataCsv(withdrawalList.value, t('accounting.table_withdrawal'))
      const financingTotalItems = getDataCsv(financingTotalList.value, t('accounting.table_total'))

      const exportObj = {
        fileTitle: 'AD1200',
        labels: getHeaderCsv(),
        items: [...depositItems, ...withdrawalItems, ...financingTotalItems]
      }
      exportCSVFile(exportObj)
    }
    /* --------------------- ./handle export CSV ------------------- */

    onBeforeMount(async () => {
      // fetch group list
      const groupList = await getGroups()
      tabListGroup.value = groupList.result?.data || []

      fetchPeriodList()
    })

    return {
      pixelsScrolled,
      tableIndexDisableScroll,
      financingPeriod,
      activeKeyGroup,
      tabListGroup,
      periodList,
      depositList,
      withdrawalList,
      financingTotalList,

      isLoadingPeriod,
      isLoadingTable,
      isLoadingExportCsv,

      getPixelsScrolled,
      handleChangeFinancingPeriod,
      onHandleChangeGroup,
      handleExportCsv
    }
  }
})
</script>

<style lang="scss" scoped>
.accounting {
  .-mx-32 {
    margin: 0 -32px;
  }
}
</style>
