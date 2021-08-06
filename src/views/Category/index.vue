<template>
  <section class="category">
    <CategorySearchForm @filter-changed="onFilterChange($event)" />

    <div class="box-create">
      <a-button class="btn-modal" type="primary" @click="$router.push({ name: 'category-new', query: $route.query })">
        <add-icon class="add-icon" />
        {{ $t('category.add_category') }}
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
      <template #divisionTypeName="{ text: divisionTypeName }">
        {{ divisionTypeName === 'Sales' ? $t('category.sales') : $t('category.expense') }}
      </template>

      <template #subcategoryKindName="{ text: subcategoryKindName }">
        {{
          subcategoryKindName === 'Company'
            ? $t('category.company')
            : subcategoryKindName === 'Group'
            ? $t('category.request_group')
            : subcategoryKindName === 'Text Input'
            ? $t('category.text_input')
            : $t('category.no')
        }}
      </template>

      <template #action="{ text: action, record }">
        <template v-if="record.subcategoryKind === 10">
          <a class="number_category" @click="handleSelectNumber(record)">{{ action }}</a>
        </template>
        <template v-else> - </template>
      </template>

      <template #inUse="{ text: inUse }">
        {{ inUse ? $t('category.in_use') : $t('category.prohibited') }}
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

import useGetCategoryListService from '@/views/Category/composables/useGetCategoryListService'
import useDeleteCategoryService from '@/views/Category/composables/useDeleteCategoryService'
import { convertPagination } from '@/helpers/convert-pagination'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { forEach, includes, isArray, keys, map } from 'lodash-es'

import Table from '@/mixins/table.mixin'
import CategorySearchForm from '@/views/Category/-components/CategorySearchForm'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'
import ModalDelete from '@/components/ModalDelete'
import { camelToSnakeCase } from '@/helpers/camel-to-sake-case'

export default defineComponent({
  name: 'Index',

  components: { ModalAction, CategorySearchForm, AddIcon, ModalDelete },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const body = {}

    if (keys(to.query).length > 0) {
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

    const query = {
      page_number: to.query.page_number || 1,
      page_size: 50,
      order_by: 'name asc',
      ...to.query,
      ...body
    }

    const { getLists } = await useGetCategoryListService(query, body)
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
    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const recordVisible = ref({})
    const params = ref({ ...route.query })
    const modalActionRef = ref()
    const height = ref(0)
    let idSelected = ref({})

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
          title: t('category.category_name'),
          dataIndex: 'name',
          key: 'name',
          sorter: true
        },
        {
          title: t('category.category_division'),
          dataIndex: 'divisionTypeName',
          key: 'divisionTypeName',
          slots: { customRender: 'divisionTypeName' }
        },
        {
          title: t('category.subcategory_division'),
          dataIndex: 'subcategoryKindName',
          key: 'subcategoryKindName',
          slots: { customRender: 'subcategoryKindName' }
        },
        {
          title: t('category.subcategory'),
          dataIndex: 'subcategoryNumber',
          key: 'subcategoryNumber',
          slots: { customRender: 'action' }
        },
        {
          title: t('category.status'),
          dataIndex: 'inUse',
          key: 'inUse',
          slots: { customRender: 'inUse' }
        }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
      pagination.value = { ...route.meta['pagination'] }

      // Back Form
      tempRow = [parseInt(await route.params.id)]
      if (tempRow[0] === parseInt(await route.params.id)) {
        state.selectedRowKeys = [parseInt(await route.params.id)]
        tempRow = [parseInt(await route.params.id)]
        recordVisible.value.id = route.params.id
        recordVisible.value.visible = true
      }

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
        name: 'category',
        query: {
          ...params.value,
          ...filter.value
        }
      })

      await fetchList(params.value, filter.value)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      params.value = {
        page_number: 1,
        page_size: 50,
        order_by: 'name asc',
        ...filter.value
      }
      await router.push({ name: 'category', query: { ...params.value, ...filter.value } })
      await fetchList(params.value, filter.value)
    }

    const handleDeleteRecord = async () => {
      try {
        const { deleteCategory } = useDeleteCategoryService(recordVisible.value.id)
        await deleteCategory()
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
      await fetchList(params.value)
    }

    const categoryEnums = ref({
      category_deposit: t('category.category_deposit'),
      category_subcategory: t('category.category_subcategory')
    })

    const checkErrorsApi = (err) => {
      openDelete.value = false
      err.response.data.errors = camelToSnakeCase(err.response.data.errors)

      for (let item in err.response.data.errors) {
        setTimeout(() => {
          store.commit('flash/STORE_FLASH_MESSAGE', {
            variant: 'error',
            duration: 5,
            message: locale.value === 'en' ? `${categoryEnums.value[item]}` : `${categoryEnums.value[item]}`
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
        name: 'category-edit',
        params: {
          id: recordVisible.value.id
        },
        query: { ...params.value, ...filter.value }
      })
    }

    const handleSelectNumber = (record) => {
      if (record.subcategoryKind !== 10) return

      idSelected.value = {
        key_search: '',
        category_id: [parseInt(record.id)],
        name: record.name,
        id: record.id
      }
      router.push({
        name: 'subcategory',
        params: {
          name: record.name,
          category_id: record.id,
          key_search: ''
        },
        query: { ...idSelected.value, ...params.value, ...filter.value }
      })
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      tempRow = []
      try {
        const { getLists } = useGetCategoryListService({ ...params }, data)
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
      handleDeleteRecord,
      handleCloseRecord,
      handleClickOutdideTable,
      handleEditRecord,
      customRow,
      handleChange,
      onFilterChange,
      fetchList,
      handleSelectNumber
    }
  }
})
</script>
