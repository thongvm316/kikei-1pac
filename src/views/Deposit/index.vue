<template>
  <div class="u-mx-32">
    <div class="u-flex u-justify-end u-mt-24 u-mb-16">
      <a-button>
        <template #icon><span class="btn-icon"><line-down-icon /></span></template>
        CSVファイルダウンロード
      </a-button>

      <a-button type="primary" class="u-ml-12">
        <template #icon><span class="btn-icon"><line-add-icon /></span></template>
        新規入出金追加
      </a-button>
    </div>

    <div class="u-flex u-justify-between u-mb-24">
      <div>
        <a-checkbox
          v-model:checked="checkAllRowTable"
          @change="onSelectAllRowsByCustomCheckbox"
          :indeterminate="indeterminateCheckAllRows">
          チェックした項目全てを確定する
        </a-checkbox>

        <a-button v-if="currentSelectedRowKeys.length > 1" size="small" type="primary">確定</a-button>
      </div>

      <a-select
        v-model:value="searchKeyMultipleSelect"
        show-arrow
        :maxTagCount="0"
        mode="multiple"
        placeholder="Select a bank"
        style="width: 200px"
        option-label-prop="label"
        dropdownClassName="multiple-select-custom"
        :defaultActiveFirstOption="false"
        @change="onHandleChangeBankAcountSelect">
        <template #menuItemSelectedIcon>
          <a-checkbox :checked="true" />
        </template>

        <a-select-option v-for="option in bankAccountList" :key="option.id">
          {{ option.number }}
        </a-select-option>
      </a-select>

      <a-pagination
        v-model:current="currentPage"
        :total="totalRecords"
        :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
        :page-size="10"
        @change="handleChangePage"
        size="small" />
    </div>

    <a-tabs
      class="-mx-32"
      default-active-key="1"
      :animated="false"
      @change="onHandleChangeTabGroup">
      <a-tab-pane v-for="item in tabListGroup" :key="item.id" :tab="item.name">
        <deposit-table
          v-model:expanded-row-keys="expandedRowKeys"
          v-model:is-loading-data-table="isLoadingDataTable"
          v-model:dataDeposit="dataDeposit"
          v-model:indeterminate-check-all-rows="indeterminateCheckAllRows"
          v-model:check-all-row-table="checkAllRowTable"
          v-model:current-selected-row-keys="currentSelectedRowKeys"
          v-model:expand-icon-column-index="expandIconColumnIndex"
          @on-open-deposit-buttons-float="onOpenDepositButtonsFloat" />
      </a-tab-pane>
    </a-tabs>
  </div>

  <search-deposit-modal v-model:current-active-id-group="currentActiveIdGroup" @on-search="getDataDeposit($event)" />
  <deposit-buttons-float
    @on-open-delete-deposit-modal="onOpenDeleteDepositModal"
    @on-copy-record-deposit="onCopyRecordDeposit"
    v-model:visible="isVisibleDepositButtonsFloat" />
  <delete-deposit-modal @on-delete-deposit-record="onDeleteDepositRecord" v-model:visible="isVisibleDepositModal" />
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref, toRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import DepositTable from './-components/DepositTable'
import { getDeposit, getGroupList, getBankAccounts, deleteDeposit } from './composables/useDepositService'
import { debounce } from '@/helpers/debounce'
import { typeDepositEnums } from '@/enums/deposit.enum'
import SearchDepositModal from './-components/SearchDepositModal'
import DepositButtonsFloat from './-components/DepositButtonsFloat'
import DeleteDepositModal from './-components/DeleteDepositModal'

