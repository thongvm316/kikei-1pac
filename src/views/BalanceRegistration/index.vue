<template>
  <div class="balance-registration">
    <div class="balance-mask" v-if="isUpdating" @click="handleClickMask"></div>
    <modal-balance-registration
      v-model:visible="open"
      :show-modal-update-balance="open"
      @onHandleConfirm="handleConfirmCancleUpdate"
      @cancelModal="handleCancelModal"
    />
    <div class="balance">
      <div class="balance__header">
        <div class="balance__header-export-csv">
          <div class="balance__header-export-csv-button">
            <!-- csv -->
            <a-tooltip color="#fff" :title="$t('deposit.deposit_list.export_csv')">
              <a-button
                class="u-mr-16"
                type="link"
                :loading="isLoadingExportCsv"
                @click="exportBalanceRegistrationAsCsvFile"
              >
                <template #icon>
                  <span class="btn-icon" :style="{ height: '28px' }"><line-down-icon /></span>
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </div>
        <div class="balance__header-filter">
          <div class="balance__header-filter-group">
            <a-tabs
              v-model:active-key="filter.groupId"
              default-active-key="1"
              :animated="false"
              @change="onChangeGroup"
            >
              <a-tab-pane v-for="item in groupList" :key="item.id" :tab="item.name" />
            </a-tabs>
          </div>
          <!-- Bank Account -->
          <div class="balance__header-filter-bank-account">
            <a-select v-model:value="filter.bankAccountId" :disabled="isDisabledBank" @change="onChangeBankAccount">
              <a-select-option v-for="item in bankAccountList" :key="item.id" :value="item.id">
                <span>
                  {{ item.currencyCode ? `${item.name} (${item.currencyCode})` : item.name }}
                </span>
              </a-select-option>
            </a-select>
          </div>
          <!-- ./Bank Account -->
        </div>
      </div>
      <a-table
        id="list-table"
        :columns="columns"
        :data-source="tableList"
        :row-key="(record) => record.month"
        :loading="isLoadingDataTable"
        :pagination="false"
        :scroll="{ y: height - 279 }"
        :locale="localeTable"
        size="middle"
      >
        <template #month="{ record }">{{ $filters.moment_yyyy_mm(record.month) }}</template>
        <template #updateAt="{ record }">
          <div class="time-update-future" v-if="record.balance === 0">
            <a-tooltip color="#fff" :title="$t('balance_registration.none_record')">
              <span class="balance-future-content">N/A</span>
            </a-tooltip>
          </div>
          <div v-else>
            {{ $filters.moment_l(record.updateAt) }}
          </div>
        </template>
        <template #balance="{ record }">
          <form @submit="onSubmit" v-if="record.action">
            <div class="form-group">
              <Field
                v-slot="{ field, handleChange }"
                v-model="form.balance"
                name="balance_registered"
                rules="input_required|numeric"
              >
                <div class="form-content">
                  <div class="form-input">
                    <a-input-number
                      v-if="record.action"
                      :value="field.value"
                      :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                      @change="handleChange"
                      :style="{ zIndex: zIndexForm }"
                      class="input_balance"
                    />
                    <label class="form-label">
                      {{ record.currencyCode }}
                    </label>
                  </div>
                </div>
              </Field>
            </div>
          </form>
          <div
            class="balance-future"
            v-else-if="
              (record.isFuture && !record.action) || (record.balance === 0 && !record.action && !record.isCurrent)
            "
          >
            <a-tooltip color="#fff" :title="$t('balance_registration.none_record')">
              <span class="balance-future-content">N/A</span>
            </a-tooltip>
          </div>
          <div class="balance-future" v-else-if="record.balance === 0 && !record.action && record.isCurrent"></div>
          <div class="form-content" v-else>
            <span>
              {{ $filters.number_with_commas(record.balance) }}
            </span>
            <label class="form-label">
              {{ record.currencyCode }}
            </label>
          </div>
        </template>
        <template #action="{ record }">
          <a-button
            class="btn-confirm-edit"
            :style="{ zIndex: zIndexForm }"
            v-if="record.action && !record.isFuture"
            type="primary"
            @click="onConfirmEditRow(record)"
          >
            {{ $t('balance_registration.confirm_edit') }}
          </a-button>
          <div class="balance-future" v-else-if="record.isFuture"></div>
          <a-button class="btn-edit" v-else @click="handleEditRow(record)">
            <template #icon><FormOutlined /></template> {{ $t('balance_registration.edit') }}
          </a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, onBeforeMount, onUnmounted } from 'vue'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useForm, Field } from 'vee-validate'
