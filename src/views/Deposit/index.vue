<template>
  <div class="u-mx-32">
    <div class="u-flex u-justify-end u-mt-24 u-mb-16">
      <a-button :loading="loadingExportCsvButton" @click="exportDepositAsCsvFile">
        <template #icon>
          <span class="btn-icon"><line-down-icon /></span>
        </template>
        {{ $t('deposit.deposit_list.export_csv') }}
      </a-button>

      <a-button type="primary" class="u-ml-12" @click="$router.push({ name: 'deposit-new' })">
        <template #icon>
          <span class="btn-icon"><line-add-icon /></span>
        </template>
        {{ $t('deposit.deposit_list.create_deposit') }}
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
          {{ $t('deposit.deposit_list.check_all') }}
        </a-checkbox>

        <a-button
          v-if="currentSelectedRowKeys.length > 1"
          size="small"
          type="primary"
          @click="onOpenConfirmDepositRecordModal(currentSelectedRowKeys, 'confirmAll')"
        >
          {{ $t('deposit.deposit_list.confirm_all') }}
        </a-button>
      </div>

      <a-select
        v-model:value="bankAccountId"
        show-arrow
        :max-tag-count="1"
        option-label-prop="label"
        dropdown-class-name="multiple-select-custom"
        mode="multiple"
        :placeholder="$t('deposit.deposit_list.select_bank_placeholder')"
        :style="{ width: '200px' }"
        :default-active-first-option="false"
        @change="onHandleChangeBankAcountSelect"
      >
        <a-select-option v-for="option in bankAccountList" :key="option.name" :value="option.id" :label="option.name">
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
          :key="tableKey"
          v-model:expanded-row-keys="expandedRowKeys"
          v-model:is-loading-data-table="isLoadingDataTable"
          v-model:data-deposit="dataDeposit"
          v-model:indeterminate-check-all-rows="indeterminateCheckAllRows"
          v-model:check-all-row-table="checkAllRowTable"
          v-model:current-selected-row-keys="currentSelectedRowKeys"
          v-model:expand-icon-column-index="expandIconColumnIndex"
          @on-open-deposit-buttons-float="onOpenDepositButtonsFloat"
          @on-open-confirm-deposit-record-modal="onOpenConfirmDepositRecordModal($event, 'confirmOne')"
          @on-sort="sort"
        />
      </a-tab-pane>
    </a-tabs>
  </div>

  <search-deposit-modal @updateParamRequestDeposit="updateParamRequestDeposit" />

  <modal-actions
    v-if="isVisibleDepositButtonsFloat"
    v-model:is-disable-delete="isDisableDelete"
    @on-go-to-edit="onEditRecordDeposit"
    @on-go-to-copy="onCopyRecordDeposit"
    @on-go-to-delete="onOpenDeleteDepositModal"
  />

  <delete-deposit-modal
    v-model:visible="isVisibleDepositModal"
    :current-selected-record="currentSelectedRecord"
    @on-delete-deposit-record="onDeleteDepositRecord"
  />

  <confirm-deposit-modal
    v-model:visible="isVisibleConfirmDepositModal"
    :confirmed-selected-purpose="confirmedSelectedPurpose"
    @on-confirm-deposit-record="onConfirmDepositRecord"
  />
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { merge } from 'lodash-es'

import {
  getDeposit,
  getGroups,
  getBankAccounts,
  deleteDeposit,
  createDataTableFormat,
  confirmDeposit
} from './composables/useDeposit'
import { debounce } from '@/helpers/debounce'
import { exportCSVFile } from '@/helpers/export-csv-file'
import { deepCopy } from '@/helpers/json-parser'

import DepositTable from './-components/DepositTable'
import SearchDepositModal from './-components/SearchDepositModal'
import DeleteDepositModal from './-components/DeleteDepositModal'
import ConfirmDepositModal from './-components/ConfirmDepositModal'
import ModalActions from '@/components/ModalActions'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'

