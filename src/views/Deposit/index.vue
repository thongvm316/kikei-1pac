<template>
  <div class="deposit-list u-mx-32">
    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16">
      <div>
        <span class="u-mr-16 u-text-grey-15">表示:</span>
        <a-radio-group
          v-model:value="checkedListFilterMonth"
          :options="filterMonthList"
          @change="handleChangeFilterMonth"
        />
      </div>

      <div class="head-buttons">
        <a-tooltip color="#fff" title="ごみ箱">
          <a-button type="link" @click="isVisibleRecoverDepositModal = true">
            <template #icon>
              <span class="btn-icon" :style="{ height: '28px' }"><recover-icon /></span>
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip color="#fff" :title="$t('deposit.deposit_list.export_csv')">
          <a-button type="link" :loading="isLoadingExportCsv" @click="exportDepositAsCsvFile">
            <template #icon>
              <span class="btn-icon" :style="{ height: '28px' }"><line-down-icon /></span>
            </template>
          </a-button>
        </a-tooltip>

        <a-button type="primary" @click="onAddRecordDeposit">
          <template #icon>
            <span class="btn-icon"><line-add-icon /></span>
          </template>
          {{ $t('deposit.deposit_list.create_deposit') }}
        </a-button>
      </div>
    </div>

    <div class="u-flex u-justify-between u-items-center u-mb-24">
      <div class="u-relative">
        <a-tooltip
          color="fff"
          :title="
            currentSelectedRowKeys.length > 0
              ? $t('deposit.deposit_list.uncheck_all')
              : $t('deposit.deposit_list.check_all')
          "
        >
          <a-checkbox
            v-model:checked="isCheckAllRowTable"
            :disabled="isDisabledSelectAllRows"
            :indeterminate="isIndeterminateCheckAllRow"
            @change="onSelectAllRows"
          />
        </a-tooltip>

        <div v-if="currentSelectedRowKeys.length > 0" class="confirm-buttons">
          <a-tooltip color="fff" title="チェックした項目を確定">
            <a-button
              type="primary"
              shape="circle"
              @click="onOpenConfirmDepositRecordModal(currentSelectedRowKeys, 'confirmAll')"
            >
              <template #icon>
                <span class="btn-icon"><CheckWhiteIcon /></span>
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip color="fff" title="削除">
            <a-button type="primary" shape="circle" @click="onOpenDeleteDepositModal('multiple')">
              <template #icon>
                <span class="btn-icon"><DeleteWhiteIcon /></span>
              </template>
            </a-button>
          </a-tooltip>
        </div>
      </div>

      <a-select
        v-model:value="bankAccountId"
        :allow-clear="true"
        show-arrow
        :max-tag-count="1"
        option-label-prop="label"
        :placeholder="$t('deposit.deposit_list.select_bank_placeholder')"
        :style="{ width: '350px' }"
        :default-active-first-option="false"
        @change="onHandleChangeBankAcountSelect"
      >
        <a-select-option
          v-for="option in bankAccountList"
          :key="option.name"
          :value="option.id"
          :label="`${option.name} (${option.currencyCode})`"
        >
          {{ `${option.name} (${option.currencyCode})` }}
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
      v-model:is-loading-data-table="isLoadingDataTable"
      v-model:data-deposit="dataDeposit"
      v-model:indeterminate-check-all-rows="isIndeterminateCheckAllRow"
      v-model:check-all-row-table="isCheckAllRowTable"
      v-model:current-selected-row-keys="currentSelectedRowKeys"
      v-click-outside="handleClickOutsideTable"
      :is-visible-modal-action-bar="isVisibleModalActionBar"
      class="-mx-32"
      @on-open-deposit-buttons-float="onClickRowRecord"
      @on-open-confirm-deposit-record-modal="onOpenConfirmDepositRecordModal($event, 'confirmOne')"
      @handle-open-unconfirm-modal="handleOpenUnconfirmModal"
      @on-sort="onSortTable"
    />
  </div>

  <search-deposit-modal @updateParamRequestDeposit="updateParamRequestDeposit" />

  <modal-action-bar
    v-if="isVisibleModalActionBar"
    ref="modalActionRef"
    v-model:is-disable-delete="isDisableDelete"
    @on-go-to-edit="onEditRecordDeposit"
    @on-go-to-copy="onCopyRecordDeposit"
    @on-go-to-delete="onOpenDeleteDepositModal('once')"
    @on-close-modal="onCloseModalAction"
  />

  <delete-deposit-modal
    v-if="isVisibleDeleteModal"
    v-model:visible="isVisibleDeleteModal"
    v-model:current-selected-record="currentSelectedRecord"
    v-model:loading="isLoadingOkButtonDeleteDepositModal"
    @on-delete-deposit-record="onDeleteDepositRecord($event)"
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

  <modify-deposit-modal
    v-if="isModifyDepositRoot"
    v-model:visible="isModifyDepositRoot"
    v-model:current-selected-row-keys="currentSelectedRowKeys"
    v-model:current-selected-record="currentSelectedRecord"
    :group-id="activeKeyGroupTab"
    :type-modify-deposit-root="typeModifyDepositRoot"
    @on-delete-deposit-root="onDeleteDepositRoot($event)"
  />

  <recover-deposit-modal
    v-if="isVisibleRecoverDepositModal"
    v-model:visible="isVisibleRecoverDepositModal"
    v-model:current-selected-row-keys="currentSelectedRowKeys"
    :group-id="activeKeyGroupTab"
    @on-restore-deposit="onRestoreDeposit($event)"
  />