import { useStore } from 'vuex'
import { FormOutlined } from '@ant-design/icons-vue'
import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import { exportCSVFile } from '@/helpers/export-csv-file'
import { FEATURE_KEY } from '@/enums/balance-registrasion'
import ModalBalanceRegistration from '@/components/ModalBalanceRegistraion.vue'
import { getGroupsForAccount, getBankAccounts } from '@/views/BalanceRegistration/compasables/useBalanceRegistration'
import useGetListBalanceRegistrationService from '@/views/BalanceRegistration/compasables/useListBalanceRegistrationService'
import useCreateOrUpdateBalanceRegistrationService from '@/views/BalanceRegistration/compasables/useCreateOrUpdateBalanceRegistration'

export default defineComponent({
  name: 'BalanceRegistrationPage',

  components: { LineDownIcon, FormOutlined, Field, ModalBalanceRegistration },

  setup() {
    const { t } = useI18n()
    const store = useStore()
    const { setFieldError } = useForm()
    const groupList = ref([])
    const zIndexForm = ref(1001)
    const isLoadingDataTable = ref(true)
    const bankAccountList = ref([])
    const isLoadingExportCsv = ref(false)
    const isDisabledBank = ref(false)
    const isUpdating = ref(false)
    const open = ref(false)
    const tableList = ref([])
    const tmpErrors = ref()
    const height = ref(0)
    const filter = ref({ groupId: 0, bankAccountId: 0 })
    const form = ref({
      bankAccountId: '',
      month: '',
      balance: 0
    })
    const isFutureRecord = ref(false)
    const columns = [
      {
        title: t('balance_registration.month'),
        dataIndex: 'month',
        slots: { customRender: 'month' },
        key: 'month',
        sorter: false
      },
      {
        title: t('balance_registration.UpdatedAt'),
        dataIndex: 'updateAt',
        slots: { customRender: 'updateAt' },
        key: 'updateAt',
        width: '176px',
        sorter: false
      },
      {
        title: t('balance_registration.balance'),
        dataIndex: 'balance',
        slots: { customRender: 'balance' },
        key: 'balance',
        align: 'right',
        sorter: false
      },
      {
        title: t('balance_registration.action'),
        dataIndex: 'action',
        key: 'action',
        slots: { customRender: 'action' },
        width: '150px',
        align: 'center',
        sorter: false,
        ellipsis: true
      }
    ]

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    // Fetch data filter
    const fetchGroupList = async () => {
      try {
        const groups = await getGroupsForAccount(FEATURE_KEY, {})
        groupList.value = groups.result?.data
        filter.value.groupId = groups.result?.data[0].id
      } catch (e) {
        throw e
      }
    }

    // Fetch banks account
    const fetchBankAccountList = async (groupId) => {
      try {
        const bankAccount = await getBankAccounts({ groupId: groupId })
        bankAccountList.value = bankAccount.result?.data || []
        filter.value.bankAccountId = bankAccountList.value.length > 0 ? bankAccountList.value[0].id : null
      } catch (e) {
        throw e
      }
    }

    // Fetch registraion balance
    const fetchRegistrationBalance = async (bankAccountId) => {
      isLoadingDataTable.value = true
      try {
        if (bankAccountId !== null) {
          const { listBalance } = useGetListBalanceRegistrationService({ bankAccountId: bankAccountId })
          const { result } = await listBalance()
          tableList.value = convertDataRenderTable(result?.data)
        } else {
          tableList.value = []
        }
      } catch (e) {
        throw e
      } finally {
        isLoadingDataTable.value = false
      }
    }

    /* --------------------- handle export CSV ------------------- */
    const exportObj = reactive({
      fileTitle: 'Balance Registration',
      labels: [
        { header: t('balance_registration.month'), field: 'month', formatBy: 'moment_yyyy_mm' },
        { header: t('balance_registration.UpdatedAt'), field: 'updateAt', formatBy: 'moment_l' },
        { header: t('balance_registration.balance'), field: 'balance' },
        { header: t('balance_registration.action'), field: 'currencyCode' }
      ],
      items: []
    })

    const exportBalanceRegistrationAsCsvFile = async () => {
      isLoadingExportCsv.value = true
      const { listBalance } = useGetListBalanceRegistrationService({ bankAccountId: filter.value.bankAccountId })
      const { result } = await listBalance()

      isLoadingExportCsv.value = false
      const balanceRegistrationItems = result.data
      exportObj.items = balanceRegistrationItems
      exportCSVFile(exportObj)
    }
    /* --------------------- handle export CSV ------------------- */

    // update registration balance
    const updateBalanceRegistration = async (id, value) => {
      let data = {
        ...value
      }
      // eslint-disable-next-line no-useless-catch
      try {
        const { createOrUpdate } = useCreateOrUpdateBalanceRegistrationService(id, data)
        await createOrUpdate()
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          duration: 5,
          message: data.month + t('balance_registration.edit_success')
        })
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
    }

    // check error api
    const checkErrorsApi = (err) => {
      tmpErrors.value = err.response.data.errors
      verifyErrors(tmpErrors.value, t('balance_registration.content'))
    }

    //verify error
    const verifyErrors = (errors, msg) => {
      for (let item in errors) {
        setFieldError(item, msg)
      }
    }

    //convert data for show record future
    const convertDataRenderTable = (records) => {
      records = records.map((record) => {
        record.isFuture = moment(record.month).format('YYYY-MM') > moment().format('YYYY-MM')
        record.isCurrent = moment(record.month).format('YYYY-MM') === moment().format('YYYY-MM')
        return record
      })
      return records
    }

    // on change group
    const onChangeGroup = async () => {
      await fetchBankAccountList(filter.value.groupId)
      await fetchRegistrationBalance(filter.value.bankAccountId)
    }

    // on change bank account
    const onChangeBankAccount = async () => {
      await fetchRegistrationBalance(filter.value.bankAccountId)
    }

    // handle click mask
    const handleClickMask = async () => {
      open.value = true
      zIndexForm.value = 0
    }

    // handle click button edit
    const handleEditRow = async (record) => {
      form.value.balance = record.balance
      isUpdating.value = true
      record.action = true
      zIndexForm.value = 1001
    }

    // confirm cancle update
    const handleConfirmCancleUpdate = async () => {
      isUpdating.value = false
      zIndexForm.value = 0
      await fetchRegistrationBalance(filter.value.bankAccountId)
    }

    // off modal notifi..
    const handleCancelModal = async () => {
      zIndexForm.value = 1001
    }

    // handle confirm edit
    const onConfirmEditRow = async (record) => {
      try {
        record.action = false
        isLoadingDataTable.value = true
        open.value = false
        isUpdating.value = false
        form.value.bankAccountId = filter.value.bankAccountId
        form.value.month = record.month
        const balanceUpdate = { ...form.value }
        const bankAccountId = filter.value.bankAccountId
        if (record.balance !== form.value.balance) {
          await updateBalanceRegistration(record.id, balanceUpdate)
        }
        await fetchRegistrationBalance(bankAccountId)
        zIndexForm.value = 0
      } catch (e) {
        throw e
      } finally {
        isLoadingDataTable.value = false
      }
    }

    // show text table empty
    const localeTable = {
      emptyText: t('balance_registration.empty_text_table')
    }

    onBeforeMount(async () => {
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)

      await fetchGroupList()
      await fetchBankAccountList(filter.value.groupId)
      await fetchRegistrationBalance(filter.value.bankAccountId)
    })

    onUnmounted(() => {
      open.value = true
      window.removeEventListener('resize', getInnerHeight)
    })

    return {
      filter,
      groupList,
      bankAccountList,
      tableList,
      columns,
      isLoadingDataTable,
      isLoadingExportCsv,
      isDisabledBank,
      height,
      localeTable,
      form,
      isFutureRecord,
      isUpdating,
      open,
      zIndexForm,
      handleCancelModal,
      handleConfirmCancleUpdate,
      onChangeGroup,
      onChangeBankAccount,
      handleEditRow,
      onConfirmEditRow,
      handleClickMask,
      exportBalanceRegistrationAsCsvFile
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/mixins';
@import '@/styles/shared/variables';

.balance-registration {
  #list-table {
    .ant-table-thead tr th:first-child {
      padding-left: 32px;
    }

    .ant-table-thead tr th:last-child {
      padding-right: 32px;
    }

    .ant-table-tbody > tr > td {
      padding: 23px 16px 23px 32px;
    }
  }

  .balance {
    &__header {
      @include flexbox(normal, normal);
      flex-direction: column;
      flex-wrap: wrap;
    }

    &__header-export-csv {
      @include flexbox(flex-end, flex-end);
      flex-direction: column;
      padding: 24px 32px 16px;
    }

    &__header-export-csv-button {
      @include flexbox(normal, flex-end);
      padding-right: 4px;

      button + button {
        margin-left: 16px;
      }
    }

    &__header-filter-group {
      @include flexbox(space-between, normal);
      .ant-tabs {
        width: 100%;
        height: 46px;

        &-nav {
          .ant-tabs-tab {
            padding: 12px 0;
            margin-right: 49px;
          }
        }
      }
    }

    &__header-filter-bank-account {
      @include flexbox(normal, center);
      padding: 12px 32px;

      .ant-select {
        height: 32px;
        width: 350px;
      }
    }
  }

  .form-content {
    @include flexbox(flex-end, center);
  }

  .form-input {
    flex-grow: 100;
  }

  .form-label {
    flex-grow: 0;
    margin: 0;
    padding: 0;
    margin-left: 4px;
  }

  .input_balance {
    width: 55%;
    font-size: 12px;
  }

  .ant-input-number-handler-wrap {
    display: none;
  }

  .ant-input-number-input {
    text-align: end;
  }

  .balance-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1001;
  }

  .balance-future {
    @include flexbox(flex-end, center);
    height: 32px;
  }
}

.ant-modal-wrap {
  z-index: 1002;
}
</style>
