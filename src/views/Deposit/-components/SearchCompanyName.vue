<template>
  <a-modal
    :visible="visible"
    :title="$t('deposit.company_name.title_search')"
    class="deposit-search-company"
    width="85%"
    max-height="85%"
    @cancel="handleModalCancel"
  >
    <template #footer>
      <div class="form-deposit">
        <a-form ref="searchCompanyRef" class="form-left" :model="filters" layout="vertical" @submit="handleSearch">
          <a-form-item name="purpose" :label="$t('deposit.company_name.key_search')">
            <a-input v-model:value="filters.keySearch" :placeholder="$t('deposit.company_name.place_input')" />
          </a-form-item>

          <a-form-item name="division" :label="$t('deposit.company_name.division')">
            <a-checkbox-group v-model:value="filters.division" :options="divisionOptions" />
          </a-form-item>

          <a-form-item name="country" :label="$t('deposit.company_name.country')">
            <a-checkbox-group v-model:value="filters.country" :options="countryOptions" />
          </a-form-item>

          <a-form-item name="currency" :label="$t('deposit.company_name.currency')">
            <a-checkbox-group v-model:value="filters.currency" :options="currencyOptions" />
          </a-form-item>

          <a-button type="default" html-type="reset" @click="handleClearFilter">
            {{ $t('deposit.company_name.handle_clear') }}
          </a-button>

          <a-button key="submit" type="primary" html-type="submit" :loading="isFilterloading">
            <template #icon>
              <span class="btn-icon">
                <search-icon />
              </span>
            </template>
            {{ $t('deposit.company_name.handle_ok') }}
          </a-button>
        </a-form>
      </div>

      <div class="table-deposit">
        <a-table
          :columns="columns"
          :data-source="companyListData"
          :pagination="false"
          :expand-icon-as-cell="false"
          :scroll="{ x: 1000, y: 350 }"
          :loading="isTableLoading"
          table-layout="fixed"
        >
          <template #action="{ record }">
            <a-button
              :disabled="record.disabled"
              type="primary"
              class="table-deposit__select-btn"
              @click="handleSelectCompany(record)"
            >
              {{ $t('deposit.company_name.handle_select') }}
            </a-button>
          </template>
        </a-table>

        <a-pagination
          v-if="totalRecords !== 0"
          v-model:current="pageNumber"
          :total="totalRecords"
          :page-size="pageSize"
          size="small"
        />
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount, watch, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { DIVISION, COUNTRY, CURRENCY } from '@/enums/deposit.enum'
import { getCompanyList } from '../composables/useSearchCompany'
import { addUniqueRowKey } from '@/helpers/table'

import SearchIcon from '@/assets/icons/ico_search.svg'

export default defineComponent({
  name: 'KSearchCompanyName',

  components: {
    SearchIcon
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    subcategoryId: Number
  },

  emits: {
    'update:subcategoryId': null,
    'update:companyName': null,
    'update:visible': null,
    handleValidateSubCategory: null
  },

  setup(_, context) {
    const { t } = useI18n()

    const searchCompanyRef = ref()
    const isTableLoading = ref(false)
    const isFilterloading = ref(false)
    const companyListData = ref([])
    const pagination = reactive({ pageNumber: 1, pageSize: 10, orderBy: 'name', totalPages: 0, totalRecords: 0 })
    const filters = ref({ keySearch: '', division: [], countryId: [], currencyId: [] })

    const divisionOptions = DIVISION.map((item) => ({ ...item, label: t(`deposit.division.${item.label}`) }))
    const countryOptions = COUNTRY.map((item) => ({ ...item, label: t(`deposit.country.${item.label}`) }))
    const currencyOptions = CURRENCY.map((item) => ({ ...item, label: t(`deposit.currency.${item.label}`) }))

    const columns = [
      {
        title: t('deposit.company_name.table_header_select'),
        dataIndex: 'select',
        key: 'select',
        slots: { customRender: 'action' },
        ellipsis: true
      },
      { title: t('deposit.company_name.table_header_name'), dataIndex: 'name', key: 'name', ellipsis: true },
      { title: t('deposit.company_name.table_header_code'), dataIndex: 'code', key: 'code', ellipsis: true },
      {
        title: t('deposit.company_name.table_header_country'),
        dataIndex: 'countryName',
        key: 'countryName',
        ellipsis: true
      },
      {
        title: t('deposit.company_name.table_header_currency'),
        dataIndex: 'currencyCode',
        key: 'currencyCode',
        ellipsis: true
      },
      {
        title: t('deposit.company_name.table_header_division'),
        dataIndex: 'divisionName',
        key: 'divisionName',
        ellipsis: true
      }
    ]

    const fetchCompanyList = async () => {
      isTableLoading.value = true

      try {
        const { result = {} } = await getCompanyList(
          {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            orderBy: pagination.orderBy
          },
          filters.value
        )

        companyListData.value = addUniqueRowKey(result.data)
        pagination.totalPages = result.meta?.totalPages || 0
        pagination.totalRecords = result.meta?.totalRecords || 0
      } finally {
        isTableLoading.value = false
      }
    }

    // update state in parent
    const handleSelectCompany = (record) => {
      context.emit('update:companyName', record.name)
      context.emit('update:subcategoryId', record.id)
      context.emit('handleValidateSubCategory')
      handleModalCancel()
    }

    // cancel modal
    const handleModalCancel = () => {
      context.emit('update:visible', false)
    }

    const handleSearch = () => {
      fetchCompanyList()
    }

    const handleClearFilter = () => {
      searchCompanyRef.value.resetFields()
    }

    // fetch table list
    onBeforeMount(() => {
      fetchCompanyList()
    })

    watch(
      () => pagination.pageNumber,
      () => {
        fetchCompanyList()
      }
    )

    return {
      searchCompanyRef,
      isTableLoading,
      isFilterloading,
      divisionOptions,
      countryOptions,
      currencyOptions,
      filters,
      companyListData,
      columns,

      handleSelectCompany,
      handleModalCancel,
      handleSearch,
      handleClearFilter,
      ...toRefs(pagination)
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.deposit-search-company {
  .ant-modal-footer {
    @include flexbox(null, null);
    padding: 0;
  }

  .form-deposit {
    text-align: left;
    padding: 24px;
    border-right: 1px solid $color-grey-55;
    width: 296px;
    background-color: $color-grey-94;

    .form-left {
      position: relative;
      width: 100%;
      overflow: auto;
    }

    .form-group,
    .checkbox__input {
      margin-bottom: 16px;
    }
  }

  .table-deposit {
    flex: 1;
    padding: 24px;
    width: 200px;

    &__select-btn {
      font-size: 12px;
      line-height: 18px;
      height: 20px;
    }
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-checkbox-group {
    @include flexbox(null, null);
    flex-direction: column;
  }

  .ant-table-wrapper {
    margin-bottom: 16px;
  }

  form .form-group .form-content .form-input {
    width: 100%;
  }

  .ant-table-thead > tr > th {
    padding: 7px 16px;
  }

  .ant-table-tbody > tr > td:not(:first-child) {
    padding: 7px 16px;
    line-height: 14px;
  }

  .ant-table-tbody > tr > td:first-child {
    padding: 6px 16px;
    line-height: 14px;
  }

  .ant-table {
    border: 1px solid $color-grey-85;
  }

  .ant-table-body {
    overflow-x: auto !important;
  }

  .ant-table-placeholder {
    height: 338px;
  }
}
</style>
