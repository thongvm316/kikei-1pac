<template>
  <div class="u-mx-32">
    <div class="u-flex u-justify-end u-mt-24 u-mb-16">
      <a-button :loading="loadingExportCsvButton" @click="exportDepositAsCsvFile">
        <template #icon
          ><span class="btn-icon"><line-down-icon /></span
        ></template>
        CSVファイルダウンロード
      </a-button>

      <a-button type="primary" class="u-ml-12" @click="$router.push({ name: 'deposit-new' })">
        <template #icon
          ><span class="btn-icon"><line-add-icon /></span
        ></template>
        新規入出金追加
      </a-button>
    </div>

    <div class="u-flex u-justify-between u-mb-24">
      <div>
        <a-checkbox
          v-model:checked="checkAllRowTable"
          :disabled="disabledCheckAllRowTable"
          :indeterminate="indeterminateCheckAllRows"
          @change="onSelectAllRowsByCustomCheckbox"
        >
          チェックした項目全てを確定する
        </a-checkbox>

        <a-button
          v-if="currentSelectedRowKeys.length > 1"
          @click="onOpenConfirmDepositRecordModal(currentSelectedRowKeys)"
          size="small"
          type="primary">確定</a-button>
      </div>

      <a-select
        v-model:value="searchKeyMultipleSelect"
        show-arrow
        :max-tag-count="1"
        option-label-prop="label"
        dropdown-class-name="multiple-select-custom"
        mode="multiple"
        placeholder="Select a bank"
        style="width: 200px"
        :default-active-first-option="false"
        @change="onHandleChangeBankAcountSelect"
      >
        <template #menuItemSelectedIcon>
          <a-checkbox :checked="true" />
        </template>

        <a-select-option v-for="option in bankAccountList" :key="option.id" :label="option.name">
          {{ option.name }}
        </a-select-option>
      </a-select>

      <a-pagination
        v-model:current="currentPage"
        :total="totalRecords"
        :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
        :page-size="10"
        size="small"
        @change="handleChangePage"
      />
    </div>

    <a-tabs
      v-model:active-key="activeKeyGroupTab"
      class="-mx-32"
      default-active-key="1"
      :animated="false"
      @change="onHandleChangeTabGroup"
    >
      <a-tab-pane v-for="item in tabListGroup" :key="item.id" :tab="item.name">
        <deposit-table
          v-model:expanded-row-keys="expandedRowKeys"
          v-model:is-loading-data-table="isLoadingDataTable"
          v-model:data-deposit="dataDeposit"
          v-model:indeterminate-check-all-rows="indeterminateCheckAllRows"
          v-model:check-all-row-table="checkAllRowTable"
          v-model:current-selected-row-keys="currentSelectedRowKeys"
          v-model:expand-icon-column-index="expandIconColumnIndex"
          :key="tableKey"
          @on-open-deposit-buttons-float="onOpenDepositButtonsFloat"
          @on-open-confirm-deposit-record-modal="onOpenConfirmDepositRecordModal($event)"
        />
      </a-tab-pane>
    </a-tabs>
  </div>

  <search-deposit-modal v-model:current-active-id-group="currentActiveIdGroup" @on-search="getDataDeposit($event)" />

  <deposit-buttons-float
    v-model:disable-button="disableButton"
    v-model:visible="isVisibleDepositButtonsFloat"
    @on-open-delete-deposit-modal="onOpenDeleteDepositModal"
    @on-copy-record-deposit="onCopyRecordDeposit"
    @on-edit-record-deposit="onEditRecordDeposit" />
  <delete-deposit-modal @on-delete-deposit-record="onDeleteDepositRecord" v-model:visible="isVisibleDepositModal" />

  <confirm-deposit-modal
    v-model:visible="isVisibleConfirmDepositModal"
    :current-selected-record="currentSelectedRecord"
    @on-confirm-deposit-record="onConfirmDepositRecord" />
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import DepositTable from './-components/DepositTable'
import {
  getDeposit,
  getGroups,
  getBankAccounts,
  deleteDeposit,
  createDataTableFormat,
  confirmDeposit } from './composables/useDeposit'
import { debounce } from '@/helpers/debounce'
import { exportCSVFile } from '@/helpers/export-csv-file'
import SearchDepositModal from './-components/SearchDepositModal'
import DepositButtonsFloat from './-components/DepositButtonsFloat'
import DeleteDepositModal from './-components/DeleteDepositModal'
import ConfirmDepositModal from './-components/ConfirmDepositModal'

