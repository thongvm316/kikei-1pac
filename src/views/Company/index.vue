<template>
  <section>
    <Search @filter-changed="onFilterChange($event)" />

    <div class="box-create">
      <a-button class="btn-modal" type="primary"><add-icon class="add-icon" /> 新規企業追加</a-button>
    </div>

    <div class="list-table">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :row-key="(record) => record.id"
        :loading="isLoading"
        :pagination="{
          ...pagination,
          showTotal: showTotal
        }"
        :custom-row="customRow"
        :row-selection="rowSelection"
        size="middle"
        @change="handleChange"
      >
        <!-- Name -->
        <template #customTitle>
          <span class="pl-32">{{ t('company.company_name') }}</span>
        </template>
        <template #name="{ text }">
          <p class="pl-32">{{ text }}</p>
        </template>
      </a-table>

      <ModalAction v-if="recordVisible.visible" />
    </div>
  </section>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useGetCompanyListService from '@/views/Company/composables/useGetCompanyListService'
import { convertPagination } from '@/helpers/convert-pagination'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'

import Table from '@/mixins/table.mixin'
import Search from '@/views/Company/Search'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'

export default defineComponent({
  name: 'Index',

  components: { ModalAction, Search, AddIcon },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getLists } = useGetCompanyListService({ pageNumber: 1, pageSize: 30 })
    const { result } = await getLists()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    next()
  },

  setup() {
    const route = useRoute()
    const { t } = useI18n()

    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const recordVisible = ref({})

    let tempRow = reactive([])
    const state = reactive({ selectedRowKeys: [] })

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: state.selectedRowKeys,
        columnWidth: 0,
        type: 'radio'
      }
    })

    const columns = computed(() => {
      return [
        {
          dataIndex: 'name',
          key: 'name',
          slots: {
            title: 'customTitle',
            customRender: 'name'
          },
          sorter: (a, b) => a.name.length - b.name.length
        },
        {
          title: t('company.company_code'),
          dataIndex: 'code',
          key: 'code',
          sorter: (a, b) => a.code - b.code
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
          title: t('company.classification'),
          dataIndex: 'divisionName',
          key: 'divisionName'
        }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
      pagination.value = { ...route.meta['pagination'] }
    })

    const handleChange = async (pagination) => {
      const params = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize
      }

      await fetchlist(params)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      await fetchlist({ pageNumber: 1, pageSize: 30 }, filter.value)
    }

    const fetchlist = async (params = {}, data) => {
      isLoading.value = true

      try {
        const { getLists } = useGetCompanyListService({ ...params }, data)
        const { result } = await getLists()

        dataSource.value = [...result.data]
        pagination.value = convertPagination(result.meta)
        isLoading.value = false
      } catch (e) {
        isLoading.value = false
      }
    }

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

    return {
      dataSource,
      pagination,
      columns,
      isLoading,
      t,
      state,
      rowSelection,
      recordVisible,
      customRow,
      handleChange,
      onFilterChange,
      fetchlist
    }
  }
})
</script>

<style scoped lang="scss">
.box-create {
  padding: 24px 32px 0;
  text-align: right;
  text-align: -webkit-right;

  .btn-modal {
    width: auto;
    height: 24px;
    border-radius: 2px;
    padding: 1px 8px;
    text-align: center;
    display: flex;
    align-items: center;

    .add-icon {
      margin-right: 10.33px;
    }
  }
}
</style>
