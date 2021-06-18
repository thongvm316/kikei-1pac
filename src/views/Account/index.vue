<template>
  <section>
    <company-search-form @filter-changed="onFilterChange($event)" />

    <div class="box-create">
      <a-button class="btn-modal" type="primary" @click="$router.push({ name: 'company-new' })">
        <add-icon class="add-icon" />
        {{ $t('account.add_account') }}
      </a-button>
    </div>

    <a-table
      id="list-table"
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
      :scroll="{ y: height - 211 }"
      size="middle"
      @change="handleChange"
    >
    </a-table>

    <ModalAction v-if="recordVisible.visible" @edit="handleEditRecord" @delete="openDelete = true" />

    <ModalDelete v-model:visible="openDelete" :name="recordVisible.name" @delete="handleDeleteRecord($event)" />
  </section>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import useGetCompanyListService from '@/views/Company/composables/useGetCompanyListService'
import useDeleteCompanyService from '@/views/Company/composables/useDeleteCompanyService'
import { convertPagination } from '@/helpers/convert-pagination'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'

import Table from '@/mixins/table.mixin'
import CompanySearchForm from '@/views/Company/-components/CompanySearchForm'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'
import ModalDelete from '@/components/ModalDelete'
import useGetAccountDetailService from '@/views/Account/composables/useGetAccountDetailService'

export default defineComponent({
  name: 'Account',

  components: { ModalAction, CompanySearchForm, AddIcon, ModalDelete },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getAccounts } = useGetAccountDetailService({ pageNumber: 1, pageSize: 30 })
    const { result } = await getAccounts()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    next()
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, locale } = useI18n()
    const store = useStore()

    const openDelete = ref(false)
    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const recordVisible = ref({})
    const params = ref({})

    const height = ref(0)

    const state = reactive({ selectedRowKeys: [] })
    let tempRow = reactive([])

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
          title: t('account.login_id'),
          dataIndex: 'id',
          key: 'id',
          sorter: true
        },
        {
          title: t('account.full_name'),
          dataIndex: 'full_name',
          key: 'full_name',
          sorter: true
        },
        {
          title: t('account.status'),
          dataIndex: 'status',
          key: 'status'
        }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
      pagination.value = { ...route.meta['pagination'] }
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const handleChange = async (pagination, filters, sorter) => {
      if (sorter.order === 'ascend') {
        sorter.order = 'asc'
      } else if (sorter.order === 'descend') {
        sorter.order = 'desc'
      } else {
        sorter.order = ''
      }

      params.value = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        order_by: sorter.order === '' ? '' : sorter.field + ' ' + sorter.order
      }
      await fetchList(params.value, filter.value)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      await fetchList({ pageNumber: 1, pageSize: 30 }, filter.value)
    }

    const handleDeleteRecord = async () => {
      try {
        const { deleteCompany } = useDeleteCompanyService(recordVisible.value.id)
        await deleteCompany()
      } catch (error) {
        console.log(error)
      }
      openDelete.value = false
      recordVisible.value.visible = false
      await fetchList(params.value)
      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message:
          locale.value === 'en' ? 'Deleted' + recordVisible.value.name : recordVisible.value.name + 'を削除しました'
      })
    }

    const handleEditRecord = () => {
      router.push({
        name: 'company-edit',
        params: {
          id: recordVisible.value.id
        }
      })
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      try {
        const { getLists } = useGetAccountDetailService({ ...params }, data)
        debugger
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
      openDelete,
      state,
      rowSelection,
      recordVisible,
      height,
      params,
      handleDeleteRecord,
      handleEditRecord,
      customRow,
      handleChange,
      onFilterChange,
      fetchList
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
    margin-bottom: 16px;

    .add-icon {
      margin-right: 10.33px;
    }
  }
}
</style>
