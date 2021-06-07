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
        <Form class="form-left" @submit="handleSearch">
          <!-- keySearch -->
          <div class="form-group">
            <Field
              v-slot="{ field, handleChange }"
              v-model="filters.keySearch"
              :name="$t('deposit.company_name.key_search')"
            >
              <div class="form-content">
                <label class="form-label">{{ $t('deposit.company_name.key_search') }}</label>
                <div class="form-input">
                  <a-input
                    :value="field.value"
                    :placeholder="$t('deposit.company_name.place_input')"
                    @change="handleChange"
                  />
                </div>
              </div>
            </Field>
          </div>

          <!-- division -->
          <Field
            v-slot="{ field, handleChange }"
            v-model="filters.division"
            :name="$t('deposit.company_name.division')"
          >
            <div class="checkbox__input">
              <label class="label-input">
                {{ $t('deposit.company_name.division') }}
              </label>
              <a-checkbox-group v-model="field.value" :options="DIVISION" @change="handleChange" />
            </div>
          </Field>

          <!-- Country -->
          <Field
            v-slot="{ field, handleChange }"
            v-model="filters.countryId"
            :name="$t('deposit.company_name.country')"
          >
            <div class="checkbox__input">
              <label class="label-input">
                {{ $t('deposit.company_name.country') }}
              </label>
              <a-checkbox-group v-model="field.value" :options="COUNTRY" @change="handleChange" />
            </div>
          </Field>

          <!-- Currency -->
          <Field
            v-slot="{ field, handleChange }"
            v-model="filters.currencyId"
            :name="$t('deposit.company_name.currency')"
          >
            <div class="checkbox__input">
              <label class="label-input">
                {{ $t('deposit.company_name.currency') }}
              </label>
              <a-checkbox-group v-model="field.value" :options="CURRENCY" @change="handleChange" />
            </div>
          </Field>

          <a-button key="submit" type="primary" html-type="submit" :loading="isFilterloading">
            {{ $t('deposit.company_name.handle_ok') }}
          </a-button>
        </Form>
      </div>

      <div class="table-deposit">
        <a-table
          :columns="columns"
          :data-source="companyListData"
          :pagination="false"
          :expand-icon-as-cell="false"
          :scroll="{ x: 600, y: 330 }"
          :loading="isTableLoading"
          table-layout="auto"
        >
          <template #action="{ record }">
            <a-button
              :disabled="record.disabled"
              type="primary"
              class="table-deposit__select-btn"
              @click="handleSelectCompany(record.name)"
            >
              確定
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
import { DIVISION, COUNTRY, CURRENCY } from '@/enums/deposit.enum'
import { getCompanyList } from '../composables/useSearchCompany'

const columns = [
  { title: '選択', dataIndex: 'select', key: 'select', slots: { customRender: 'action' } },
  { title: '企業名', dataIndex: 'name', key: 'name' },
  { title: '企業コード', dataIndex: 'code', key: 'code' },
  { title: '国', dataIndex: 'countryName', key: 'countryName' },
  { title: '通貨', dataIndex: 'currencyCode', key: 'currencyCode' },
  { title: '区分', dataIndex: 'divisionName', key: 'divisionName' }
]

export default defineComponent({
  name: 'KSearchCompanyName',

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    companyName: {
      type: String,
      required: true
    }
  },

  setup(_, context) {
    const isTableLoading = ref(false)
    const isFilterloading = ref(false)
    const companyListData = ref([])
    const pagination = reactive({ pageNumber: 1, pageSize: 10, orderBy: 'name', totalPages: 0, totalRecords: 0 })
    const filters = reactive({ keySearch: '', division: [], countryId: [], currencyId: [] })

    const fetchCompanyList = async () => {
      isTableLoading.value = true

      try {
        const { result = {} } = await getCompanyList(
          {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            orderBy: pagination.orderBy
          },
          filters
        )

        companyListData.value = (result?.data || []).map((item, index) => ({ key: index, ...item }))
        pagination.totalPages = result.meta?.totalPages || 0
        pagination.totalRecords = result.meta?.totalRecords || 0
      } catch (e) {
        console.log('featch company list error', e)
      } finally {
        isTableLoading.value = false
      }
    }

    // update state in parent
    const handleSelectCompany = (name) => {
      context.emit('update:companyName', name)
      context.emit('update:visible', false)
    }

    // cancel modal
    const handleModalCancel = () => {
      context.emit('update:visible', false)
    }

    const handleSearch = () => {
      fetchCompanyList()
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
      isTableLoading,
      isFilterloading,
      DIVISION,
      COUNTRY,
      CURRENCY,
      filters,
      companyListData,
      columns,
      handleSelectCompany,
      handleModalCancel,
      handleSearch,
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
      height: 100%;
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

  .ant-checkbox-group-item {
    margin-top: 8px;
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
}
</style>
