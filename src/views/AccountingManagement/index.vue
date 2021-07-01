<template>
  <div class="u-mx-32">
    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16">
      <div>
        <span class="u-mr-16 u-text-grey-15">期間:</span>
        <a-select v-model:value="yearAccounting" :style="{ width: '120px' }" @change="handleChangeYearAccouting">
          <a-select-option value="g1">G1</a-select-option>
          <a-select-option value="g2">G2</a-select-option>
          <a-select-option value="g3">G3</a-select-option>
        </a-select>
        <span class="u-mr-16 u-text-grey-15">期</span>
      </div>

      <a-button>
        <template #icon>
          <span class="btn-icon"><line-down-icon /></span>
        </template>
        {{ $t('accounting.export_csv') }}
      </a-button>
    </div>

    <div class="-mx-32">
      <a-tabs
        v-model:active-key="activeKeyGroupTab"
        default-active-key="1"
        :animated="false"
        @change="onHandleChangeTabGroup"
      >
        <a-tab-pane v-for="item in tabListGroup" :key="item.id" :tab="item.name" />
      </a-tabs>

      <accounting-table
        :table-index="0"
        :table-index-disable-scroll="tableIndexDisableScroll"
        :pixels-scrolled="pixelsScrolled"
        @getPixelsScrolled="getPixelsScrolled"
      />
      <accounting-table
        :table-index="1"
        :table-index-disable-scroll="tableIndexDisableScroll"
        :pixels-scrolled="pixelsScrolled"
        @getPixelsScrolled="getPixelsScrolled"
      />
      <accounting-table
        :table-index="2"
        :table-index-disable-scroll="tableIndexDisableScroll"
        :pixels-scrolled="pixelsScrolled"
        @getPixelsScrolled="getPixelsScrolled"
      />
    </div>
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
    const yearAccounting = ref()

    // group tabs
    const activeKeyGroupTab = ref(1)
    const tabListGroup = ref([])

    const getPixelsScrolled = ({ tableIndex, pixel }) => {
      tableIndexDisableScroll.value = tableIndex
      pixelsScrolled.value = pixel
    }

    const handleChangeYearAccouting = () => {
      // fetch data list
    }

    onBeforeMount(async () => {
      // fetch group list
      const groupList = await getGroups()
      tabListGroup.value = groupList.result?.data || []
    })

    return {
      pixelsScrolled,
      tableIndexDisableScroll,
      yearAccounting,
      activeKeyGroupTab,
      tabListGroup,

      getPixelsScrolled,
      handleChangeYearAccouting
    }
  }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin: 0 -32px;
}
</style>