export default defineComponent({
  name: 'DepositPage',

  components: {
    LineDownIcon,
    LineAddIcon,
    DepositTable,
    SearchDepositModal,
    DepositButtonsFloat,
    DeleteDepositModal,
    ConfirmDepositModal
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const store = useStore()

    const activeKeyGroupTab = ref(1)
    const disableButton = ref()
    const loadingExportCsvButton = ref()
    const currentSelectedRecord = ref()
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
    const currentPageNumber = ref()
    const isVisibleConfirmDepositModal = ref(false)
    const confirmedSelectedDepositRecord = ref()
    const disabledCheckAllRowTable = ref()
    const tableKey = ref(0)

    const onSelectAllRowsByCustomCheckbox = (e) => {
      indeterminateCheckAllRows.value = false
      const keyRowList = dataDeposit.value.filter((item) => !item.confirmed)

      e.target.checked
        ? (currentSelectedRowKeys.value = keyRowList.map((item) => item.key))
        : (currentSelectedRowKeys.value = [])
    }

    const resetConfirmAllRecordButton = () => {
      checkAllRowTable.value = false
      indeterminateCheckAllRows.value = false
      currentSelectedRowKeys.value = []
    }

    const getDataDeposit = async (data, params) => {
      try {
        isLoadingDataTable.value = true
        const res = await getDeposit(data, params)
        dataDeposit.value = createDataTableFormat(res.data.result?.data || [])
        disabledCheckAllRowTable.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0
        totalRecords.value = res.data.result?.meta.totalRecords || 0
      } finally {
        isLoadingDataTable.value = false
      }
    }

    onBeforeMount(async () => {
      const groupList = await getGroups()
      tabListGroup.value = groupList.result?.data || []

      const groupId = getTabIndex(tabListGroup.value)
      activeKeyGroupTab.value = parseInt(groupId)
      currentActiveIdGroup.value = parseInt(groupId)

      await fetchBankAccounts()

      // call search data deposit
      const res = await fetchDataDeposit(groupId)
    })

    const fetchBankAccounts = async () => {
      const bankAccounts = await getBankAccounts({ groupId: currentActiveIdGroup.value })
      bankAccountList.value = bankAccounts.result?.data || []
    }

    const fetchDataDeposit = async (groupId) => {
      const { purpose } = route.query || null
      await getDataDeposit({ groupId, purpose })
      router.replace({ query: { groupId, purpose: '' } })
    }

    const getTabIndex = (tabList) => {
      const { tab } = route.query || 1
      const indexTab = tabList.findIndex((item) => item.id === parseInt(tab))
      const groupId = indexTab < 0 ? tabList[0].id : parseInt(tab)

      return groupId
    }

    const onHandleChangeBankAcountSelect = debounce(async (bankAccountId) => {
      dataDeposit.value = []
      currentBankAccountList.value = bankAccountId
      await getDataDeposit(
        { groupId: currentActiveIdGroup.value, bankAccountId },
        { pageNumber: currentPageNumber.value }
      )

      const COLLUMNS_COUNT = 9
      dataDeposit.value[0].bankAccounts?.length
        ? (expandIconColumnIndex.value = COLLUMNS_COUNT)
        : (expandIconColumnIndex.value = 10)

      bankAccountId.length
        ? (expandedRowKeys.value = dataDeposit.value.map((item) => item.key))
        : (expandedRowKeys.value = [])
    }, 1000)

    const onHandleChangeTabGroup = async (groupId) => {
      currentActiveIdGroup.value = groupId
      router.push({ query: { ...route.query, tab: groupId } })

      await fetchBankAccounts()
      await getDataDeposit({ groupId })
      resetConfirmAllRecordButton()
    }

    const handleChangePage = async (pageNumber) => {
      const res = await getDataDeposit(
        { groupId: currentActiveIdGroup.value, bankAccountId: currentBankAccountList.value },
        { pageNumber }
      )
      currentPageNumber.value = pageNumber
      resetConfirmAllRecordButton()
    }

    const exportObj = reactive({
      fileTitle: 'Deposit',
      labels: [
        { header: t('deposit.csv.header.confirmed'), field: 'confirmed', formatBy: 'format_bolean_confirmed_text' },
        { header: t('deposit.csv.header.date'), field: 'date', formatBy: 'moment_l' },
        { header: t('deposit.csv.header.statictis_month'), field: 'statisticsMonth', formatBy: 'moment_yyyy_mm' },
        { header: t('deposit.csv.header.deposit_money'), field: 'depositMoney' },
        { header: t('deposit.csv.header.withdraw_money'), field: 'withdrawalMoney' },
        { header: t('deposit.csv.header.balance'), field: 'balance' },
        { header: t('deposit.csv.header.type_name'), field: 'type', formatBy: 'format_deposit_type_name_text' },
        { header: t('deposit.csv.header.category'), field: 'categoryName' },
        { header: t('deposit.csv.header.sub_category'), field: 'subcategoryName' },
        { header: t('deposit.csv.header.purpose'), field: 'purpose' }
      ],
      items: []
    })

    const generateKeyCsv = (data) => {
      let objectData = {}

      data.forEach((item) => {
        ;(objectData[`${item.name.replaceAll(' ', '').toLowerCase()}_deposit`] = item.deposit),
        (objectData[`${item.name.replaceAll(' ', '').toLowerCase()}_withdrawal`] = item.withdrawal),
        (objectData[`${item.name.replaceAll(' ', '').toLowerCase()}_balance`] = item.balance)
      })

      return objectData
    }

    const exportDepositAsCsvFile = async () => {
      loadingExportCsvButton.value = true
      const params = {
        pageNumber: 1,
        pageSize: totalRecords.value + 100
      }
      const dataRequest = {
        groupId: tabListGroup.value[0].id,
        bankAccountId: currentBankAccountList.value
      }

      const { data } = await getDeposit(dataRequest, params)
      loadingExportCsvButton.value = false
      const depositItems = data.result.data

      if (depositItems[0].bankAccounts) {
        exportObj.items = depositItems.map((record) => {
          const bankObj = generateKeyCsv(record.bankAccounts)
          return { ...record, ...bankObj }
        })

        // TODO: LOCALE header csv
        Object.keys(generateKeyCsv(depositItems[0].bankAccounts)).forEach((key) => {
          const headerSplit = key.split('_')
          exportObj.labels.push({
            header: `${headerSplit[0]}_${t(`deposit.csv.header.${headerSplit[1]}`)}`,
            field: key
          })
        })
      } else {
        exportObj.items = depositItems
      }
      exportCSVFile(exportObj)
    }

    const onOpenDepositButtonsFloat = (record) => {
      currentSelectedRecord.value = record
      disableButton.value = record.confirmed
      isVisibleDepositButtonsFloat.value = true
    }

    const onOpenDeleteDepositModal = () => {
      if (currentSelectedRecord.value.confirmed) return

      isVisibleDepositModal.value = true
    }

    const onDeleteDepositRecord = async () => {
      isLoadingDataTable.value = true
      await deleteDeposit(currentSelectedRecord.value.id)
      dataDeposit.value = dataDeposit.value.filter((item) => item.id !== currentSelectedRecord.value.id)
      isVisibleDepositModal.value = false
      isLoadingDataTable.value = false
      isVisibleDepositButtonsFloat.value = false

      // show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message: 'プロジェクト名 を削除しました'
      })
    }

    const onCopyRecordDeposit = () => {
      const depositId = currentSelectedRecord.value?.id || currentSelectedRecord.value?.parentId || ''
      if (!depositId) return

      router.push({
        name: 'deposit-new',
        query: { selectedId: depositId }
      })
    }

    const onEditRecordDeposit = () => {
      const depositId = currentSelectedRecord.value?.id || currentSelectedRecord.value?.parentId || ''
      if (!depositId) return

      router.push({ name: 'deposit-edit', params: { id: depositId } })
    }

    const onOpenConfirmDepositRecordModal = (depositIdList) => {
      isVisibleConfirmDepositModal.value = true
      confirmedSelectedDepositRecord.value = depositIdList
    }

    const onConfirmDepositRecord = async () => {
      await confirmDeposit({ id: confirmedSelectedDepositRecord.value })

      confirmedSelectedDepositRecord.value.forEach(confirmedId => {
        const indexConfirmedRecord = dataDeposit.value.findIndex(record => record.id === confirmedId)
        if (indexConfirmedRecord < 0) return

        dataDeposit.value[indexConfirmedRecord].confirmed = true
        currentSelectedRowKeys.value = currentSelectedRowKeys.value.filter(key => key !== confirmedId)
      })

      indeterminateCheckAllRows.value = currentSelectedRowKeys.value.length > 0

      checkAllRowTable.value = (currentSelectedRowKeys.value.length === dataDeposit.value.filter((item) => !item.confirmed).length) && currentSelectedRowKeys.value.length > 2

      disabledCheckAllRowTable.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0

      // Force rerender table
      tableKey.value++

      // show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message: 'プロジェクト名 を削除しました'
      })

      isVisibleConfirmDepositModal.value = false
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
      currentPageNumber,
      disableButton,
      loadingExportCsvButton,
      activeKeyGroupTab,
      isVisibleConfirmDepositModal,
      tableKey,
      disabledCheckAllRowTable,
      currentSelectedRecord,

      onSelectAllRowsByCustomCheckbox,
      onHandleChangeBankAcountSelect,
      onHandleChangeTabGroup,
      handleChangePage,
      getDataDeposit,
      onOpenDepositButtonsFloat,
      onOpenDeleteDepositModal,
      onEditRecordDeposit,
      onDeleteDepositRecord,
      onCopyRecordDeposit,
      exportDepositAsCsvFile,
      onOpenConfirmDepositRecordModal,
      onConfirmDepositRecord,
      resetConfirmAllRecordButton
    }
  }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin: 0 -32px;
}
</style>
