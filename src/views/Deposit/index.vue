<template>
  <div class="u-mx-32">
    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16">
      <div>
        <span class="u-mr-16 u-text-grey-15">表示:</span>
        <a-radio-group
          v-model:value="checkedListFilterMonth"
          :options="filterMonthList"
          @change="handleChangeFilterMonth"
        />
      </div>

      <div class="u-flex u-items-center">
        <a-tooltip color="#fff" :title="$t('deposit.deposit_list.export_csv')">
          <a-button type="link" :loading="isLoadingExportCsv" @click="exportDepositAsCsvFile">
            <template #icon>
              <span class="btn-icon" style="height: 28px"><line-down-icon /></span>
            </template>
          </a-button>
        </a-tooltip>

        <a-button type="primary" class="u-ml-16" @click="$router.push({ name: 'deposit-new' })">
          <template #icon>
            <span class="btn-icon"><line-add-icon /></span>
          </template>
          {{ $t('deposit.deposit_list.create_deposit') }}
        </a-button>
      </div>
    </div>

    <div class="u-flex u-justify-between u-items-center u-mb-24">
      <div>
        <a-checkbox
          v-model:checked="checkAllRowTable"
          :disabled="isDisabledSelectAllRows"
          :indeterminate="indeterminateCheckAllRows"
          @change="onSelectAllRows"
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
        :style="{ width: '350px' }"
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
        :page-size="pageSize"
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
      <a-tab-pane v-for="item in tabListGroup" :key="item.id" :tab="item.name"></a-tab-pane>
    </a-tabs>

    <deposit-table
      :key="tableKey"
      v-model:expanded-row-keys="expandedRowKeys"
      v-model:is-loading-data-table="isLoadingDataTable"
      v-model:data-deposit="dataDeposit"
      v-model:indeterminate-check-all-rows="indeterminateCheckAllRows"
      v-model:check-all-row-table="checkAllRowTable"
      v-model:current-selected-row-keys="currentSelectedRowKeys"
      v-model:expand-icon-column-index="expandIconColumnIndex"
      v-click-outside="handleClickOutsideTable"
      :is-visible-modal-action-bar="isVisibleModalActionBar"
      class="-mx-32"
      @on-open-deposit-buttons-float="onOpenDepositButtonsFloat"
      @on-open-confirm-deposit-record-modal="onOpenConfirmDepositRecordModal($event, 'confirmOne')"
      @handle-open-unconfirm-modal="handleOpenUnconfirmModal"
      @on-sort="onSortTable"
    />
  </div>

  <search-deposit-modal @updateParamRequestDeposit="updateParamRequestDeposit" />

  <modal-actions
    v-if="isVisibleModalActionBar"
    ref="modalActionRef"
    v-model:is-disable-delete="isDisableDelete"
    @on-go-to-edit="onEditRecordDeposit"
    @on-go-to-copy="onCopyRecordDeposit"
    @on-go-to-delete="onOpenDeleteDepositModal"
    @on-close-modal="onCloseModalAction"
  />

  <delete-deposit-modal
    v-model:visible="isVisibleDeleteModal"
    :current-selected-record="currentSelectedRecord"
    @on-delete-deposit-record="onDeleteDepositRecord"
  />

  <confirm-deposit-modal
    v-model:visible="isVisibleConfirmDepositModal"
    :confirmed-selected-purpose="confirmedSelectedPurpose"
    @on-confirm-deposit-record="onConfirmDepositRecord"
  />

  <modal-unconfirm
    v-model:visible="isVisibleUnconfirmModal"
    :purpose="unconfirmRecordSeleted?.purpose || ''"
    @on-unconfirm-deposit="onUnconfirmDeposit"
  />
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref, watch, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { merge, find, isEmpty } from 'lodash-es'
import moment from 'moment'

