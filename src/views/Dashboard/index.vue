<template>
  <div class="dashboard u-mx-32">
    <div class="dashboard__block">
      <controller-block
        :block-id="0"
        :block-list="blockOrder"
        :title="'Table 1'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
      >
        <sales-table :is-loading-table="isLoadingTableSales" :data-source="dataTableSales" />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="1"
        :block-list="blockOrder"
        :title="'Table 2'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
      >
        <sales-table :is-loading-table="isLoadingTableSales" :data-source="dataTableSales" />
        <stacked-bar-sales />
      </controller-block>
    </div>

    <div class="dashboard__block">
      <controller-block
        :block-id="2"
        :block-list="blockOrder"
        :title="'Table 3'"
        :group-list="groupList"
        @on-swap-block-order="swapBlockOrder"
      >
        <sales-table :is-loading-table="isLoadingTableSales" :data-source="dataTableSales" />
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

import { getGroups } from './composables/useDashboard'
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

export default defineComponent({
  name: 'DashboardPage',

  components: {
    ControllerBlock,
    SalesTable,
    StackedBarSales
  },

  setup() {
    // table order
    const blockOrder = ref([])
    const blockListEl = ref()

    // group tabs
    const groupList = ref([])

    //sales table
    const isLoadingTableSales = ref()

    const generateOrderList = () => {
      blockListEl.value = document.querySelectorAll('.dashboard__block')
      if (blockListEl.value.length === 0) return

      blockOrder.value = new Array(blockListEl.value.length).fill(undefined).map((_, index) => ({
        id: index, // don't change
        order: index
      }))

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

      // swap list
      ;[blockOrder.value[currentBlockIndex], blockOrder.value[blockTargetIndex]] = [
        blockOrder.value[blockTargetIndex],
        blockOrder.value[currentBlockIndex]
      ]

      setBlockOrder()
    }

    const setBlockOrder = () => {
      if (blockListEl.value.length === 0) return

      blockListEl.value.forEach((block, index) => {
        const blockFound = find(blockOrder.value, { id: index })
        if (!blockFound) return
        block.style.order = blockFound.order
      })
    }

    onBeforeMount(async () => {
      // fetch group list
      const groupsReponse = await getGroups()
      groupList.value = groupsReponse.result?.data || []
    })

    onMounted(() => {
      generateOrderList()
    })

    return {
      groupList,
      isLoadingTableSales,
      dataTableSales,
      blockOrder,

      swapBlockOrder
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.dashboard {
  @include flexbox(null, null);
  flex-direction: column;
  margin-top: -40px;

  &__block {
    margin-top: 64px;
  }

  // &__block:first-child {
  //   margin-top: 24px;
  // }
}
</style>
