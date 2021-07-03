<template>
  <div class="accounting u-mx-32">
    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16">
      <div>
        <span class="u-mr-16 u-text-grey-15">{{ $t('accounting.financing_period_label') }}:</span>
        <a-select v-model:value="financingPeriod" :style="{ width: '120px' }" @change="handleChangeFinancingPeriod">
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

    <p class="u-mt-24">合計</p>
    <accounting-table
      :table-index="2"
      :table-index-disable-scroll="tableIndexDisableScroll"
      :pixels-scrolled="pixelsScrolled"
      :is-loading-table="isLoadingTable"
      :group-id="activeKeyGroup"
      :data-source="financingTotalList"
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

import AccountingTable from './-components/AccountingTable.vue'
import { getGroups, getPeriods, getDeposit, getWithdrawal, getFinancingTotal } from './composables/useAccounting'
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
      100, // need equal time delay of scroll event
      {
        leading: true,
        trailing: false
      }
    )

    const fetchPeriodList = async () => {
      const groupId = activeKeyGroup.value
      const periodResponse = await getPeriods(groupId)
      periodList.value = periodResponse.result?.data || []

      // FIXME: default peiod selected
      periodList.value.length > 0 && (financingPeriod.value = periodList.value[0].id)
      fetchDataTables()
    }

    const fetchDataTables = async () => {
      // request data
      isLoadingTable.value = true

      const dataRequest = { groupId: activeKeyGroup.value, periodId: financingPeriod.value }

      // FIXME: use when getFinancingTotal aready
      // Promise.all([getDeposit(dataRequest), getWithdrawal(dataRequest), getFinancingTotal(dataRequest)]).then(
      //   ([depositReponse, withdrawalReponse, financingTotalReponse]) => {
      //     depositList.value = depositReponse?.result?.data || []
      //     withdrawalList.value = withdrawalReponse?.result?.data || []
      //     financingTotalList.value = financingTotalReponse?.result?.data || []
      //   }
      // )
      // .finally((isLoadingTable.value = false))

      Promise.all([getDeposit(dataRequest), getWithdrawal(dataRequest)])
        .then(([depositReponse, withdrawalReponse]) => {
          depositList.value = depositReponse?.result?.data || []
          withdrawalList.value = withdrawalReponse?.result?.data || []
        })
        .finally((isLoadingTable.value = false))
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
        { header: t('accounting.period'), field: 'period' },
        { header: t('accounting.group'), field: 'group' },
        { header: t('accounting.type'), field: 'type' },
        { header: t('accounting.category'), field: 'category' },
        { header: t('accounting.subcategory'), field: 'subcategory' }
      ]

      // FIXME: get from period selected
      const monthFrom = '2020-07'
      const monthTo = '2021-06'

      if (!monthFrom || !monthTo) return labels

      const startTime = moment(monthFrom)
      const endTime = moment(monthTo)
      let month = startTime.clone()

      while (month <= endTime && labels.length < 9999) {
        const monthStr = monthStrFormat(month)
        labels.push({
          header: monthStr,
          field: monthStr
        })

        month = month.clone().add(1, 'M')
      }

      return labels
    }

    const getDataCsv = (tableList) => {
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
          type: '',
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
              type: '',
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
      const depositItems = getDataCsv(depositList.value)
      const withdrawalItems = getDataCsv(withdrawalList.value)

      const exportObj = {
        fileTitle: 'accounting',
        labels: getHeaderCsv(),
        items: [...depositItems, ...withdrawalItems]
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
