<template>
  <div class="balance-registration">
    <model-balance-registration v-model:visible="isShowModalUpdate" />
    <div class="balance">
      <div class="balance__header">
        <div class="balance__header-export-csv">
          <div class="balance__header-export-csv-button">
            <!-- csv -->
            <a-tooltip color="#fff" :title="$t('deposit.deposit_list.export_csv')">
              <a-button class="u-mr-16" type="link">
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
              v-model:active-key="filter.group_id"
              default-active-key="1"
              :animated="false"
              @change="onChangeGroup"
            >
              <a-tab-pane v-for="item in groupList" :key="item.id" :tab="item.name" />
            </a-tabs>
          </div>
          <!-- Bank Account -->
          <div class="balance__header-filter-bank-account">
            <a-select v-model:value="filter.bank_account_id" :disabled="isDisabledBank" @change="onChangeBankAccount">
              <a-select-option v-for="item in bankAccountList" :key="item.id" :value="item.id">
                <span v-if="item.currencyCode">
                  {{ item.name + ' (' + item.currencyCode + ')' }}
                </span>
                <span v-else>
                  {{ item.name }}
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
        :loading="isLoading"
        :pagination="false"
        :custom-row="customRow"
        :scroll="{ x: 1200, y: isTableModal ? height - 400 : height - 295 }"
        :locale="localeTable"
        size="middle"
      >
        <template #month="{ record }">{{ $filters.moment_yyyy_mm(record.month) }}</template>
        <template #updateAt="{ record }">{{ $filters.moment_l(record.updateAt) }}</template>
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
                      :value="field.value"
                      :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                      @change="handleChange"
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
          <div class="balance-future" v-else-if="record.is_future && !record.action">
            <span class="balance-future-content">N/A</span>
          </div>
          <div class="form-content" v-else>
            <span class="form-input">
              {{ $filters.number_with_commas(record.balance) }}
            </span>
            <label class="form-label">
              {{ record.currencyCode }}
            </label>
          </div>
        </template>
        <template #action="{ record }">
          <a-button v-if="record.action && !record.is_future" type="primary" @click="onConfirmEditRow(record)">
            {{ $t('balance_registration.confirm_edit') }}
          </a-button>
          <div class="balance-future" v-else-if="record.is_future"></div>
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
import { useI18n } from 'vue-i18n'
import { FormOutlined } from '@ant-design/icons-vue'
import useGetListBalanceRegistrationService from '@/views/BalanceRegistration/compasables/useListBalanceRegistrationService'
import { getGroups, getBankAccounts } from '@/views/BalanceRegistration/compasables/useBalanceRegistration'
import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import { Field } from 'vee-validate'
import useCreateOrUpdateBalanceRegistrationService from '@/views/BalanceRegistration/compasables/useCreateOrUpdateBalanceRegistration'
import ModelBalanceRegistration from '@/components/ModelBalanceRegistraion.vue'
import moment from 'moment'

