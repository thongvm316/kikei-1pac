<template>
  <controller-table :title="'Title table'" :group-list="groupList" />
  <sales-table :is-loading-table="isLoadingTableSales" :data-source="dataTableSales" />
  <stacked-bar-sales />
</template>

<script>
import { defineComponent, ref, onBeforeMount } from 'vue'

import ControllerTable from './-components/ControllerTable'
import SalesTable from './-components/SalesTable'
import StackedBarSales from './-components/StackedBarSales'

import { getGroups } from './composables/useDashboard'

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
    ControllerTable,
    SalesTable,
    StackedBarSales
  },

  setup() {
    // table order
    // const tableOrder = ref([])

    // group tabs
    const groupList = ref([])

    //sales table
    const isLoadingTableSales = ref()

    onBeforeMount(async () => {
      // fetch group list
      const groupsReponse = await getGroups()
      groupList.value = groupsReponse.result?.data || []
    })

    return {
      groupList,
      isLoadingTableSales,
      dataTableSales
    }
  }
})
</script>

<style></style>
