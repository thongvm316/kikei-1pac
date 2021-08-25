<template>
  <section class="company">
    <company-search-form :is-delete="isDelete" @filter-changed="onFilterChange($event)" />

    <div class="box-create">
      <a-button class="btn-modal" type="primary" @click="$router.push({ name: 'company-new', query: $route.query })">
        <add-icon class="add-icon" />
        {{ $t('company.add_company') }}
      </a-button>
    </div>

    <a-table
      id="list-table"
      v-click-outside="handleClickOutdideTable"
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
      :scroll="{ y: height - 218 }"
      size="middle"
      @change="handleChange"
    >
      <template #createdAt="{ text: createdAt }">
        {{ $filters.moment_l(createdAt) }}
      </template>

      <template #divisions="{ text: divisions }">
        {{ divisions === 0 ? $t('company.customer') : divisions === 1 ? $t('company.partner') : $t('company.both') }}
      </template>
    </a-table>

    <ModalAction
      v-if="recordVisible.visible"
      ref="modalActionRef"
      @edit="handleEditRecord"
      @delete="openDelete = true"
      @close="handleCloseRecord"
    />

    <ModalDelete
      v-model:visible="openDelete"
      class="close-modal-delete"
      :name="recordVisible.name"
      @delete="handleDeleteRecord($event)"
    />
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
import { forEach, isArray, keys, map, includes } from 'lodash-es'

import Table from '@/mixins/table.mixin'
import CompanySearchForm from '@/views/Company/-components/CompanySearchForm'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'
import ModalDelete from '@/components/ModalDelete'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'

export default defineComponent({
  name: 'Index',

  components: { ModalAction, CompanySearchForm, AddIcon, ModalDelete },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const body = {}

    if (keys(to.query).length > 0) {
      forEach(to.query, (value, key) => {
        if (!includes(['order_by', 'page_number', 'page_size'], key)) {
          body[key] = map([...value], (i) => Number(i))
        }
      })
    }

    const query = {
      page_number: to.query.page_number || 1,
      page_size: 50,
      order_by: 'created_at desc',
      ...to.query,
      ...body
    }

    const { getLists } = useGetCompanyListService(query, body)
    const { result } = await getLists()
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
    const isDelete = ref(false)
    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const recordVisible = ref({})
    const params = ref({ ...route.query })
    const modalActionRef = ref()

    const height = ref(0)

    const state = reactive({ selectedRowKeys: [] })
    let tempRow = reactive([])

    const companyEnums = ref({
      company_project: t('company.company_project'),
      company_project_order: t('company.company_project_order'),
      company_deposit: t('company.company_deposit')
    })

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
          title: t('company.company_created_at'),
          dataIndex: 'createdAt',
          key: 'createdAt',
          slots: { customRender: 'createdAt' },
          sorter: true
        },
        {
          title: t('company.company_name'),
          dataIndex: 'name',
          key: 'name',
          sorter: true
        },
        {
          title: t('company.company_code'),
          dataIndex: 'code',
          key: 'code',
          sorter: true
        },
        {
          title: t('company.country'),
          dataIndex: 'countryName',
          key: 'countryName',
          sorter: true
        },
        {
          title: t('company.currency'),
          dataIndex: 'currencyCode',
          key: 'currencyCode'
        },
        {
          title: t('company.classification'),
          dataIndex: 'divisions',
          key: 'divisions',
          slots: { customRender: 'divisions' }
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
      recordVisible.value.visible = false

      if (sorter.order === 'ascend') {
        sorter.order = 'asc'
      } else if (sorter.order === 'descend') {
        sorter.order = 'desc'
      } else {
        sorter.order = ''
      }

      let sortIsCountry = sorter.field === 'countryName'
      let sortIsDate = sorter.field === 'createdAt'
      let sortCountry = 'ADCountry.name' + ' ' + sorter.order
      let sortDate = 'created_at' + ' ' + sorter.order
      let sortDefault = sorter.field + ' ' + sorter.order

      params.value = {
        page_number: pagination.current,
        page_size: pagination.pageSize,
        order_by:
          sorter.order === '' ? 'created_at desc' : sortIsCountry ? sortCountry : sortIsDate ? sortDate : sortDefault
      }

      if (keys(route.query).length > 0) {
        forEach(route.query, (value, key) => {
          if (!includes(['order_by', 'page_number', 'page_size'], key)) {
            if (isArray(value)) {
              filter.value[key] = map([...value], (i) => Number(i))
            } else {
              filter.value[key] = value
            }
          }
        })
      }

      await router.push({
        name: 'company',
        query: {
          ...params.value,
          ...filter.value
        }
      })

      await fetchList({ ...params.value }, { ...filter.value })
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      params.value = {
        page_number: 1,
        page_size: 50,
        order_by: 'created_at desc'
      }
      await router.push({ name: 'company', query: { ...params.value, ...filter.value } })
      await fetchList({ ...params.value }, { ...filter.value })
    }

    const handleDeleteRecord = async () => {
      try {
        const { deleteCompany } = useDeleteCompanyService(recordVisible.value.id)
        await deleteCompany()
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'success',
          duration: 5,
          message:
            locale.value === 'en' ? 'Deleted' + recordVisible.value.name : recordVisible.value.name + 'が削除されました'
        })
        isDelete.value = true
      } catch (err) {
        checkErrorsApi(err)
        throw err
      }
      openDelete.value = false
      recordVisible.value.visible = false
      params.value = {
        page_number: 1,
        page_size: 50
      }
      await fetchList(params.value)
    }

    const checkErrorsApi = (err) => {
      openDelete.value = false
      err.response.data.errors = camelToSnakeCase(err.response.data.errors)

      for (let item in err.response.data.errors) {
        setTimeout(() => {
          store.commit('flash/STORE_FLASH_MESSAGE', {
            variant: 'error',
            duration: 5,
            message: locale.value === 'en' ? `${companyEnums.value[item]}` : `${companyEnums.value[item]}`
          })
        }, 1000)
      }
    }

    // Close ActionBar
    const handleCloseRecord = () => {
      recordVisible.value.visible = false
      state.selectedRowKeys = []
      tempRow = []
    }

    // Click outside close ActionBar
    const handleClickOutdideTable = (event) => {
      const elModalDelete = document.querySelector('.close-modal-delete')
      const elNotOutsideList = [modalActionRef.value?.$el, elModalDelete].filter(Boolean)
      if (elNotOutsideList.length === 0) return
      const isElOutside = elNotOutsideList.every((el) => !(el === event.target || el.contains(event.target)))
      if (isElOutside) {
        recordVisible.value.visible = false
        state.selectedRowKeys = []
        tempRow = []
      }
    }

    const handleEditRecord = () => {
      router.push({
        name: 'company-edit',
        params: {
          id: recordVisible.value.id
        },
        query: { ...params.value, ...filter.value }
      })
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      tempRow = []
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
      openDelete,
      state,
      rowSelection,
      recordVisible,
      height,
      params,
      modalActionRef,
      isDelete,
      handleDeleteRecord,
      handleEditRecord,
      handleCloseRecord,
      handleClickOutdideTable,
      customRow,
      handleChange,
      onFilterChange,
      fetchList
    }
  }
})
</script>