export default defineComponent({
  name: 'DepositPage',

  components: {
    LineDownIcon,
    LineAddIcon,
    DepositTable,
    SearchDepositModal,
    DepositButtonsFloat,
    DeleteDepositModal
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const currentSelectedRecord = ref()

    const onOpenDepositButtonsFloat = (record) => {
      if (record.confirmed) return

      currentSelectedRecord.value = record
      isVisibleDepositButtonsFloat.value = true
    }

    const onOpenDeleteDepositModal = () => {
      isVisibleDepositButtonsFloat.value = false
      isVisibleDepositModal.value = true
    }

    const onDeleteDepositRecord = async () => {
      isLoadingDataTable.value = true
      await deleteDeposit(currentSelectedRecord.value.id)
      dataDeposit.value = dataDeposit.value.filter(item => item.id !== currentSelectedRecord.value.id)
      isVisibleDepositModal.value = false
      isLoadingDataTable.value = false
    }

    const onCopyRecordDeposit = () => {
      store.commit('deposit/STORE_RECORD_DEPOSIT', currentSelectedRecord.value)
      router.push({ name: 'deposit-new' })
    }

    // const tableVal = reactive({
    //   indeterminateCheckAllRows: false,
    //   checkAllRowTable: false,
    //   currentSelectedRowKeys: [],
    //   dataDeposit: [],
    //   isLoadingDataTable: true,
    //   expandedRowKeys: [],
    //   expandIconColumnIndex: null
    // })

    const isVisibleDepositButtonsFloat = ref()
    const isVisibleDepositModal = ref()

    const checkAllRowTable = ref()
    const indeterminateCheckAllRows = ref()
    const searchKeyMultipleSelect = ref([])
    const currentPage = ref(1)
    const currentSelectedRowKeys = ref([])
    const tabListGroup = ref([])
    const bankAccountList = ref([])
    const dataDeposit = ref([])
    const isLoadingDataTable = ref(true)
    const expandedRowKeys = ref([])
    const currentActiveIdGroup = ref()
    const currentBankAccountList = ref([])
    const totalRecords = ref()
    const expandIconColumnIndex = ref()

    const onSelectAllRowsByCustomCheckbox = (e) => {
      indeterminateCheckAllRows.value = false
      const keyRowList = dataDeposit.value.filter(item => !item.confirmed)
      e.target.checked ? currentSelectedRowKeys.value = keyRowList.map(item => item.key) : currentSelectedRowKeys.value = []
    }

    const createDataTableFormat = (data) => {
      return data.map(item => {
        let typeName
        typeDepositEnums.forEach(type => (type.type === item.type) && (typeName = type.name))

        return Object.assign(item,
          {
            key: item.id,
            children: item.bankAccounts ? item.bankAccounts.map(
              bank => Object.assign(bank,
                { type: 10 },
                { key: item.id },
                { purpose: `${bank.name} (${bank.currency})` },
                { typeName }))
                : [],
            deposit: '100000',
            typeName
          })
      })
    }

    const getDataDeposit = async (data, params) => {
      try {
        isLoadingDataTable.value = true
        const res = await getDeposit(data, params)
        dataDeposit.value = createDataTableFormat(res.data.result.data)
        totalRecords.value = res.data.result.meta.totalRecords
      } finally {
        isLoadingDataTable.value = false
      }
    }

    onBeforeMount(async () => {
      const groupList = await getGroupList()
      tabListGroup.value = groupList.result
      currentActiveIdGroup.value = groupList.result[0].id

      const bankAccounts = await getBankAccounts()
      bankAccountList.value = bankAccounts.result

      const { tab } = router.currentRoute._value.query
      const idGroupList = tabListGroup.value.map(item => item.id)
      const indexTab = idGroupList.findIndex(item => item.toString() === tab)

      if (indexTab < 0) {
        await getDataDeposit({ groupId: tabListGroup.value[0].id })
      } else {
        await getDataDeposit({ groupId: parseInt(tab) })
      }
    })

    const onHandleChangeBankAcountSelect = debounce(async (bankAccountId) => {
      dataDeposit.value = []
      currentBankAccountList.value = bankAccountId
      await getDataDeposit({ groupId: currentActiveIdGroup.value, bankAccountId })
      expandIconColumnIndex.value = 10 // TODO: columns count
      bankAccountId.length ? expandedRowKeys.value = dataDeposit.value.map(item => item.key) : expandedRowKeys.value = []
    }, 800)

    const onHandleChangeTabGroup = async (groupId) => {
      currentActiveIdGroup.value = groupId
      router.push({ query: { ...route.query, tab: groupId } })

      await getDataDeposit({ groupId, bankAccountId: currentBankAccountList.value })
    }

    const handleChangePage = async (pageNumber) => {
      await getDataDeposit({ groupId: currentActiveIdGroup.value, bankAccountId: currentBankAccountList.value }, { pageNumber })
    }

    return {
      checkAllRowTable,
      searchKeyMultipleSelect,
      currentPage,
      indeterminateCheckAllRows,
      currentSelectedRowKeys,
      bankAccountList,
      tabListGroup,
      dataDeposit,
      isLoadingDataTable,
      expandedRowKeys,
      totalRecords,
      currentActiveIdGroup,
      expandIconColumnIndex,
      isVisibleDepositButtonsFloat,
      isVisibleDepositModal,

      onSelectAllRowsByCustomCheckbox,
      onHandleChangeBankAcountSelect,
      onHandleChangeTabGroup,
      handleChangePage,
      getDataDeposit,
      onOpenDepositButtonsFloat,
      onOpenDeleteDepositModal,
      onDeleteDepositRecord,
      onCopyRecordDeposit
    }
  }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin: 0 -32px;
}
</style>