export default defineComponent({
  name: 'Index',

  components: { LineDownIcon, FormOutlined, Field, ModelBalanceRegistration },

  setup() {
    const { t } = useI18n()
    const groupList = ref([])
    const filter = ref({})
    const isLoading = ref(true)
    const bankAccountList = ref([])
    const isDisabledBank = ref(false)
    const isShowModalUpdate = ref(false)
    const tableList = ref([])
    const height = ref(0)
    const form = ref({
      bank_account_id: '',
      month: '',
      balance: 0
    })
    const state = reactive({ selectedRowKeys: [] })
    const recordVisible = ref({})
    const isFutureRecord = ref(false)
    let tempRow = reactive([])

    var isUpdating = false
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
      let groups = await getGroups()
      groupList.value = groups.result?.data
      filter.group_id = groups.result?.data[0].id
    }

    // Fetch banks account
    const fetchBankAccountList = async (groupId) => {
      let bankAccount = await getBankAccounts({ groupId: groupId })
      bankAccountList.value = bankAccount.result?.data || []
      if (bankAccountList.value.length > 0) {
        filter.value.bank_account_id = bankAccountList.value[0].id
      } else {
        filter.value.bank_account_id = 0
      }
    }

    // Fetch registraion balance
    const fetchRegistrationBalance = async (bankAccountId) => {
      isLoading.value = true
      try {
        if (bankAccountId != 0) {
          let { getLists } = await useGetListBalanceRegistrationService({ bank_account_id: bankAccountId })
          let { result } = await getLists()
          let data = await convertDataRenderTable(result?.data)
          tableList.value = data
        } else {
          tableList.value = []
        }
      } finally {
        isLoading.value = false
      }
    }

    // update registration balance
    const updateBalanceRegistration = async (id, value) => {
      let data = {
        ...value
      }
      // eslint-disable-next-line no-useless-catch
      try {
        const { createOrUpdate } = await useCreateOrUpdateBalanceRegistrationService(id, data)
        await createOrUpdate()
      } catch (err) {
        throw err
      }
    }

    //convert data for show record future
    const convertDataRenderTable = async (records) => {
      records.map((record) => {
        if (moment(record.month).format('YYYY-MM') > moment().format('YYYY-MM')) {
          record.is_future = true
        } else {
          record.is_future = false
        }
      })
      return records
    }

    const handleClickOutdideInput = () => {
      //isShowModalUpdate.value = true
    }

    // on change group
    const onChangeGroup = async () => {
      await fetchBankAccountList(filter.value.group_id)
      await fetchRegistrationBalance(filter.value.bank_account_id)
    }

    // on change bank account
    const onChangeBankAccount = async () => {
      await fetchRegistrationBalance(filter.value.bank_account_id)
    }

    // select row in table
    const selectRow = (record) => {
      recordVisible.value = { ...record }
      if (tempRow.length && tempRow[0] === record.id) {
        state.selectedRowKeys = []
        tempRow = []
        recordVisible.value.visible = false
      } else {
        state.selectedRowKeys = [record.id]
        tempRow = [record.id]
        recordVisible.value.visible = true
      }
    }

    const customRow = (record) => {
      return {
        onClick: () => {
          selectRow(record)
        }
      }
    }

    // handle click button edit
    const handleEditRow = (record) => {
      if (isUpdating) {
        isShowModalUpdate.value = true
      } else {
        form.value.balance = record.balance
        record.action = true
        console.log(isUpdating)
      }
      isUpdating = true
    }

    // handle confirm edit
    const onConfirmEditRow = async (record) => {
      console.log(isUpdating)
      isLoading.value = true
      isUpdating = false
      try {
        record.action = false
        form.value.bank_account_id = filter.value.bank_account_id
        form.value.month = record.month
        let data = { ...form.value }
        let bankAccountId = filter.value.bank_account_id
        await updateBalanceRegistration(record.id, data)
        await fetchRegistrationBalance(bankAccountId)
      } catch (e) {
        console.log(e)
      }
      isLoading.value = false
    }

    const localeTable = {
      emptyText: t('balance_registration.empty_text_table')
    }

    onBeforeMount(async () => {
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)

      await fetchGroupList()
      await fetchBankAccountList(filter.group_id)
      await fetchRegistrationBalance(filter.value.bank_account_id)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getInnerHeight)
    })

    return {
      filter,
      groupList,
      bankAccountList,
      tableList,
      columns,
      isLoading,
      isDisabledBank,
      height,
      localeTable,
      form,
      isFutureRecord,
      isShowModalUpdate,
      onChangeGroup,
      onChangeBankAccount,
      handleEditRow,
      onConfirmEditRow,
      customRow,
      handleClickOutdideInput
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/mixins';
@import '@/styles/shared/variables';
.balance {
  &__header {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  &__header-export-csv {
    @include flexbox(flex-end, flex-end);
    flex-direction: column;
    padding: 24px 32px 16px;
  }
  &__header-export-csv-button {
    display: flex;
    align-content: center;
    padding-right: 4px;

    button + button {
      margin-left: 16px;
    }
  }
  &__header-filter-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    display: flex;
    align-content: center;
    padding: 12px 32px;
    .ant-select {
      height: 32px;
      width: 350px;
    }
  }
}

.form-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.form-input {
  flex-grow: 100;
}
.form-label {
  flex-grow: 0;
  margin-left: 8px;
}
.input_balance {
  width: 300px;
  font-size: 12px;
}
.ant-input-number-handler-wrap {
  display: none;
}
.ant-input-number-input {
  text-align: end;
}
</style>
