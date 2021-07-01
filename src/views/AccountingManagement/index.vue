<template>
  <div class="accounting u-mx-32">
    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16">
      <div>
        <span class="u-mr-16 u-text-grey-15">{{ $t('accounting.financing_period_label') }}:</span>
        <a-select v-model:value="financingPeriod" :style="{ width: '120px' }" @change="handleChangeFinancingPeriod">
          <a-select-option value="g1">G1</a-select-option>
          <a-select-option value="g2">G2</a-select-option>
          <a-select-option value="g3">G3</a-select-option>
        </a-select>
        <span class="u-ml-8 u-text-grey-75">{{ $t('accounting.period') }}</span>
      </div>

      <a-button>
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
      @getPixelsScrolled="getPixelsScrolled"
    />

    <p class="u-mt-24">支出</p>
    <accounting-table
      :table-index="1"
      :table-index-disable-scroll="tableIndexDisableScroll"
      :pixels-scrolled="pixelsScrolled"
      :is-loading-table="isLoadingTable"
      @getPixelsScrolled="getPixelsScrolled"
    />

    <p class="u-mt-24">合計</p>
    <accounting-table
      :table-index="2"
      :table-index-disable-scroll="tableIndexDisableScroll"
      :pixels-scrolled="pixelsScrolled"
      :is-loading-table="isLoadingTable"
      @getPixelsScrolled="getPixelsScrolled"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from 'vue'

import AccountingTable from './-components/AccountingTable.vue'
import { getGroups } from './composables/useAccounting'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'

export default defineComponent({
  name: 'AccountingManagementPage',

  components: {
    AccountingTable,
    LineDownIcon
  },

  setup() {
    const pixelsScrolled = ref(0)
    const tableIndexDisableScroll = ref()
    const financingPeriod = ref()
    const isLoadingTable = ref(false)

    // group tabs
    const activeKeyGroup = ref(1)
    const tabListGroup = ref([])

    const getPixelsScrolled = ({ tableIndex, pixel }) => {
      tableIndexDisableScroll.value = tableIndex
      pixelsScrolled.value = pixel
    }

    const fetchDataTables = () => {
      // request data
      isLoadingTable.value = true

      try {
        //...
      } finally {
        isLoadingTable.value = false
      }
    }

    const handleChangeFinancingPeriod = () => {
      fetchDataTables()
    }

    const onHandleChangeGroup = () => {
      fetchDataTables()
    }

    onBeforeMount(async () => {
      // fetch group list
      const groupList = await getGroups()
      tabListGroup.value = groupList.result?.data || []
    })

    return {
      pixelsScrolled,
      tableIndexDisableScroll,
      financingPeriod,
      activeKeyGroup,
      tabListGroup,

      isLoadingTable,

      getPixelsScrolled,
      handleChangeFinancingPeriod,
      onHandleChangeGroup
    }
  }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin: 0 -32px;
}
</style>