</template>

<script>
import { defineComponent, onBeforeMount, provide, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { merge, find, isEmpty, omit } from 'lodash-es'
import moment from 'moment'

import {
  getDeposit,
  getGroupsForAccount,
  getBankAccounts,
  deleteDeposit,
  deleteDepositRoot,
  createDataTableFormat,
  confirmDeposit,
  unconfirmDeposit
} from './composables/useDeposit'
import useGetRecordRead from '@/views/Deposit/composables/useGetRecordRead'
import { debounce } from '@/helpers/debounce'
import { exportCSVFile } from '@/helpers/export-csv-file'
import { deepCopy } from '@/helpers/json-parser'
import { TYPE_MODIFY_DEPOSIT_ROOT } from '@/enums/deposit.enum'

import DepositTable from './-components/DepositTable'
import SearchDepositModal from './-components/SearchDepositModal'
import DeleteDepositModal from './-components/DeleteDepositModal'
import ConfirmDepositModal from './-components/ConfirmDepositModal'
import ModalActionBar from '@/components/ModalActionBar'
import ModalUnconfirm from './-components/UnconfirmDepositModal'
import ModifyDepositModal from './-components/ModifyDepositModal'
import RecoverDepositModal from './-components/RecoverDepositModal.vue'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import DeleteWhiteIcon from '@/assets/icons/ico_delete_white.svg'
import CheckWhiteIcon from '@/assets/icons/ico_check_white.svg'
import RecoverIcon from '@/assets/icons/ico_recover.svg'

export default defineComponent({
  name: 'DepositPage',

  components: {
    CheckWhiteIcon,
    DeleteWhiteIcon,
    LineDownIcon,
    RecoverIcon,
    LineAddIcon,
    DepositTable,
    SearchDepositModal,
    DeleteDepositModal,
    ConfirmDepositModal,
    ModalActionBar,
    ModalUnconfirm,
    ModifyDepositModal,
    RecoverDepositModal
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const store = useStore()

    // recover modal
    const isVisibleRecoverDepositModal = ref()

    // pagination
    const currentPage = ref(1)
    const totalRecords = ref()
    const pageSize = ref(50)

    // tabs
    const activeKeyGroupTab = ref(1)
    const tabListGroup = ref([])

    // select bank account
    const bankAccountId = ref()
    const bankAccountList = ref([])

    // table
    const dataDeposit = ref([])

    provide('dataDeposit', dataDeposit)

    const isLoadingDataTable = ref(true)
    const currentSelectedRowKeys = ref([])
    const currentSelectedRecord = ref()
    const confirmedSelectedDepositRecord = ref()
    const confirmedSelectedPurpose = ref()
    const tableKey = ref(0)
    const unconfirmRecordSeleted = ref()
    const modalActionRef = ref()
    const isModifyDepositRoot = ref(false)
    const typeModifyDepositRoot = ref('')
    const deleteRootOptions = ref({ isDeleteRootAll: false })

    // check all row
    const isCheckAllRowTable = ref(false)
    const isIndeterminateCheckAllRow = ref(false)
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
    const paramRequestDataDeposit = ref({
      data: {},
      params: { pageNumber: 1, pageSize: pageSize.value }
    })

    const isLoadingOkButtonDeleteDepositModal = ref()

    const updateParamRequestDeposit = ({ data = {}, params = {} }) => {
      paramRequestDataDeposit.value = {
        data: { ...paramRequestDataDeposit.value.data, ...data },
        params: { ...paramRequestDataDeposit.value.params, ...params }
      }
    }

    const fetchDatatableDeposit = async (dataRequest, paramsRequest) => {
      isLoadingDataTable.value = true
      const dataRequestNew = omit(dataRequest, ['skipQuickSelectMonth'])

      try {
        const { data = {} } = await getDeposit(dataRequestNew, paramsRequest)

        dataDeposit.value = createDataTableFormat(data.result?.data || [], bankAccountId.value || null)
        isDisabledSelectAllRows.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0
        totalRecords.value = data.result?.meta.totalRecords || 0
        currentPage.value = paramsRequest.pageNumber || 1
      } catch (err) {
        dataDeposit.value = []
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const onSelectAllRows = (e) => {
      const keyRowList = dataDeposit.value.filter((item) => !item.confirmed).map((item) => item.key)
      const isCheckAll = e.target.checked && !isIndeterminateCheckAllRow.value

      currentSelectedRowKeys.value = isCheckAll ? keyRowList : []
      isCheckAllRowTable.value = isCheckAll
      isIndeterminateCheckAllRow.value = false
    }

    const resetConfirmAllRecord = () => {
      isCheckAllRowTable.value = false
      isIndeterminateCheckAllRow.value = false
      currentSelectedRowKeys.value = []
    }

    const getTabIndex = (tabList) => {
      const { tab } = route.query || 1
      const indexTab = tabList.findIndex((item) => item.id === parseInt(tab))
      const groupId = indexTab < 0 ? tabList[0]?.id : parseInt(tab)

      return groupId
    }

    const onHandleChangeBankAcountSelect = debounce(async (value) => {
      updateParamRequestDeposit({
        data: { bankAccountId: value },
        params: { pageNumber: 1 }
      })
    }, 1000)

    const onHandleChangeTabGroup = async (groupId) => {
      // reset params
      bankAccountId.value = null
      currentPage.value = 1

      // fetch bank accounts
      const bankAccounts = await getBankAccounts({ groupId })
      bankAccountList.value = bankAccounts.result?.data || []

      updateParamRequestDeposit({ data: { groupId, bankAccountId: null }, params: { pageNumber: 1 } })
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
      const elModalModifyDeposit = document.querySelector('.modal-modify-deposit-js')
      const elDeleteDeposit = document.querySelector('.modal-delete-deposit-js')

      const elNotOutsideList = [modalActionRef.value?.$el, elDeleteDeposit, elModalModifyDeposit].filter(Boolean)
      if (elNotOutsideList.length === 0) return

      const isElOutside = elNotOutsideList.every((el) => {
        return !(el === event.target || el.contains(event.target))
      })

      if (isElOutside) {
        isVisibleModalActionBar.value = false
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
        objectData[`${item.name.replaceAll(' ', '').toLowerCase()}_deposit`] = item.deposit
        objectData[`${item.name.replaceAll(' ', '').toLowerCase()}_withdrawal`] = item.withdrawal
        objectData[`${item.name.replaceAll(' ', '').toLowerCase()}_balance`] = item.balance
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
    const onClickRowRecord = (record) => {
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

        if (!record.read) checkRead(record)
      }
    }

    const onAddRecordDeposit = () => {
      router.push({ name: 'deposit-new' })
    }

    const onDeleteDepositRoot = (event) => {
      if (event.optionDelete === 1) {
        if (currentSelectedRecord.value.confirmed) return

        isVisibleDeleteModal.value = true
        deleteRootOptions.value = { isDeleteRootAll: false }
      } else {
        if (event.currentSelectedRowKeys.length < 1) return

        currentSelectedRecord.value = {}
        currentSelectedRowKeys.value = event.currentSelectedRowKeys
        isVisibleDeleteModal.value = true
        deleteRootOptions.value = omit(event, ['currentSelectedRowKeys'])
      }
      isModifyDepositRoot.value = false
    }

    const onOpenDeleteDepositModal = (deleteType) => {
      deleteType === 'multiple' && (currentSelectedRecord.value = {})
      if (
        deleteType === 'multiple' ||
        (!currentSelectedRecord.value?.confirmed && currentSelectedRecord.value?.rootDepositId === null)
      ) {
        isVisibleDeleteModal.value = true
      } else if (currentSelectedRecord.value?.rootDepositId) {
        isModifyDepositRoot.value = true
        typeModifyDepositRoot.value = TYPE_MODIFY_DEPOSIT_ROOT['DELETE']
        currentSelectedRowKeys.value = [currentSelectedRecord?.value.id]
      }
    }

    const onDeleteDepositRecord = async (emitKey) => {
      const targetDelete = emitKey === 'multiple' ? currentSelectedRowKeys.value : [currentSelectedRecord.value?.id]
      const purpose = currentSelectedRecord.value?.purpose
      if (targetDelete.length < 1) return
      isLoadingOkButtonDeleteDepositModal.value = true

      try {
        isLoadingDataTable.value = true

        if (deleteRootOptions.value?.isDeleteRootAll) {
          await deleteDepositRoot(deleteRootOptions.value.idRoot, { exceptId: deleteRootOptions.value.exceptIdList })
        } else {
          await deleteDeposit({ id: targetDelete })
        }

        // refresh data table
        fetchDatatableDeposit(paramRequestDataDeposit.value.data, paramRequestDataDeposit.value.params)
        resetConfirmAllRecord()
        currentSelectedRecord.value = {}

        // show notification
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          duration: 5,
          message: purpose
            ? t('deposit.deposit_list.delete_success', { purpose })
            : t('deposit.deposit_list.delete_success_multiple')
        })
      } finally {
        isVisibleModalActionBar.value = false
        isVisibleDeleteModal.value = false
        isLoadingDataTable.value = false
        deleteRootOptions.value = { isDeleteRootAll: false }
        isLoadingOkButtonDeleteDepositModal.value = false
      }
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

      if (currentSelectedRecord.value.rootDepositId === null) {
        router.push({ name: 'deposit-edit', params: { id: depositId, isEditRoot: false } })
      } else {
        isModifyDepositRoot.value = true
        typeModifyDepositRoot.value = TYPE_MODIFY_DEPOSIT_ROOT['EDIT']
      }
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
        const recordFound = data.length === 1 ? find(dataDeposit.value, { id: data[0] }) : ''

        confirmedSelectedDepositRecord.value = data
        confirmedSelectedPurpose.value = recordFound ? recordFound?.purpose : ''
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

      isIndeterminateCheckAllRow.value =
        currentSelectedRowKeys.value.length > 0 &&
        currentSelectedRowKeys.value.length < dataDeposit.value.filter((item) => !item.confirmed).length

      isCheckAllRowTable.value =
        currentSelectedRowKeys.value.length === dataDeposit.value.filter((item) => !item.confirmed).length &&
        currentSelectedRowKeys.value.length > 2

      isDisabledSelectAllRows.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0

      // Force rerender table
      tableKey.value++

      // show notification
      const purpose = confirmedSelectedPurpose?.value
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'successfully',
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

        isIndeterminateCheckAllRow.value =
          currentSelectedRowKeys.value.length > 0 &&
          currentSelectedRowKeys.value.length < dataDeposit.value.filter((item) => !item.confirmed).length
        isDisabledSelectAllRows.value = dataDeposit.value.filter((item) => !item.confirmed).length === 0

        // Force rerender table
        tableKey.value++

        // noti
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          message: t('deposit.unconfirm_modal.unconfirm_success', { purpose })
        })
      }
    }

    /* --------------------- ./handle unconfirm deposit ------------------- */

    const onSortTable = (emitData) => {
      console.log(emitData)
      let currentSortStr = emitData.orderBy ? `${emitData.field} ${emitData.orderBy}` : ''
      if (emitData.field === 'confirmed' && emitData.orderBy !== '') {
        currentSortStr = `date asc,${currentSortStr}`
      }
      updateParamRequestDeposit({ params: { orderBy: currentSortStr } })
    }

    const handleChangeFilterMonth = (val) => {
      updateParamRequestDeposit({ params: { pageNumber: 1 }, data: val.target.value })

      // reset row checkbox
      resetConfirmAllRecord()
    }

    const checkRead = async (evt) => {
      const { getRecordRead } = useGetRecordRead(evt.id)
      await getRecordRead()
      evt.read = true
    }

    const onRestoreDeposit = async (count) => {
      // reset data table
      await fetchDatatableDeposit(paramRequestDataDeposit.value.data, paramRequestDataDeposit.value.params)

      // show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'successfully',
        duration: 5,
        message: `入出金が${count}戻されました`
      })
    }

    onBeforeMount(async () => {
      // fetch group list
      const groupsReponse = await getGroupsForAccount(2)
      tabListGroup.value = groupsReponse.result?.data || []

      // get filters deposit from store
      const filtersDepositStore = store.state.deposit?.filters || {}

      // fetch bank accounts
      const bankAccounts = await getBankAccounts({
        groupId: filtersDepositStore.data?.groupId || getTabIndex(tabListGroup.value)
      })

      bankAccountList.value = bankAccounts.result?.data || []

      // set bank account value
      const bankAccountSelected = filtersDepositStore?.data?.bankAccountId || null
      if (bankAccountSelected) {
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

      router.replace({ query: { tab: groupId } })
    })

    watch(
      () => store.state.drag?.isDrag,
      async (val) => {
        if (val) {
          await fetchDatatableDeposit(paramRequestDataDeposit.value.data, paramRequestDataDeposit.value.params)
          store.commit('drag/STORE_DRAG', false)
        }
      }
    )

    // watch to fetch data deposit
    watch(
      () => paramRequestDataDeposit.value,
      () => {
        // uncheck quick select date
        const { fromDate = null, toDate = null, skipQuickSelectMonth } = paramRequestDataDeposit.value?.data || {}
        if (skipQuickSelectMonth) {
          checkedListFilterMonth.value = ''
        } else {
          const objFound = find(filterMonthList.value, { value: { fromDate, toDate } })
          checkedListFilterMonth.value = objFound ? objFound.value : ''
        }

        // fetch data table
        fetchDatatableDeposit(paramRequestDataDeposit.value.data, paramRequestDataDeposit.value.params)

        // save filters search to store
        store.commit('deposit/STORE_DEPOSIT_FILTER', paramRequestDataDeposit.value)
      }
    )

    watch(
      () => isVisibleDeleteModal.value,
      (value) => {
        if (!value) {
          resetConfirmAllRecord()
        }
      }
    )

    return {
      bankAccountId,
      currentPage,
      currentSelectedRowKeys,
      bankAccountList,
      tabListGroup,
      dataDeposit,
      totalRecords,
      activeKeyGroupTab,
      tableKey,
      currentSelectedRecord,
      confirmedSelectedDepositRecord,
      confirmedSelectedPurpose,
      checkedListFilterMonth,
      filterMonthList,
      unconfirmRecordSeleted,
      modalActionRef,
      pageSize,
      typeModifyDepositRoot,

      isCheckAllRowTable,
      isDisabledSelectAllRows,
      isIndeterminateCheckAllRow,
      isLoadingDataTable,
      isVisibleModalActionBar,
      isVisibleDeleteModal,
      isDisableDelete,
      isLoadingExportCsv,
      isVisibleConfirmDepositModal,
      isVisibleUnconfirmModal,
      isModifyDepositRoot,
      isVisibleRecoverDepositModal,
      isLoadingOkButtonDeleteDepositModal,

      checkRead,
      updateParamRequestDeposit,
      onSelectAllRows,
      onHandleChangeBankAcountSelect,
      onHandleChangeTabGroup,
      handleChangePage,
      onClickRowRecord,
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
      handleChangeFilterMonth,
      onAddRecordDeposit,
      onDeleteDepositRoot,
      onRestoreDeposit
    }
  }
})
</script>

<style lang="scss">
.deposit-list {
  .-mx-32 {
    margin: 0 -32px;
  }

  .ant-btn-link:hover {
    span {
      text-decoration: underline;
    }
  }

  .confirm-buttons {
    position: absolute;
    display: flex;
    align-items: center;
    margin-left: 24px;
    gap: 8px;
    top: 50%;
    transform: translateY(-50%);
    left: 100%;
  }

  .head-buttons {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
</style>
