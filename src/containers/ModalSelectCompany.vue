<template>
  <section>
    <a-modal
      :visible="visible"
      :title="$t('company.title_search_modal')"
      class="modal-company"
      width="85%"
      max-height="85%"
      @cancel="handleModalCancel"
    >
      <template #footer>
        <div class="form-company__search">
          <form class="form-left" @submit.prevent="onSearch">
            <!-- Keyword -->
            <div class="form-group">
              <div class="form-content">
                <label class="form-label">{{ $t('company.key_word') }}</label>
                <div class="form-input">
                  <a-input v-model:value="filter.key_search" :placeholder="$t('company.place_input')" />
                </div>
              </div>
            </div>

            <!-- Classification -->
            <div class="form-group">
              <div class="form-content">
                <label class="label-input">
                  {{ $t('company.division') }}
                </label>
                <a-checkbox-group v-model:value="filter.division">
                  <a-checkbox v-for="item in DIVISION" :key="item.id" :value="item.id">{{
                    $t(`company.${item.value}`)
                  }}</a-checkbox>
                </a-checkbox-group>
              </div>
            </div>

            <!-- Country -->
            <div class="form-group">
              <div class="form-content">
                <label class="label-input">
                  {{ $t('company.country') }}
                </label>
                <a-checkbox-group v-model:value="filter.country_id">
                  <a-checkbox v-for="item in COUNTRY" :key="item.id" :value="item.id">{{ item.value }}</a-checkbox>
                </a-checkbox-group>
              </div>
            </div>

            <!-- Currency -->
            <div class="form-group">
              <div class="form-content">
                <label class="label-input">
                  {{ $t('company.currency') }}
                </label>
                <a-checkbox-group v-model:value="filter.currency_id">
                  <a-checkbox v-for="item in CURRENCY" :key="item.id" :value="item.id">{{ item.value }}</a-checkbox>
                </a-checkbox-group>
              </div>
            </div>

            <!-- Box-Action-->
            <div class="box-action">
              <a-button key="clear" type="default" @click="handleClear">{{ $t('company.clear') }} </a-button>
              <a-button key="submit" type="primary" html-type="submit">
                <template #icon>
                  <span class="btn-icon">
                    <search-icon />
                  </span>
                </template>
                {{ $t('company.search') }}
              </a-button>
            </div>
          </form>
        </div>

        <a-table
          :columns="columns"
          :data-source="dataSource"
          :row-key="(record) => record.id"
          :loading="isLoading"
          :pagination="pagination"
          :scroll="{ y: height - 330 }"
          :custom-row="customRow"
          size="middle"
          table-layout="fixed"
          @change="handleChange"
        >
          <template #action="{ record }">
            <a-button type="primary" @click="handleSelectCompany(record)">{{ $t('company.confirm') }}</a-button>
          </template>

          <template #createdAt="{ text: createdAt }">
            {{ $filters.moment_l(createdAt) }}
          </template>

          <template #divisions="{ text: divisions }">
            {{
              divisions === 0 ? $t('company.customer') : divisions === 1 ? $t('company.partner') : $t('company.both')
            }}
          </template>
        </a-table>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { convertPagination } from '@/helpers/convert-pagination'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'

import useGetCompanyListService from '@/views/Company/composables/useGetCompanyListService'
import SearchIcon from '@/assets/icons/ico_search.svg'
import Table from '@/mixins/table.mixin'
import { DIVISION, COUNTRY, CURRENCY } from '@/enums/company.enum'

export default defineComponent({
  name: 'Search',

  components: {
    SearchIcon
  },

  mixins: [Table],

  props: {
    visible: Boolean
  },

  emits: ['update:visible', 'update:subcategoryId', 'update:companyName', 'handleValidateSubCategory'],

  setup(_, context) {
    const route = useRoute()
    const { t } = useI18n()

    const dataSource = ref([])
    const pagination = ref({ pageNumber: 1, pageSize: 30, orderBy: 'created_at desc' })
    const selected = ref({})
    const filters = ref({})
    const tmpCompany = ref({})
    const height = ref(0)
    const isLoading = ref(false)

    const initialState = {
      key_search: '',
      division: [],
      country_id: [],
      currency_id: []
    }

    const filter = reactive({ ...initialState })

    const columns = computed(() => {
      return [
        {
          title: t('company.confirm'),
          dataIndex: 'confirm',
          key: 'confirm',
          slots: { customRender: 'action' }
        },
        {
          title: t('company.company_created_at'),
          dataIndex: 'createdAt',
          key: 'createdAt',
          slots: { customRender: 'createdAt' }
        },
        {
          title: t('company.company'),
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: t('company.company_code'),
          dataIndex: 'code',
          key: 'code'
        },
        {
          title: t('company.country'),
          dataIndex: 'countryName',
          key: 'countryName'
        },
        {
          title: t('company.currency'),
          dataIndex: 'currencyCode',
          key: 'currencyCode'
        },
        {
          title: t('company.division'),
          dataIndex: 'divisions',
          key: 'divisions',
          slots: { customRender: 'divisions' }
        }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...(route?.meta['lists'] || [])]
      pagination.value = { ...(route?.meta['pagination'] || {}) }
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const handleClear = async () => {
      Object.assign(filter, initialState)
      await fetchList({ pageNumber: 1, pageSize: 30, orderBy: 'created_at desc' })
    }

    const handleChange = async (pagination) => {
      const params = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        orderBy: 'created_at desc'
      }

      await fetchList(params, filter)
    }

    const onSearch = async () => {
      filters.value = { ...deleteEmptyValue(filter) }
      await fetchList({ pageNumber: 1, pageSize: 30, orderBy: 'created_at desc' }, filters.value)
    }

    const customRow = (record) => {
      return {
        onClick: () => {
          tmpCompany.value = { ...record }
        }
      }
    }

    const handleSelectCompany = (record) => {
      context.emit('select-company', record)
      handleModalCancel()
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true

      try {
        const { getListCompany } = useGetCompanyListService({ ...params }, data)
        const { result } = await getListCompany()

        dataSource.value = [...result.data]
        pagination.value = convertPagination(result.meta, 'bottom')
        isLoading.value = false
      } catch (e) {
        isLoading.value = false
      }
    }

    const handleModalCancel = () => {
      context.emit('update:visible', false)
    }

    onBeforeMount(() => {
      fetchList(pagination.value)
    })

    return {
      isLoading,
      filter,
      filters,
      columns,
      dataSource,
      pagination,
      selected,
      tmpCompany,
      height,
      handleClear,
      handleChange,
      onSearch,
      fetchList,
      handleSelectCompany,
      customRow,
      CURRENCY,
      COUNTRY,
      DIVISION,
      handleModalCancel
    }
  }
})
</script>

<style scoped></style>
