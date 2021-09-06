<template>
  <div class="dashboard">
    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[0]"
        :title="'経理業務'"
        :group-list="groupList"
        :is-unvisible-group-tab="true"
        @on-swap-block-order="swapBlockOrder"
      >
        <accouting-operations-table
          :is-loading-table="isLoadingAccountingOperations"
          :data-source="dataTableAccoutingOperations"
        />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[1]"
        :title="'今期売上見込'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
        @on-change-group="fetchSales($event)"
      >
        <sales-table :block-id="blockIdList[1]" :is-loading-table="isLoadingTableSales" :data-source="dataTableSales" />
        <stacked-bar-sales :data-source="dataTableSales" />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[2]"
        :title="'月次簡易試算'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
        @on-change-group="fetchMonthlyAccounting($event)"
      >
        <monthly-accounting-table
          :block-id="blockIdList[2]"
          :is-loading-table="isLoadingMonthlyAccounting"
          :data-source="dataTableMonthly"
        />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[3]"
        :title="'銀行残高推移'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
        @on-change-group="fetchBankAccountBalance($event)"
      >
        <bank-line-chart :bank-balance="bankBalance" />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[4]"
        :title="'今期顧客別売上'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
        @on-change-group="fetchRaking($event)"
      >
        <a-spin :spinning="isSpiningRanking">
          <div class="dashboard__ranking">
            <ranking-table :ranking-data="rankingData || []" />
            <pie-chart :ranking-data="rankingData" />
          </div>
        </a-spin>
      </controller-block>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, computed, nextTick } from 'vue'
import { findIndex, find } from 'lodash-es'
import { useStore } from 'vuex'

import ControllerBlock from './-components/ControllerBlock'
import SalesTable from './-components/SalesTable'
import StackedBarSales from './-components/StackedBarSales'
import BankLineChart from './-components/BankLineChart'
import PieChart from './-components/PieChart'
import AccoutingOperationsTable from './-components/AccoutingOperationsTable'
import MonthlyAccountingTable from './-components/MonthlyAccountingTable'
import RankingTable from './-components/RankingTable'

import {
  getGroups,
  getPendingDeposits,
  getRevenue,
  getRevenueStatistics,
  getRevenueBalance,
  getBankAccountBalance
} from './composables/useDashboard'
import { ORDER_UP, ORDER_DOWN } from '@/enums/dashboard.enum'
import services from '@/services'
import storageKeys from '@/enums/storage-keys'
import { deepCopy } from '@/helpers/json-parser'