export default defineComponent({
  name: 'DepositPage',

  components: {
    LineDownIcon,
    LineAddIcon,
    DepositTable,
    SearchDepositModal,
    DeleteDepositModal,
    ConfirmDepositModal,
    ModalActions
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const store = useStore()

    // pagination
    const currentPage = ref(1)
    const totalRecords = ref()

    // tabs
    const activeKeyGroupTab = ref(1)
    const tabListGroup = ref([])
    const currentActiveIdGroup = ref()

    // select bank account
    const bankAccountId = ref([])
    const bankAccountList = ref([])

    // table
    const dataDeposit = ref([])
    const isLoadingDataTable = ref(true)
    const expandedRowKeys = ref([])
    const expandIconColumnIndex = ref(10)
    const currentSelectedRowKeys = ref([])
    const currentSelectedRecord = ref()
    const confirmedSelectedDepositRecord = ref()
    const confirmedSelectedPurpose = ref()
    const tableKey = ref(0)

    // check all row
    const checkAllRowTable = ref()
    const indeterminateCheckAllRows = ref()
    const disabledCheckAllRowTable = ref()

    const loadingExportCsvButton = ref()
    const isDisableDelete = ref()
    const isVisibleDepositButtonsFloat = ref()
    const isVisibleDepositModal = ref()
    const isVisibleConfirmDepositModal = ref(false)

    // data for request deposit
    const paramRequestDataDeposit = ref({ data: {}, params: { pageNumber: 1 } })

    const updateParamRequestDeposit = ({ data = {}, params = {} }) => {
      paramRequestDataDeposit.value = {
        data: { ...paramRequestDataDeposit.value.data, ...data },
        params: { ...paramRequestDataDeposit.value.params, ...params }
      }
    }

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

    const getDataDeposit = async (dataRequest, paramsRequest) => {
      isLoadingDataTable.value = true

      try {
        const { data = {} } = await getDeposit(dataRequest, paramsRequest)

        dataDeposit.value = createDataTableFormat(data.result?.data || [])
        disabledCheckAllRowTable.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0
        totalRecords.value = data.result?.meta.totalRecords || 0
        currentPage.value = paramsRequest.pageNumber || 1

        // expand row table
        const COLLUMNS_COUNT = 9
        dataDeposit.value[0]?.bankAccounts?.length
          ? (expandIconColumnIndex.value = COLLUMNS_COUNT)
          : (expandIconColumnIndex.value = 10)

        bankAccountId.value.length
          ? (expandedRowKeys.value = dataDeposit.value.map((item) => item.key))
          : (expandedRowKeys.value = [])
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const getTabIndex = (tabList) => {
      const { tab } = route.query || 1
      const indexTab = tabList.findIndex((item) => item.id === parseInt(tab))
      const groupId = indexTab < 0 ? tabList[0].id : parseInt(tab)

      return groupId
    }

    const onHandleChangeBankAcountSelect = debounce(async (value) => {
      updateParamRequestDeposit({
        data: { bankAccountId: value }
      })
    }, 1000)

    const onHandleChangeTabGroup = async (groupId) => {
      dataDeposit.value = []
      currentActiveIdGroup.value = groupId
      router.push({ query: { ...route.query, tab: groupId } })

      // reset params
      bankAccountId.value = []
      currentPage.value = 1
      expandedRowKeys.value = []
      expandIconColumnIndex.value = 10

      // fetch bank accounts
      const bankAccounts = await getBankAccounts({ groupId: currentActiveIdGroup.value })
      bankAccountList.value = bankAccounts.result?.data || []

      updateParamRequestDeposit({ data: { groupId, bankAccountId: [] }, params: { pageNumber: 1 } })
      resetConfirmAllRecordButton()
    }

    const handleChangePage = async (pageNumber) => {
      updateParamRequestDeposit({
        params: { pageNumber }
      })

      resetConfirmAllRecordButton()
    }

    /* --------------------- handle export CSV ------------------- */
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
        bankAccountId: bankAccountId.value
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
            header: `${headerSplit[0]}-${t(`deposit.csv.header.${headerSplit[1]}`)}`,
            field: key
          })
        })
      } else {
        exportObj.items = depositItems
      }
      exportCSVFile(exportObj)
    }
    /* --------------------- handle export CSV ------------------- */

    /* --------------------- handle edit/copy/delete deposit ------------------- */
    const onOpenDepositButtonsFloat = (record) => {
      const depositId = currentSelectedRecord.value?.id || ''
      const recordId = record?.id || ''

      if (!recordId || depositId === recordId) {
        currentSelectedRecord.value = {}
        isDisableDelete.value = false
        isVisibleDepositButtonsFloat.value = false
      } else {
        currentSelectedRecord.value = record
        isDisableDelete.value = record.confirmed
        isVisibleDepositButtonsFloat.value = true
      }
    }

    const onOpenDeleteDepositModal = () => {
      if (currentSelectedRecord.value.confirmed) return

      isVisibleDepositModal.value = true
    }

    const onDeleteDepositRecord = async () => {
      const depositId = currentSelectedRecord.value?.id || ''
      if (!depositId) return

      isLoadingDataTable.value = true
      await deleteDeposit(depositId)
      dataDeposit.value = dataDeposit.value.filter((item) => item.id !== depositId)
      isVisibleDepositModal.value = false
      isLoadingDataTable.value = false
      isVisibleDepositButtonsFloat.value = false

      // show notification
      const purpose = currentSelectedRecord.value?.purpose

      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message: purpose
          ? t('deposit.deposit_list.delete_success', { purpose })
          : t('deposit.deposit_list.delete_success_multiple')
      })
    }

    const onCopyRecordDeposit = () => {
      const depositId = currentSelectedRecord.value?.id || ''
      if (!depositId) return

      router.push({
        name: 'deposit-new',
        query: { selectedId: depositId }
      })
    }

    const onEditRecordDeposit = () => {
      const depositId = currentSelectedRecord.value?.id || ''
      if (!depositId) return

      // save filters search to store
      store.commit('deposit/STORE_DEPOSIT_FILTER', paramRequestDataDeposit.value)

      router.push({ name: 'deposit-edit', params: { id: depositId } })
    }
    /* --------------------- ./handle edit/copy/delete  deposit ------------------- */

    /* --------------------- handle confirm deposit ------------------- */
    const onOpenConfirmDepositRecordModal = (data, typeConfirm) => {
      isVisibleConfirmDepositModal.value = true
      if (typeConfirm === 'confirmAll') {
        confirmedSelectedDepositRecord.value = data
        confirmedSelectedPurpose.value = ''
      } else {
        confirmedSelectedDepositRecord.value = [data.id]
        confirmedSelectedPurpose.value = data.purpose
      }
    }

    const onConfirmDepositRecord = async () => {
      await confirmDeposit({ id: confirmedSelectedDepositRecord.value })

      confirmedSelectedDepositRecord.value.forEach((confirmedId) => {
        const indexConfirmedRecord = dataDeposit.value.findIndex((record) => record.id === confirmedId)
        if (indexConfirmedRecord < 0) return

        dataDeposit.value[indexConfirmedRecord].confirmed = true
        currentSelectedRowKeys.value = currentSelectedRowKeys.value.filter((key) => key !== confirmedId)
      })

      indeterminateCheckAllRows.value = currentSelectedRowKeys.value.length > 0

      checkAllRowTable.value =
        currentSelectedRowKeys.value.length === dataDeposit.value.filter((item) => !item.confirmed).length &&
        currentSelectedRowKeys.value.length > 2

      disabledCheckAllRowTable.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0

      // Force rerender table
      tableKey.value++

      // show notification
      const purpose = currentSelectedRecord.value?.purpose
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message: purpose
          ? t('deposit.confirm_modal.confirm_success', { purpose })
          : t('deposit.confirm_modal.confirm_success_multiple')
      })

      isVisibleConfirmDepositModal.value = false
      confirmedSelectedPurpose.value = ''
    }
    /* --------------------- ./handle confirm deposit ------------------- */

    const sort = (emitData) => {
      let currentSortStr = ''

      if (!emitData.orderBy) {
        currentSortStr = null
        return
      }

      currentSortStr = `${emitData.field} ${emitData.orderBy}`

      updateParamRequestDeposit({ params: { orderBy: currentSortStr } })
    }

    onBeforeMount(async () => {
      const groupList = await getGroups()
      tabListGroup.value = groupList.result?.data || []

      const groupId = getTabIndex(tabListGroup.value)
      activeKeyGroupTab.value = parseInt(groupId)
      currentActiveIdGroup.value = parseInt(groupId)

      // await fetchBankAccounts()
      const bankAccounts = await getBankAccounts({ groupId: currentActiveIdGroup.value })
      bankAccountList.value = bankAccounts.result?.data || []

      // get filters deposit from store
      const filtersDepositStore = store.state.deposit?.filters || {}

      // set bank account value
      const bankAccountSelected = filtersDepositStore?.data?.bankAccountId || []
      if (bankAccountSelected.length > 0) {
        bankAccountId.value = bankAccountSelected
      }

      updateParamRequestDeposit(merge(deepCopy(filtersDepositStore), { data: { groupId } }))

      router.replace({ query: { tab: groupId } })
    })

    // watch to fetch data deposit
    watch(
      () => paramRequestDataDeposit.value,
      () => {
        getDataDeposit(paramRequestDataDeposit.value.data, paramRequestDataDeposit.value.params)
      }
    )

    return {
      checkAllRowTable,
      bankAccountId,
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
      isDisableDelete,
      loadingExportCsvButton,
      activeKeyGroupTab,
      isVisibleConfirmDepositModal,
      tableKey,
      disabledCheckAllRowTable,
      currentSelectedRecord,
      confirmedSelectedDepositRecord,
      confirmedSelectedPurpose,

      updateParamRequestDeposit,
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
      resetConfirmAllRecordButton,
      sort
    }
  }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin: 0 -32px;
}
</style>
