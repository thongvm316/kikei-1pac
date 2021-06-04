<template>
  <section>
    <a-modal
      :visible="visible"
      :title="$t('depositCompany.title_search')"
      class="deposit-search-company"
      width="85%"
      max-height="85%"
      @cancel="handleCancel"
    >
      <template #footer>
        <div class="form-deposit">
          <Form class="form-left" @submit="onSubmit">
            <!-- Keyword -->
            <div class="form-group">
              <Field v-slot="{ field, handleChange }" v-model="filter.keyword" :name="$t('depositCompany.keyword')">
                <div class="form-content">
                  <label class="form-label">{{ $t('depositCompany.keyword') }}</label>
                  <div class="form-input">
                    <a-input
                      :value="field.value"
                      :placeholder="$t('depositCompany.place_input')"
                      @change="handleChange"
                    />
                  </div>
                </div>
              </Field>
            </div>

            <!-- Classification -->
            <Field
              v-slot="{ field, handleChange }"
              v-model="filter.classification"
              :name="$t('depositCompany.classification')"
            >
              <div class="checkbox__input">
                <label class="label-input">
                  {{ $t('depositCompany.classification') }}
                </label>
                <a-checkbox-group v-model="field.value" :options="plainOptions" @change="handleChange" />
              </div>
            </Field>

            <!-- Country -->
            <Field v-slot="{ field, handleChange }" v-model="filter.country" :name="$t('depositCompany.country')">
              <div class="checkbox__input">
                <label class="label-input">
                  {{ $t('depositCompany.country') }}
                </label>
                <a-checkbox-group v-model="field.value" :options="countries" @change="handleChange" />
              </div>
            </Field>

            <!-- Currency -->
            <Field v-slot="{ field, handleChange }" v-model="filter.currency" :name="$t('depositCompany.currency')">
              <div class="checkbox__input">
                <label class="label-input">
                  {{ $t('depositCompany.currency') }}
                </label>
                <a-checkbox-group v-model="field.value" :options="currencies" @change="handleChange" />
              </div>
            </Field>

            <a-button key="submit" type="primary" html-type="submit" :loading="loading">
              {{ $t('depositCompany.handle_ok') }}
            </a-button>
          </Form>
        </div>

        <div class="table-deposit">
          <a-table
            :columns="columns"
            :data-source="companyListData"
            :pagination="false"
            :expand-icon-as-cell="false"
            :scroll="{ y: 350 }"
            table-layout="fixed"
          >
            <template #action="{ record }">
              <a-button :disabled="record.disabled" type="primary">確定</a-button>
            </template>
          </a-table>

          <a-pagination v-model:current="pageNumber" :total="totalRecords" :page-size="pageSize" size="small" />
        </div>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount, watch, toRefs } from 'vue'
import useSearchCompany from '../composables/useSearchCompany'

const columns = [
  { title: '選択', dataIndex: 'select', key: 'select', slots: { customRender: 'action' } },
  { title: '企業名', dataIndex: 'name', key: 'name' },
  { title: '企業コード', dataIndex: 'code', key: 'code' },
  { title: '国', dataIndex: 'countryName', key: 'countryName' },
  { title: '通貨', dataIndex: 'currencyCode', key: 'currencyCode' },
  { title: '区分', dataIndex: 'divisionName', key: 'divisionName' }
]

export default defineComponent({
  name: 'KCompanySearch',

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    company: {
      type: Number,
      required: true
    }
  },

  setup(_, context) {
    const { getCompanyList } = useSearchCompany()

    const loading = ref(false)
    const companyListData = ref([])
    const paramsRequest = reactive({ pageNumber: 1, pageSize: 10, orderBy: 'name', totalPages: 0, totalRecords: 0 })
    const plainOptions = reactive(['顧客', 'パートナー'])
    const countries = reactive(['Japan', 'Vietnam'])
    const currencies = reactive(['JPY', 'VND'])
    const filter = reactive({ keyword: '', classification: [], country: [], currency: [] })

    const fetchCompanyList = async () => {
      const { result = {} } = await getCompanyList({
        pageNumber: paramsRequest.pageNumber,
        pageSize: paramsRequest.pageSize,
        orderBy: paramsRequest.orderBy
      })

      companyListData.value = (result?.data || []).map((item, index) => ({ key: index, ...item }))
      paramsRequest.totalPages = result.meta?.totalPages || 0
      paramsRequest.totalRecords = result.meta?.totalRecords || 0
    }

    onBeforeMount(() => {
      fetchCompanyList()
    })

    watch(
      () => [paramsRequest.pageNumber, paramsRequest.orderBy],
      () => {
        fetchCompanyList()
      }
    )

    const handleOk = () => {
      context.emit('update:visible', false)
    }

    const handleCancel = () => {
      context.emit('update:visible', false)
    }

    const onSubmit = () => {
      alert('ok')
    }

    return {
      loading,
      plainOptions,
      countries,
      currencies,
      filter,
      handleOk,
      handleCancel,
      onSubmit,
      companyListData,
      columns,
      ...toRefs(paramsRequest)
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
    }

    .form-group,
    .checkbox__input {
      margin-bottom: 16px;
    }

    .ant-checkbox-group {
      @include flexbox(null, null);
      flex-direction: column;
    }

    .ant-btn {
      position: absolute;
      bottom: 0;
    }
  }

  .table-deposit {
    flex: 1;
    padding: 24px;

    .ant-table-wrapper {
      margin-bottom: 36px;
    }
  }

  form .form-group .form-content .form-input {
    width: 100%;
  }

  .ant-checkbox-group-item {
    margin-top: 8px;
  }
}
</style>