export default defineComponent({
  name: 'DashboardPage',

  components: {
    ControllerBlock,
    SalesTable,
    StackedBarSales,
    BankLineChart,
    PieChart,
    AccoutingOperationsTable,
    MonthlyAccountingTable,
    RankingTable
  },

  setup() {
    const store = useStore()
    const StorageService = services.get('StorageService')

    // table order
    const blockListEl = ref()
    const blockIdList = ref([])
    const groupIdDefault = ref(0)

    // group tabs
    const groupList = ref([])

    //tables
    const isLoadingAccountingOperations = ref(false)
    const isLoadingTableSales = ref()
    const isLoadingMonthlyAccounting = ref(false)
    const dataTableAccoutingOperations = ref([])
    const dataTableSales = ref([])
    const dataTableMonthly = ref([])

    // revenue
    const rankingData = ref()

    const isSpiningRanking = ref()

    // bank balance
    const bankBalance = ref()

    const dashboardBlocks = computed(() => store.state.dashboard.blocks)

    const generateOrderList = () => {
      blockListEl.value = document.querySelectorAll('.dashboard__block')
      if (blockListEl.value.length === 0) return

      if (dashboardBlocks.value.length !== blockListEl.value.length) {
        const blockOrder = new Array(blockListEl.value.length).fill(undefined).map((_, index) => ({
          id: index,
          order: index,
          mode: '',
          groupId: groupIdDefault.value
        }))

        updateBlockStore(blockOrder)
      } else {
        // reset groupId
        const _dashboardBlocks = dashboardBlocks.value.map((block) => ({
          ...block,
          groupId: groupIdDefault.value
        }))

        updateBlockStore(_dashboardBlocks)
      }

      blockIdList.value = dashboardBlocks.value.map((_, index) => index) // needs to be the same as the id generated above

      setBlockOrder()
    }

    const swapBlockOrder = ({ id, mode }) => {
      const currentBlockIndex = findIndex(dashboardBlocks.value, { id })
      if (
        currentBlockIndex !== -1 &&
        ((mode === ORDER_UP && currentBlockIndex === 0) ||
          (mode === ORDER_DOWN && currentBlockIndex + 1 === dashboardBlocks.value.length))
      ) {
        return
      }

      // block target
      let blockTargetIndex
      if (mode === ORDER_UP) {
        blockTargetIndex = currentBlockIndex - 1
      } else if (mode === ORDER_DOWN) {
        blockTargetIndex = currentBlockIndex + 1
      }

      let _dashboardBlocks = deepCopy(dashboardBlocks.value)

      // change order
      const orderCurrent = _dashboardBlocks[currentBlockIndex].order
      const orderTarget = _dashboardBlocks[blockTargetIndex].order
      _dashboardBlocks[currentBlockIndex].order = orderTarget
      _dashboardBlocks[blockTargetIndex].order = orderCurrent

      // set mode
      _dashboardBlocks[currentBlockIndex].mode = mode
      _dashboardBlocks[blockTargetIndex].mode = mode === ORDER_UP ? ORDER_DOWN : ORDER_UP

      // swap list
      ;[_dashboardBlocks[currentBlockIndex], _dashboardBlocks[blockTargetIndex]] = [
        _dashboardBlocks[blockTargetIndex],
        _dashboardBlocks[currentBlockIndex]
      ]

      updateBlockStore(_dashboardBlocks)
      setBlockOrder()
    }

    const setBlockOrder = () => {
      if (blockListEl.value.length === 0) return

      // get lenghts to move (set variable before run transform)
      blockListEl.value.forEach((block, index) => {
        const blockFound = find(dashboardBlocks.value, { id: index })
        if (!blockFound || !blockFound.mode) return

        const heightEl = block.offsetHeight + 64 // + margin-top
        if (blockFound.mode === ORDER_UP) {
          document.documentElement.style.setProperty('--move-up-length', `-${heightEl}px`)
        } else {
          document.documentElement.style.setProperty('--move-down-length', `${heightEl}px`)
        }
      })

      // apply styles, animations
      blockListEl.value.forEach((block, index) => {
        const blockFound = find(dashboardBlocks.value, { id: index })
        if (!blockFound) return
        block.style.order = blockFound.order
        block.classList.remove('animation-move-up', 'animation-move-down')

        // animation
        if (!blockFound.mode) return
        // void block.offsetWidth // magic to run
        block.classList.add(blockFound.mode === ORDER_UP ? 'animation-move-down' : 'animation-move-up')
      })

      // clear all mode
      const _dashboardBlocks = dashboardBlocks.value.map((item) => ({ ...item, mode: '' }))

      // save to store
      updateBlockStore(_dashboardBlocks)
    }

    const updateBlockStore = (data) => {
      StorageService.set(storageKeys.dashboardBlocks, data)
      store.commit('dashboard/STORE_DASHBOARD_BLOCKS', deepCopy(data))
    }

    // FETCH APIs
    const fetchPendingDeposits = async () => {
      const pendingDepositsReponse = await getPendingDeposits(isLoadingAccountingOperations)
      dataTableAccoutingOperations.value = pendingDepositsReponse?.result?.data || []
    }

    const fetchSales = async (params) => {
      const salesReponse = await getRevenueStatistics(isLoadingTableSales, params)
      dataTableSales.value = salesReponse?.result?.data || []
    }

    const fetchMonthlyAccounting = async (params) => {
      const monthlyAccountingReponse = await getRevenueBalance(isLoadingMonthlyAccounting, params)
      dataTableMonthly.value = monthlyAccountingReponse?.result?.data || []
    }

    const fetchRaking = async (params) => {
      isSpiningRanking.value = true
      const { result } = await getRevenue(params)
      rankingData.value = result?.data
      isSpiningRanking.value = false
    }

    const fetchBankAccountBalance = async (param) => {
      const { result } = await getBankAccountBalance(param)
      bankBalance.value = result?.data
    }

    onBeforeMount(async () => {
      const dashboardBlocks = StorageService.get(storageKeys.dashboardBlocks)
      if (dashboardBlocks) {
        store.commit('dashboard/STORE_DASHBOARD_BLOCKS', dashboardBlocks)
      }

      // fetch group list
      const groupsReponse = await getGroups()
      const groupListData = groupsReponse?.result?.data || []
      if (groupListData.length > 1) {
        // add item
        groupListData.push({
          id: 0, // default all group
          name: 'グループ全体'
        })
      }
      groupList.value = groupListData

      groupIdDefault.value = groupList.value[0]?.id || 0
      if (!groupIdDefault.value) return

      const allGroupId = groupList.value
        .filter((group) => group.id !== 0)
        .reduce((acc, group) => {
          acc += acc ? ',' + group.id : group.id
          return acc
        }, '')
      const params = { groupId: groupIdDefault.value > 0 ? groupIdDefault.value : allGroupId }

      fetchPendingDeposits(params)
      fetchSales(params)
      fetchMonthlyAccounting(params)
      fetchRaking(params)
      fetchBankAccountBalance(params)

      nextTick(() => {
        // DOM is updated
        generateOrderList()
      })
    })

    return {
      groupList,
      isLoadingTableSales,
      dataTableSales,
      dashboardBlocks,
      blockIdList,
      dataTableAccoutingOperations,
      isLoadingAccountingOperations,
      dataTableMonthly,
      isLoadingMonthlyAccounting,
      rankingData,
      bankBalance,
      isSpiningRanking,

      swapBlockOrder,
      fetchPendingDeposits,
      fetchSales,
      fetchMonthlyAccounting,
      fetchRaking,
      fetchBankAccountBalance
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.dashboard {
  $move-up-length: var(--move-up-length);
  $move-down-length: var(--move-down-length);

  @include flexbox(null, null);
  flex-direction: column;
  margin-top: -40px;

  &__block {
    margin-top: 64px;
  }

  &__ranking {
    display: flex;
    background-color: $color-grey-100;
    padding-right: 32px;
    padding-bottom: 24px;
  }

  .animation-move-up,
  .animation-move-down {
    animation-duration: 500ms;
    animation-timing-function: ease-in-out;
  }

  .animation-move-up {
    animation-name: moveBlockUp;
  }

  .animation-move-down {
    animation-name: moveBlockDown;
  }

  @keyframes moveBlockUp {
    0% {
      transform: translateY($move-up-length);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes moveBlockDown {
    0% {
      transform: translateY($move-down-length);
    }

    100% {
      transform: translateY(0);
    }
  }
}
</style>
