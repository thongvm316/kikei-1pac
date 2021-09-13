<template>
  <div class="dashboard">
    <div v-show="blockList[0].isActive" class="dashboard__block">
      <controller-block
        :title="'経理業務'"
        :block-id="blockList[0].id"
        :group-list="blockList[0].groupListAccess"
        :is-unvisible-group-tab="true"
        @on-swap-block-order="swapBlockOrder"
      >
        <accouting-operations-table
          :is-loading-table="isLoadingAccountingOperations"
          :data-source="dataTableAccoutingOperations"
        />
      </controller-block>
    </div>

    <div v-show="blockList[1].isActive" class="dashboard__block">
      <controller-block
        :title="'今期売上見込'"
        :block-id="blockList[1].id"
        :group-list="blockList[1].groupListAccess"
        @on-swap-block-order="swapBlockOrder"
        @on-change-group="fetchSales($event)"
      >
        <sales-table
          :block-id="blockList[1].id"
          :is-loading-table="isLoadingTableSales"
          :data-source="dataTableSales"
        />
        <stacked-bar-sales :data-source="dataTableSales" />
      </controller-block>
    </div>

    <div v-show="blockList[2].isActive" class="dashboard__block">
      <controller-block
        :title="'月次簡易試算'"
        :block-id="blockList[2].id"
        :group-list="blockList[2].groupListAccess"
        @on-swap-block-order="swapBlockOrder"
        @on-change-group="fetchMonthlyAccounting($event)"
      >
        <monthly-accounting-table
          :block-id="blockList[2].id"
          :is-loading-table="isLoadingMonthlyAccounting"
          :data-source="dataTableMonthly"
        />
      </controller-block>
    </div>

    <div v-show="blockList[3].isActive" class="dashboard__block">
      <controller-block
        :title="'銀行残高推移'"
        :block-id="blockList[3].id"
        :group-list="blockList[3].groupListAccess"
        @on-swap-block-order="swapBlockOrder"
        @on-change-group="fetchBankAccountBalance($event)"
      >
        <bank-line-chart :bank-balance="bankBalance" />
      </controller-block>
    </div>

    <div v-show="blockList[4].isActive" class="dashboard__block">
      <controller-block
        :title="'今期顧客別売上'"
        :block-id="blockList[4].id"
        :group-list="blockList[4].groupListAccess"
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

    <DashboardEmpty v-if="isDashboardEmpty" />
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, computed, nextTick } from 'vue'
import { findIndex, find, cloneDeep } from 'lodash-es'
import { useStore } from 'vuex'

import ControllerBlock from './-components/ControllerBlock'
import SalesTable from './-components/SalesTable'
import StackedBarSales from './-components/StackedBarSales'
import BankLineChart from './-components/BankLineChart'
import PieChart from './-components/PieChart'
import AccoutingOperationsTable from './-components/AccoutingOperationsTable'
import MonthlyAccountingTable from './-components/MonthlyAccountingTable'
import RankingTable from './-components/RankingTable'
import DashboardEmpty from './-components/DashboardEmpty'

import {
  getGroups,
  getPendingDeposits,
  getRevenue,
  getRevenueStatistics,
  getRevenueBalance,
  getBankAccountBalance
} from './composables/useDashboard'
import { ORDER_UP, ORDER_DOWN, BLOCK_FEATURE_KEY_LIST } from '@/enums/dashboard.enum'
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
    RankingTable,
    DashboardEmpty
  },

  setup() {
    const store = useStore()
    const StorageService = services.get('StorageService')

    // table order
    const blockListEl = ref()
    const blockList = ref(cloneDeep(BLOCK_FEATURE_KEY_LIST))

    // group tabs
    const TAB_GROUP_ALL_ID = 0
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
    const isDashboardEmpty = ref(false)

    const setBlocksActive = () => {
      const isAdmin = store.state.auth?.authProfile?.isAdmin || false
      const permissionList = store.state?.account?.permissions || []

      blockList.value = blockList.value.map((block) => {
        if (isAdmin) {
          return {
            ...block,
            groupListAccess: groupList.value,
            isActive: true
          }
        }

        const groupIdAccess = permissionList
          .filter((group) => {
            const groupFound = find(group.permissions, { featureKey: block.featureKey })
            return groupFound && groupFound.permissionKey !== 3
          })
          .map((group) => group.groupId)

        if (groupIdAccess.length > 1) groupIdAccess.push(TAB_GROUP_ALL_ID)

        return {
          ...block,
          groupListAccess: groupList.value.filter((group) => groupIdAccess.indexOf(group.id) !== -1),
          isActive: groupIdAccess.length > 0
        }
      })

      // check dashboard is empty
      isDashboardEmpty.value = blockList.value.every((block) => !block.isActive)
    }

    const generateOrderList = () => {
      blockListEl.value = document.querySelectorAll('.dashboard__block')
      if (blockListEl.value.length === 0) return

      if (dashboardBlocks.value.length !== blockListEl.value.length) {
        const blockOrder = new Array(blockListEl.value.length).fill(undefined).map((_, index) => ({
          id: index,
          order: index,
          mode: '',
          groupId: blockList.value[index]?.groupListAccess[0]?.id || 0
        }))

        updateBlockStore(blockOrder)
      } else {
        // reset groupId
        const _dashboardBlocks = dashboardBlocks.value.map((block, index) => ({
          ...block,
          groupId: blockList.value[index]?.groupListAccess[0]?.id || 0
        }))

        updateBlockStore(_dashboardBlocks)
      }

      setBlockOrder()
    }

    const swapBlockOrder = ({ id, mode }) => {
      const currentBlockIndex = findIndex(dashboardBlocks.value, { id })
      if (
        currentBlockIndex !== -1 &&
        ((mode === ORDER_UP && currentBlockIndex === 0) ||
          (mode === ORDER_DOWN && currentBlockIndex + 1 === dashboardBlocks.value.length))
      )
        return

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
      const groupIdListAccess = blockList.value[0].groupListAccess
        .filter((group) => group.id !== TAB_GROUP_ALL_ID)
        .map((group) => group.id)
      const params = { groupId: groupIdListAccess.toString() }
      const pendingDepositsReponse = await getPendingDeposits(isLoadingAccountingOperations, params)
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
        // add tab group all
        groupListData.push({
          id: TAB_GROUP_ALL_ID,
          name: 'グループ全体'
        })
      }
      groupList.value = groupListData

      // get group access
      setBlocksActive()

      if (blockList.value[0]?.isActive) {
        const params = {
          groupId: blockList.value[0].groupListAccess
            .filter((group) => group.id !== 0)
            .map((group) => group.id)
            .toString()
        }
        fetchPendingDeposits(params)
      }
      if (blockList.value[1]?.isActive) {
        const params = { groupId: blockList.value[1].groupListAccess[0].id }
        fetchSales(params)
      }
      if (blockList.value[2]?.isActive) {
        const params = { groupId: blockList.value[2].groupListAccess[0].id }
        fetchMonthlyAccounting(params)
      }
      if (blockList.value[3]?.isActive) {
        const params = { groupId: blockList.value[3].groupListAccess[0].id }
        fetchBankAccountBalance(params)
      }
      if (blockList.value[4]?.isActive) {
        const params = { groupId: blockList.value[4].groupListAccess[0].id }
        fetchRaking(params)
      }

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
      blockList,
      dataTableAccoutingOperations,
      isLoadingAccountingOperations,
      dataTableMonthly,
      isLoadingMonthlyAccounting,
      rankingData,
      bankBalance,
      isSpiningRanking,
      isDashboardEmpty,

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
  height: 100%;

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