import {
  getDeposit,
  getGroups,
  getBankAccounts,
  deleteDeposit,
  createDataTableFormat,
  confirmDeposit,
  unconfirmDeposit
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

const ModalUnconfirm = defineAsyncComponent(() => import('./-components/UnconfirmDepositModal'))

export default defineComponent({
  name: 'DepositPage',

  components: {
    LineDownIcon,
    LineAddIcon,
    DepositTable,
    SearchDepositModal,
    DeleteDepositModal,
    ConfirmDepositModal,
    ModalActions,
    ModalUnconfirm
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const store = useStore()

    // pagination
    const currentPage = ref(1)
    const totalRecords = ref()
    const pageSize = ref(50)

    // tabs
    const activeKeyGroupTab = ref(1)
    const tabListGroup = ref([])

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
    const unconfirmRecordSeleted = ref()
    const modalActionRef = ref()

    // check all row
    const checkAllRowTable = ref()
    const indeterminateCheckAllRows = ref()
    const isDisabledSelectAllRows = ref(false)

    const isLoadingExportCsv = ref()
    const isDisableDelete = ref(false)
    const isVisibleModalActionBar = ref(false)
    const isVisibleDeleteModal = ref(false)
    const isVisibleConfirmDepositModal = ref(false)
    const isVisibleUnconfirmModal = ref(false)

    // filter month
    const allMonth = { fromDate: null, toDate: null }
    const lastMonth = {
      fromDate: moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
      toDate: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
    }
    const currentMonth = {
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().endOf('month').format('YYYY-MM-DD')
    }
    const nextMonth = {
      fromDate: moment().add(1, 'months').startOf('month').format('YYYY-MM-DD'),
      toDate: moment().add(1, 'months').endOf('month').format('YYYY-MM-DD')
    }
    const checkedListFilterMonth = ref()
    const filterMonthList = ref([
      { label: 'すべて', value: allMonth },
      { label: '先月', value: lastMonth },
      { label: '当月', value: currentMonth },
      { label: '来月', value: nextMonth }
    ])

    // data for request deposit
    const paramRequestDataDeposit = ref({ data: {}, params: { pageNumber: 1, pageSize: pageSize.value } })

    const updateParamRequestDeposit = ({ data = {}, params = {} }) => {
      paramRequestDataDeposit.value = {
        data: { ...paramRequestDataDeposit.value.data, ...data },
        params: { ...paramRequestDataDeposit.value.params, ...params }
      }
    }

    const fetchDatatableDeposit = async (dataRequest, paramsRequest) => {
      isLoadingDataTable.value = true

      try {
        const { data = {} } = await getDeposit(dataRequest, paramsRequest)

        dataDeposit.value = createDataTableFormat(data.result?.data || [])
        isDisabledSelectAllRows.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0
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

    const onSelectAllRows = (e) => {
      indeterminateCheckAllRows.value = false
      const keyRowList = dataDeposit.value.filter((item) => !item.confirmed)

      e.target.checked
        ? (currentSelectedRowKeys.value = keyRowList.map((item) => item.key))
        : (currentSelectedRowKeys.value = [])
    }

    const resetConfirmAllRecord = () => {
      checkAllRowTable.value = false
      indeterminateCheckAllRows.value = false
      currentSelectedRowKeys.value = []
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
      // reset params
      bankAccountId.value = []
      currentPage.value = 1
      expandedRowKeys.value = []
      expandIconColumnIndex.value = 10
      debugger
      // fetch bank accounts
      const bankAccounts = await getBankAccounts({ groupId })
      bankAccountList.value = bankAccounts.result?.data || []

      updateParamRequestDeposit({ data: { groupId, bankAccountId: [] }, params: { pageNumber: 1 } })
      resetConfirmAllRecord()

      router.push({ query: { ...route.query, tab: groupId } })
    }

    const handleChangePage = async (pageNumber) => {
      updateParamRequestDeposit({
        params: { pageNumber }
      })

      resetConfirmAllRecord()
    }

    // close action bar
    const handleClickOutsideTable = (event) => {
      const elModalDeleteDeposit = document.querySelector('.modal-delete-deposit-js')
      const elNotOutsideList = [modalActionRef.value?.$el, elModalDeleteDeposit].filter(Boolean)
      if (elNotOutsideList.length === 0) return

      const isElOutside = elNotOutsideList.every((el) => !(el == event.target || el.contains(event.target)))

      if (isElOutside) {
        isVisibleModalActionBar.value = false
        currentSelectedRecord.value = {}
      }
    }

    /* --------------------- handle export CSV ------------------- */
    const exportObj = reactive({
      fileTitle: 'Deposit',
      labels: [
        { header: t('deposit.csv.header.confirmed'), field: 'confirmed', formatBy: 'format_bolean_confirmed_text' },
        { header: t('deposit.csv.header.date'), field: 'date', formatBy: 'moment_l' },
        { header: t('deposit.csv.header.statictis_month'), field: 'statisticsMonth', formatBy: 'moment_yyyy_mm' },
        { header: t('deposit.csv.header.deposit'), field: 'depositMoney' },
        { header: t('deposit.csv.header.withdrawal'), field: 'withdrawalMoney' },
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
      isLoadingExportCsv.value = true

      const params = {
        ...paramRequestDataDeposit.value.params,
        pageNumber: 1,
        pageSize: totalRecords.value + 100
      }

      const dataRequest = paramRequestDataDeposit.value.data

      const { data } = await getDeposit(dataRequest, params)

      isLoadingExportCsv.value = false
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
        isVisibleModalActionBar.value = false
      } else {
        currentSelectedRecord.value = record
        isDisableDelete.value = record.confirmed
        isVisibleModalActionBar.value = true
      }
    }

    const onOpenDeleteDepositModal = () => {
      if (currentSelectedRecord.value.confirmed) return

      isVisibleDeleteModal.value = true
    }

    const onDeleteDepositRecord = async () => {
      const depositId = currentSelectedRecord.value?.id || ''
      const purpose = currentSelectedRecord.value?.purpose
      if (!depositId) return

      isLoadingDataTable.value = true
      const { result: deletedRecords } = await deleteDeposit(depositId, {
        applyForRoot: currentSelectedRecord.value?.isRoot || false
      })

      dataDeposit.value = dataDeposit.value.filter((item) => !deletedRecords.data.includes(item.id))
      isVisibleDeleteModal.value = false
      isLoadingDataTable.value = false
      isVisibleModalActionBar.value = false

      // show notification
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

      // save filters search to store
      store.commit('deposit/STORE_DEPOSIT_FILTER', paramRequestDataDeposit.value)

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

    const onCloseModalAction = () => {
      isVisibleModalActionBar.value = false
      currentSelectedRecord.value = {}
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

      indeterminateCheckAllRows.value =
        currentSelectedRowKeys.value.length > 0 &&
        currentSelectedRowKeys.value.length < dataDeposit.value.filter((item) => !item.confirmed).length

      checkAllRowTable.value =
        currentSelectedRowKeys.value.length === dataDeposit.value.filter((item) => !item.confirmed).length &&
        currentSelectedRowKeys.value.length > 2

      isDisabledSelectAllRows.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0

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

    /* --------------------- handle unconfirm deposit ------------------- */
    const handleOpenUnconfirmModal = (record) => {
      isVisibleUnconfirmModal.value = true
      unconfirmRecordSeleted.value = record
    }

    const onUnconfirmDeposit = async () => {
      const depositId = unconfirmRecordSeleted.value.id
      const response = await unconfirmDeposit(depositId)

      if (response.status === 200) {
        const purpose = unconfirmRecordSeleted.value.purpose

        // reset unconfirm
        isVisibleUnconfirmModal.value = false
        unconfirmRecordSeleted.value = {}

        // update confirmed record
        const indexConfirmedRecord = dataDeposit.value.findIndex((record) => record.id === depositId)
        if (indexConfirmedRecord !== -1) {
          dataDeposit.value[indexConfirmedRecord].confirmed = false
        }

        indeterminateCheckAllRows.value =
          currentSelectedRowKeys.value.length > 0 &&
          currentSelectedRowKeys.value.length < dataDeposit.value.filter((item) => !item.confirmed).length
        isDisabledSelectAllRows.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0

        // Force rerender table
        tableKey.value++

        // noti
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'success',
          message: t('deposit.unconfirm_modal.unconfirm_success', { purpose })
        })
      }
    }

    /* --------------------- ./handle unconfirm deposit ------------------- */

    const onSortTable = (emitData) => {
      let currentSortStr = ''

      if (!emitData.orderBy) {
        currentSortStr = null
        return
      }

      currentSortStr = `${emitData.field} ${emitData.orderBy}`

      updateParamRequestDeposit({ params: { orderBy: currentSortStr } })
    }

    const handleChangeFilterMonth = (val) => {
      updateParamRequestDeposit({ params: { pageNumber: 1 }, data: val.target.value })

      // reset row checkbox
      resetConfirmAllRecord()

      // update modal search deposit
      store.commit('deposit/STORE_DEPOSIT_FILTER', paramRequestDataDeposit.value)
    }

    onBeforeMount(async () => {
      // fetch group list
      const groupList = await getGroups()
      tabListGroup.value = groupList.result?.data || []
      debugger
      // get filters deposit from store
      const filtersDepositStore = store.state.deposit?.filters || {}

      // fetch bank accounts
      const bankAccounts = await getBankAccounts({
        groupId: filtersDepositStore.data?.groupId || activeKeyGroupTab.value
      })
      bankAccountList.value = bankAccounts.result?.data || []

      // set bank account value
      const bankAccountSelected = filtersDepositStore?.data?.bankAccountId || []
      if (bankAccountSelected.length > 0) {
        bankAccountId.value = bankAccountSelected
      }

      // set group
      const groupIdStore = filtersDepositStore?.data?.groupId
      const groupId = groupIdStore ? groupIdStore : getTabIndex(tabListGroup.value)
      activeKeyGroupTab.value = parseInt(groupId)

      // set checkedListFilterMonth
      const { fromDate, toDate } = filtersDepositStore?.data || {}
      if (fromDate && toDate) {
        const objFound = find(filterMonthList.value, { value: { fromDate, toDate } })
        objFound && (checkedListFilterMonth.value = objFound.value)
      } else if (!checkedListFilterMonth.value && isEmpty(filtersDepositStore)) {
        checkedListFilterMonth.value = currentMonth
      } else {
        checkedListFilterMonth.value = allMonth
      }

      // update date default from checkedListFilterMonth
      if (fromDate && toDate) {
        updateParamRequestDeposit(merge(deepCopy(filtersDepositStore), { data: { groupId } }))
      } else {
        const { fromDate: currentFromDate = null, toDate: currentToDate = null } = checkedListFilterMonth.value || {}

        updateParamRequestDeposit(
          merge(deepCopy(filtersDepositStore), { data: { groupId, fromDate: currentFromDate, toDate: currentToDate } })
        )
      }

      // update modal search deposit
      store.commit('deposit/STORE_DEPOSIT_FILTER', paramRequestDataDeposit.value)

      router.replace({ query: { tab: groupId } })
    })

    // watch to fetch data deposit
    watch(
      () => paramRequestDataDeposit.value,
      () => {
        // uncheck quick select date
        const { fromDate = null, toDate = null } = paramRequestDataDeposit.value?.data || {}
        const objFound = find(filterMonthList.value, { value: { fromDate, toDate } })
        checkedListFilterMonth.value = objFound ? objFound.value : ''

        // fetch data table
        fetchDatatableDeposit(paramRequestDataDeposit.value.data, paramRequestDataDeposit.value.params)
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
      expandedRowKeys,
      totalRecords,
      expandIconColumnIndex,
      activeKeyGroupTab,
      tableKey,
      isDisabledSelectAllRows,
      currentSelectedRecord,
      confirmedSelectedDepositRecord,
      confirmedSelectedPurpose,
      checkedListFilterMonth,
      filterMonthList,
      unconfirmRecordSeleted,
      modalActionRef,
      pageSize,

      isLoadingDataTable,
      isVisibleModalActionBar,
      isVisibleDeleteModal,
      isDisableDelete,
      isLoadingExportCsv,
      isVisibleConfirmDepositModal,
      isVisibleUnconfirmModal,

      updateParamRequestDeposit,
      onSelectAllRows,
      onHandleChangeBankAcountSelect,
      onHandleChangeTabGroup,
      handleChangePage,
      onOpenDepositButtonsFloat,
      onOpenDeleteDepositModal,
      onEditRecordDeposit,
      onDeleteDepositRecord,
      onCopyRecordDeposit,
      exportDepositAsCsvFile,
      onOpenConfirmDepositRecordModal,
      onConfirmDepositRecord,
      onSortTable,
      onUnconfirmDeposit,
      handleOpenUnconfirmModal,
      handleClickOutsideTable,
      onCloseModalAction,
      handleChangeFilterMonth
    }
  }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin: 0 -32px;
}
</style>
