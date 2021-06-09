<template>
  <div class="u-mx-32">
    <div class="u-flex u-justify-end u-mt-24 u-mb-16">
      <a-button @click="exportDepositAsCsvFile" :loading="loadingExportCsvButton">
        <template #icon><span class="btn-icon"><line-down-icon /></span></template>
        CSVファイルダウンロード
      </a-button>

      <a-button @click="$router.push({ name: 'deposit-new' })" type="primary" class="u-ml-12">
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
        :max-tag-count="1"
        option-label-prop="label"
        dropdownClassName="multiple-select-custom"
        mode="multiple"
        placeholder="Select a bank"
        style="width: 200px"
        :defaultActiveFirstOption="false"
        @change="onHandleChangeBankAcountSelect">
        <template #menuItemSelectedIcon>
          <a-checkbox :checked="true" />
        </template>

        <a-select-option :label="option.name" v-for="option in bankAccountList" :key="option.id">
          {{ option.name }}
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
    v-model:disable-button="disableButton"
    @on-open-delete-deposit-modal="onOpenDeleteDepositModal"
    @on-copy-record-deposit="onCopyRecordDeposit"
    @on-edit-record-deposit="$router.push({ path: `/deposit/1/edit` })"
    v-model:visible="isVisibleDepositButtonsFloat" />
  <delete-deposit-modal @on-delete-deposit-record="onDeleteDepositRecord" v-model:visible="isVisibleDepositModal" />
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import DepositTable from './-components/DepositTable'
import { getDeposit, getGroups, getBankAccounts, deleteDeposit } from './composables/useDepositService'
import { debounce } from '@/helpers/debounce'
import { exportCSVFile } from '@/helpers/export-csv-file'
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
    const { t } = useI18n()
    const store = useStore()

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

    const onSelectAllRowsByCustomCheckbox = (e) => {
      indeterminateCheckAllRows.value = false
      const keyRowList = dataDeposit.value.filter(item => !item.confirmed)
      e.target.checked ? currentSelectedRowKeys.value = keyRowList.map(item => item.key) : currentSelectedRowKeys.value = []
    }

    const createDataTableFormat = (data = []) => {
      if (!data) return

      return data.map(item => {
        let typeName
        typeDepositEnums.forEach(type => (type.type === item.type) && (typeName = type.name))

        const typeNameBank = (depositMoney, withdrawMoney) => {
          if (depositMoney > withdrawMoney) {
            return 'type_deposit_sales'
          } else if (depositMoney < withdrawMoney) {
            return 'type_deposit_payment'
          } else {
            return 'type_none'
          }
        }

        const depositBank = (depositMoney, withdrawMoney) => {
          if (depositMoney > withdrawMoney) {
            return depositMoney
          } else if (depositMoney < withdrawMoney) {
            return withdrawMoney
          } else {
            return '-'
          }
        }

        const handleDepositMoneyValue = (type, depositMoney, withdrawMoney) => {
          if (type === 10) {
            return depositMoney
          } else if (type === 20) {
            return withdrawMoney
          } else if (type === 30) {
            return depositMoney > 0 ? depositMoney : withdrawMoney
          } else {
            return depositMoney > 0 ? depositMoney : `- ${withdrawMoney}`
          }
        }

        return Object.assign(item,
          {
            key: item.id,
            children: item.bankAccounts ? item.bankAccounts.map(
              bank => Object.assign(bank,
                { date: null },
                { statisticsMonth: null },
                { class: typeNameBank(bank.deposit, bank.withdrawal) },
                { key: item.id },
                { purpose: `${bank.name} (${bank.currency})` },
                { typeName: typeNameBank(bank.deposit, bank.withdrawal) },
                { deposit: depositBank(bank.deposit, bank.withdrawal) }))
              : [],
            deposit: handleDepositMoneyValue(item.type, item.depositMoney, item.withdrawalMoney),
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
      const groupList = await getGroups()
      tabListGroup.value = groupList.result?.data || []
      currentActiveIdGroup.value = (groupList.result?.data || [])[0].id

      const bankAccounts = await getBankAccounts({ group_id: currentActiveIdGroup.value })
      bankAccountList.value = bankAccounts.result?.data || []

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
      await getDataDeposit({ groupId: currentActiveIdGroup.value, bankAccountId }, { pageNumber: currentPageNumber.value })
      expandIconColumnIndex.value = 9 // TODO: columns count
      bankAccountId.length ? expandedRowKeys.value = dataDeposit.value.map(item => item.key) : expandedRowKeys.value = []
    }, 1000)

    const onHandleChangeTabGroup = async (groupId) => {
      currentActiveIdGroup.value = groupId
      router.push({ query: { ...route.query, tab: groupId } })

      await getDataDeposit({ groupId, bankAccountId: currentBankAccountList.value })
    }

    const handleChangePage = async (pageNumber) => {
      const res = await getDataDeposit({ groupId: currentActiveIdGroup.value, bankAccountId: currentBankAccountList.value }, { pageNumber })
      currentPageNumber.value = pageNumber
    }

    const exportObj = reactive({
      header: [
        t('deposit.csv.header.confirmed'),
        t('deposit.csv.header.date'),
        t('deposit.csv.header.statictis_month'),
        t('deposit.csv.header.deposit_money'),
        t('deposit.csv.header.withdraw_money'),
        t('deposit.csv.header.balance'),
        t('deposit.csv.header.type_name'),
        t('deposit.csv.header.category'),
        t('deposit.csv.header.sub_category'),
        t('deposit.csv.header.purpose')
      ],
      fileTitle: 'Deposit',
      labels: [
        { field: 'confirmed', formatBy: 'format_bolean_text_confirmed' },
        { field: 'date', formatBy: 'moment_l' },
        { field: 'statisticsMonth', formatBy: 'moment_mm_dd' },
        'depositMoney',
        'withdrawalMoney',
        'balance',
        { field: 'type', formatBy: 'format_deposit_type_name' },
        'categoryName',
        'subcategoryName',
        'purpose'
      ],
      items: []
    })

    const generateKeyCsv = (data) => {
      const SPACE_REGREX = /\s/g
      let objectData = {}

      data.forEach(item => {
        objectData[`${item.name.replace(SPACE_REGREX, '').toLowerCase()}_deposit`] = item.deposit,
        objectData[`${item.name.replace(SPACE_REGREX, '').toLowerCase()}_withdrawal`] = item.withdrawal,
        objectData[`${item.name.replace(SPACE_REGREX, '').toLowerCase()}_balance`] = item.balance
      })

      return objectData
    }

    const exportDepositAsCsvFile = async () => {
      loadingExportCsvButton.value = true
      const dataRequest = {
        groupId: tabListGroup.value[0].id,
        bankAccountId: currentBankAccountList.value
      }

      const params = {
        pageNumber: currentPageNumber.value
      }
      const { data } = await getDeposit(dataRequest, params)
      loadingExportCsvButton.value = false

      if (!!data.result.data[0].bankAccounts) {
        exportObj.items = data.result.data.map(record => {
          const bankObj = generateKeyCsv(record.bankAccounts)

          return Object.assign(record, bankObj)
        })

        // TODO: LOCALE header csv
        // const headerList = Object.keys(generateKeyCsv(data.result.data[0].bankAccounts)).map(item => ({ value: item, label: t(`deposit.csv.header.${item}`) }))

        // headerList.forEach(item => {
        //   exportObj.header.push(item.label)
        //   exportObj.labels.push(item.value)
        // })

        const headerList = Object.keys(generateKeyCsv(data.result.data[0].bankAccounts))

        headerList.forEach(item => {
          exportObj.header.push(item)
          exportObj.labels.push(item)
        })
      } else {
        exportObj.items = data.result.data
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
      dataDeposit.value = dataDeposit.value.filter(item => item.id !== currentSelectedRecord.value.id)
      isVisibleDepositModal.value = false
      isLoadingDataTable.value = false

      // show notification
      store.commit('flash/STORE_FLASH_MESSAGE', { variant: 'success', duration: 5, message: 'プロジェクト名 を削除しました' })
    }

    const onCopyRecordDeposit = () => {
      store.commit('deposit/STORE_RECORD_DEPOSIT', currentSelectedRecord.value)
      router.push({ name: 'deposit-new' })
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

      onSelectAllRowsByCustomCheckbox,
      onHandleChangeBankAcountSelect,
      onHandleChangeTabGroup,
      handleChangePage,
      getDataDeposit,
      onOpenDepositButtonsFloat,
      onOpenDeleteDepositModal,
      onDeleteDepositRecord,
      onCopyRecordDeposit,
      exportDepositAsCsvFile
    }
  }
})
</script>

<style lang="scss" scoped>
.-mx-32 {
  margin: 0 -32px;
}
</style>
