<template>
  <section class="subcategory">
    <subcategory-search-form @filter-changed="onFilterChange($event)" />

    <div class="box-create">
      <a-button class="bnt-back" type="default" @click="handleBack">
        <arrow-icon class="arrow-icon" />
        {{ $t('subcategory.back') }}
      </a-button>
      <a-button class="btn-modal" type="primary" @click="handleCreate">
        <add-icon class="add-icon" />
        {{ $t('subcategory.add_subcategory') }}
      </a-button>
    </div>

    <a-table
      id="list-table"
      v-click-outside="handleClickOutdideTable"
      :columns="columns"
      :data-source="dataSource"
      :row-key="(record) => record.id"
      :loading="isLoading"
      :locale="emptyTextHTML"
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
      <template #inUse="{ text: inUse }">
        {{ inUse ? $t('subcategory.in_use') : $t('subcategory.prohibited') }}
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
import { defineComponent, computed, ref, reactive, onMounted, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import useGetSubCategoryListService from '@/views/Subcategory/composables/useGetSubcategoryListService'
import useDeleteSubCategoryService from '@/views/Subcategory/composables/useDeleteSubcategoryService'
import { convertPagination } from '@/helpers/convert-pagination'

import Table from '@/mixins/table.mixin'
import SubcategorySearchForm from '@/views/Subcategory/-components/SubcategorySearchForm'
import ArrowIcon from '@/assets/icons/ico_arrow_up.svg'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'
import ModalDelete from '@/components/ModalDelete'
import { forEach, includes, isArray, keys, map } from 'lodash-es'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'

export default defineComponent({
  name: 'Index',

  components: { ModalAction, SubcategorySearchForm, ArrowIcon, AddIcon, ModalDelete },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const body = {}

    if (isArray(to.query.category_id)) {
      forEach(to.query, (value, key) => {
        if (!includes(['order_by', 'page_number', 'page_size'], key)) {
          if (isArray(value)) {
            body[key] = map([...value], (i) => Number(i))
          } else {
            body[key] = value
          }
        }
      })
    }

    if (isArray(from.query.category_id)) {
      forEach(from.query, (value, key) => {
        if (!includes(['order_by', 'page_number', 'page_size'], key)) {
          if (isArray(value)) {
            body[key] = map([...value], (i) => Number(i))
          } else {
            body[key] = value
          }
        }
      })
    }

    const query = {
      page_number: 1,
      page_size: 50,
      order_by: 'name asc',
      ...body
    }

    const { getLists } = useGetSubCategoryListService(query, body)
    const { result } = await getLists()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    to.meta['queryDelete'] = body
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
    const modalActionRef = ref()
    const queryDelete = ref({})
    const emptyTextHTML = ref({})
    let idSelected = ref({})

    const state = reactive({ selectedRowKeys: [] })
    let tempRow = reactive([])

    emptyTextHTML.value = {
      emptyText: <div class="ant-empty ant-empty-normal ant-empty-description"> {t('subcategory.emptyData')}</div>
    }

    const subcategoryEnums = ref({
      subcategory_deposit: t('subcategory.subcategory_deposit')
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
          title: t('subcategory.subcategory_name'),
          dataIndex: 'name',
          key: 'name',
          sorter: true
        },
        {
          title: t('subcategory.status'),
          dataIndex: 'inUse',
          key: 'inUse',
          slots: { customRender: 'inUse' }
        }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
      pagination.value = { ...route.meta['pagination'] }
      queryDelete.value = { ...route.meta['queryDelete'] }

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

      params.value = {
        page_number: pagination.current,
        page_size: pagination.pageSize,
        order_by: sorter.order === '' ? 'name asc' : sorter.field + ' ' + sorter.order
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
        name: 'subcategory',
        query: {
          ...params.value,
          ...filter.value
        }
      })

      await fetchList(params.value, filter.value)
    }

    const onFilterChange = async (evt) => {
      let filter = {}
      if (keys(route.query).length > 0) {
        forEach(route.query, (value, key) => {
          if (isArray(value)) {
            filter[key] = map([...value], (i) => Number(i))
          } else if (key === 'category_id' && typeof value === 'string') {
            filter[key] = map([value], (i) => Number(i))
          } else {
            filter[key] = value
          }
        })
      }
      queryDelete.value = {
        ...filter,
        key_search: evt.key_search === '' ? '' : evt.key_search
      }
      await router.push({ name: 'subcategory', query: queryDelete.value })
      await fetchList({ page_number: 1, page_size: 50, order_by: 'name asc' }, queryDelete.value)
    }

    const handleBack = () => {
      let queryBack = {
        ...route.query
      }
      delete queryBack.category_id
      delete queryBack.name
      delete queryBack.category_name
      delete queryBack.key_search
      delete queryBack.id
      router.push({
        name: 'category',
        params: queryDelete.value,
        query: queryBack
      })
    }

    const handleCreate = () => {
      idSelected.value = {
        key_search: route.query.key_search,
        category_id: parseInt(route.query.id),
        name: route.query.name,
        id: route.query.id
      }
      router.push({
        name: 'subcategory-new',
        params: route.params,
        query: { ...idSelected.value, ...params.value, ...filter.value }
      })
    }

    const handleDeleteRecord = async () => {
      try {
        const { deleteSubCategory } = useDeleteSubCategoryService(recordVisible.value.id)
        await deleteSubCategory()
        //show notification
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'success',
          duration: 5,
          message:
            locale.value === 'en' ? 'Deleted' + recordVisible.value.name : recordVisible.value.name + 'が削除されました'
        })
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
      await fetchList(params.value, queryDelete.value)
    }

    const checkErrorsApi = (err) => {
      openDelete.value = false
      err.response.data.errors = camelToSnakeCase(err.response.data.errors)

      for (let item in err.response.data.errors) {
        setTimeout(() => {
          store.commit('flash/STORE_FLASH_MESSAGE', {
            variant: 'error',
            duration: 5,
            message: locale.value === 'en' ? `${subcategoryEnums.value[item]}` : `${subcategoryEnums.value[item]}`
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
      idSelected.value = {
        key_search: route.query.key_search,
        category_id: parseInt(route.query.id),
        name: route.query.name,
        id: route.query.id
      }
      router.push({
        name: 'subcategory-edit',
        params: {
          id: recordVisible.value.id,
          category_id: route.params.category_id,
          name: route.params.name
        },
        query: { ...idSelected.value, ...params.value, ...filter.value }
      })
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      tempRow = []
      try {
        const { getLists } = useGetSubCategoryListService({ ...params }, data)
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

    onBeforeMount(async () => {
      let params = {
        page_number: 1,
        page_size: 50,
        order_by: 'name asc',
        ...route.query
      }
      let filter = {}
      if (keys(route.query).length > 0) {
        forEach(route.query, (value, key) => {
          if (key === 'category_id' && typeof value === 'string') {
            filter[key] = map([value], (i) => Number(i))
          } else {
            filter[key] = value
          }
        })
      }
      await fetchList(params, filter)
    })

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
      emptyTextHTML,
      handleCreate,
      handleBack,
      handleCloseRecord,
      handleClickOutdideTable,
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
