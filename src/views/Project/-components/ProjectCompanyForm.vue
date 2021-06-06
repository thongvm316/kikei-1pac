<template>
  <a-modal
    v-model:visible="visibility"
    :title="$t('deposit.title_search')"
    class="search-deposit"
    width="85%"
    max-height="85%"
  >
    <template #footer>
      <div class="form-deposit">
        <Form class="form-left" @submit="onSubmit">
          <!-- Keyword -->
          <div class="form-group">
            <Field v-slot="{ field, handleChange }" v-model="filter.keyword" :name="$t('deposit.keyword')">
              <div class="form-content">
                <label class="form-label">{{ $t('deposit.keyword') }}</label>
                <div class="form-input">
                  <a-input :value="field.value" :placeholder="$t('deposit.place_input')" @change="handleChange" />
                </div>
              </div>
            </Field>
          </div>

          <!-- Classification -->
          <Field
            v-slot="{ field, handleChange }"
            v-model="filter.classification"
            :name="$t('deposit.classification')"
          >
            <div class="checkbox__input">
              <label class="label-input">
                {{ $t('deposit.classification') }}
              </label>
              <a-checkbox-group v-model="field.value" :options="plainOptions" @change="handleChange" />
            </div>
          </Field>

          <!-- Country -->
          <Field v-slot="{ field, handleChange }" v-model="filter.country" :name="$t('deposit.country')">
            <div class="checkbox__input">
              <label class="label-input">
                {{ $t('deposit.country') }}
              </label>
              <a-checkbox-group v-model="field.value" :options="countries" @change="handleChange" />
            </div>
          </Field>

          <!-- Currency -->
          <Field v-slot="{ field, handleChange }" v-model="filter.currency" :name="$t('deposit.currency')">
            <div class="checkbox__input">
              <label class="label-input">
                {{ $t('deposit.currency') }}
              </label>
              <a-checkbox-group v-model="field.value" :options="currencies" @change="handleChange" />
            </div>
          </Field>

          <a-button key="submit" type="primary" html-type="submit" :loading="loading">
            <template #icon>
              <span class="btn-icon">
                <search-icon />
              </span>
            </template>
            {{ $t('deposit.handle_ok') }}
          </a-button>
        </Form>
      </div>

      <div class="table-deposit">
        <a-table
          :columns="columns"
          :data-source="datas"
          :pagination="false"
          :expand-icon-as-cell="false"
          :scroll="{ y: 350 }"
          :loading="loading"
          table-layout="fixed"
        >
          <template #action="{ record }">
            <a-button :disabled="record.disabled" @click="selectCompany(record)" type="primary">確定</a-button>
          </template>
        </a-table>

        <a-pagination
          v-model:current="currentPage"
          :total="pagination.totalRecords"
          :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
          :page-size="pagination.pageSize"
          size="small"
        />
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue'
import useGetCompanyListService from '@/views/Company/composables/useGetCompanyListService'
import SearchIcon from '@/assets/icons/ico_search.svg'
import { addUniqueRowKey } from '@/helpers/table'

const columns = [
  { title: '選択', dataIndex: 'select', key: 'select', slots: { customRender: 'action' } },
  { title: '企業名', dataIndex: 'name', key: 'name' },
  { title: '企業コード', dataIndex: 'code', key: 'code' },
  { title: '国', dataIndex: 'countryName', key: 'countryName' },
  { title: '通貨', dataIndex: 'currencyCode', key: 'currencyCode' },
  { title: '区分', dataIndex: 'divisionName', key: 'divisionName' }
]

export default defineComponent({
  name: 'Search',

  props: {
    visibility: {
      type: Boolean
    }
  },

  setup(props, { emit }) {
    const visibility = props.visible

    const currentPage = ref(1)
    const pagination = ref({
      pageSize: 10,
      pageNumber: 1
    });
    const datas = ref([])
    const loading = ref(false)
    const plainOptions = reactive(['顧客', 'パートナー'])
    const countries = reactive(['Japan', 'Vietnam'])
    const currencies = reactive(['JPY', 'VND'])
    const filter = reactive({ keyword: '', classification: [], country: [], currency: [] })

    const fetchCompanies = async () => {
      loading.value = true
      pagination.value.pageNumber = currentPage
      const { getLists } = useGetCompanyListService(pagination.value, filter)
      const { result } = await getLists()
      datas.value = addUniqueRowKey(result.data)
      pagination.value = result.meta
      loading.value = false
    }

    const handleCancel = () => {
      emit('update:visible', false)
    }
    const onSubmit = () => { fetchCompanies() }
    const selectCompany = (company) => {
      emit('select-company', company)
      handleCancel()
    }

    onBeforeMount(() => { fetchCompanies() })
    watch(currentPage, fetchCompanies)

    return {
      visibility,
      currentPage,
      pagination,
      filter,
      datas,
      columns,
      loading,
      plainOptions,
      countries,
      currencies,
      selectCompany,
      handleCancel,
      onSubmit
    }
  },

  components: {
    SearchIcon
  }
})
</script>
