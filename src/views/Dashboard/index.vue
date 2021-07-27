<template>
  <div class="dashboard">
    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[0]"
        :block-list="blockOrder"
        :title="'経理業務'"
        :group-list="groupList"
        :is-unvisible-group-tab="true"
        @on-swap-block-order="swapBlockOrder"
      >
        <AccoutingOperationsTable
          :is-loading-table="isLoadingAccountingOperations"
          :data-source="dataTableAccoutingOperations"
        />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[1]"
        :block-list="blockOrder"
        :title="'今期売上見込'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
      >
        <sales-table :is-loading-table="isLoadingTableSales" :data-source="dataTableSales" />
        <stacked-bar-sales />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[2]"
        :block-list="blockOrder"
        :title="'月次簡易試算'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
      >
        <monthly-accounting-table :is-loading-table="isLoadingMonthlyAccounting" :data-source="dataTableMonthly" />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[3]"
        :block-list="blockOrder"
        :title="'銀行残高推移'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
      >
        <bank-line-chart />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="blockIdList[4]"
        :block-list="blockOrder"
        :title="'今期顧客別売上'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
      >
        <div class="dashboard__ranking">
          <RankingTable />
          <pie-chart />
        </div>
      </controller-block>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, onMounted } from 'vue'
import { findIndex, find } from 'lodash-es'

import ControllerBlock from './-components/ControllerBlock'
import SalesTable from './-components/SalesTable'
import StackedBarSales from './-components/StackedBarSales'
import BankLineChart from './-components/BankLineChart'
import PieChart from './-components/PieChart'
import AccoutingOperationsTable from './-components/AccoutingOperationsTable'
import MonthlyAccountingTable from './-components/MonthlyAccountingTable'
import RankingTable from './-components/RankingTable'

import { getGroups, getPendingDeposits } from './composables/useDashboard'
import { ORDER_UP, ORDER_DOWN } from '@/enums/dashboard.enum'

const dataTableSales = [
  {
    key: '1',
    S: 1111111323343343,
    A: 323343343,
    B: 323343343,
    C: 323343343,
    D: 323343343,
    E: 323343343
  },
  {
    key: '2',
    S: '累積売上',
    A: 1111111323343343,
    B: 1111111323343343,
    C: 1111111323343343,
    D: 1111111323343343,
    E: 1111111323343343
  }
]

const dataTableMonthly = [
  {
    key: '1',
    type: '売上',
    202104: 1111111323343343,
    202105: 1111111323343343,
    202106: 1111111323343343,
    202107: 1111111323343343
  },
  {
    key: '1',
    type: '支出',
    202104: 1111111323343343,
    202105: 1111111323343343,
    202106: 1111111323343343,
    202107: 1111111323343343
  },
  {
    key: '1',
    type: '利益',
    202104: 1111111323343343,
    202105: 1111111323343343,
    202106: 1111111323343343,
    202107: 1111111323343343
  }
]

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
    // table order
    const blockOrder = ref([])
    const blockListEl = ref()
    const blockIdList = ref([])

    // group tabs
    const groupList = ref([])

    //tables
    const isLoadingAccountingOperations = ref(false)
    const isLoadingTableSales = ref()
    const isLoadingMonthlyAccounting = ref(false)
    const dataTableAccoutingOperations = ref([])

    const generateOrderList = () => {
      blockListEl.value = document.querySelectorAll('.dashboard__block')
      if (blockListEl.value.length === 0) return

      blockOrder.value = new Array(blockListEl.value.length).fill(undefined).map((_, index) => ({
        id: index,
        order: index,
        mode: ''
      }))

      blockIdList.value = blockOrder.value.map((block) => block.id)

      setBlockOrder()
    }

    const swapBlockOrder = ({ id, mode }) => {
      const currentBlockIndex = findIndex(blockOrder.value, { id })
      if (
        currentBlockIndex !== -1 &&
        ((mode === ORDER_UP && currentBlockIndex === 0) ||
          (mode === ORDER_DOWN && currentBlockIndex + 1 === blockOrder.value.length))
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

      const orderCurrent = blockOrder.value[currentBlockIndex].order
      const orderTarget = blockOrder.value[blockTargetIndex].order

      // change order
      blockOrder.value[currentBlockIndex].order = orderTarget
      blockOrder.value[blockTargetIndex].order = orderCurrent

      // set mode
      blockOrder.value[currentBlockIndex].mode = mode
      blockOrder.value[blockTargetIndex].mode = mode === ORDER_UP ? ORDER_DOWN : ORDER_UP

      // swap list
      ;[blockOrder.value[currentBlockIndex], blockOrder.value[blockTargetIndex]] = [
        blockOrder.value[blockTargetIndex],
        blockOrder.value[currentBlockIndex]
      ]

      setBlockOrder()
    }

    const setBlockOrder = () => {
      if (blockListEl.value.length === 0) return

      // get lenghts to move (set variable before run transform)
      blockListEl.value.forEach((block, index) => {
        const blockFound = find(blockOrder.value, { id: index })
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
        const blockFound = find(blockOrder.value, { id: index })
        if (!blockFound) return
        block.style.order = blockFound.order
        block.classList.remove('animation-move-up', 'animation-move-down')

        // animation
        if (!blockFound.mode) return
        // void block.offsetWidth // magic to run
        block.classList.add(blockFound.mode === ORDER_UP ? 'animation-move-down' : 'animation-move-up')
      })

      // clear all mode
      blockOrder.value = blockOrder.value.map((item) => ({ ...item, mode: '' }))
    }

    onBeforeMount(async () => {
      // fetch group list
      const groupsReponse = await getGroups()
      groupList.value = groupsReponse?.result?.data || []

      // fetch pending deposits
      const pendingDepositsReponse = await getPendingDeposits(isLoadingAccountingOperations)
      dataTableAccoutingOperations.value = pendingDepositsReponse?.result?.data || []
    })

    onMounted(() => {
      generateOrderList()
    })

    return {
      groupList,
      isLoadingTableSales,
      dataTableSales,
      blockOrder,
      blockIdList,
      dataTableAccoutingOperations,
      isLoadingAccountingOperations,
      dataTableMonthly,
      isLoadingMonthlyAccounting,

      swapBlockOrder
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
